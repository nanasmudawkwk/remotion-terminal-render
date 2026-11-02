import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {clamp, ease, sp} from '../anim';
import {Heading} from '../components/Heading';
import {Sfx, SfxItem, typeClicks} from '../components/Sfx';


const pops = (n: number, start: number, gap: number, f = 'pop', v = 0.4): SfxItem[] =>
  Array.from({length: n}, (_, i) => ({at: start + i * gap, f, v, d: 30}));
const SFX_INTRO: SfxItem[] = [
  {at: 0, f: 'hit', v: 0.55},
  {at: 4, f: 'whoosh', v: 0.4, d: 24},
  ...Array.from({length: 13}, (_, i) => ({at: 6 + i * 2, f: `click${(i % 3) + 1}`, v: 0.3, d: 6})),
  ...typeClicks(95, 6, 0.3, 0.3, 1),
  {at: 130, f: 'ding', v: 0.35, d: 30},
];
const SFX_OBJ: SfxItem[] = [...pops(6, 50, 105), ...pops(6, 84, 105, 'ding', 0.25)];
const SFX_PENG: SfxItem[] = [...pops(3, 150, 40, 'pop', 0.45), ...pops(4, 290, 34, 'pop', 0.4)];
const SFX_NANO: SfxItem[] = [
  ...typeClicks(40, 24, 0.5, 0.3, 2),
  ...[100, 170, 240].flatMap((a) => [{at: a, f: 'click2', v: 0.6, d: 6}, {at: a + 2, f: 'pop', v: 0.45, d: 12}]),
];
const SFX_PERM: SfxItem[] = [
  ...typeClicks(60, 19, 0.5, 0.3, 2),
  ...pops(3, 130, 50, 'pop', 0.45),
  ...typeClicks(310, 18, 0.5, 0.3, 2),
  {at: 355, f: 'ding', v: 0.4, d: 30},
];
const SFX_INTER: SfxItem[] = [
  {at: 0, f: 'whoosh', v: 0.4, d: 24},
  ...[14, 56, 94].map((a) => ({at: a, f: 'pop', v: 0.5, d: 12})),
  {at: 132, f: 'hit', v: 0.5},
];
const SFX_KES: SfxItem[] = [
  {at: 6, f: 'hit', v: 0.4},
  ...pops(5, 115, 40, 'pop', 0.4),
  {at: 440, f: 'ding', v: 0.45, d: 30},
];

