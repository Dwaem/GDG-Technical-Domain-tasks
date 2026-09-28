# QR Code Generator & Designer

A client-side QR Code customization and generation web application submitted for the **GDG on Campus SRM Recruitments 2026-27 (Frontend Domain - Task 1)**.

🔗 **Live Deployment:** [https://your-app-name.vercel.app](https://your-app-name.vercel.app)

---

## 📸 Screenshots

### Desktop Layout & Live Preview
![Desktop Layout](./screenshots/desktop-main.png)

### Wi-Fi Configuration Mode
![Wi-Fi Configuration](./screenshots/wifi-mode.png)

### Custom Colors & Presets
![Custom Presets](./screenshots/custom-style.png)

### Scan Reliability Warning (Contrast Guard)
![Reliability Warning](./screenshots/scan-warning.png)

### Mobile Responsive Layout
![Mobile View](./screenshots/mobile-view.png)

---

## ✨ Features Implemented

- **Dynamic QR Payloads:** URL, plain text, email (`mailto:`), phone (`tel:`), and Wi-Fi (`WIFI:S:...`).
- **Real-Time Rendering:** Instant client-side DOM updates powered by `qr-code-styling`.
- **Customization Engine:** Hex color pickers, dot styling, error correction levels (L, M, Q, H), and margin controls.
- **Scan Reliability Alert:** Dynamic warnings when low contrast compromises scannability.
- **Client-Side Export:** Clean, one-click PNG downloads matching preview configurations.
- **Local Persistence:** Retains recent QR codes in browser `localStorage` across page reloads.
- **Responsive Layout:** Two-column desktop grid collapsing into a single-column layout for mobile devices.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Custom CSS
- **QR Engine:** `qr-code-styling`
- **Hosting:** Vercel

---

## 🚀 Local Setup

```bash
git clone [https://github.com/Dwaem/GDG-Technical-Domain-t.git](https://github.com/Dwaem/GDG-Technical-Domain-t.git)
cd gdg-qr-generator
npm install
npm run dev