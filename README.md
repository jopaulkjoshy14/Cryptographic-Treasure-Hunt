# 🔐 Cryptographic Treasure Hunt

A browser-based cryptographic treasure hunt platform that enables organizers to create encrypted clues and participants to decrypt them after discovering both the ciphertext and the secret key.

The project is designed for interactive events such as youth camps, educational activities, escape rooms, STEM workshops, and cybersecurity demonstrations.

## ✨ Features

### Organizer Portal

* Create encrypted clues using AES-256-GCM
* Enter custom secret messages and encryption keys
* Generate QR codes for both ciphertext and secret key
* Copy ciphertext and key with one click
* Distribute the ciphertext and key separately
* Responsive interface for desktop and mobile devices
* Clear and regenerate encrypted clues easily

### Participant Portal

* Decrypt clues using the discovered ciphertext and secret key
* Enter values manually or scan QR codes
* Responsive QR scanner modal
* Friendly error messages for invalid ciphertext or keys
* Successful decryption result display
* Confetti celebration after successful decryption
* Mobile-friendly and desktop-compatible interface

### General Interface

* Central dashboard for navigating between portals
* Dedicated About page explaining the project
* Shared visual design and styling
* Responsive navigation across all pages
* No account creation or backend configuration required

## 🛡️ Security and Privacy

All cryptographic operations are performed locally inside the user's browser using the native Web Crypto API.

* No backend server
* No database
* No user accounts
* No plaintext data is uploaded
* No ciphertext or secret key is transmitted to a project backend
* No application data is stored by the project
* AES-256-GCM authenticated encryption
* Random salt and initialization vector generated for each encryption operation

The organizer enters the plaintext message and secret key locally. The browser encrypts the message and produces a Base64-encoded ciphertext.

Participants must obtain both the ciphertext and the secret key through the treasure hunt. Decryption is then performed locally in the participant's browser.

> **Important:** The security of the clue depends on keeping the secret key separate from the ciphertext. Anyone who possesses both can decrypt the message.

## 🛠️ Technology Stack

* HTML5
* CSS3
* Bootstrap 5
* Vanilla JavaScript
* JavaScript ES6 Modules
* Web Crypto API
* AES-256-GCM
* PBKDF2-HMAC-SHA-256
* QRCode.js
* html5-qrcode
* canvas-confetti

## 📁 Project Structure

```text
cryptographic-treasure-hunt/
│
├── index.html
├── about/
│   └── index.html
│
├── organizer/
│   ├── index.html
│   └── app.js
│
├── participant/
│   ├── index.html
│   └── app.js
│
├── shared/
│   ├── crypto.js
│   └── styles.css
│
├── README.md
└── LICENSE
```

## 🚀 How It Works

1. The organizer enters a secret message.
2. The organizer provides a custom secret key.
3. The browser derives an AES-256 encryption key using PBKDF2.
4. The message is encrypted using AES-256-GCM.
5. The resulting ciphertext is encoded as Base64.
6. QR codes are generated for the ciphertext and secret key.
7. The organizer distributes the ciphertext and key separately.
8. Participants discover both items during the treasure hunt.
9. Participants enter or scan the ciphertext and secret key.
10. The browser decrypts the ciphertext locally.
11. The original clue is revealed and guides participants to the next stage.

## 🔑 Ciphertext Format

The encrypted payload contains the following components:

```text
16-byte Salt
+
12-byte Initialization Vector
+
Ciphertext and AES-GCM Authentication Tag
```

The complete payload is then encoded as a single Base64 string.

This allows the application to transmit or display one ciphertext value while retaining the information required for decryption.

## 🎯 Use Cases

* Youth camps
* Church events
* School treasure hunts
* College activities
* Escape rooms
* STEM workshops
* Cybersecurity demonstrations
* Cryptography education
* Team-building activities
* Interactive learning events

## 📦 Deployment

The project is a static browser-based application and can be deployed using services such as GitHub Pages, Netlify, Vercel, or Render Static Sites.

The application can be accessed through the following pages:

* **Dashboard:** `index.html`
* **Organizer Portal:** `organizer/index.html`
* **Participant Portal:** `participant/index.html`
* **About Page:** `about/index.html`

All pages use the shared cryptographic implementation and stylesheet from the `shared/` directory.

For QR scanning and clipboard functionality, deployment through HTTPS is recommended because modern browsers may restrict camera and clipboard access on insecure connections.

## ▶️ Running Locally

Because the project uses JavaScript ES6 modules, it should be served through a local web server rather than opened directly using the `file://` protocol.

For example, the project can be served using:

* VS Code Live Server
* Python's built-in HTTP server
* Any static web server

After starting a local server, open the root `index.html` page through the server URL.

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

You can:

* Fork the repository
* Open an issue
* Suggest improvements
* Submit a pull request
