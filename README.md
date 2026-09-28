# QR Code Generator & Designer

A client-side QR Code customization and generation web application submitted for the **GDG on Campus SRM Recruitments 2026-27 (Frontend Domain - Task 1)**.

🔗 **Live Deployment:** [https://gdg-technical-domain-tasks.vercel.app](https://gdg-technical-domain-tasks.vercel.app)

---

## 📸 Screenshots

### Desktop Layout & Live Preview
<img width="1920" height="1080" alt="desktop-main" src="https://github.com/user-attachments/assets/2618eafb-a586-4bd4-9691-db6b183a9f52" />

### Wi-Fi Configuration Mode
<img width="1920" height="1080" alt="wifi-mode" src="https://github.com/user-attachments/assets/e3a418f2-578c-4642-a374-ce3943a81174" />


### Custom Colors & Presets

<img width="1920" height="1080" alt="custom-style" src="https://github.com/user-attachments/assets/23868edc-c5e5-44ee-9962-6dc6fd224d81" />

### Scan Reliability Warning (Contrast Guard)
<img width="1920" height="1080" alt="scan-warning" src="https://github.com/user-attachments/assets/0eed485c-6584-46b4-a785-21d49a4ef5ac" />


### Mobile Responsive Layout
<img width="603" height="1311" alt="mobile-view" src="https://github.com/user-attachments/assets/25723119-04fd-499e-869b-70bce3e425d5" />


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
git clone [https://github.com/Dwaem/GDG-Technical-Domain-tasks.git](https://github.com/Dwaem/GDG-Technical-Domain-tasks.git)
cd gdg-qr-generator
npm install
npm run dev
