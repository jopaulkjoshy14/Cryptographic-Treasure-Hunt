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

/* ---------------------------------------------------------- */
/* Decrypt                                                    */
/* ---------------------------------------------------------- */

decryptBtn.addEventListener("click", async () => {

    const ciphertext = ciphertextInput.value.trim();
    const key = keyInput.value.trim();

    if (!ciphertext) {
        alert("Please enter or scan the ciphertext.");
        return;
    }

    if (!key) {
        alert("Please enter or scan the secret key.");
        return;
    }

    try {

        decryptBtn.disabled = true;

        decryptBtn.innerHTML =
            `<span class="spinner-border spinner-border-sm"></span> Decrypting...`;

        const message = await decrypt(ciphertext, key);

        messageOutput.textContent = message;

        resultSection.classList.remove("d-none");

        confetti({
            particleCount: 150,
            spread: 90,
            origin: {
                y: 0.6
            }
        });

    }
    catch (error) {

        console.error(error);

        resultSection.classList.add("d-none");

        alert(
            "Decryption failed.\n\nCheck that both the ciphertext and the secret key are correct."
        );

    }
    finally {

        decryptBtn.disabled = false;

        decryptBtn.innerHTML =
            `<i class="bi bi-unlock-fill"></i> Decrypt`;

    }

});

/* ---------------------------------------------------------- */
/* Clear                                                      */
/* ---------------------------------------------------------- */

clearBtn.addEventListener("click", () => {

    ciphertextInput.value = "";
    keyInput.value = "";

    messageOutput.textContent = "";

    resultSection.classList.add("d-none");

});

/* ---------------------------------------------------------- */
/* Clipboard                                                  */
/* ---------------------------------------------------------- */

pasteCipherBtn.addEventListener("click", async () => {

    try {

        ciphertextInput.value =
            await navigator.clipboard.readText();

    }
    catch {

        alert("Clipboard access denied.");

    }

});

pasteKeyBtn.addEventListener("click", async () => {

    try {

        keyInput.value =
            await navigator.clipboard.readText();

    }
    catch {

        alert("Clipboard access denied.");

    }

});

/* ---------------------------------------------------------- */
/* QR Scanner                                                 */
/* ---------------------------------------------------------- */

scanCipherBtn.addEventListener("click", () => {

    activeInput = ciphertextInput;

    openScanner();

});

scanKeyBtn.addEventListener("click", () => {

    activeInput = keyInput;

    openScanner();

});

async function openScanner() {

    scannerModal.show();

    html5QrCode = new Html5Qrcode("reader");

    try {

        await html5QrCode.start(

            {
                facingMode: "environment"
            },

            {
                fps: 10,
                qrbox: 250
            },

            async decodedText => {

                activeInput.value = decodedText;

                await html5QrCode.stop();

                scannerModal.hide();

            }

        );

    }
    catch (error) {

        console.error(error);

        alert("Unable to access the camera.");

    }

}

/* ---------------------------------------------------------- */
/* Stop camera when modal closes                             */
/* ---------------------------------------------------------- */

scannerModalElement.addEventListener(
    "hidden.bs.modal",
    async () => {

        if (html5QrCode) {

            try {

                await html5QrCode.stop();

            }
            catch {}

            html5QrCode.clear();

            html5QrCode = null;

        }

    }
);
