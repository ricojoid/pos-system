# Tokoku POS & E-Commerce System

Tokoku adalah sistem *Point of Sale* (POS) sekaligus platform *E-Commerce* modern yang dirancang dengan antarmuka (UI/UX) yang bersih, estetik, profesional, dan responsif. Aplikasi ini mendukung sistem *multi-vendor* di mana pengguna dapat mendaftar untuk berperan sebagai pembeli maupun penjual, serta dikelola secara terpusat oleh seorang Admin.

## ✨ Fitur Utama

- **Sistem 3 Peran (Role-based Access)**:
  - **Pembeli (Buyer)**: Dapat menelusuri katalog produk, memasukkan barang ke keranjang, *checkout* pesanan, hingga melacak riwayat belanja secara terpadu.
  - **Penjual (Seller)**: Memiliki *dashboard* eksklusif untuk memantau performa toko, manajemen produk (tambah/edit/hapus), mengurus pesanan masuk, dan menyunting profil publik toko.
  - **Admin**: Memiliki *dashboard* pusat (Superadmin) untuk memantau aktivitas sistem, mengelola basis data pengguna, menyetujui pendaftaran toko baru, dan mengatur seluruh kategori produk.
- **Desain Premium (Clean UI)**: Menggunakan perpaduan palet warna terang (*Light Theme* berbasis *Slate* & *Emerald*), efek *glassmorphism*, dan *micro-animation* halus layaknya aplikasi perusahaan teknologi global.
- **Responsif Penuh**: Tata letak layar yang menyesuaikan dengan sempurna mulai dari layar ponsel pintar hingga monitor *ultrawide*.

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React.js** (berbasis Vite untuk *rendering* super cepat)
- **Tailwind CSS** (kerangka kerja penataan gaya yang sangat fleksibel)
- **React Router DOM** (navigasi halus tanpa memuat ulang halaman)

### Backend
- **C# .NET Core Web API** (sistem peladen tangguh dan aman)
- **Entity Framework Core** (manajemen dan koneksi *database*)
- **JWT (JSON Web Token)** (untuk autentikasi dan keamanan tingkat tinggi pada *endpoint* terbatas)

## 🚀 Cara Menjalankan Secara Lokal

### Frontend
1. Buka terminal dan arahkan ke direktori `frontend`.
2. Ketik perintah `npm install` untuk mengunduh modul-modul yang dibutuhkan.
3. Ketik perintah `npm run dev` untuk menyalakan peladen *development*. Aplikasi bisa diakses melalui *localhost*.

### Backend
1. Buka terminal dan arahkan ke direktori `backend/POS.API`.
2. (Opsional) Sesuaikan koneksi basis data Anda di dalam berkas `appsettings.json`.
3. Jalankan perintah `dotnet run` untuk menghidupkan API peladen.

---
*Proyek ini dirancang secara khusus tidak hanya untuk berfungsi secara optimal, tetapi juga untuk memberikan pengalaman visual (WOW factor) terbaik bagi setiap penggunanya.*
