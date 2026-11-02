import React from 'react';
import {C} from '../theme';
import {SimScene, Step, TreeItem} from '../components/SimScene';

export const DasarScene: React.FC = () => {
  const steps: Step[] = [
    {cmd: 'pwd', out: ['/home/siswa'], note: 'Menampilkan lokasi direktori saat ini.'},
    {cmd: 'ls', out: ['Dokumen  Unduhan  belajar  catatan.txt'], note: 'Menampilkan daftar file dan folder.'},
    {cmd: 'ls -a', out: ['.  ..  .bashrc  .profile  Dokumen  belajar'], note: 'Menampilkan semua file, termasuk yang tersembunyi.'},
    {cmd: 'cd belajar', after: '~/belajar', note: 'Masuk ke folder.'},
    {cmd: 'cd ..', after: '~', note: 'Kembali satu direktori.'},
    {cmd: 'cd /', after: '/', note: 'Masuk ke direktori utama sistem.'},
    {cmd: 'cd ~', after: '~', note: 'Kembali ke direktori home.'},
    {cmd: 'clear', note: 'Membersihkan tampilan terminal.'},
    {cmd: 'whoami', out: ['siswa'], note: 'Menampilkan nama pengguna yang sedang aktif.'},
    {
      cmd: 'history',
      out: ['  1  pwd', '  2  ls', '  3  ls -a', '  4  cd belajar', '  5  cd ..', '  6  cd /'],
      note: 'Menampilkan riwayat perintah.',
    },
  ];
  return <SimScene title="Perintah Dasar" subtitle="Berpindah dan melihat sekeliling" steps={steps} accent={C.amber} />;
};

const R: TreeItem = {name: 'latihan/', depth: 0, dir: true};
const D: TreeItem = {name: 'dokumen/', depth: 1, dir: true};

export const FileScene: React.FC = () => {
  const steps: Step[] = [
    {cmd: 'mkdir dokumen', tree: [R, D], note: 'Membuat folder baru.'},
    {cmd: 'touch file.txt', tree: [R, D, {name: 'file.txt', depth: 1}], note: 'Membuat file kosong.'},
    {cmd: 'echo "Halo Dunia"', out: ['Halo Dunia'], note: 'Menampilkan teks di terminal.'},
    {cmd: 'echo "Halo Dunia" > file.txt', note: 'Menulis teks ke dalam file.'},
    {cmd: 'cat file.txt', out: ['Halo Dunia'], note: 'Menampilkan isi file.'},
    {cmd: 'echo "Teks tambahan" >> file.txt', note: 'Menambahkan teks ke akhir file.'},
    {cmd: 'cat file.txt', out: ['Halo Dunia', 'Teks tambahan'], note: 'Isi file sekarang punya dua baris.'},
    {
      cmd: 'cp file.txt salinan.txt',
      tree: [R, D, {name: 'file.txt', depth: 1}, {name: 'salinan.txt', depth: 1}],
      note: 'Menyalin file.',
    },
    {
      cmd: 'mv salinan.txt dokumen/',
      tree: [R, D, {name: 'salinan.txt', depth: 2}, {name: 'file.txt', depth: 1}],
      note: 'Memindahkan file ke dalam folder.',
    },
    {
      cmd: 'mv file.txt baru.txt',
      tree: [R, D, {name: 'salinan.txt', depth: 2}, {name: 'baru.txt', depth: 1}],
      note: 'Mengganti nama file.',
    },
    {
      cmd: 'rm baru.txt',
      tree: [R, D, {name: 'salinan.txt', depth: 2}],
      note: 'Menghapus file.',
    },
    {
      cmd: 'rm -r dokumen',
      tree: [R],
      warn: true,
      note: 'Hati-hati: rm menghapus data secara permanen. Periksa dulu sebelum menjalankannya.',
    },
  ];
  return (
    <SimScene
      title="File dan Folder"
      subtitle="Membuat, menulis, menyalin, memindahkan, menghapus"
      steps={steps}
      accent={C.cyan}
      startCwd="~/latihan"
    />
  );
};

