import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';

interface SectionData {
  title: string;
  badge: string;
  items: { cmd?: string; desc: string }[];
  accentColor: string;
}

const SECTIONS: SectionData[] = [
  {
    title: '1. PENGENALAN TERMINAL',
    badge: 'DASAR INTERAKSI SISTEM',
    accentColor: '#38bdf8',
    items: [
      { cmd: 'CLI', desc: 'Aplikasi interaksi sistem operasi melalui teks (Command Line Interface)' },
      { cmd: 'Platform', desc: 'CMD & PowerShell (Windows), Bash (Linux), Termux (Android)' },
      { cmd: 'Kegunaan', desc: 'Mengelola file & folder, menjalankan program, instalasi paket, dan kontrol server' }
    ]
  },
  {
    title: '2. PERINTAH DASAR TERMINAL',
    badge: 'NAVIGASI & EKSPLORASI',
    accentColor: '#4ade80',
    items: [
      { cmd: 'pwd', desc: 'Menampilkan path lokasi direktori saat ini' },
      { cmd: 'ls / ls -a', desc: 'Menampilkan file & folder (termasuk file hidden)' },
      { cmd: 'cd <folder> / cd ..', desc: 'Berpindah ke dalam folder atau kembali satu level' },
      { cmd: 'clear', desc: 'Membersihkan seluruh tampilan layar terminal' },
      { cmd: 'whoami & history', desc: 'Cek nama akun aktif dan riwayat command sebelumnya' }
    ]
  },
  {
    title: '3. MENGELOLA FILE & FOLDER',
    badge: 'FILE OPERATIONS',
    accentColor: '#facc15',
    items: [
      { cmd: 'mkdir & rmdir', desc: 'Membuat folder baru dan menghapus folder kosong' },
      { cmd: 'touch nama_file', desc: 'Membuat file kosong baru secara instan' },
      { cmd: 'cat file.txt', desc: 'Membaca dan mencetak seluruh isi file ke terminal' },
      { cmd: 'echo "halo" > file', desc: 'Menulis atau menambahkan data teks ke file' },
      { cmd: 'cp, mv, rm', desc: 'Salin file (cp), pindah / rename (mv), dan hapus file (rm)' }
    ]
  },
  {
    title: '4. INFORMASI SISTEM & JARINGAN',
    badge: 'MONITORING & NETWORKING',
    accentColor: '#f472b6',
    items: [
      { cmd: 'date & uname -a', desc: 'Menampilkan tanggal/waktu dan informasi kernel OS' },
      { cmd: 'df -h & free -h', desc: 'Mengecek sisa kapasitas storage dan penggunaan RAM' },
      { cmd: 'top & ps aux', desc: 'Memantau aktivitas proses dan beban utilisasi CPU' },
      { cmd: 'ping google.com', desc: 'Menguji stabilitas koneksi & latensi internet' },
      { cmd: 'curl & wget', desc: 'Mengambil data dari URL dan mengunduh file web' }
    ]
  },
  {
    title: '5. EDITOR TEKS & PERMISSION',
    badge: 'EDITOR & HAK AKSES',
    accentColor: '#a78bfa',
    items: [
      { cmd: 'nano file.txt', desc: 'Editor teks terminal (Ctrl+O Simpan, Ctrl+X Keluar)' },
      { cmd: 'Hak Akses (r-w-x)', desc: 'r = Read (baca), w = Write (tulis), x = Execute (jalankan)' },
      { cmd: 'chmod 755 script.sh', desc: 'Mengubah hak izin eksekusi script atau program' }
    ]
  },
  {
    title: '6. KESIMPULAN & PRAKTIK',
    badge: 'RANGKUMAN MATERI',
    accentColor: '#2dd4bf',
    items: [
      { cmd: 'Skill Wajib', desc: 'Terminal adalah fondasi utama administrasi server, cloud & DevOps' },
      { cmd: 'Keunggulan', desc: 'Sangat cepat, ringan, efisien, dan dapat diotomasi dengan scripting' },
      { cmd: 'Rekomendasi', desc: 'Latih perintah praktikum (mkdir -> cd -> touch -> echo -> cat -> rm)' }
    ]
  }
];

