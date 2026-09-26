# Wedding Planner

Wedding Planner adalah aplikasi web berbasis event yang dapat digunakan untuk merencanakan dua jenis acara utama sebelum pernikahan: **Wedding** (Persiapan Pernikahan) dan **Engagement** (Persiapan Lamaran). 

Aplikasi ini menggunakan **satu arsitektur dan satu struktur halaman yang sama** untuk kedua jenis event. Perbedaan antara Wedding dan Engagement tidak terletak pada pembuatan aplikasi atau halaman terpisah, melainkan pada **konten yang ditampilkan secara kondisional (*conditional rendering/configuration*) berdasarkan `event_type`**.

Aplikasi menggabungkan checklist persiapan, administrasi KUA / persiapan lamaran, alur acara, anggaran, vendor, daftar tamu & hadiah, rundown acara, serta seserahan/hantaran dalam satu aplikasi terpadu.

---

## Status Pengembangan

| Fitur | Status |
| --- | --- |
| Login & Registrasi Akun | ✅ Selesai |
| Dashboard Utama | ✅ Selesai (Conditional / Context-Aware) |
| Peta Persiapan & Checklist | ✅ Selesai (Wedding & Engagement) |
| Alur Pernikahan / Alur Acara | ✅ Selesai (Wedding & Engagement) |
| Budget & Pengeluaran | ✅ Selesai (Kategori Multi-Event) |
| Tabungan CPP & CPW | ✅ Selesai (Terintegrasi dengan Budget) |
| Seserahan & Hantaran | ✅ Selesai |
| Tamu & Hadiah | ✅ Selesai (versi awal) |
| Akad & Resepsi / Acara Hari-H | ✅ Selesai (Checklist & Rundown Multi-Event) |
| Akun & Profil | ✅ Selesai (Pengaturan Event Type & Profil) |
| Edit / Tambah / Hapus isi halaman | ✅ Selesai (semua halaman + Kembalikan ke bawaan) |
| Tampilan HP & Tablet | ✅ Selesai (responsif 360px – desktop) |

---

## Tujuan

Data persiapan sebelum pernikahan (baik Lamaran maupun Pernikahan) sering tersebar di chat, catatan, spreadsheet, tautan marketplace, dan bukti pembayaran. Wedding Planner menyatukannya dalam satu aplikasi berbasis `event_type` agar pengguna dapat mengetahui tugas yang belum selesai, mengurus dokumen/persyaratan, mengendalikan biaya, memilih vendor, serta bekerja bersama pasangan dan keluarga.

---

## Event Type & Conditional Content

Aplikasi menggunakan konsep jenis acara (`event_type`) untuk membedakan isi dan alur persiapan di dalam halaman yang sama tanpa memecah aplikasi menjadi halaman berbeda:

```text
event_type
├── wedding      (Persiapan pernikahan)
└── engagement   (Persiapan lamaran / engagement)
```

Prinsip utama conditional content:

```text
Menu Sidebar
└── Peta Persiapan Pernikahan / Lamaran (persiapan.html)
             │
             ▼
        event_type
        ┌────┴────┐
        ▼         ▼
     wedding   engagement
        │         │
        ▼         ▼
 Peta Persiapan  Peta Persiapan
 Pernikahan      Lamaran
```

Atribut `event_type` ini menentukan secara dinamis:
- **Konten Peta Persiapan** (`persiapan.html`): Stepper dan checklist yang disesuaikan (KUA vs Lamaran).
- **Alur Acara** (`alur-pernikahan.html`): Timeline alur administrasi atau alur persiapan lamaran.
- **Informasi Dashboard** (`index.html`): Judul, target countdown, dan daftar prioritas mendesak.
- **Kategori Budget** (`budget.html`): Opsi pengeluaran dan donut chart yang disesuaikan.
- **Konten Hari-H** (`akad-resepsi.html`): Checklist operasional Akad & Resepsi atau Acara Lamaran.
- **Terminologi & Label**: Istilah yang tampil pada navigasi dan kartu informasi.

Meskipun kontennya dinamis:
- **Halaman tetap sama** (menggunakan file `.html` yang sama).
- **Navigasi tetap sama** (menggunakan 9 menu utama yang sama).
- **Database tetap sama** (menggunakan tabel `wedding_events` dan tabel terikatnya).
- **JavaScript melakukan conditional rendering/configuration** berdasarkan `event_type`.

---

## Alur Aplikasi

