# 特定技能2号 — catatan belajar

Situs pribadi untuk belajar tokutei ginou **2号**: materi, syarat, dan kuis.
Login + database pakai Supabase.

## Isi

- `index.html` — masuk / daftar
- `app.html` — beranda (daftar materi + tombol kuis)
- `materi.html?id=N` — baca materi
- `kuis.html` — 10 soal, skor tersimpan
- `aset/desain.css` — satu-satunya CSS
- `aset/app.js` — auth + ambil data + kuis
- `aset/konfig.js` — URL + publishable key Supabase (boleh publik)
- `db/skema.sql` — tabel + RLS + isi awal

## Pasang (10 menit)

1. Supabase → New project.
2. SQL Editor → tempel seluruh `db/skema.sql` → Run.
3. Authentication → Providers → Email: **matikan** "Confirm email"
   (login pakai nama pengguna, jadi tidak ada email sungguhan).
4. Project Settings → API → salin **URL** dan **publishable/anon key**.
5. Isi `aset/konfig.js`:
   ```js
   window.KONFIG = { supabaseUrl: "https://xxx.supabase.co", supabaseKey: "sb_publishable_..." };
   ```
6. Buka `index.html` lewat server lokal (`python3 -m http.server`) atau hosting.

## Deploy

GitHub Pages (repo Public) atau Cloudflare Pages. Cukup upload seluruh folder.

## Kenapa pakai JS

Login, sesi, dan baca tulis database Supabase hanya bisa dari browser lewat
`supabase-js`. Semua halaman tetap HTML statis; JS hanya untuk auth + data + kuis.

## Catatan isi

Materi awal: 3 topik (apa itu 2号, 11 bidang, syarat naik) + 5 contoh soal.
Syarat & jadwal ujian **berbeda per bidang** — cek 出入国在留管理庁 atau 協会 resmi
bidangmu sebelum dipakai sebagai patokan resmi.

## Materi bidang 宿泊 (hotel)

`db/isi-hotel.sql` — 6 topik + 15 soal, disusun dari
`特定技能2号評価試験 学習用テキスト 宿泊分野` (65 halaman, milikmu).

Urutan jalan: `skema.sql` → `isi-hotel.sql` → `kosakata.sql`.

## Flashcard kosakata — dipisah 1号 & 2号

Tabel `kosakata` punya kolom `level`: `1号`, `2号`, atau `1号・2号`.
Di halaman flashcard ada filter **Level ujian** + **Bagian**.

| level | jumlah |
|---|---|
| hanya 1号 | 81 |
| hanya 2号 | 196 |
| ada di dua-duanya | 263 |
| **total** | **540** |

## Flashcard kosakata

`flashcard.html` + `db/kosakata.sql` — **152 kata** (kanji · kana · arti Indonesia),
dari 2 PDF 宿泊分野 (1号 52 hlm + 2号 65 hlm). Bacaan diambil dari JMdict (EDRDG),
bukan ditebak.

Fitur: filter per bagian (制度・法律 / フロント業務 / 企画・広報 / 接客 /
レストランサービス / 安全衛生), ketuk kartu untuk balik, tombol sebelumnya/lagi,
dan acak urutan.

Catatan: teks aslinya materi berbayar/hak cipta penerbit — pakai untuk diri
sendiri, **jangan dipublikasikan**. Ringkasannya sudah ditulis ulang dalam
Bahasa Indonesia + istilah Jepang.

## Nilai & review

- `nilai.html` — 3 angka (kuis dikerjakan · rata-rata benar · skor terakhir) + 20 riwayat.
- `review.html` — soal yang pernah salah, lengkap jawaban benar + penjelasan.
  Tombol **Sudah paham** menghapus entri itu.
- Kuis otomatis mencatat jawaban salah ke tabel `salah` (db/review.sql).

Urutan SQL lengkap: `skema.sql` → `isi-hotel.sql` → `kosakata.sql` → `review.sql`.

## Sumber jawaban (penjelasan soal)

`db/sumber-soal.sql` menambah 6 kolom ke tabel `soal`:
`bab`, `sumber_pdf`, `halaman`, `kalimat`, `kalimat_ruby`, `kosakata`.

Setelah soal dijawab (kuis) atau saat membaca Review, muncul:
1. **kalimat asli** dari PDF dengan **furigana** (ruby)
2. **daftar kosakata** di kalimat itu: kanji（かな）— arti
3. baris sumber: **bab ・ PDF mana ・ halaman berapa**

Urutan SQL: `skema.sql` → `isi-hotel.sql` → `kosakata.sql` → `review.sql` → `sumber-soal.sql`.

## ピクトグラム (papan tanda) — sumber terpisah

Dari `000102041.pdf` (標準デザイン ピクトグラム, 8 hlm): **188 istilah papan tanda**
(kanji · kana · arti Indonesia) + **20 soal** sendiri.