export const SistemScene: React.FC = () => {
  const steps: Step[] = [
    {cmd: 'date', out: ['Senin, 2 November 2026  11:50:07 WIB'], note: 'Menampilkan tanggal dan waktu.'},
    {cmd: 'uname -a', out: ['Linux belajar 6.8.0 #45 SMP x86_64 GNU/Linux'], note: 'Informasi sistem operasi dan kernel.'},
    {
      cmd: 'df -h',
      out: ['Filesystem  Size  Used  Avail  Use%', '/dev/sda1    64G   23G    38G   38%'],
      note: 'Kapasitas dan penggunaan penyimpanan.',
    },
    {cmd: 'du -sh belajar', out: ['4.2M  belajar'], note: 'Melihat ukuran sebuah folder.'},
    {
      cmd: 'free -h',
      out: ['        total   used   free', 'Mem:    7.7Gi  2.1Gi  4.3Gi'],
      note: 'Penggunaan RAM. Tidak tersedia default di semua lingkungan.',
    },
    {cmd: 'uptime', out: [' 11:50 up 3:42, 1 user, load: 0.21'], note: 'Melihat lama sistem berjalan.'},
    {
      cmd: 'top',
      out: ['PID   USER    %CPU  COMMAND', '1204  siswa   12.0  node', '  88  root     3.1  systemd', ' 411  siswa    1.4  bash'],
      note: 'Memantau proses dan penggunaan sumber daya.',
    },
    {
      cmd: 'ps aux',
      out: ['USER   PID  %CPU %MEM COMMAND', 'siswa  411   0.0  0.1 bash', 'siswa 1204  12.0  2.3 node', 'siswa 1290   0.0  0.0 ps aux'],
      note: 'Daftar proses yang sedang berjalan.',
    },
  ];
  return <SimScene title="Informasi Sistem" subtitle="Mengintip kondisi komputer" steps={steps} accent={C.lilac} />;
};

export const JaringanScene: React.FC = () => {
  const steps: Step[] = [
    {
      cmd: 'ping google.com',
      out: ['PING google.com (142.250.4.100)', '64 bytes: time=12.4 ms', '64 bytes: time=11.9 ms', '64 bytes: time=12.1 ms'],
      note: 'Menguji koneksi jaringan.',
    },
    {
      cmd: 'curl https://example.com',
      out: ['<!doctype html>', '<html>', '  <h1>Example Domain</h1>', '</html>'],
      note: 'Mengambil data dari sebuah URL.',
    },
    {
      cmd: 'curl -I https://example.com',
      out: ['HTTP/2 200', 'content-type: text/html', 'content-length: 1256'],
      note: 'Melihat header HTTP.',
    },
    {
      cmd: 'wget https://example.com/file.zip',
      out: ['Menyimpan ke: file.zip', '100%[==========>] 1,2M  4,1MB/s', 'file.zip tersimpan'],
      note: 'Mengunduh file dari internet.',
    },
    {
      cmd: 'ip addr',
      out: ['2: wlan0: <BROADCAST,UP>', '    inet 192.168.1.23/24'],
      note: 'Melihat informasi alamat IP pada Linux.',
    },
    {
      cmd: 'ssh user@alamat-ip',
      after: 'server:~',
      out: ['Terhubung ke alamat-ip ...', 'Welcome to Ubuntu Server'],
      note: 'Mengakses server lain melalui SSH.',
    },
  ];
  return <SimScene title="Perintah Jaringan" subtitle="Terhubung ke dunia luar" steps={steps} accent={C.pink} />;
};

