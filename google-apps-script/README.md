# Setup pengumpulan Pitch Deck Ruang Karya

Integrasi ini menyimpan jawaban siswa ke Google Sheets dan file PNG ke Google Drive. Tidak memakai database tambahan.

## 1. Buat Apps Script

1. Buka https://script.google.com/ dengan akun Google guru.
2. Buat project baru, misalnya **Ruang Karya — Pengumpulan Pitch Deck**.
3. Hapus isi awal `Code.gs`, lalu salin seluruh isi file `Code.gs` dari folder ini.
4. Simpan project.
5. Pilih fungsi `setupRuangKarya` lalu klik **Run**.
6. Setujui izin akses Google Sheets dan Google Drive.
7. Buka Execution log. Di sana ada tautan Spreadsheet dan folder Drive yang dibuat otomatis.

Jalankan `setupRuangKarya` hanya sekali, kecuali memang ingin membuat ulang tempat penyimpanan.

## 2. Deploy sebagai Web App

1. Klik **Deploy → New deployment**.
2. Pilih jenis **Web app**.
3. **Execute as:** Me.
4. **Who has access:** Anyone.
5. Klik Deploy dan selesaikan otorisasi.
6. Salin URL Web App yang berakhiran `/exec`.

Akses publik diperlukan agar siswa dapat mengirim tugas tanpa login Google. Endpoint hanya menerima data tugas dan menyimpan file menggunakan izin akun guru. Jangan menaruh data rahasia di kode frontend.

## 3. Hubungkan ke website

Buka `data/submission-config.json` di repo Ruang Karya. Isi properti `endpoint` dengan URL Web App tadi:

```json
{
  "endpoint": "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
}
```

Commit perubahan dan tunggu deployment Vercel selesai. Setelah itu tombol **Kirim tugas** akan mengirim jawaban dan PNG ke spreadsheet serta Drive.

## 4. Uji sebelum dibagikan ke siswa

1. Buka Sesi 20 di website.
2. Isi data uji dengan nama panggilan, judul, problem, target, solusi, gameplay, dan pesan.
3. Klik **Kirim tugas**.
4. Pastikan baris baru muncul di tab **Pengumpulan**.
5. Pastikan file PNG muncul di folder Drive dan tautannya ada di kolom terakhir.

## Catatan privasi dan operasional

- Minta siswa memakai nama panggilan atau nama yang biasa digunakan di kelas; jangan mengumpulkan alamat, nomor telepon, kata sandi, atau data sensitif.
- URL Web App bersifat publik. Batasi informasi yang dikirim dan pantau spreadsheet/folder Drive.
- Jangan membagikan URL edit spreadsheet atau folder Drive kepada siswa.
- Draft otomatis hanya tersimpan pada browser/perangkat yang sedang digunakan. Pengumpulan resmi baru tercatat setelah submit berhasil.
- Jika Apps Script diubah, deploy versi baru atau edit deployment agar website memakai kode terbaru.
- Google Apps Script memiliki kuota harian dan batas ukuran request. Implementasi ini membatasi PNG hingga 4,5 MB.
