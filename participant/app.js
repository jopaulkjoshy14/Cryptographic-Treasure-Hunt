import { decrypt } from "../shared/crypto.js";

const ciphertextInput = document.getElementById("ciphertext");
const keyInput = document.getElementById("key");

const decryptBtn = document.getElementById("decryptBtn");
const clearBtn = document.getElementById("clearBtn");

const pasteCipherBtn = document.getElementById("pasteCipherBtn");
const pasteKeyBtn = document.getElementById("pasteKeyBtn");

const scanCipherBtn = document.getElementById("scanCipherBtn");
const scanKeyBtn = document.getElementById("scanKeyBtn");

const resultSection = document.getElementById("resultSection");
const messageOutput = document.getElementById("messageOutput");

const scannerModalElement = document.getElementById("scannerModal");
const scannerModal = new bootstrap.Modal(scannerModalElement);

let html5QrCode = null;
let activeInput = null;
let scannerStarting = false;

/* ---------------------------------------------------------- */
/* Decrypt                                                    */
/* ---------------------------------------------------------- */

decryptBtn.addEventListener("click", async () => {
    const ciphertext = ciphertextInput.value.trim();
    const key = keyInput.value.trim();

    if (!ciphertext) {
        alert("Please enter or scan the ciphertext.");
        ciphertextInput.focus();
        return;
    }

    if (!key) {
        alert("Please enter or scan the secret key.");
        keyInput.focus();
        return;
    }

    try {
        decryptBtn.disabled = true;
        decryptBtn.innerHTML =
            `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> Decrypting...`;

        const message = await decrypt(ciphertext, key);

        messageOutput.textContent = message;
        resultSection.classList.remove("d-none");

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        if (typeof confetti === "function") {
            confetti({
                particleCount: 150,
                spread: 90,
                origin: {
                    y: 0.6
                }
            });
        }
    } catch (error) {
        console.error("Decryption failed:", error);

        messageOutput.textContent = "";
        resultSection.classList.add("d-none");

        alert(
            "Decryption failed.\n\nCheck that both the ciphertext and the secret key are correct."
        );
    } finally {
        decryptBtn.disabled = false;
        decryptBtn.innerHTML =
            `<i class="bi bi-unlock-fill me-2"></i> Decrypt Clue`;
    }
});

/* ---------------------------------------------------------- */
/* Clear                                                      */
/* ---------------------------------------------------------- */

clearBtn.addEventListener("click", async () => {
    await stopScanner();

    ciphertextInput.value = "";
    keyInput.value = "";

    messageOutput.textContent = "";
    resultSection.classList.add("d-none");

    ciphertextInput.focus();
});

/* ---------------------------------------------------------- */
/* Clipboard                                                  */
/* ---------------------------------------------------------- */

pasteCipherBtn.addEventListener("click", async () => {
    const text = await readClipboardText();

    if (text === null) {
        alert("Clipboard access denied. Please paste the ciphertext manually.");
        return;
    }

    ciphertextInput.value = text;
    ciphertextInput.focus();
});

pasteKeyBtn.addEventListener("click", async () => {
    const text = await readClipboardText();

    if (text === null) {
        alert("Clipboard access denied. Please paste the secret key manually.");
        return;
    }

    keyInput.value = text;
    keyInput.focus();
});

async function readClipboardText() {
    try {
        if (!navigator.clipboard || !window.isSecureContext) {
            return null;
        }

        return await navigator.clipboard.readText();
    } catch (error) {
        console.error("Clipboard read error:", error);
        return null;
    }
}

/* ---------------------------------------------------------- */
/* QR Scanner                                                 */
/* ---------------------------------------------------------- */

scanCipherBtn.addEventListener("click", async () => {
    activeInput = ciphertextInput;
    await openScanner();
});

scanKeyBtn.addEventListener("click", async () => {
    activeInput = keyInput;
    await openScanner();
});

async function openScanner() {
    if (scannerStarting || html5QrCode) {
        return;
    }

    scannerStarting = true;
    scannerModal.show();

    try {
        html5QrCode = new Html5Qrcode("reader");

        await html5QrCode.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            async decodedText => {
                if (activeInput) {
                    activeInput.value = decodedText;
                    activeInput.focus();
                }

                await stopScanner();
                scannerModal.hide();
            },
            () => {
                // Ignore individual QR scan misses.
            }
        );
    } catch (error) {
        console.error("QR scanner error:", error);

        await stopScanner();
        scannerModal.hide();

        alert(
            "Unable to access the camera. Please check camera permissions or enter the value manually."
        );
    } finally {
        scannerStarting = false;
    }
}

/* ---------------------------------------------------------- */
/* Stop camera safely                                         */
/* ---------------------------------------------------------- */

async function stopScanner() {
    if (!html5QrCode) {
        return;
    }

    const activeScanner = html5QrCode;
    html5QrCode = null;

    try {
        await activeScanner.stop();
    } catch (error) {
        console.warn("Scanner stop warning:", error);
    }

    try {
        activeScanner.clear();
    } catch (error) {
        console.warn("Scanner clear warning:", error);
    }
}

/* ---------------------------------------------------------- */
/* Stop camera when modal closes                               */
/* ---------------------------------------------------------- */

scannerModalElement.addEventListener(
    "hidden.bs.modal",
    async () => {
        await stopScanner();
        activeInput = null;
    }
);