const Check: React.FC<{p: number; size?: number; color?: string}> = ({p, size = 56, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx={28} cy={28} r={23} fill="none" stroke="#ffffff30" strokeWidth={3} />
    <circle cx={28} cy={28} r={23 * p} fill={color} />
    <path
      d="M16 29 L25 38 L41 19"
      fill="none"
      stroke={C.bg}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={50}
      strokeDashoffset={(1 - p) * 50}
    />
  </svg>
);

/* ---------------------------------------------------------------- INTRO */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glyphs = ['ls', 'cd ..', 'pwd', 'mkdir', 'cat', 'chmod +x', 'sudo apt', 'ssh', 'echo', 'rm -r', 'cp', 'mv', 'top', 'ping', 'nano', 'whoami'];
  const words = ['Dasar', 'Terminal'];
  let idx = 0;
  const typed = 'whoami'.slice(0, Math.max(0, Math.floor((frame - 95) * 0.3)));
  const bar = interpolate(frame, [40, 80], [0, 1], {...clamp, easing: ease});
  const logo = sp(frame, fps, 10, 12, 80);
  return (
    <AbsoluteFill>
      <Sfx list={SFX_INTRO} master={0.8} />
      {glyphs.map((g, i) => {
        const y = 1150 - ((frame * (0.7 + (i % 4) * 0.3) + i * 210) % 1350);
        return (
          <div
            key={g}
            style={{
              position: 'absolute',
              left: (i * 263) % 1800,
              top: y,
              fontFamily: mono,
              fontSize: 30 + (i % 3) * 12,
              color: i % 2 ? C.cyan : C.lilac,
              opacity: 0.16,
            }}
          >
            {g}
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 110, top: 190}}>
        {words.map((w) => (
          <div key={w} style={{display: 'flex', height: 200}}>
            {w.split('').map((ch, ci) => {
              const e = sp(frame, fps, 6 + idx++ * 2, 14, 100);
              return (
                <div
                  key={ci}
                  style={{
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: 200,
                    letterSpacing: -6,
                    lineHeight: 1,
                    color: C.text,
                    opacity: e,
                    transform: `translateY(${(1 - e) * 130}px) rotate(${(1 - e) * 9}deg)`,
                    filter: `blur(${(1 - e) * 14}px)`,
                  }}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{height: 14, width: 760 * bar, background: C.amber, borderRadius: 7, margin: '22px 0'}} />
        <div
          style={{
            fontFamily: display,
            fontWeight: 500,
            fontSize: 42,
            color: C.dim,
            opacity: interpolate(frame, [56, 80], [0, 1], clamp),
          }}
        >
          Belajar mengendalikan komputer lewat perintah teks
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'inline-block',
            background: C.term,
            border: `1.5px solid ${C.amber}66`,
            borderRadius: 20,
            padding: '16px 30px',
            fontFamily: mono,
            fontSize: 38,
            opacity: interpolate(frame, [88, 100], [0, 1], clamp),
          }}
        >
          <span style={{color: C.amber}}>$ </span>
          <span style={{color: C.cyan, fontWeight: 700}}>{typed}</span>
          {frame >= 95 + 6 / 0.3 && frame >= 130 && (
            <div style={{color: C.green, opacity: interpolate(frame, [130, 138], [0, 1], clamp)}}>siswa</div>
          )}
          {frame < 130 && (
            <span
              style={{
                display: 'inline-block',
                width: 20,
                height: 38,
                background: Math.floor(frame / 15) % 2 ? 'transparent' : C.amber,
                verticalAlign: 'text-bottom',
                marginLeft: 4,
              }}
            />
          )}
        </div>
      </div>

      <div style={{position: 'absolute', left: 1330, top: 330, width: 400, height: 400}}>
        {[0, 30].map((off) => {
          const t = ((frame + off) % 60) / 60;
          return (
            <div
              key={off}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 100,
                border: `3px solid ${C.amber}`,
                opacity: (1 - t) * 0.5,
                transform: `scale(${1 + t * 0.7})`,
              }}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 100,
            background: `linear-gradient(145deg, ${C.panel2}, ${C.term})`,
            border: `2px solid ${C.amber}88`,
            boxShadow: `0 40px 90px #000a, 0 0 80px ${C.amber}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 190,
            color: C.amber,
            transform: `translateY(${Math.sin(frame / 28) * 12}px) rotate(${-8 + logo * 8}deg) scale(${0.4 + logo * 0.6})`,
            opacity: logo,
          }}
        >
          <span>&gt;</span>
          <span style={{opacity: Math.floor(frame / 15) % 2 ? 0 : 1}}>_</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ OBJECTIVES */
const OBJ = [
  {t: 'Memahami fungsi terminal', h: 'bash'},
  {t: 'Berpindah dan melihat isi direktori', h: 'cd  ls'},
  {t: 'Mengelola file dan folder', h: 'mkdir  cp  rm'},
  {t: 'Membaca informasi sistem dan jaringan', h: 'df -h  ping'},
  {t: 'Memasang aplikasi dengan manajemen paket', h: 'apt  pkg'},
  {t: 'Mengatur izin file dan berlatih langsung', h: 'chmod +x'},
];

export const ObjectivesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const colors = [C.amber, C.cyan, C.pink, C.lilac, C.green, C.amber];
  return (
    <AbsoluteFill>
      <Sfx list={SFX_OBJ} master={0.8} />
      <Heading title="Tujuan Pembelajaran" subtitle="Setelah video ini, kamu bisa:" />
      {OBJ.map((o, i) => {
        const d = 50 + i * 105;
        const e = sp(frame, fps, d, 18, 110);
        const age = frame - d;
        const hi = interpolate(age, [0, 50], [1, 0], clamp);
        const tick = sp(frame, fps, d + 34, 12, 140);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 100 + col * 880,
              top: 290 + row * 230,
              width: 840,
              height: 196,
              borderRadius: 30,
              background: C.panel,
              border: `2px solid ${colors[i]}${Math.round(40 + hi * 180).toString(16).padStart(2, '0')}`,
              boxShadow: `0 0 ${hi * 60}px ${colors[i]}44`,
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '0 34px',
              opacity: e,
              clipPath: `inset(0 ${(1 - e) * 100}% 0 0 round 30px)`,
              transform: `translateX(${(1 - e) * -40}px)`,
            }}
          >
            <Check p={tick} color={colors[i]} />
            <div>
              <div style={{fontFamily: display, fontWeight: 700, fontSize: 36, lineHeight: 1.2, color: C.text}}>{o.t}</div>
              <div style={{fontFamily: mono, fontSize: 26, color: colors[i], marginTop: 10}}>{o.h}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ PENGENALAN */
export const PengenalanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sentence = 'Terminal adalah aplikasi untuk berinteraksi dengan sistem operasi lewat perintah teks.'.split(' ');
  const cards = [
    {os: 'Windows', name: 'CMD dan PowerShell', prompt: 'C:\\>', color: C.cyan},
    {os: 'Linux', name: 'Bash', prompt: '$', color: C.amber},
    {os: 'Android', name: 'Termux', prompt: '~ $', color: C.pink},
  ];
  const uses = ['Kelola file', 'Jalankan program', 'Instal aplikasi', 'Kelola server'];
  return (
    <AbsoluteFill>
      <Sfx list={SFX_PENG} master={0.8} />
      <Heading title="Apa itu Terminal?" />
      <div style={{position: 'absolute', left: 100, top: 230, width: 1500, display: 'flex', flexWrap: 'wrap', gap: '0 14px'}}>
        {sentence.map((w, i) => {
          const e = sp(frame, fps, 30 + i * 5, 18, 120);
          return (
            <span
              key={i}
              style={{
                fontFamily: display,
                fontWeight: 500,
                fontSize: 46,
                lineHeight: 1.35,
                color: C.text,
                opacity: e,
                transform: `translateY(${(1 - e) * 20}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {cards.map((c, i) => {
        const e = sp(frame, fps, 150 + i * 40, 13, 90);
        return (
          <div
            key={c.os}
            style={{
              position: 'absolute',
              left: 100 + i * 590,
              top: 410,
              width: 540,
              height: 330,
              borderRadius: 32,
              background: C.panel,
              border: `2px solid ${c.color}66`,
              overflow: 'hidden',
              opacity: e,
              transform: `perspective(1200px) rotateY(${(1 - e) * -50}deg) translateY(${(1 - e) * 60}px)`,
            }}
          >
            <div style={{height: 10, background: c.color}} />
            <div style={{padding: '24px 36px'}}>
              <div style={{fontFamily: display, fontWeight: 500, fontSize: 28, color: C.dim}}>{c.os}</div>
              <div style={{fontFamily: mono, fontWeight: 700, fontSize: 96, color: c.color, margin: '18px 0'}}>{c.prompt}</div>
              <div style={{fontFamily: display, fontWeight: 700, fontSize: 40, color: C.text}}>{c.name}</div>
            </div>
          </div>
        );
      })}
      {uses.map((u, i) => {
        const e = sp(frame, fps, 290 + i * 34, 10, 160);
        return (
          <div
            key={u}
            style={{
              position: 'absolute',
              left: 100 + i * 440,
              top: 810,
              padding: '18px 34px',
              borderRadius: 60,
              background: '#ffffff0D',
              border: '1.5px solid #ffffff30',
              fontFamily: display,
              fontWeight: 700,
              fontSize: 34,
              color: C.text,
              opacity: e,
              transform: `scale(${0.6 + e * 0.4})`,
            }}
          >
            {u}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ NANO */
export const NanoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = 'Catatan belajar terminal';
  const typed = text.slice(0, Math.max(0, Math.floor((frame - 40) * 0.5)));
  const keys = [
    {k: 'O', t: 'Menyimpan file', at: 100, msg: '[ Tersimpan: 1 baris ditulis ]', c: C.green},
    {k: 'X', t: 'Keluar', at: 170, msg: '[ Keluar dari nano ]', c: C.pink},
    {k: 'W', t: 'Mencari teks', at: 240, msg: 'Cari: terminal', c: C.cyan},
  ];
  const active = [...keys].reverse().find((k) => frame >= k.at);
  return (
    <AbsoluteFill>
      <Sfx list={SFX_NANO} master={0.8} />
      <Heading title="Editor Teks: Nano" subtitle="nano catatan.txt" color={C.cyan} />
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 270,
          width: 1000,
          height: 620,
          borderRadius: 24,
          background: C.term,
          border: `1.5px solid ${C.cyan}66`,
          overflow: 'hidden',
          fontFamily: mono,
          fontSize: 28,
          opacity: sp(frame, fps, 6, 20, 100),
        }}
      >
        <div style={{background: C.text, color: C.bg, padding: '10px 24px', display: 'flex', justifyContent: 'space-between'}}>
          <span>GNU nano</span>
          <span>catatan.txt</span>
          <span> </span>
        </div>
        <div style={{padding: '24px 30px', color: C.text, height: 400}}>
          {typed}
          <span style={{display: 'inline-block', width: 16, height: 30, background: Math.floor(frame / 15) % 2 ? 'transparent' : C.cyan, verticalAlign: 'text-bottom'}} />
        </div>
        <div style={{height: 50, textAlign: 'center', color: active?.c ?? C.dim}}>{active?.msg ?? ''}</div>
        <div style={{display: 'flex', gap: 40, padding: '12px 30px', borderTop: '1px solid #ffffff18'}}>
          {keys.map((k) => {
            const on = active?.k === k.k;
            return (
              <div key={k.k} style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <span style={{background: on ? k.c : C.text, color: C.bg, padding: '2px 10px', borderRadius: 4, fontWeight: 700}}>^{k.k}</span>
                <span style={{color: on ? k.c : C.dim}}>{k.t.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{position: 'absolute', left: 1180, top: 270, width: 650}}>
        {keys.map((k, i) => {
          const press = interpolate(frame - k.at, [0, 4, 14], [0, 1, 0], clamp);
          const e = sp(frame, fps, 20 + i * 12, 16, 110);
          const cap = (label: string, wide?: boolean) => (
            <div
              style={{
                minWidth: wide ? 190 : 110,
                height: 110,
                padding: '0 22px',
                borderRadius: 22,
                background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
                border: `2px solid ${press > 0.1 ? k.c : '#ffffff30'}`,
                boxShadow: `0 ${10 - press * 8}px 0 #00000066, 0 0 ${press * 50}px ${k.c}88`,
                transform: `translateY(${press * 8}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 44,
                color: press > 0.1 ? k.c : C.text,
              }}
            >
              {label}
            </div>
          );
          return (
            <div key={k.k} style={{marginBottom: 44, opacity: e, transform: `translateX(${(1 - e) * 60}px)`}}>
              <div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
                {cap('CTRL', true)}
                <div style={{fontFamily: mono, fontSize: 40, color: C.dim}}>+</div>
                {cap(k.k)}
              </div>
              <div style={{fontFamily: display, fontWeight: 700, fontSize: 38, color: C.text, marginTop: 16}}>{k.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ PERMISSION */
export const PermissionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bits = [
    {k: 'r', n: 'Read', d: 'membaca', v: 4, c: C.cyan},
    {k: 'w', n: 'Write', d: 'menulis', v: 2, c: C.amber},
    {k: 'x', n: 'Execute', d: 'menjalankan', v: 1, c: C.pink},
  ];
  const groups = [
    {n: 'Pemilik', num: 7},
    {n: 'Grup', num: 5},
    {n: 'Lainnya', num: 5},
  ];
  const cmd1 = 'chmod 755 script.sh'.slice(0, Math.max(0, Math.floor((frame - 60) * 0.5)));
  const cmd2 = 'chmod +x script.sh'.slice(0, Math.max(0, Math.floor((frame - 310) * 0.5)));
  const pulse = frame > 360 ? 0.5 + 0.5 * Math.sin((frame - 360) / 5) : 0;
  return (
    <AbsoluteFill>
      <Sfx list={SFX_PERM} master={0.8} />
      <Heading title="Dasar Permission" subtitle="Siapa boleh membaca, mengubah, dan menjalankan file" color={C.pink} />
      <div style={{position: 'absolute', left: 1050, top: 90, display: 'flex', gap: 22}}>
        {bits.map((b, i) => {
          const e = sp(frame, fps, 14 + i * 8, 14, 120);
          return (
            <div key={b.k} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: e, transform: `scale(${0.7 + e * 0.3})`}}>
              <div style={{width: 54, height: 54, borderRadius: 14, background: b.c, color: C.bg, fontFamily: mono, fontWeight: 700, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {b.k}
              </div>
              <div style={{fontFamily: display, fontWeight: 700, fontSize: 24, color: C.text, lineHeight: 1.1}}>
                {b.n}
                <div style={{fontWeight: 500, color: C.dim}}>{b.d}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 290,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 56,
          background: C.term,
          border: `1.5px solid ${C.pink}66`,
          borderRadius: 22,
          padding: '14px 34px',
          opacity: interpolate(frame, [54, 62], [0, 1], clamp),
          minWidth: 700,
        }}
      >
        <span style={{color: C.pink}}>$ </span>
        <span style={{color: C.text}}>{cmd1}</span>
      </div>

      {groups.map((g, gi) => {
        const e = sp(frame, fps, 130 + gi * 50, 14, 110);
        const sumDone = frame > 130 + gi * 50 + 24;
        const lit = bits.map((b) => (g.num & b.v) !== 0);
        const eq = bits.filter((b) => g.num & b.v).map((b) => b.v).join(' + ');
        return (
          <div key={g.n} style={{position: 'absolute', left: 100 + gi * 590, top: 440, width: 540, opacity: e, transform: `translateY(${(1 - e) * 40}px)`}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
              <div style={{fontFamily: display, fontWeight: 800, fontSize: 130, color: C.text, lineHeight: 1}}>{g.num}</div>
              <div style={{fontFamily: display, fontWeight: 700, fontSize: 36, color: C.dim}}>{g.n}</div>
            </div>
            <div style={{display: 'flex', gap: 18, marginTop: 20}}>
              {bits.map((b, bi) => {
                const on = lit[bi] && frame > 130 + gi * 50 + bi * 8;
                const isX = b.k === 'x';
                const extra = isX && frame > 360 ? pulse : 0;
                return (
                  <div
                    key={b.k}
                    style={{
                      width: 150,
                      height: 130,
                      borderRadius: 26,
                      background: on ? b.c : '#ffffff0D',
                      border: `2px solid ${on ? b.c : '#ffffff22'}`,
                      boxShadow: on ? `0 0 ${30 + extra * 50}px ${b.c}77` : 'none',
                      color: on ? C.bg : '#ffffff40',
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 70,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `scale(${on ? 1 + extra * 0.06 : 0.94})`,
                    }}
                  >
                    {b.k}
                  </div>
                );
              })}
            </div>
            <div style={{fontFamily: mono, fontSize: 32, color: C.dim, marginTop: 16, opacity: sumDone ? 1 : 0}}>
              {eq} = {g.num}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 868,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 40,
          background: C.term,
          border: `1.5px solid ${C.pink}66`,
          borderRadius: 18,
          padding: '8px 26px',
          opacity: interpolate(frame, [304, 312], [0, 1], clamp),
        }}
      >
        <span style={{color: C.pink}}>$ </span>
        <span>{cmd2}</span>
        <span style={{fontFamily: display, fontWeight: 500, fontSize: 30, color: C.dim, marginLeft: 26, opacity: frame > 350 ? 1 : 0}}>
          memberi izin eksekusi
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- INTERLUDE */
export const InterludeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const R = 150;
  const L = 2 * Math.PI * R;
  const p = interpolate(frame, [14, 150], [0, 1], {...clamp, easing: ease});
  const n = frame < 56 ? '3' : frame < 94 ? '2' : frame < 132 ? '1' : 'Mulai';
  const start = frame < 56 ? 14 : frame < 94 ? 56 : frame < 132 ? 94 : 132;
  const e = sp(frame, fps, start, 10, 160);
  const t = sp(frame, fps, 0, 16, 90);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <Sfx list={SFX_INTER} master={0.8} />
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 130,
          letterSpacing: -3,
          color: C.text,
          position: 'absolute',
          top: 150,
          opacity: t,
          transform: `translateY(${(1 - t) * 60}px)`,
        }}
      >
        Saatnya Praktikum
      </div>
      <svg width={400} height={400} viewBox="0 0 400 400" style={{position: 'absolute', top: 400}}>
        <circle cx={200} cy={200} r={R} fill="none" stroke="#ffffff1A" strokeWidth={14} />
        <circle
          cx={200}
          cy={200}
          r={R}
          fill="none"
          stroke={C.amber}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          transform="rotate(-90 200 200)"
        />
        <text
          x={200}
          y={n === 'Mulai' ? 222 : 240}
          textAnchor="middle"
          fontFamily={display}
          fontWeight={800}
          fontSize={n === 'Mulai' ? 64 : 150}
          fill={n === 'Mulai' ? C.green : C.text}
          style={{transformOrigin: '200px 200px', transform: `scale(${0.6 + e * 0.4})`, opacity: e}}
        >
          {n}
        </text>
      </svg>
      <div style={{position: 'absolute', top: 860, fontFamily: display, fontWeight: 500, fontSize: 38, color: C.dim, opacity: interpolate(frame, [40, 60], [0, 1], clamp)}}>
        Siapkan terminalmu dan ikuti perintahnya secara berurutan
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ KESIMPULAN */
export const KesimpulanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cx = 1370;
  const cy = 520;
  const rad = 320;
  const nodes = ['Linux', 'Administrasi server', 'Pemrograman', 'Jaringan komputer', 'Cybersecurity'];
  const hub = sp(frame, fps, 6, 12, 90);
  const fin = sp(frame, fps, 440, 14, 100);
  return (
    <AbsoluteFill>
      <Sfx list={SFX_KES} master={0.8} />
      <div style={{position: 'absolute', left: 100, top: 230, width: 800}}>
        {['Kuasai perintah dasar,', 'buka jalan ke banyak bidang.'].map((l, i) => {
          const e = sp(frame, fps, 10 + i * 14, 18, 110);
          return (
            <div key={l} style={{overflow: 'hidden'}}>
              <div style={{fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 1.12, letterSpacing: -2, color: C.text, transform: `translateY(${(1 - e) * 110}%)`}}>
                {l}
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 60,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 74,
            color: C.amber,
            opacity: fin,
            transform: `translateY(${(1 - fin) * 30}px)`,
          }}
        >
          $ selamat belajar
          <span style={{display: 'inline-block', width: 34, height: 70, background: Math.floor(frame / 15) % 2 ? 'transparent' : C.amber, marginLeft: 8, verticalAlign: 'text-bottom'}} />
        </div>
      </div>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {nodes.map((_, i) => {
          const a = (-90 + i * 72) * (Math.PI / 180);
          const x = cx + rad * Math.cos(a);
          const y = cy + rad * Math.sin(a);
          const d = interpolate(frame, [90 + i * 40, 120 + i * 40], [0, 1], {...clamp, easing: ease});
          return (
            <line key={i} x1={cx} y1={cy} x2={cx + (x - cx) * d} y2={cy + (y - cy) * d} stroke={C.amber} strokeOpacity={0.55} strokeWidth={3} strokeDasharray="10 10" />
          );
        })}
      </svg>

      {nodes.map((n, i) => {
        const a = (-90 + i * 72) * (Math.PI / 180);
        const x = cx + rad * Math.cos(a);
        const y = cy + rad * Math.sin(a);
        const e = sp(frame, fps, 115 + i * 40, 11, 130);
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${e})`,
              opacity: e,
              padding: '18px 32px',
              borderRadius: 50,
              background: C.panel,
              border: `2px solid ${[C.cyan, C.lilac, C.green, C.pink, C.amber][i]}`,
              fontFamily: display,
              fontWeight: 700,
              fontSize: 34,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            {n}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: cx - 100,
          top: cy - 100,
          width: 200,
          height: 200,
          borderRadius: 54,
          background: `linear-gradient(145deg, ${C.panel2}, ${C.term})`,
          border: `2px solid ${C.amber}`,
          boxShadow: `0 0 ${50 + Math.sin(frame / 12) * 25}px ${C.amber}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 100,
          color: C.amber,
          transform: `scale(${hub})`,
        }}
      >
        &gt;_
      </div>
    </AbsoluteFill>
  );
};