Aplikasi berjalan dengan alur bersyarat (*conditional flow*):

```text
Login / Registrasi
        ↓
Pilih / Tentukan Jenis Event (di Akun / Header Switcher)
        ↓
┌───────────────────────────────┐
│                               │
▼                               ▼
Wedding                     Engagement
│                               │
▼                               ▼
Persiapan Pernikahan        Persiapan Lamaran
│                               │
├── Peta Persiapan             ├── Checklist Lamaran
├── Administrasi KUA            ├── Budget Lamaran
├── Akad                       ├── Vendor / Kebutuhan
├── Resepsi                    └── Persiapan Acara
└── Checklist
```

---

## Arah Tampilan & Navigasi

### Struktur Layar & Navigasi Generik

Desktop memakai sidebar kiri dan area kerja utama. Sidebar berubah menjadi menu drawer pada ponsel. Navigasi sidebar menggunakan **9 menu generik tetap** yang konsisten untuk seluruh jenis event:

1. **Dashboard** (`index.html`)
2. **Peta Persiapan** (`persiapan.html`)
3. **Alur Acara** (`alur-pernikahan.html`)
4. **Budget** (`budget.html`)
5. **Tabungan** (`tabungan.html`)
6. **Tamu & Hadiah** (`tamu-hadiah.html`)
7. **Acara** (`akad-resepsi.html`)
8. **Seserahan** (`seserahan.html`)
9. **Akun** (`akun.html`)

Menu sidebar berfungsi sebagai navigasi utama aplikasi dan **tidak berubah labelnya saat event type berganti**. Konten di dalam setiap halamanlah yang merender informasi, checklist, dan data secara kondisional berdasarkan `event_type`.

Bagian atas setiap halaman berisi sapaan `Halo, Ayu & Angga 👋`, teks pendukung, badge pemilih event type (*Event Switcher*), ikon notifikasi, dan avatar (foto pasangan).

### Dashboard Context-Aware (`index.html`)

Dashboard tidak dipisah menjadi file terpisah, melainkan menyesuaikan konten berdasarkan `event_type`:
- **Wedding**: Istilah Akad & Resepsi, hitung mundur menuju tanggal akad nikah, ringkasan progres persiapan nikah dan administrasi KUA.
- **Engagement**: Istilah Lamaran / Engagement, hitung mundur menuju acara lamaran, ringkasan progres persiapan lamaran.

### Gaya Visual

