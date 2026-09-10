🔐 Cryptographic Treasure Hunt

A browser-based cryptographic treasure hunt platform that enables organizers to create encrypted clues and participants to decrypt them after discovering both the ciphertext and the secret key. The project is designed for interactive events such as youth camps, educational activities, escape rooms, and treasure hunts.

✨ Features

Organizer Portal

- Create encrypted clues using AES-256-GCM
- Enter custom secret messages and encryption keys
- Generate QR codes for both ciphertext and key
- One-click copy for ciphertext and key
- Responsive organizer interface for desktop and mobile
- Separate QR and copy distribution options

Participant Portal

- Decrypt clues using the discovered ciphertext and key
- Manual entry or QR code scanning
- Confetti celebration on successful decryption
- Friendly error messages for invalid input
- Mobile-first responsive design
- Responsive QR scanner modal

🛡️ Security

This project performs all cryptographic operations entirely within the browser using the Web Crypto API.

- No backend server
- No database
- No user accounts
- No data is stored or transmitted
- AES-256-GCM authenticated encryption

The organizer enters the plaintext and key locally, and participants decrypt locally after obtaining both pieces of information.

🛠️ Technology Stack

- HTML5
- Bootstrap 5
- Vanilla JavaScript (ES6 Modules)
- Web Crypto API
- QRCode.js
- html5-qrcode
- canvas-confetti

📁 Project Structure

cryptographic-treasure-hunt/
│
├── assets/
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

🚀 How It Works

1. The organizer creates a secret message.
2. A custom encryption key is provided.
3. The message is encrypted using AES-256-GCM.
4. The ciphertext and key are hidden separately during the treasure hunt.
5. Participants discover both items.
6. Participants enter or scan the ciphertext and key.
7. The original clue is revealed, guiding them to the next stage.

🎯 Use Cases

- Youth Camps
- Church Events
- School Treasure Hunts
- Escape Rooms
- STEM & Cybersecurity Workshops
- Cryptography Demonstrations

📦 Deployment

The project is intended to be deployed as two independent static websites from the same repository:

- Organizer Portal
- Participant Portal

Both portals share the same cryptographic implementation and styling through the "shared/" directory.

🤝 Contributing

Contributions, suggestions, and improvements are welcome. Feel free to fork the repository, open an issue, or submit a pull request.

📄 License

This project is licensed under the MIT License. See the "LICENSE" file for details.

---

Built with ❤️ for interactive learning, teamwork, and fun.