Penanda supaya tidak tertukar dengan 1号/2号:
- flashcard: pilihan **Level → ピクトグラム**, latar kartu kebiruan
- kuis: buka `kuis.html?sumber=picto` → latar biru + badge **ピクトグラム** di header
- tombol di beranda: **Kuis ピクトグラム** + **Flashcard ピクトグラム (188)**

SQL: `db/picto.sql` (jalan setelah skema & kosakata).

## Soal bergambar (piktogram)

`db/picto-gambar.sql`:
- kolom `gambar` di `soal` dan `kosakata`
- **187 ikon** dipotong dari PDF (300 dpi) → `aset/picto/001.png …`
- **187 soal bergambar** (semua ikon): "このピクトグラムは何を表していますか？"
  jawabannya **istilah Jepang (kanji)** — bukan arti Indonesia; penjelasan menampilkan kana + arti
- flashcard ikut menampilkan ikon di sisi depan

Jalan setelah `picto.sql`.

## Soal pilihan bergambar (menjebak)

`db/picto-jebakan.sql` — **69 soal** "「非常口」のピクトグラムはどれですか？"
dengan **4 pilihan berupa ikon** dari kelompok mirip:

- 非常口 / 避難所（建物） / 広域避難場所 / 津波避難場所 / 津波避難ビル
- 非常口 / 非常電話 / 非常ボタン / 列車の非常停止ボタン
- 立入禁止 / 進入禁止 / 駐車禁止 / 自転車乗り入れ禁止 / 一般禁止
- 喫煙所 / 禁煙 / 加熱式たばこ専用喫煙室 / 歩行中禁煙
- 温泉 / 浴室 / シャワー / 水飲み場 / 飲料水 / 飲めない
- お手洗 / 洋風便器 / 和風便器 / オストメイト用設備 / ベビーケアルーム
- 優先席 5 jenis · 注意 4 jenis · 交通 4–6 jenis · 空港 · 宿泊 · 食 · 自然

Kolom baru: `soal.pilihan_gambar` (array path ikon).
Jalan setelah `picto-gambar.sql`.

## Kuis ピクトグラム dipisah

- `kuis.html?sumber=picto&jenis=teks` — 187 soal: ikon → pilih **istilah kanji**
- `kuis.html?sumber=picto&jenis=gambar` — 69 soal: teks → pilih **ikon** (4 ikon mirip)

Badge di header ikut menyebut "・teks" / "・gambar" supaya jelas sedang di mana.

## Belajar 30 hari × 3 sesi

`belajar.html` → 30 kartu hari (hijau = selesai, kuning = materi sudah, angka = belum).
`hari.html?n=1` → 3 sesi:

1. **チェック materi** — flashcard: depan **kanji**, belakang **hiragana + arti**.
   Setiap kartu wajib dibalik; tombol "Sudah hafal" / "Belum hafal" (belum hafal = diulang di akhir).
   Selesai → tercatat di tabel `progres` (sesi `materi`).
2. **Sesi pagi** — **terkunci** sampai materi hari itu selesai. Isi: 12 soal, 6 tipe:
   kanji→kana · kana→kanji · kanji→arti · arti→kanji · arti→kana · kana→arti.
3. **Sesi siang / malam** — belum dibuka (nanti).

Pembagian: 35 kata/hari (1.028 kata → 30 hari; hari terakhir 13 kata).
`db/belajar.sql` — tabel `progres` + RLS (hanya milik sendiri).

## Sesi pagi: 3 sub-sesi (satu soal satu layar)

35 kata dibagi 3: Pagi 1 (12) · Pagi 2 (12) · Pagi 3 (11). Berurutan —
Pagi 2 terbuka setelah Pagi 1 selesai.

Di dalam tiap sub-sesi:
- **satu soal satu layar** (kartu), 4 pilihan
- **timer berjalan** per soal (dihitung sejak soal tampil, berhenti saat dijawab)
- **jawaban salah masuk lagi ke paling belakang antrean** sub-sesi itu, sampai benar
- selesai = antrean kosong; tersimpan ke `progres` (sesi `pagi1/2/3`) dengan
  `skor` (benar sekali coba), `total`, `jumlah_soal` (jumlah jawaban), `waktu_ms`

`db/sesi-pagi.sql` — longgarkan constraint `progres.sesi` + kolom waktu.

## PDF sumber

`aset/pdf/2gou-shukuhaku.pdf` = PDF 宿泊分野 2号 (65 halaman). Dipakai tombol
"halaman N ↗" di penjelasan kuis: `...pdf#page=N` membuka viewer di halaman itu
(Chrome / Edge / Firefox desktop). **Hak cipta penerbit** — jangan taruh di host publik.
