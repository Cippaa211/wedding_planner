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
| Seserahan & Hantaran | ✅ Selesai |
| Tamu & Hadiah | ✅ Selesai (versi awal) |
| Akad & Resepsi / Acara Hari-H | ✅ Selesai (Checklist & Rundown Multi-Event) |
| Akun & Profil | ✅ Selesai (Pengaturan Event Type & Profil) |

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
- **Navigasi tetap sama** (menggunakan 8 menu utama yang sama).
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

Desktop memakai sidebar kiri dan area kerja utama. Sidebar berubah menjadi menu drawer pada ponsel. Navigasi sidebar menggunakan **8 menu generik tetap** yang konsisten untuk seluruh jenis event:

1. **Dashboard** (`index.html`)
2. **Peta Persiapan** (`persiapan.html`)
3. **Alur Acara** (`alur-pernikahan.html`)
4. **Budget** (`budget.html`)
5. **Tamu & Hadiah** (`tamu-hadiah.html`)
6. **Acara** (`akad-resepsi.html`)
7. **Seserahan** (`seserahan.html`)
8. **Akun** (`akun.html`)

Menu sidebar berfungsi sebagai navigasi utama aplikasi dan **tidak berubah labelnya saat event type berganti**. Konten di dalam setiap halamanlah yang merender informasi, checklist, dan data secara kondisional berdasarkan `event_type`.

Bagian atas setiap halaman berisi sapaan `Halo, Ayu & Angga 👋`, teks pendukung, badge pemilih event type (*Event Switcher*), ikon notifikasi, dan avatar pengguna.

### Dashboard Context-Aware (`index.html`)

Dashboard tidak dipisah menjadi file terpisah, melainkan menyesuaikan konten berdasarkan `event_type`:
- **Wedding**: Istilah Akad & Resepsi, hitung mundur menuju tanggal akad nikah, ringkasan progres persiapan nikah dan administrasi KUA.
- **Engagement**: Istilah Lamaran / Engagement, hitung mundur menuju acara lamaran, ringkasan progres persiapan lamaran.

### Gaya Visual

- Aksen merah muda/merah (`#E11D48`) untuk tombol utama, menu aktif, dan informasi penting.
- Latar putih atau merah muda sangat pucat agar konten mudah dibaca.
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
- **Prioritas Mendesak**: 5 tugas/dokumen paling mendesak yang menyesuaikan event (Administrasi KUA untuk Wedding / Konfirmasi Tempat & Hantaran untuk Engagement).

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

### 4. Alur Pernikahan / Alur Acara (`alur-pernikahan.html`)

Halaman `alur-pernikahan.html` dipertahankan nama filenya untuk kompatibilitas, namun secara konseptual menjadi halaman **Alur Acara**:

- **Wedding (`event_type = wedding`)**:
  - **Jalur CPP**: RT/RW → KUA Asal (Surat Numpang Nikah) → Serahkan ke Calon Istri.
  - **Jalur CPW**: RT/RW → Puskesmas/Klinik (Suntik TT) → Lengkapi Dokumen KUA.
- **Engagement (`event_type = engagement`)**:
  - **Jalur Laki-laki**: Hantaran & Cincin Lamaran → Keluarga & Utusan Juru Bicara → Kedatangan.
  - **Jalur Perempuan**: Tempat & Dekorasi Acara → MUA & Busana → Penerimaan & Jamuan Tamu.

### 5. Budget (`budget.html`)

- Halaman `budget.html` dan tabel database `budget_items` bersifat **reusable** untuk kedua jenis event.
- **Opsi Kategori Pengeluaran** disesuaikan secara otomatis:
  - **Wedding**: `Venue`, `Akad`, `Resepsi`, `Catering`, `MUA`, `Dokumentasi`, `Seserahan`, `Lain-lain`.
  - **Engagement**: `Venue/Lokasi`, `MUA & Busana`, `Dekorasi`, `Catering`, `Hantaran/Seserahan`, `Dokumentasi`, `Ring/Cincin`, `Lain-lain`.

### 6. Akad & Resepsi / Acara Hari-H (`akad-resepsi.html`)

Halaman `akad-resepsi.html` menampilkan checklist operasional hari-H secara kondisional:
- **Wedding**: Sesi Pra-Akad, Akad Nikah, Resepsi, dan Pasca Acara.
- **Engagement**: Sesi Pra-Acara, Prosesi Lamaran/Pinangan & Tukar Cincin, Ramah Tamah & Foto, dan Pasca Acara.

