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
        return;
    }

    if (!key) {
        alert("Please enter a secret key.");
        return;
    }

    try {

        encryptBtn.disabled = true;
        encryptBtn.innerHTML =
            `<span class="spinner-border spinner-border-sm"></span> Encrypting...`;

        const ciphertext = await encrypt(message, key);

        ciphertextOutput.value = ciphertext;
        displayKey.value = key;

        resultSection.classList.remove("d-none");

        generateCipherQR(ciphertext);
        generateKeyQR(key);

    }
    catch (error) {

        console.error(error);

        alert("Encryption failed.");

    }
    finally {

        encryptBtn.disabled = false;
        encryptBtn.innerHTML =
            `<i class="bi bi-lock-fill"></i> Encrypt`;

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

});

/**
 * Copy Ciphertext
 */
copyCipherBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(ciphertextOutput.value);

    copyCipherBtn.innerHTML =
        `<i class="bi bi-check-lg"></i> Copied!`;

    setTimeout(() => {

        copyCipherBtn.innerHTML =
            `<i class="bi bi-clipboard"></i> Copy Ciphertext`;

    }, 2000);

});

/**
 * Copy Key
 */
copyKeyBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(displayKey.value);

    copyKeyBtn.innerHTML =
        `<i class="bi bi-check-lg"></i> Copied!`;

    setTimeout(() => {

        copyKeyBtn.innerHTML =
            `<i class="bi bi-clipboard"></i> Copy Key`;

    }, 2000);

});

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