- Aksen biru (`#2563EB`) untuk tombol utama, menu aktif, dan informasi penting.
- Merah (`#DC2626`) hanya untuk status bahaya: badge *Mendesak*/*Tidak Hadir*, tombol Hapus & Keluar, dan pesan error.
- Latar putih atau biru sangat pucat agar konten mudah dibaca.
- Kartu putih bersudut membulat (`border-radius: 16–24px`), bayangan lembut, chip status, tombol kapsul, checkbox, dan donut chart SVG.
- Tipografi: **Plus Jakarta Sans** (Google Fonts).

---

## Fitur Halaman & Conditional Content

### 1. Login & Registrasi (`login.html`)

- Tab switch antara **Masuk** dan **Daftar Akun**.
- Form pendaftaran menerima nama pasangan (CPW & CPP), email, dan kata sandi.
- **Mode Demo**: Tombol langsung masuk tanpa daftar untuk eksplorasi cepat.
- Integrasi penuh dengan **Supabase Auth** (email + password).
- Session guard: pengguna yang belum login otomatis diarahkan ke `login.html`.

### 2. Dashboard (`index.html`)

- **Header dinamis**: Sapaan `Halo, [CPW] & [CPP] 👋` dengan badge jenis acara dan tanggal hari ini dalam Bahasa Indonesia.
- **Kartu Profil Pasangan**: Foto, nama, status, dan tanggal Akad & Resepsi (atau tanggal Lamaran).
- **Hitung Mundur Real-time**: 4 kotak (Hari, Jam, Menit, Detik) berdetak setiap detik menuju hari acara yang sesuai (`akadDate`).
- **Ringkasan Budget**: SVG Donut chart dua warna (Terpakai vs Sisa), nominal, dan persentase.
- **Hadiah dari Tamu**: Total nominal dan jumlah tamu pemberi hadiah.
- **Prioritas Mendesak**: Maksimal 5 hal yang perlu segera ditindaklanjuti, disusun otomatis dari data acara aktif:
  - Checklist Peta Persiapan yang belum selesai — tahap aktif **Mendesak**, tahap berikutnya **Perhatian**
  - Pengeluaran berstatus *Belum bayar* / *DP* — **Perhatian**
  - Jumlah tamu yang belum konfirmasi RSVP — **Tercatat**

### 3. Peta Persiapan (`persiapan.html`)

Halaman `persiapan.html` menggunakan conditional rendering berdasarkan `event_type`:

- **Wedding (`event_type = wedding`)**:
  ```text
  RT/RW → Kelurahan → Puskesmas → KUA → Akad → Resepsi
  ```
  Menampilkan 6 tahapan stepper dan 13 berkas persyaratan KUA interaktif.

- **Engagement (`event_type = engagement`)**:
  ```text
  Pertemuan Keluarga → Tempat & Vendor → Hantaran & Cincin → Panitia & Rundown → Hari-H
  ```
  Menampilkan 5 tahapan stepper dan 12 checklist persiapan lamaran interaktif.

- **Bisa diubah sepenuhnya**: tambah, edit, dan hapus item; **Edit Tahap** (nama, ikon, judul, deskripsi, judul daftar checklist, keterangan hasil); **Tambah Tahap**; serta hapus tahap. Status tahap (Belum/Proses/Selesai) dihitung ulang otomatis dari item.
- **Detail belanja per item**: saat menambah atau mengedit checklist, pengguna dapat mengisi **harga** dan **link pembelian** secara opsional. Jika diisi, nominal dan tautan **Lihat link pembelian** tampil di bawah nama item—misalnya untuk item “Kebaya”. Harga harus lebih dari nol; tautan dibatasi ke URL `http://` atau `https://` dan dibuka di tab baru dengan `noopener noreferrer`.

### 4. Alur Pernikahan / Alur Acara (`alur-pernikahan.html`)

Halaman `alur-pernikahan.html` dipertahankan nama filenya untuk kompatibilitas, namun secara konseptual menjadi halaman **Alur Acara**:

- **Wedding (`event_type = wedding`)**:
  - **Jalur CPP**: RT/RW → KUA Asal (Surat Numpang Nikah) → Serahkan ke Calon Istri.
  - **Jalur CPW**: RT/RW → Puskesmas/Klinik (Suntik TT) → Lengkapi Dokumen KUA.
- **Engagement (`event_type = engagement`)**:
  - **Jalur Laki-laki**: Hantaran & Cincin Lamaran → Keluarga & Utusan Juru Bicara → Kedatangan.
  - **Jalur Perempuan**: Tempat & Dekorasi Acara → MUA & Busana → Penerimaan & Jamuan Tamu.
- **Bisa diubah**: setiap langkah bisa diedit (judul, keterangan, judul & daftar dokumen) atau dihapus, dan **+ Tambah Langkah** tersedia di jalur pria maupun wanita. Nomor langkah menyesuaikan otomatis. Disimpan di `event_settings` (key `wp_alur`).

### 5. Budget (`budget.html`)

- Halaman `budget.html` dan tabel database `budget_items` bersifat **reusable** untuk kedua jenis event.
- **Total budget terpisah** per jenis acara: Wedding memakai kolom `total_budget` (default Rp 50.000.000), Engagement memakai `engagement_total_budget` (default Rp 15.000.000).
- **Opsi Kategori Pengeluaran** disesuaikan secara otomatis:
  - **Wedding**: `Venue`, `Akad`, `Resepsi`, `Catering`, `MUA`, `Dokumentasi`, `Seserahan`, `Lain-lain`.
  - **Engagement**: `Venue/Lokasi`, `MUA & Busana`, `Dekorasi`, `Catering`, `Hantaran/Seserahan`, `Dokumentasi`, `Ring/Cincin`, `Lain-lain`.

- Setiap pengeluaran bisa **diedit** (nama, kategori, nominal, tanggal, status, vendor) atau dihapus; status *Lunas* / *DP* / *Belum bayar* tampil sebagai badge di bawah nama.
- Kartu **Dana dari Tabungan** menampilkan total tabungan, pengeluaran yang sudah dibayar, dan saldo tabungan (lihat bagian Tabungan).

### 6. Tabungan (`tabungan.html`)

- Mencatat uang yang terkumpul dari **CPP** dan **CPW** — frekuensi bebas (harian, mingguan, bulanan); setiap catatan berisi penabung, nominal, tanggal, dan catatan opsional.
- Ringkasan: tabungan CPP, tabungan CPW, total terkumpul, dan saldo tersedia; riwayat dikelompokkan per bulan dengan subtotal, bisa difilter per penabung, dan setiap catatan bisa diedit/dihapus.
- **Terintegrasi dengan Budget**:
  - **Target tabungan** = Total Budget acara aktif, ditampilkan sebagai progress bar beserta kekurangannya.
  - **Terpakai** = pengeluaran berstatus *Lunas* atau *DP* (yang *Belum bayar* belum mengurangi tabungan).
  - **Saldo tersedia** = total tabungan − terpakai (bisa minus bila pengeluaran melebihi tabungan).
- Data disimpan di tabel `savings_entries` (satu baris per catatan, dipisah per `event_type`) agar CPP & CPW yang mencatat dari perangkat berbeda tidak saling menimpa.

### 7. Akad & Resepsi / Acara Hari-H (`akad-resepsi.html`)

Halaman `akad-resepsi.html` menampilkan checklist operasional hari-H secara kondisional:
- **Wedding**: Sesi Pra-Akad, Akad Nikah, Resepsi, dan Pasca Acara.
- **Engagement**: Sesi Pra-Acara, Prosesi Lamaran/Pinangan & Tukar Cincin, Ramah Tamah & Foto, dan Pasca Acara.
- Tugas bisa ditambah, diedit (judul, sesi, jam, PIC), dicentang, dan dihapus; disimpan di `event_settings` (key `wp_event_tasks`).

### 8. Seserahan & Hantaran (`seserahan.html`)

- Konten disesuaikan untuk daftar belanja **Seserahan Pernikahan** (`wedding`) atau **Hantaran Lamaran** (`engagement`).
- Menyediakan summary bar 4 angka, filter kategori, kategori accordion, checkbox item, dan modal CRUD item (nama, harga, link pembelian).
- **Kategori bisa diubah**: + Tambah Kategori (dengan item awal), edit nama & ikon, dan hapus kategori beserta isinya.

### 9. Tamu & Hadiah (`tamu-hadiah.html`)

- Tambah, edit, dan hapus tamu (nama, relasi, jenis undangan, RSVP, nominal hadiah, catatan), dengan pencarian dan filter RSVP.

### 10. Akun & Profil (`akun.html`)

- Menyediakan form pembaruan profil acara, tanggal, dan pengunggah foto pasangan. Dashboard menyediakan pintasan **Edit profil, tanggal & foto** ke halaman ini.
- **Pemilih Jenis Acara (Event Type)**: Dropdown untuk beralih antara `Pernikahan (Wedding)` dan `Lamaran (Engagement)`. Saat diubah, seluruh antarmuka dan konten aplikasi akan beradaptasi secara otomatis.

---

## Edit & Kustomisasi Isi

Semua halaman memakai **satu modal form bersama** (`WP_UI.openFormModal` di `js/ui.js`) untuk tambah / edit / hapus, sehingga perilakunya konsisten:

- Field wajib divalidasi (isian yang hanya berisi spasi ditolak). Tipe *daftar* pada fitur yang mendukung input massal diisi satu item per baris; checklist Peta Persiapan ditambahkan satu per satu agar harga dan link pembelian dapat dicatat untuk setiap item.
- Tombol **Hapus** di dalam modal selalu meminta konfirmasi.
- Halaman yang isinya berasal dari template (**Peta Persiapan, Alur Acara, Seserahan, Acara**) memiliki tombol **↺ Kembalikan ke bawaan** sebagai jaring pengaman.
- Daftar yang sengaja dikosongkan tetap kosong setelah reload (tidak otomatis kembali ke isi bawaan).
- Perubahan Wedding dan Engagement disimpan terpisah.

| Data | Penyimpanan (Cloud) | Key `event_settings` |
| --- | --- | --- |
| Tahap & checklist Peta Persiapan (termasuk `price` dan `purchaseLink` per item) | `event_settings` | `wp_checklist_kua` |
| Langkah Alur Acara | `event_settings` | `wp_alur` |
| Kategori & item Seserahan | `event_settings` | `wp_seserahan` |
| Tugas Hari-H (Acara) | `event_settings` | `wp_event_tasks` |
| Pengeluaran | tabel `budget_items` | — |
| Tamu & hadiah | tabel `guests` | — |
| Tabungan | tabel `savings_entries` | — |

Untuk Engagement, key `event_settings` diberi prefix `engagement_` (contoh: `engagement_wp_alur`).

---

## Tampilan Responsif & Interaksi

Aplikasi diuji pada lebar **360px, 390px (HP), 768px (tablet), dan 1360px (desktop)** tanpa scroll horizontal.

- **Header menempel** di atas saat scroll (≤1024px); di HP nama pasangan satu baris, badge event & tanggal di bawahnya.
- **Menu drawer** (≤1024px) dengan tombol ✕, tutup via tombol Esc atau tap area gelap, dan halaman di belakangnya tidak ikut ter-scroll.
- **Modal menjadi bottom sheet** di HP (muncul dari bawah, tombol dekat jempol); semua modal bisa ditutup dengan Esc atau tap di luar dialog.
- **Tabel Budget & Tamu berubah menjadi kartu** di HP, dengan tombol edit/hapus selalu terlihat.
- Input berukuran **16px** di HP agar iOS tidak zoom otomatis; field dua kolom di halaman Akun menjadi satu kolom.
- Stepper Peta Persiapan dapat digeser menyamping dan otomatis menggeser tahap aktif ke tengah.
- Umpan balik sentuhan (efek tekan), target sentuh minimal ±40px di layar sentuh, fokus keyboard terlihat, toast selebar layar di HP.
- Menghormati pengaturan perangkat **"kurangi animasi"** (`prefers-reduced-motion`).

---

## Keamanan & Data

- Semua tabel memakai **Row Level Security**: pengguna hanya bisa membaca/mengubah data miliknya (`event_id` milik `auth.uid()`).
- Semua teks buatan pengguna di-escape sebelum ditampilkan (aman dari HTML/script injection); link pembelian pada Seserahan dan item Peta Persiapan hanya menerima `http(s)`.
- **Salinan data di browser tidak terbawa ke akun lain**: logout akun Cloud menghapus semua data aplikasi di `localStorage`, dan bila akun lain login di perangkat yang sama, data lokal akun sebelumnya (termasuk sisa Mode Demo) dibersihkan lebih dulu. Logout Mode Demo hanya menghapus sesi karena datanya hanya ada di perangkat.
- Anon key Supabase di `js/supabase.js` memang bersifat publik; keamanan data bergantung pada RLS.

---

## Struktur Folder (Implementasi Aktual)

Struktur folder project mempertahankan seluruh file `.html` dan `.js` yang ada tanpa membuat halaman atau file JS baru khusus Engagement:

```text
wedding_planner/
├── index.html                  # Dashboard utama (Conditional Content ✅)
├── login.html                  # Login, Daftar Akun & Mode Demo (✅ Aktif)
├── persiapan.html              # Peta Persiapan & Checklist (Conditional Content ✅)
├── alur-pernikahan.html        # Alur Pernikahan / Alur Acara (Conditional Content ✅)
├── budget.html                 # Budget & Pengeluaran (Conditional Categories ✅)
├── tabungan.html               # Tabungan CPP & CPW, terintegrasi dengan Budget
├── seserahan.html              # Seserahan / Hantaran (Conditional Content ✅)
├── tamu-hadiah.html            # Daftar tamu, RSVP, hadiah (✅ Aktif)
├── akad-resepsi.html           # Checklist Hari-H / Acara (Conditional Content ✅)
├── akun.html                   # Profil Pasangan & Event Type Switcher (✅ Aktif)
│
├── css/
│   ├── variables.css           # Design tokens: warna, radius, shadow, font
│   ├── global.css              # Reset, layout dasar, utilitas flex/grid
│   ├── components.css          # Sidebar, header, card, button, badge, event-switcher
│   └── pages.css               # Styling per halaman, kontrol edit, Tabungan, responsif & interaksi
│
├── js/
│   ├── supabase.js             # Inisialisasi Supabase client & config
│   ├── auth.js                 # Login, register, session guard, syncUserData() (event_type)
│   ├── layout.js               # Render sidebar dinamis, header, switchEventType()
│   ├── dashboard.js            # Countdown, donut, prioritas (event_type aware)
│   ├── persiapan.js            # Stepper & checklist + CRUD tahap/item (Wedding vs Engagement)
│   ├── alur-pernikahan.js      # Timeline + CRUD langkah (Wedding vs Engagement)
│   ├── budget.js               # CRUD pengeluaran & kategori multi-event
│   ├── savings.js              # Data tabungan (Supabase/lokal) & perhitungan dana vs budget
│   ├── tabungan.js             # Halaman Tabungan
│   ├── seserahan.js            # Accordion seserahan / hantaran + CRUD kategori & item
│   ├── data-store.js           # loadPageState / savePageState ke event_settings (event-scoped keys)
│   ├── tamu-hadiah.js          # CRUD tamu, RSVP, dan hadiah
│   ├── akad-resepsi.js         # Checklist & rundown hari-H + CRUD tugas (Wedding vs Engagement)
│   ├── akun.js                 # Pembaruan profil acara & event_type
│   ├── ui.js                   # Toast, drawer HP, modal form bersama, Esc / tap-luar untuk semua modal
│   └── utils.js                # Format rupiah/tanggal, getEventType(), key per event, total budget
│
├── sql/
│   ├── schema.sql              # Skema PostgreSQL + RLS + event_type
│   ├── 002_integrate_page_state.sql # Migrasi sinkronisasi checklist
│   ├── 003_enable_couple_photo_upload.sql # Storage bucket kebijakan foto
│   ├── 004_add_event_type.sql  # Migrasi penambahan kolom event_type
│   ├── 005_fix_schema_mismatch.sql # Kolom yang dipakai aplikasi, UNIQUE(user_id), event_type per item
│   └── 006_add_savings.sql     # Tabel savings_entries untuk halaman Tabungan
│
├── assets/
│   └── images/                 # Foto pasangan default (couple_kita.jpeg)
│
└── img/
    ├── slide1.jpeg s/d slide5.jpeg # Referensi mockup
    └── v1/                         # Versi mockup awal
```

---

## Teknologi & Arsitektur

### Tech Stack

| Kebutuhan | Teknologi |
| --- | --- |
| Tampilan & interaksi | HTML5, CSS3, Vanilla JavaScript (ES2020+) |
| Database, autentikasi, file | Supabase (PostgreSQL + Auth + Storage) |
| Hosting | Vercel |
| Version control & deploy | GitHub |

### Arsitektur Aplikasi

```text
Browser Pengguna (Single Page & Navigation Structure)
    ↓
HTML + CSS + JavaScript (Vercel Static Hosting)
    │
    ├── event_type === 'wedding'   → Render Konten & Checklist Wedding
    └── event_type === 'engagement'→ Render Konten & Checklist Engagement
    ↓ supabase-js (anon key + RLS)
Supabase: Auth + PostgreSQL + Storage
```

### Konsep Conditional UI (JavaScript Implementation)

Untuk mendukung `event_type` pada halaman yang sama, JavaScript menerapkan logika pengondisian (*conditional rendering & configuration*):

```javascript
// Konsep conditional rendering di dalam file JavaScript yang sama
const eventType = WP_Utils.getEventType();

if (eventType === 'wedding') {
    renderWeddingPreparation();
} else if (eventType === 'engagement') {
    renderEngagementPreparation();
}
```

### Arsitektur Database & Relasi Data

Seluruh data terhubung ke **Event** utama pengguna pada tabel `wedding_events`, yang memiliki atribut `event_type`:

```text
User
 │
 ▼
Event (wedding_events)
 │
 ├── Tasks
 ├── Budget Items
 ├── Savings Entries (Tabungan)
 ├── Seserahan Items
 ├── Guests
 └── Event Settings
```

```text
Event
├── event_type = wedding
│      └── Konfigurasi & checklist Wedding
│
└── event_type = engagement
       └── Konfigurasi & checklist Engagement
```

#### Tabel Central Event (`wedding_events`)

Nama tabel `wedding_events` dipertahankan untuk menjaga kompatibilitas dengan kode yang sudah berjalan, namun secara konseptual tabel ini menampung pusat data acara pengguna (baik Wedding maupun Engagement):

```text
wedding_events
├── id
├── user_id
├── event_type ('wedding' | 'engagement')
├── bride_name / CPW
├── groom_name / CPP
├── akad_date, akad_location
├── resepsi_date, resepsi_location
├── wedding_theme
├── total_budget             (budget Wedding)
├── engagement_total_budget  (budget Engagement)
└── photo_url
```

#### Reusabilitas Tabel

Setiap pengguna memiliki **tepat satu** baris `wedding_events` (`UNIQUE(user_id)`); mengganti jenis acara hanya mengubah kolom `event_type` pada baris tersebut. Karena itu data per item ditandai sendiri:

1. **`budget_items`** & **`guests`**: Reusable untuk seluruh jenis event tanpa tabel terpisah. Setiap baris memiliki kolom `event_type` sendiri, dan aplikasi memfilter berdasarkan `event_id` + `event_type` aktif sehingga pengeluaran/tamu Wedding dan Engagement tidak tercampur.
2. **`event_settings`**: Menyimpan state checklist (Peta Persiapan, Seserahan, Hari-H) dengan kunci terisolasi (*scoped key*, prefix `engagement_` untuk Engagement) agar state Wedding dan Engagement tidak saling menimpa.
3. **Mode Lokal / Demo**: Data disimpan di `localStorage` dengan kunci yang dipisah per `event_type` menggunakan aturan prefix yang sama.

---

## Cara Menjalankan Secara Lokal

1. **Clone / Unduh** repository ini.
2. Buka [`js/supabase.js`](js/supabase.js) dan isi `URL` dan `ANON_KEY` dari Supabase project Anda:
   ```js
   const SUPABASE_CONFIG = {
     URL: 'https://xxxx.supabase.co',
     ANON_KEY: 'eyJhbGciOi...'
   };
   ```
3. Jalankan file SQL berikut **secara berurutan** di Supabase SQL Editor:
   1. [`sql/schema.sql`](sql/schema.sql) — tabel, RLS, trigger pendaftaran
   2. [`sql/002_integrate_page_state.sql`](sql/002_integrate_page_state.sql) — tabel `event_settings` untuk checklist
   3. [`sql/003_enable_couple_photo_upload.sql`](sql/003_enable_couple_photo_upload.sql) — bucket foto pasangan (wajib untuk upload foto)
   4. [`sql/004_add_event_type.sql`](sql/004_add_event_type.sql) — kolom `event_type`
   5. [`sql/005_fix_schema_mismatch.sql`](sql/005_fix_schema_mismatch.sql) — kolom `wedding_theme`, `engagement_total_budget` & `guests.notes`, `UNIQUE(user_id)`, `event_type` pada `budget_items`/`guests`
   6. [`sql/006_add_savings.sql`](sql/006_add_savings.sql) — tabel `savings_entries` untuk halaman Tabungan

   Untuk database yang sudah berjalan, cukup jalankan migrasi yang belum pernah dijalankan (semua migrasi aman dijalankan ulang). Lihat bagian **Update Database** di bawah.
4. Buka [`login.html`](login.html) di browser (via Live Server, atau klik kanan → Open with Browser).
5. Daftar akun baru atau klik **Masuk Mode Demo** untuk langsung mengakses dashboard.
6. Untuk mengubah jenis acara, klik badge **💍 Wedding / 💐 Engagement** di bagian header atau buka menu **Akun & Profil**.

> **Mode Demo** menyimpan data hanya di browser (`localStorage`) dan tidak tersinkron ke Supabase. Gunakan akun terdaftar untuk menyimpan data ke cloud dan berbagi dengan pasangan.
>
> Setelah menarik (`git pull`) perubahan terbaru, muat ulang browser dengan **Ctrl+F5** agar JS/CSS terbaru terpakai.

---

## Update Database (Wajib untuk Database yang Sudah Berjalan)

Setelah `git pull`, jalankan migrasi yang belum pernah dijalankan di **Supabase → SQL Editor → New query** (salin seluruh isi file, lalu **Run**). Semua migrasi aman dijalankan ulang.

| Migrasi | Isi | Status database project saat ini |
| --- | --- | --- |
| `002_integrate_page_state.sql` | Tabel `event_settings` (checklist, alur, seserahan, tugas hari-H) | ✅ Sudah dijalankan |
| `003_enable_couple_photo_upload.sql` | Bucket foto pasangan `wedding-assets` | ✅ Sudah dijalankan |
| `004_add_event_type.sql` | Kolom `event_type` (sudah tercakup di 005, boleh dilewati) | — |
| `005_fix_schema_mismatch.sql` | Kolom `wedding_theme`, `engagement_total_budget`, `guests.notes`, `event_type` per item, `UNIQUE(user_id)` | ✅ Sudah dijalankan |
| **`006_add_savings.sql`** | **Tabel `savings_entries` untuk halaman Tabungan** | ⚠️ **Wajib dijalankan** |

Tanpa `006`, halaman **Tabungan** dan kartu **Dana dari Tabungan** di Budget menampilkan pesan *"Tabel tabungan belum ada di database"* pada akun Cloud (Mode Demo tetap berjalan).

Query untuk memastikan semua migrasi sudah masuk (semua kolom hasil harus bernilai `true`):

```sql
select
  to_regclass('public.event_settings') is not null  as migrasi_002,
  exists (select 1 from storage.buckets where id = 'wedding-assets') as migrasi_003,
  exists (select 1 from information_schema.columns
          where table_schema = 'public' and table_name = 'wedding_events'
            and column_name = 'engagement_total_budget')  as migrasi_005,
  to_regclass('public.savings_entries') is not null as migrasi_006,
  coalesce((select relrowsecurity from pg_class
            where oid = to_regclass('public.savings_entries')), false) as rls_tabungan_aktif;
```

---

## Checklist Pengujian

Gunakan daftar berikut setiap kali ada perubahan besar (uji di Mode Demo dan akun Cloud, untuk Wedding dan Engagement):

**Fungsional**
- [ ] Login, daftar, Mode Demo, dan logout berjalan; halaman tanpa sesi dialihkan ke `login.html`.
- [ ] Ganti jenis acara lewat badge header / Akun: isi setiap halaman berganti dan data kedua jenis acara tidak tercampur.
- [ ] Peta Persiapan: tambah item dengan nama, harga, dan link pembelian; pastikan detail tampil di bawah nama item dan tautan terbuka di tab baru.
- [ ] Peta Persiapan: edit/hapus item & tahap, centang item (status tahap ikut berubah), Kembalikan ke bawaan; item lama tanpa harga/link tetap tampil normal.
- [ ] Alur Acara: tambah/edit/hapus langkah beserta daftar dokumen.
- [ ] Budget: tambah/edit/hapus pengeluaran (hanya baris yang dipilih yang terhapus), ubah total budget.
- [ ] Tabungan: catat, edit, hapus, filter penabung; angka di halaman Budget (Dana dari Tabungan) ikut berubah; status *Belum bayar* tidak mengurangi saldo.
- [ ] Tamu, Acara, Seserahan: tambah/edit/hapus; Seserahan juga kategori.
- [ ] Semua perubahan tetap ada setelah reload; daftar yang dikosongkan tetap kosong.
- [ ] Teks seperti `<b>tes</b>` tampil apa adanya (tidak menjadi HTML).

**Tampilan HP (DevTools → Toggle device toolbar, 360px & 390px)**
- [ ] Tidak ada scroll horizontal di semua halaman.
- [ ] Header tetap terlihat saat scroll; menu drawer terbuka/tertutup (✕, Esc, tap luar).
- [ ] Modal muncul dari bawah dan bisa ditutup dengan tap di luar; input tidak memicu zoom di iPhone.
- [ ] Tabel Budget & Tamu tampil sebagai kartu dengan tombol edit/hapus terlihat.

**Database (Supabase)**
- [ ] Setelah migrasi baru, pastikan tabel/kolom baru ada dan RLS aktif untuk tabel baru.

---

## Pengembangan Lanjutan (Roadmap)

- [ ] **Ekspor PDF/Excel Multi-Event**: Laporan budget, daftar tamu, checklist seserahan/hantaran, dan rundown acara untuk Wedding maupun Engagement.
- [ ] **Tamu & Hadiah lanjutan**: Impor/ekspor daftar tamu, filter grup keluarga, dan kirim undangan digital.
- [ ] **Akun & Profil lanjutan**: Undang kolaborator pasangan/keluarga dan pengaturan notifikasi email.
- [ ] **Pengingat / Notifikasi**: Reminder deadline tugas, jatuh tempo tagihan vendor, dan persiapan H-7 acara.
- [ ] **Halaman Vendor**: Database vendor terpusat (venue, MUA, dekorasi, catering, dokumentasi).
- [ ] **Mode Offline (PWA)**: Service Worker untuk akses data hari-H tanpa koneksi internet.

---

## Istilah

| Singkatan / Istilah | Kepanjangan / Keterangan |
| --- | --- |
| **CPP** | Calon pengantin pria / Calon pria |
| **CPW** | Calon pengantin wanita / Calon wanita |
| **Lamaran / Engagement** | Acara pertemuan keluarga resmi sebelum pernikahan |
| **MUA** | Makeup artist |
| **WCC** | Wedding content creator / Fotografer |
| **DP** | Down payment (uang muka) |
| **WO / EO** | Wedding organizer / Event organizer |
| **RLS** | Row Level Security (keamanan data Supabase per pengguna) |
