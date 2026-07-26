/**
 * ============================================================
 * Cryptographic Treasure Hunt
 * shared/crypto.js
 *
 * Shared AES-256-GCM encryption/decryption utilities.
 * Uses the browser's native Web Crypto API.
 *
 * Ciphertext Format:
 * ------------------------------------------------------------
 * | 16-byte Salt | 12-byte IV | Ciphertext + Auth Tag |
 * ------------------------------------------------------------
 *
 * The entire payload is Base64 encoded so the application only
 * needs to store/transmit a single ciphertext string.
 * ============================================================
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100000;

/**
 * Convert Uint8Array/ArrayBuffer to Base64
 * (Mobile-safe implementation)
 */
function toBase64(buffer) {

    const bytes = new Uint8Array(buffer);

    let binary = "";

    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

/**
 * Convert Base64 to Uint8Array
 * (Mobile-safe implementation)
 */
function fromBase64(base64) {

    const binary = atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

/**
 * Derive AES-256 key using PBKDF2
 */
async function deriveKey(password, salt) {

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        passwordKey,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt a plaintext message.
 *
 * @param {string} message
 * @param {string} password
 * @returns {Promise<string>} Base64 ciphertext
 */
export async function encrypt(message, password) {

    const salt = crypto.getRandomValues(
        new Uint8Array(SALT_LENGTH)
    );

    const iv = crypto.getRandomValues(
        new Uint8Array(IV_LENGTH)
    );

    const key = await deriveKey(password, salt);

    const ciphertext = new Uint8Array(
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv
            },
            key,
            encoder.encode(message)
        )
    );

    // Combine Salt + IV + Ciphertext
    const result = new Uint8Array(
        SALT_LENGTH + IV_LENGTH + ciphertext.length
    );

    result.set(salt, 0);
    result.set(iv, SALT_LENGTH);
    result.set(ciphertext, SALT_LENGTH + IV_LENGTH);

    return toBase64(result);
}

/**
 * Decrypt a ciphertext.
 *
 * @param {string} encryptedData
 * @param {string} password
 * @returns {Promise<string>} Plaintext
 */
export async function decrypt(encryptedData, password) {

    const data = fromBase64(encryptedData);

    const salt = data.slice(0, SALT_LENGTH);

    const iv = data.slice(
        SALT_LENGTH,
        SALT_LENGTH + IV_LENGTH
    );

    const ciphertext = data.slice(
        SALT_LENGTH + IV_LENGTH
    );

    const key = await deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv
        },
        key,
        ciphertext
    );

    return decoder.decode(decrypted);
}
