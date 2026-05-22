# Toko Erina

Toko Erina adalah aplikasi website toko sembako dengan landing page pelanggan dan dashboard admin. Aplikasi ini dibuat untuk membantu toko menampilkan produk, menerima pesanan pelanggan, mengelola katalog, melihat laporan penjualan, dan mengatur konten informasi toko.

Repository ini berisi dua bagian utama:

- `tokoerina-vite-main`: frontend React + Vite.
- `tokoerina-laravel-remove-all-markdown-file`: backend Laravel API.

## Fitur Utama

### Pelanggan

- Melihat produk sembako berdasarkan kategori.
- Mencari dan memilih produk.
- Menambahkan produk ke keranjang.
- Membuat pesanan melalui halaman checkout.
- Mengirim pesan kontak ke toko.
- Melihat informasi toko pada landing page.

### Admin

- Login admin.
- Melihat ringkasan dashboard.
- Mengelola produk: tambah, edit, hapus, status stok, dan produk unggulan.
- Mengelola pesanan pelanggan dan mengubah status pesanan.
- Melihat inventaris penjualan dan laporan bulanan.
- Mengelola informasi tentang toko.
- Membaca dan mengelola pesan kontak pelanggan.

## Teknologi

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend

- Laravel
- Laravel Sanctum
- MySQL atau database lain yang didukung Laravel
- Cloudinary opsional untuk upload gambar

Jika konfigurasi Cloudinary belum tersedia, aplikasi dapat menyimpan upload gambar produk secara lokal.

## Struktur Project

```text
.
├── tokoerina-vite-main
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── data
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   ├── package.json
│   └── vite.config.ts
│
└── tokoerina-laravel-remove-all-markdown-file
    ├── app
    ├── config
    ├── database
    ├── routes
    ├── storage
    ├── composer.json
    └── artisan
```

## Persyaratan

- Node.js
- npm
- PHP 8.3 atau lebih baru
- Composer
- MySQL atau database lain sesuai konfigurasi Laravel

> Catatan: project backend menggunakan dependency yang membutuhkan PHP 8.3+. Jika memakai PHP 8.2, beberapa command seperti test dapat gagal.

## Menjalankan Backend

Masuk ke folder backend:

```bash
cd tokoerina-laravel-remove-all-markdown-file
```

Install dependency:

```bash
composer install
```

Buat file environment:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Atur koneksi database di `.env`, contoh:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=toko_erina
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi:

```bash
php artisan migrate
```

Jika ingin mengisi data awal:

```bash
php artisan db:seed
```

Jalankan server backend:

```bash
php artisan serve
```

Default API backend berjalan di:

```text
http://127.0.0.1:8000/api
```

## Menjalankan Frontend

Masuk ke folder frontend:

```bash
cd tokoerina-vite-main
```

Install dependency:

```bash
npm install
```

Buat file `.env` frontend jika diperlukan:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Jalankan development server:

```bash
npm run dev
```

Default frontend berjalan di:

```text
http://localhost:3000
```

atau port lain yang ditampilkan oleh Vite.

## Build Frontend

Untuk membuat build production:

```bash
cd tokoerina-vite-main
npm run build
```

Hasil build akan masuk ke folder `build/`.

## Konfigurasi Cloudinary

Cloudinary digunakan untuk upload gambar produk. Konfigurasi ini opsional.

Isi bagian berikut di `.env` backend jika ingin memakai Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=cloud_name_anda
CLOUDINARY_API_KEY=api_key_anda
CLOUDINARY_API_SECRET=api_secret_anda
CLOUDINARY_UPLOAD_PRESET=mealjun_preset
```

Setelah mengubah `.env`, jalankan:

```bash
php artisan config:clear
```

Jika Cloudinary tidak diisi, upload gambar akan disimpan secara lokal di folder `public/uploads`.

## Akun Admin

Akun admin dapat dibuat melalui seeder atau langsung dari database sesuai kebutuhan project. Jika menggunakan seeder, cek file berikut:

```text
tokoerina-laravel-remove-all-markdown-file/database/seeders/UserSeeder.php
```

## File yang Tidak Dimasukkan ke Repository

Repository ini hanya menyimpan source code dan file konfigurasi contoh. File berikut tidak dimasukkan karena bisa dibuat ulang atau bersifat lokal/sensitif:

- `node_modules/`
- `vendor/`
- `.env`
- `build/`
- `storage/logs/*.log`
- `public/uploads/`

Gunakan `npm install`, `composer install`, dan `.env.example` untuk menyiapkan project setelah clone repository.

## Workflow Singkat Setelah Clone

Backend:

```bash
cd tokoerina-laravel-remove-all-markdown-file
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Frontend:

```bash
cd tokoerina-vite-main
npm install
npm run dev
```

## Lisensi

Project ini dibuat untuk kebutuhan sistem informasi Toko Erina.
