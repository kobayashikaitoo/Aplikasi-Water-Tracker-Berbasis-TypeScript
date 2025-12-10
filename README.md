# 💧 HydroFlow - Desktop Water Tracker

HydroFlow adalah aplikasi desktop modern yang dirancang untuk membantu pengguna menjaga hidrasi tubuh dengan cara yang menyenangkan dan interaktif. Dibangun menggunakan teknologi web terkini yang dibungkus dalam **Electron**, aplikasi ini menawarkan pengalaman *native desktop* yang responsif dan *offline-first*.

![Hero Image](public/icons/icon.png)

## 🚀 Fitur Utama

- **🌊 Smart Hydration Tracking**: Mencatat asupan air harian dengan mudah lewat dashboard interaktif.
- **⏰ Smart Reminders**: Sistem pengingat cerdas yang otomatis menjadwalkan notifikasi setiap **1 jam 30 menit** di antara jam bangun dan jam tidur pengguna.
- **📊 Statistik Lengkap**: Visualisasi data hidrasi dalam rentang Mingguan, Bulanan, hingga Tahunan menggunakan grafik interaktif.
- **🎯 Target Personal**: Perhitungan target air otomatis berdasarkan berat badan dan jenis kelamin (Formulasi ilmiah).
- **🔥 Gamifikasi**: Fitur *Streak* harian untuk memotivasi konsistensi pengguna.
- **🔒 Privasi Terjamin**: Semua data disimpan secara lokal (**Local Persistence**) di perangkat pengguna. Tidak ada data yang dikirim ke server cloud.

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan kombinasi teknologi modern untuk performa dan kemudahan pengembangan (RPL):

- **Framework Utama**: [Electron.js](https://www.electronjs.org/) (Desktop Runtime)
- **Frontend**: [Next.js](https://nextjs.org/) (React Framework)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Persistence**: Local Storage via Zustand Middleware
- **Charts**: Recharts

## 💻 Cara Menjalankan Project (Development)

Pastikan [Node.js](https://nodejs.org/) sudah terinstall di komputer Anda.

1.  **Clone / Download Project**
    ```bash
    git clone https://github.com/username/water-tracker.git
    cd water-tracker
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # atau
    npm i
    ```

3.  **Jalankan Mode Pengembangan**
    Perintah ini akan menjalankan server Next.js dan membuka jendela Electron secara bersamaan.
    ```bash
    npm run dev:electron
    ```

## 📦 Cara Build (Membuat File .exe)

Untuk membuat file installer atau portable executable (`.exe`) untuk Windows:

```bash
npm run dist
```
File hasil build akan tersimpan di folder `dist/`.

## 📂 Struktur Project

- **`main.js`**: *Entry point* utama Electron (Backend process untuk window management).
- **`src/app`**: Halaman-halaman aplikasi (Next.js App Router).
  - `page.tsx`: Dashboard Utama.
  - `history/`: Halaman Statistik.
  - `onboarding/`: Halaman Setup awal user.
  - `settings/`: Pengaturan profil & pengingat.
- **`src/store`**: Logika manajemen data (Zustand).
  - `useWaterStore.ts`: Pusat penyimpanan data (State & Actions).
- **`src/components`**: Komponen UI reusable (Charts, Modals, Buttons).
- **`src/lib`**: Fungsi helper (Kalkulasi target air, logic pengingat).

## 📝 Catatan Arsitektur (Untuk Review Akademis)

**Mengapa tidak menggunakan Database SQL (MySQL)?**
Aplikasi ini menerapkan arsitektur **Local State Persistence**. Karena didesain sebagai aplikasi *utility single-user* yang *offline-first*, penggunaan database server (seperti MySQL) dinilai terlalu berat (*overhead*) dan mengurangi portabilitas aplikasi.

Sebagai gantinya, kami menggunakan **Zustand Store** yang terintegrasi dengan **Local Storage** engine milik browser (Chromium/Electron).
- **CRUD Operation**: Dilakukan langsung di memori aplikasi (State).
- **Persistence**: State secara otomatis diserialisasi ke JSON dan disimpan ke file lokal sistem saat ada perubahan.
- **Advantages**: Aplikasi sangat ringan, data persisten, dan *Zero-Configuration* (User tidak perlu install XAMPP/SQL).

---
*Dibuat untuk memenuhi tugas Proyek RPL (Rekayasa Perangkat Lunak).*
