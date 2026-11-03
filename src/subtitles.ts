// Subtitle sesuai voiceover. Waktu dalam detik (absolut terhadap voiceover.mp3).
// Kalimat panjang dipecah agar muat satu baris.

export type Sub = {start: number; end: number; text: string};

export const SUBTITLES: Sub[] = [
  {start: 0.0, end: 3.69, text: 'Cara Membuat Video Motion Graphics Menggunakan Claude AI dan Remotion'},

  {start: 4.69, end: 8.1, text: 'Kali ini kita akan belajar bagaimana cara membuat video motion graphics'},
  {start: 8.1, end: 9.97, text: 'hanya dengan bantuan AI dan Remotion.'},
  {start: 10.97, end: 14.49, text: 'Menariknya, kita tidak perlu membuat animasi secara manual dari nol.'},

  {start: 15.48, end: 17.81, text: 'Langkah pertama: Buka ChatGPT.'},
  {start: 18.77, end: 23.52, text: 'Pertama, buka ChatGPT lalu buat naskah video yang ingin kamu jadikan motion graphics.'},
  {start: 24.48, end: 28.88, text: 'Kamu bisa menentukan topik, durasi, dan gaya bahasa sesuai kebutuhan.'},

  {start: 29.87, end: 32.02, text: 'Langkah kedua: Masuk ke Claude AI.'},
  {start: 33.02, end: 37.0, text: 'Selanjutnya, buka Claude AI dan masukkan naskah yang sudah dibuat sebelumnya.'},
  {start: 37.96, end: 43.6, text: 'Berikan instruksi kepada Claude untuk mengubah naskah tersebut menjadi kode video menggunakan Remotion,'},
  {start: 43.6, end: 47.52, text: 'lengkap dengan animasi teks, transisi, visual, dan elemen pendukung lainnya.'},

  {start: 48.49, end: 50.56, text: 'Langkah ketiga: Unduh kode project.'},
  {start: 51.66, end: 56.31, text: 'Setelah Claude selesai membuat kode, minta project tersebut dikemas menjadi file ZIP.'},
  {start: 57.26, end: 58.52, text: 'Unduh file ZIP tersebut,'},
  {start: 59.02, end: 62.39, text: 'kemudian ekstrak melalui terminal atau aplikasi terminal yang kamu gunakan.'},

  {start: 63.38, end: 66.35, text: 'Langkah keempat: Install Remotion dan render video.'},
  {start: 67.32, end: 71.94, text: 'Masuk ke direktori project melalui terminal, kemudian install semua dependency yang dibutuhkan.'},
  {start: 72.92, end: 75.1, text: 'Setelah proses instalasi selesai,'},
  {start: 75.1, end: 78.22, text: 'jalankan perintah render Remotion untuk mengubah kode menjadi video.'},

  {start: 79.21, end: 81.86, text: 'Langkah kelima: Tunggu proses rendering selesai.'},
  {start: 82.83, end: 85.5, text: 'Proses rendering mungkin membutuhkan waktu,'},
  {start: 85.5, end: 89.39, text: 'tergantung durasi video, kompleksitas animasi, dan spesifikasi perangkat.'},
  {start: 90.43, end: 93.97, text: 'Setelah selesai, file video akan tersedia di folder output project.'},

  {start: 95.11, end: 95.92, text: 'Dan selesai!'},
  {start: 96.93, end: 101.77, text: 'Sekarang kamu sudah berhasil membuat video motion graphics menggunakan bantuan Claude AI dan Remotion.'},
  {start: 102.74, end: 108.8, text: 'Dengan cara ini, kamu bisa membuat berbagai macam video edukasi, teknologi, hingga konten media sosial'},
  {start: 108.8, end: 111.17, text: 'hanya dengan bantuan AI dan sedikit konfigurasi.'},
  {start: 112.19, end: 113.11, text: 'Selamat mencoba!'},
];
