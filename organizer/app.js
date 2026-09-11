import { encrypt } from "../shared/crypto.js";

const messageInput = document.getElementById("message");
const keyInput = document.getElementById("key");

const encryptBtn = document.getElementById("encryptBtn");
const clearBtn = document.getElementById("clearBtn");

const resultSection = document.getElementById("resultSection");

const ciphertextOutput = document.getElementById("ciphertext");
const displayKey = document.getElementById("displayKey");

const copyCipherBtn = document.getElementById("copyCipherBtn");
const copyKeyBtn = document.getElementById("copyKeyBtn");

const cipherQr = document.getElementById("cipherQr");
const keyQr = document.getElementById("keyQr");

/**
 * Encrypt button
 */
encryptBtn.addEventListener("click", async () => {
    const message = messageInput.value.trim();
    const key = keyInput.value.trim();

    if (!message) {
        alert("Please enter a secret message.");
        messageInput.focus();
        return;
    }

    if (!key) {
        alert("Please enter a secret key.");
        keyInput.focus();
        return;
    }

    try {
        encryptBtn.disabled = true;
        encryptBtn.innerHTML =
            `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> Encrypting...`;

        const ciphertext = await encrypt(message, key);

        ciphertextOutput.value = ciphertext;
        displayKey.value = key;

        generateCipherQR(ciphertext);
        generateKeyQR(key);

        resultSection.classList.remove("d-none");

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } catch (error) {
        console.error("Encryption failed:", error);
        alert("Encryption failed. Please try again.");
    } finally {
        encryptBtn.disabled = false;
        encryptBtn.innerHTML =
            `<i class="bi bi-lock-fill me-2"></i> Encrypt Clue`;
    }
});

/**
 * Clear everything
 */
clearBtn.addEventListener("click", () => {
    messageInput.value = "";
    keyInput.value = "";

    ciphertextOutput.value = "";
    displayKey.value = "";

    resultSection.classList.add("d-none");

    cipherQr.innerHTML = "";
    keyQr.innerHTML = "";

    messageInput.focus();
});

/**
 * Copy Ciphertext
 */
copyCipherBtn.addEventListener("click", async () => {
    const copied = await copyToClipboard(ciphertextOutput.value);

    if (!copied) {
        alert("Unable to copy the ciphertext. Please copy it manually.");
        return;
    }

    showCopiedState(
        copyCipherBtn,
        `<i class="bi bi-clipboard-check me-2"></i> Copied!`,
        `<i class="bi bi-clipboard me-2"></i> Copy Ciphertext`
    );
});

/**
 * Copy Key
 */
copyKeyBtn.addEventListener("click", async () => {
    const copied = await copyToClipboard(displayKey.value);

    if (!copied) {
        alert("Unable to copy the key. Please copy it manually.");
        return;
    }

    showCopiedState(
        copyKeyBtn,
        `<i class="bi bi-clipboard-check me-2"></i> Copied!`,
        `<i class="bi bi-clipboard me-2"></i> Copy Key`
    );
});

/**
 * Copy text with a browser fallback
 */
async function copyToClipboard(text) {
    if (!text) {
        return false;
    }

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }

        const temporaryTextArea = document.createElement("textarea");

        temporaryTextArea.value = text;
        temporaryTextArea.style.position = "fixed";
        temporaryTextArea.style.opacity = "0";
        temporaryTextArea.setAttribute("readonly", "");

        document.body.appendChild(temporaryTextArea);
        temporaryTextArea.select();

        const copied = document.execCommand("copy");

        temporaryTextArea.remove();

        return copied;
    } catch (error) {
        console.error("Clipboard error:", error);
        return false;
    }
}

/**
 * Temporarily display a copied state
 */
function showCopiedState(button, successHTML, defaultHTML) {
    button.innerHTML = successHTML;
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = defaultHTML;
        button.disabled = false;
    }, 2000);
}

/**
 * Generate Ciphertext QR
 */
function generateCipherQR(text) {
    cipherQr.innerHTML = "";

    new QRCode(cipherQr, {
        text,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.H
    });
}

/**
 * Generate Key QR
 */
function generateKeyQR(text) {
    keyQr.innerHTML = "";

    new QRCode(keyQr, {
        text,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.H
    });
}