### 7. Seserahan & Hantaran (`seserahan.html`)

- Konten disesuaikan untuk daftar belanja **Seserahan Pernikahan** (`wedding`) atau **Hantaran Lamaran** (`engagement`).
- Menyediakan summary bar 4 angka, filter kategori, 8 kategori accordion, checkbox item, dan modal CRUD.

### 8. Akun & Profil (`akun.html`)

- Menyediakan form pembaruan profil acara, tanggal, dan pengunggah foto pasangan.
- **Pemilih Jenis Acara (Event Type)**: Dropdown untuk beralih antara `Pernikahan (Wedding)` dan `Lamaran (Engagement)`. Saat diubah, seluruh antarmuka dan konten aplikasi akan beradaptasi secara otomatis.

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
├── seserahan.html              # Seserahan / Hantaran (Conditional Content ✅)
├── tamu-hadiah.html            # Daftar tamu, RSVP, hadiah (✅ Aktif)
├── akad-resepsi.html           # Checklist Hari-H / Acara (Conditional Content ✅)
├── akun.html                   # Profil Pasangan & Event Type Switcher (✅ Aktif)
│
├── css/
│   ├── variables.css           # Design tokens: warna, radius, shadow, font
│   ├── global.css              # Reset, layout dasar, utilitas flex/grid
│   ├── components.css          # Sidebar, header, card, button, badge, event-switcher
│   └── pages.css               # Styling spesifik per halaman
│
├── js/
│   ├── supabase.js             # Inisialisasi Supabase client & config
│   ├── auth.js                 # Login, register, session guard, syncUserData() (event_type)
│   ├── layout.js               # Render sidebar dinamis, header, switchEventType()
│   ├── dashboard.js            # Countdown, donut, prioritas (event_type aware)
│   ├── persiapan.js            # Stepper & checklist (Wedding vs Engagement)
│   ├── alur-pernikahan.js      # Timeline (Wedding vs Engagement)
│   ├── budget.js               # CRUD pengeluaran & kategori multi-event
│   ├── seserahan.js            # Accordion kategori seserahan / hantaran
│   ├── data-store.js           # loadPageState / savePageState (event-scoped keys)
│   ├── tamu-hadiah.js          # CRUD tamu, RSVP, dan hadiah
│   ├── akad-resepsi.js         # Checklist hari-H (Wedding vs Engagement)
│   ├── akun.js                 # Pembaruan profil acara & event_type
│   ├── ui.js                   # Toast notification, mobile drawer toggle
│   └── utils.js                # Format rupiah, getEventType(), BUDGET_CATEGORIES
│
├── sql/
│   ├── schema.sql              # Skema PostgreSQL + RLS + event_type
│   ├── 002_integrate_page_state.sql # Migrasi sinkronisasi checklist
│   ├── 003_enable_couple_photo_upload.sql # Storage bucket kebijakan foto
│   └── 004_add_event_type.sql  # Migrasi penambahan kolom event_type
│
├── assets/
│   ├── images/                 # Foto pasangan, avatar placeholder
│   └── icons/                  # SVG ikon
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
├── event_name
├── event_date / akad_date
├── location
├── total_budget
└── photo_url
```

#### Reusabilitas Tabel

1. **`budget_items`**: Bersifat reusable untuk seluruh jenis event tanpa membuat tabel terpisah (seperti `wedding_budget_items` atau `engagement_budget_items`). Seluruh item dibedakan berdasarkan `event_id`, di mana acara tersebut memiliki atribut `event_type`.
2. **`event_settings`**: Berfungsi menyimpan state/konfigurasi fitur berbasis event dengan kunci terisolasi (*scoped key*) agar state Wedding dan Engagement tidak saling menimpa.

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
3. Jalankan SQL [`sql/schema.sql`](sql/schema.sql) dan [`sql/004_add_event_type.sql`](sql/004_add_event_type.sql) di Supabase SQL Editor.
4. Buka [`login.html`](login.html) di browser (via Live Server, atau klik kanan → Open with Browser).
5. Daftar akun baru atau klik **Masuk Mode Demo** untuk langsung mengakses dashboard.
6. Untuk mengubah jenis acara, klik badge **💍 Wedding / 💐 Engagement** di bagian header atau buka menu **Akun & Profil**.

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