export const TerminalLesson: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Total frames: 3960 (132s)
  // 6 sections:
  // 0: 0 -> 660 (22s)
  // 1: 660 -> 1440 (26s)
  // 2: 1440 -> 2160 (24s)
  // 3: 2160 -> 2880 (24s)
  // 4: 2880 -> 3480 (20s)
  // 5: 3480 -> 3960 (16s)
  const sectionBreakpoints = [0, 660, 1440, 2160, 2880, 3480, 3960];

  let currentSectionIdx = 0;
  for (let i = 0; i < sectionBreakpoints.length - 1; i++) {
    if (frame >= sectionBreakpoints[i] && frame < sectionBreakpoints[i + 1]) {
      currentSectionIdx = i;
      break;
    }
  }

  const sectionStartFrame = sectionBreakpoints[currentSectionIdx];
  const sectionEndFrame = sectionBreakpoints[currentSectionIdx + 1];
  const sectionLocalFrame = frame - sectionStartFrame;
  const currentSection = SECTIONS[currentSectionIdx];

  const overallProgress = (frame / durationInFrames) * 100;

  // Spring animation for section entrance
  const enterProgress = spring({
    frame: sectionLocalFrame,
    fps,
    config: { damping: 14, stiffness: 90 }
  });

  const opacity = interpolate(sectionLocalFrame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const translateY = interpolate(enterProgress, [0, 1], [30, 0]);

  // Terminal cursor blinking (every 16 frames)
  const cursorBlink = Math.floor(frame / 16) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090d16',
        color: '#f8fafc',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Terminal Window */}
      <div
        style={{
          width: '100%',
          maxWidth: 1160,
          height: 610,
          backgroundColor: '#0f172a',
          borderRadius: 16,
          border: '1px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            height: 48,
            backgroundColor: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid #334155'
          }}
        >
          {/* Window action buttons */}
          <div style={{ display: 'flex', gap: 9 }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: '#10b981' }} />
          </div>

          {/* Terminal Title */}
          <div
            style={{
              fontSize: 14,
              color: '#94a3b8',
              fontWeight: 600,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span style={{ color: '#38bdf8' }}>⚡</span>
            bash — Dasar Terminal &amp; Command Line Linux / Termux
          </div>

          {/* Section Indicator Badge */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: currentSection.accentColor,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${currentSection.accentColor}44`
            }}
          >
            BAGIAN {currentSectionIdx + 1} / {SECTIONS.length}
          </div>
        </div>

        {/* Terminal Body */}
        <div
          style={{
            flex: 1,
            padding: '28px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity,
            transform: `translateY(${translateY}px)`
          }}
        >
          {/* Top Title & Prompt */}
          <div>
            <div
              style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 700,
                color: currentSection.accentColor,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 8
              }}
            >
              [ {currentSection.badge} ]
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: -0.5,
                color: '#ffffff',
                marginBottom: 16
              }}
            >
              {currentSection.title}
            </div>

            {/* Simulated Shell Prompt */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#020617',
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid #1e293b',
                marginBottom: 20
              }}
            >
              <span style={{ color: '#4ade80', fontWeight: 700 }}>siswa@terminal</span>
              <span style={{ color: '#64748b' }}>:</span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>~/belajar</span>
              <span style={{ color: '#f8fafc' }}>$</span>
              <span style={{ color: '#facc15', fontWeight: 600 }}>
                run-lesson --topic="{currentSection.title.toLowerCase()}"
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: 9,
                  height: 18,
                  backgroundColor: cursorBlink ? '#38bdf8' : 'transparent',
                  marginLeft: 2
                }}
              />
            </div>
          </div>

          {/* Cards / Items List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: 10
            }}
          >
            {currentSection.items.map((item, idx) => {
              // Staggered reveal
              const itemAppearFrame = 10 + idx * 8;
              const itemOpacity = interpolate(
                sectionLocalFrame,
                [itemAppearFrame, itemAppearFrame + 10],
                [0, 1],
                { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
              );

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid #1e293b',
                    borderRadius: 10,
                    padding: '12px 20px',
                    opacity: itemOpacity,
                    transform: `translateX(${interpolate(
                      itemOpacity,
                      [0, 1],
                      [-15, 0]
                    )}px)`
                  }}
                >
                  {item.cmd && (
                    <div
                      style={{
                        minWidth: 160,
                        backgroundColor: '#020617',
                        color: currentSection.accentColor,
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 14,
                        border: '1px solid #334155',
                        textAlign: 'center'
                      }}
                    >
                      {item.cmd}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 16,
                      color: '#cbd5e1',
                      fontWeight: 500,
                      lineHeight: 1.4
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Progress Indicator Bar */}
          <div style={{ marginTop: 'auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#64748b',
                marginBottom: 6
              }}
            >
              <span>Progress Pembelajaran</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 6,
                backgroundColor: '#1e293b',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${overallProgress}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, #38bdf8, ${currentSection.accentColor})`,
                  borderRadius: 4
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TTS Audio Narration */}
      <Audio src={staticFile('audio.mp3')} />
    </AbsoluteFill>
  );
};