export const PaketScene: React.FC = () => {
  const steps: Step[] = [
    {cmd: 'sudo apt update', out: ['Hit:1 archive.ubuntu.com', 'Membaca daftar paket... Selesai'], note: 'Debian atau Ubuntu: memperbarui daftar paket.'},
    {cmd: 'sudo apt upgrade', out: ['12 paket akan diperbarui', 'Selesai.'], note: 'Memperbarui paket yang terinstal.'},
    {cmd: 'sudo apt install nano', out: ['Memasang nano ...', 'nano berhasil dipasang'], note: 'Menginstal aplikasi Nano.'},
    {cmd: 'sudo apt remove nano', after: 'termux:~', out: ['nano dihapus'], note: 'Menghapus aplikasi Nano.'},
    {cmd: 'pkg update', out: ['Mengambil daftar paket... Selesai'], note: 'Termux: memperbarui daftar paket.'},
    {cmd: 'pkg install python', out: ['Memasang python ...', 'python terpasang'], note: 'Menginstal Python.'},
    {cmd: 'pkg install git', out: ['Memasang git ...', 'git terpasang'], note: 'Menginstal Git.'},
  ];
  return (
    <SimScene
      title="Manajemen Paket"
      subtitle="Pasang dan hapus aplikasi lewat teks"
      steps={steps}
      accent={C.green}
    />
  );
};

const R2: TreeItem = {name: 'belajar-terminal/', depth: 0, dir: true};

export const PraktikumScene: React.FC = () => {
  const steps: Step[] = [
    {cmd: 'mkdir belajar-terminal', tree: [R2], label: 'mkdir', note: 'Membuat folder baru.'},
    {cmd: 'cd belajar-terminal', after: '~/belajar-terminal', label: 'cd', note: 'Masuk ke direktori.'},
    {cmd: 'touch biodata.txt', tree: [R2, {name: 'biodata.txt', depth: 1}], label: 'touch', note: 'Membuat file kosong.'},
    {cmd: 'echo "Nama: Siswa" > biodata.txt', label: 'echo >', note: 'Menulis teks ke dalam file.'},
    {cmd: 'echo "Status: Belajar Terminal" >> biodata.txt', label: 'echo >>', note: 'Menambahkan baris baru.'},
    {cmd: 'cat biodata.txt', out: ['Nama: Siswa', 'Status: Belajar Terminal'], label: 'cat', note: 'Membaca isi file.'},
    {
      cmd: 'cp biodata.txt salinan.txt',
      tree: [R2, {name: 'biodata.txt', depth: 1}, {name: 'salinan.txt', depth: 1}],
      label: 'cp',
      note: 'Menyalin file.',
    },
    {cmd: 'ls', out: ['biodata.txt  salinan.txt'], label: 'ls', note: 'Cek: ada dua file.'},
    {
      cmd: 'mv salinan.txt data.txt',
      tree: [R2, {name: 'biodata.txt', depth: 1}, {name: 'data.txt', depth: 1}],
      label: 'mv',
      note: 'Mengganti nama file.',
    },
    {cmd: 'ls', out: ['biodata.txt  data.txt'], label: 'ls', note: 'Cek: salinan.txt sudah menjadi data.txt.'},
    {
      cmd: 'rm data.txt',
      tree: [R2, {name: 'biodata.txt', depth: 1}],
      label: 'rm',
      note: 'Menghapus file.',
    },
    {cmd: 'ls', out: ['biodata.txt'], label: 'ls', note: 'Cek: tinggal biodata.txt.'},
  ];
  const goals = [
    {label: 'Membuat folder', step: 0},
    {label: 'Masuk ke direktori', step: 1},
    {label: 'Membuat file', step: 2},
    {label: 'Menulis teks', step: 3},
    {label: 'Membaca isi file', step: 5},
    {label: 'Menyalin file', step: 6},
    {label: 'Mengganti nama file', step: 8},
    {label: 'Menghapus file', step: 10},
  ];
  return (
    <SimScene
      title="Praktikum Terminal"
      subtitle="Ikuti perintahnya secara berurutan"
      steps={steps}
      accent={C.amber}
      goals={goals}
      treeTitle="Isi folder"
    />
  );
};
