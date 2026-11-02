import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './theme';
import {display, mono} from './fonts';
import {clamp, ease, sp} from './anim';
import {Background} from './components/Background';
import {Scene} from './components/Scene';
import {Line, Terminal} from './components/Terminal';

/* ====================== TIMELINE (frame @30fps, total 450 = 15 detik) ====================== */
const B = {b1: [0, 60], b2: [60, 60], b3: [120, 180], b4: [300, 90], b5: [390, 60]} as const;
const HITS = [0, 120, 300, 400];

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const PAL = [C.amber, C.cyan, C.pink, C.green, C.lilac];

/* ---------- B3: data simulasi (waktu lokal terhadap awal B3) ---------- */
const STEPS = [
  {cmd: 'mkdir belajar', out: [] as string[], note: 'Buat folder', after: undefined as string | undefined},
  {cmd: 'cd belajar', out: [], note: 'Masuk ke folder', after: '~/belajar'},
  {cmd: 'touch catatan.txt', out: [], note: 'Buat file', after: undefined},
  {cmd: 'echo "Halo Terminal" > catatan.txt', out: [], note: 'Tulis isi file', after: undefined},
  {cmd: 'cat catatan.txt', out: ['Halo Terminal'], note: 'Baca isi file', after: undefined},
  {cmd: 'ls', out: ['catatan.txt'], note: 'Lihat isi folder', after: undefined},
];
const S3 = STEPS.map((s, i) => {
  const slot = 6 + i * 28;
  const at = slot + 2;
  const cps = Math.max(0.9, s.cmd.length / 15);
  const done = at + Math.ceil(s.cmd.length / cps);
  return {...s, slot, at, cps, done, out_at: done + 3};
});
const LINES: Line[] = [];
S3.forEach((s) => {
  LINES.push({kind: 'cmd', text: s.cmd, at: s.at, cps: s.cps, after: s.after});
  s.out.forEach((o, j) => LINES.push({kind: 'out', text: o, at: s.out_at + j * 3}));
});

/* ---------- SFX plan (frame global) ---------- */
type Sfx = {at: number; f: string; v?: number; d?: number};
const SFX: Sfx[] = [];
const push = (at: number, f: string, v = 1, d = 40) => SFX.push({at, f, v, d});
// B1
push(0, 'hit', 1, 40);
push(2, 'whoosh', 0.7, 24);
'Dasar Terminal'.replace(' ', '').split('').forEach((_, i) => push(12 + i * 2, `click${(i % 3) + 1}`, 0.5, 6));
push(36, 'pop', 0.5, 12);
// B2
push(56, 'whoosh', 0.6, 24);
[0, 1, 2, 3].forEach((i) => {
  push(64 + i * 12, 'pop', 0.8, 12);
  push(64 + i * 12, 'hit', 0.28, 40);
});
// B3
push(100, 'riser', 0.7, 42);
push(118, 'whoosh', 0.7, 24);
S3.forEach((s) => {
  for (let k = 0; k < s.cmd.length; k += 2)
    push(120 + s.at + Math.ceil(k / s.cps), `click${(k % 3) + 1}`, 0.55, 6);
  push(120 + s.done, 'pop', 0.6, 12);
  if (s.out.length) push(120 + s.out_at, 'ding', 0.55, 30);
});
// B4
push(296, 'whoosh', 0.7, 24);
[0, 1, 2].forEach((i) => {
  push(304 + i * 20, 'whoosh', 0.45, 24);
  push(310 + i * 20, 'pop', 0.8, 12);
});
push(366, 'ding', 0.6, 30);
// B5
push(384, 'whoosh', 0.7, 24);
push(400, 'hit', 1, 40);
'$ mulai_belajar'.split('').forEach((_, i) => push(408 + i, `click${(i % 3) + 1}`, 0.5, 6));
push(428, 'ding', 0.7, 30);

/* ====================== KOMPONEN KECIL ====================== */
const Burst: React.FC<{cx: number; cy: number; at: number; count?: number}> = ({cx, cy, at, count = 40}) => {
  const f = useCurrentFrame();
  const age = f - at;
  if (age < 0 || age > 55) return null;
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const a = rnd(i + 1) * Math.PI * 2;
        const speed = 500 + rnd(i + 50) * 900;
        const t = age / 30;
        const d = (speed * (1 - Math.exp(-4 * t))) / 2.5;
        const size = 6 + rnd(i + 99) * 12;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx + Math.cos(a) * d - size / 2,
              top: cy + Math.sin(a) * d + t * t * 60 - size / 2,
              width: size,
              height: rnd(i + 7) > 0.5 ? size : size * 2.4,
              borderRadius: rnd(i + 3) > 0.5 ? size : 2,
              background: PAL[i % PAL.length],
              opacity: 1 - age / 55,
              transform: `rotate(${a + age * 0.2}rad)`,
              boxShadow: `0 0 14px ${PAL[i % PAL.length]}`,
            }}
          />
        );
      })}
    </>
  );
};

const Ring: React.FC<{cx: number; cy: number; at: number; color?: string}> = ({cx, cy, at, color = C.amber}) => {
  const age = useCurrentFrame() - at;
  if (age < 0 || age > 30) return null;
  const p = interpolate(age, [0, 30], [0, 1], {...clamp, easing: ease});
  const s = 120 + p * 1500;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - s / 2,
        top: cy - s / 2,
        width: s,
        height: s,
        borderRadius: '50%',
        border: `${10 * (1 - p) + 1}px solid ${color}`,
        opacity: 1 - p,
      }}
    />
  );
};

const Glitch: React.FC<{text: string; size: number; f: number; until?: number; color?: string}> = ({
  text,
  size,
  f,
  until = 22,
  color = C.text,
}) => {
  const g = f < until ? 1 - f / until : 0;
  const j = Math.sin(f * 12.9) * 14 * g;
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -4,
        lineHeight: 1,
        color,
        whiteSpace: 'nowrap',
        textShadow: g > 0 ? `${j + 6}px 0 ${C.pink}, ${-j - 6}px 0 ${C.cyan}` : `0 0 40px ${C.amber}22`,
        transform: g > 0 ? `skewX(${Math.sin(f * 7.3) * 14 * g}deg)` : undefined,
      }}
    >
      {text}
    </div>
  );
};

/* ====================== B1: PEMBUKA ====================== */
const B1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = sp(f, fps, 0, 9, 170);
  const scale = 3.2 - 2.2 * logo;
  const title = 'Dasar Terminal'.split('');
  const tag = interpolate(f, [34, 48], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Ring cx={960} cy={400} at={0} />
      <Ring cx={960} cy={400} at={5} color={C.cyan} />
      <Burst cx={960} cy={400} at={0} count={46} />
      <div
        style={{
          position: 'absolute',
          left: 960 - 160,
          top: 400 - 160,
          width: 320,
          height: 320,
          borderRadius: 84,
          background: `linear-gradient(145deg, ${C.panel2}, ${C.term})`,
          border: `3px solid ${C.amber}`,
          boxShadow: `0 0 ${60 + logo * 60}px ${C.amber}66, 0 40px 80px #000a`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 170,
          color: C.amber,
          transform: `scale(${scale}) rotate(${(1 - logo) * -25}deg)`,
          opacity: Math.min(1, f / 2 + 0.2),
        }}
      >
        &gt;<span style={{opacity: Math.floor(f / 8) % 2 ? 0 : 1}}>_</span>
      </div>
      <div style={{position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Glitch text={title.slice(0, Math.max(0, Math.floor((f - 10) / 2)) + 0).join('') || ' '} size={150} f={f} until={40} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 830,
          width: '100%',
          textAlign: 'center',
          fontFamily: display,
          fontWeight: 500,
          fontSize: 44,
          color: C.dim,
          opacity: tag,
          transform: `translateY(${(1 - tag) * 20}px)`,
        }}
      >
        Perintah teks, kendali penuh
      </div>
    </AbsoluteFill>
  );
};

/* ====================== B2: YANG DIPELAJARI ====================== */
const CHIPS = [
  {g: 'ls', t: 'Perintah dasar', c: C.amber},
  {g: 'mkdir', t: 'File dan folder', c: C.cyan},
  {g: 'ping', t: 'Jaringan', c: C.pink},
  {g: 'chmod', t: 'Permission', c: C.lilac},
];
const B2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = sp(f, fps, 0, 18, 120);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 110,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: display,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: -2,
          color: C.text,
          opacity: h,
          transform: `translateY(${(1 - h) * -50}px)`,
        }}
      >
        Yang kamu pelajari
      </div>
      {CHIPS.map((c, i) => {
        const at = 4 + i * 12;
        const e = sp(f, fps, at, 11, 200);
        const flash = interpolate(f - at, [0, 14], [1, 0], clamp);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={c.t}
            style={{
              position: 'absolute',
              left: 150 + col * 840,
              top: 320 + row * 300,
              width: 780,
              height: 240,
              borderRadius: 40,
              background: `linear-gradient(135deg, ${C.panel2}, ${C.panel})`,
              border: `3px solid ${c.c}`,
              boxShadow: `0 0 ${20 + flash * 90}px ${c.c}${Math.round(60 + flash * 120).toString(16).padStart(2, '0')}`,
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              padding: '0 48px',
              opacity: Math.min(1, e * 1.6),
              transform: `scale(${2.1 - 1.1 * e}) rotate(${(1 - e) * (i % 2 ? 10 : -10)}deg)`,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 54,
                color: C.bg,
                background: c.c,
                borderRadius: 22,
                padding: '18px 26px',
              }}
            >
              {c.g}
            </div>
            <div style={{fontFamily: display, fontWeight: 800, fontSize: 56, color: C.text, letterSpacing: -1}}>{c.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ====================== B3: SIMULASI ====================== */
const B3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(f, [0, 180], [1, 1.05], clamp);
  const active = Math.max(0, S3.reduce((a, s, i) => (s.slot <= f ? i : a), 0));
  const st = S3[active];
  const e = sp(f, fps, st.slot, 14, 160);
  const tree = [
    {name: 'belajar/', depth: 0, dir: true, at: S3[0].done},
    {name: 'catatan.txt', depth: 1, dir: false, at: S3[2].done},
  ];
  const content = S3[3].done;
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <div style={{position: 'absolute', left: 90, top: 70, fontFamily: display, fontWeight: 800, fontSize: 64, color: C.text, letterSpacing: -1}}>
        Praktik langsung
      </div>
      <div style={{position: 'absolute', left: 90, top: 190, opacity: sp(f, fps, 4, 20, 110), transform: `translateY(${(1 - sp(f, fps, 4, 20, 110)) * 50}px)`}}>
        <Terminal lines={LINES} width={1080} height={760} accent={C.amber} />
      </div>
      <div style={{position: 'absolute', left: 1230, top: 190, width: 600, display: 'flex', flexDirection: 'column', gap: 22}}>
        <div
          style={{
            background: C.panel,
            border: `2px solid ${C.amber}88`,
            borderRadius: 30,
            padding: '26px 32px',
            opacity: e,
            transform: `translateY(${(1 - e) * 30}px) scale(${0.94 + e * 0.06})`,
          }}
        >
          <div style={{fontFamily: mono, fontWeight: 700, fontSize: 26, color: C.dim}}>
            langkah {active + 1} dari {S3.length}
          </div>
          <div style={{fontFamily: display, fontWeight: 800, fontSize: 56, color: C.text, marginTop: 8, letterSpacing: -1}}>{st.note}</div>
          <div style={{display: 'flex', gap: 8, marginTop: 20}}>
            {S3.map((_, i) => (
              <div key={i} style={{height: 10, flex: 1, borderRadius: 5, background: i <= active ? C.amber : '#ffffff22'}} />
            ))}
          </div>
        </div>
        <div style={{background: C.panel, border: '2px solid #ffffff18', borderRadius: 30, padding: '22px 32px', minHeight: 250}}>
          <div style={{fontFamily: display, fontWeight: 700, fontSize: 24, color: C.dim, marginBottom: 12}}>Isi folder</div>
          {tree.map((t) => {
            const a = sp(f, fps, t.at, 12, 170);
            if (f < t.at) return null;
            const flash = interpolate(f - t.at, [0, 30], [1, 0], clamp);
            return (
              <div
                key={t.name}
                style={{
                  height: 52,
                  paddingLeft: t.depth * 36,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: mono,
                  fontSize: 30,
                  color: t.dir ? C.amber : C.cyan,
                  opacity: a,
                  transform: `translateX(${(1 - a) * -40}px)`,
                  background: `linear-gradient(90deg, ${C.amber}${Math.round(flash * 70).toString(16).padStart(2, '0')}, transparent)`,
                  borderRadius: 12,
                }}
              >
                <div style={{width: t.dir ? 30 : 22, height: 22, borderRadius: t.dir ? '4px 9px 4px 4px' : 3, background: t.dir ? C.amber : C.cyan}} />
                {t.name}
              </div>
            );
          })}
          {f >= content && (
            <div
              style={{
                marginTop: 12,
                marginLeft: 36,
                padding: '10px 20px',
                borderRadius: 14,
                background: '#00000055',
                fontFamily: mono,
                fontSize: 26,
                color: C.green,
                opacity: sp(f, fps, content, 14, 150),
              }}
            >
              "Halo Terminal"
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ====================== B4: MONTASE ====================== */
const B4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const head = sp(f, fps, 0, 18, 120);
  const card = (i: number, title: string, color: string, cmd: string, body: React.ReactNode) => {
    const at = 6 + i * 20;
    const e = sp(f, fps, at, 12, 130);
    return (
      <div
        key={title}
        style={{
          position: 'absolute',
          left: 110 + i * 590,
          top: 270,
          width: 550,
          height: 620,
          borderRadius: 40,
          background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 60px ${color}44, 0 40px 80px #0008`,
          padding: 36,
          opacity: e,
          transform: `translateY(${(1 - e) * 220}px) rotate(${(1 - e) * (i - 1) * 14}deg)`,
        }}
      >
        <div style={{fontFamily: display, fontWeight: 800, fontSize: 56, color, letterSpacing: -1}}>{title}</div>
        <div style={{fontFamily: mono, fontWeight: 700, fontSize: 30, color: C.text, background: '#00000055', borderRadius: 16, padding: '14px 20px', margin: '22px 0 34px'}}>
          <span style={{color}}>$ </span>
          {cmd}
        </div>
        {body}
      </div>
    );
  };
  // ping: batang latensi
  const ping = (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 14, height: 260}}>
      {Array.from({length: 8}).map((_, i) => {
        const a = interpolate(f, [14 + i * 3, 24 + i * 3], [0, 1], {...clamp, easing: ease});
        return <div key={i} style={{flex: 1, height: (90 + rnd(i + 4) * 150) * a, borderRadius: 10, background: C.pink}} />;
      })}
    </div>
  );
  // apt: progress
  const pr = interpolate(f, [34, 66], [0, 100], {...clamp, easing: ease});
  const apt = (
    <div>
      <div style={{height: 36, borderRadius: 18, background: '#ffffff18', overflow: 'hidden'}}>
        <div style={{width: `${pr}%`, height: '100%', background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`}} />
      </div>
      <div style={{fontFamily: mono, fontWeight: 700, fontSize: 64, color: C.green, marginTop: 30}}>{Math.round(pr)}%</div>
      <div style={{fontFamily: display, fontWeight: 700, fontSize: 40, color: pr >= 100 ? C.green : C.dim, marginTop: 8}}>
        {pr >= 100 ? 'nano terpasang' : 'memasang...'}
      </div>
    </div>
  );
  // chmod: rwx
  const rows = [[1, 1, 1], [1, 0, 1], [1, 0, 1]];
  const perm = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
      {rows.map((r, ri) => (
        <div key={ri} style={{display: 'flex', gap: 14}}>
          {['r', 'w', 'x'].map((k, ki) => {
            const on = r[ki] && f > 66 + ri * 6 + ki * 3;
            const col = [C.cyan, C.amber, C.pink][ki];
            return (
              <div
                key={k}
                style={{
                  flex: 1,
                  height: 74,
                  borderRadius: 18,
                  background: on ? col : '#ffffff0D',
                  color: on ? C.bg : '#ffffff40',
                  border: `2px solid ${on ? col : '#ffffff22'}`,
                  boxShadow: on ? `0 0 26px ${col}88` : 'none',
                  fontFamily: mono,
                  fontWeight: 700,
                  fontSize: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 90, width: '100%', textAlign: 'center', fontFamily: display, fontWeight: 800, fontSize: 84, color: C.text, letterSpacing: -2, opacity: head, transform: `translateY(${(1 - head) * -40}px)`}}>
        Dan masih banyak lagi
      </div>
      {card(0, 'Jaringan', C.pink, 'ping google.com', ping)}
      {card(1, 'Paket', C.green, 'apt install nano', apt)}
      {card(2, 'Permission', C.lilac, 'chmod 755 file', perm)}
    </AbsoluteFill>
  );
};

/* ====================== B5: PENUTUP ====================== */
const B5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = ['Siap jadi', 'jagoan terminal?'];
  const cmd = '$ mulai_belajar'.slice(0, Math.max(0, f - 18));
  const done = f > 18 + '$ mulai_belajar'.length;
  const pulse = done ? 0.5 + 0.5 * Math.sin((f - 33) / 3) : 0;
  return (
    <AbsoluteFill>
      <Ring cx={960} cy={540} at={10} color={C.pink} />
      <Burst cx={960} cy={500} at={10} count={54} />
      <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center'}}>
        {lines.map((l, i) => {
          const e = sp(f, fps, 6 + i * 6, 11, 160);
          return (
            <div key={l} style={{overflow: 'hidden'}}>
              <div style={{fontFamily: display, fontWeight: 800, fontSize: 150, letterSpacing: -5, lineHeight: 1.05, color: i ? C.amber : C.text, transform: `translateY(${(1 - e) * 120}%)`}}>
                {l}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 700,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 70,
            color: C.text,
            background: C.term,
            border: `3px solid ${C.amber}`,
            borderRadius: 30,
            padding: '20px 56px',
            minWidth: 760,
            boxShadow: `0 0 ${40 + pulse * 70}px ${C.amber}66`,
            opacity: interpolate(f, [14, 20], [0, 1], clamp),
            transform: `scale(${1 + pulse * 0.025})`,
          }}
        >
          <span style={{color: C.amber}}>{cmd.slice(0, 2)}</span>
          {cmd.slice(2)}
          <span style={{display: 'inline-block', width: 34, height: 66, marginLeft: 6, background: Math.floor(f / 8) % 2 && done ? 'transparent' : C.amber, verticalAlign: 'text-bottom'}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ====================== ROOT ====================== */
const Shake: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  let a = 0;
  HITS.forEach((h) => {
    if (f >= h) a += Math.exp(-(f - h) / 4) * 16;
  });
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(f * 9) * a}px, ${Math.cos(f * 11) * a}px)`}}>{children}</AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  let o = 0;
  HITS.forEach((h) => {
    if (f >= h) o = Math.max(o, Math.exp(-(f - h) / 3) * 0.28);
  });
  return <AbsoluteFill style={{background: '#fff', opacity: o, pointerEvents: 'none'}} />;
};

const SCENES: Record<string, React.ReactNode> = {b1: <B1 />, b2: <B2 />, b3: <B3 />, b4: <B4 />, b5: <B5 />};

export const Short: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Shake>
      {(Object.keys(B) as (keyof typeof B)[]).map((k, i, arr) => (
        <Sequence key={k} from={B[k][0]} durationInFrames={B[k][1]} name={k}>
          <Scene first={i === 0} last={i === arr.length - 1}>
            {SCENES[k]}
          </Scene>
        </Sequence>
      ))}
    </Shake>
    <Flash />
    <Audio src={staticFile('sfx/music.wav')} volume={0.32} />
    {SFX.map((s, i) => (
      <Sequence key={i} from={s.at} durationInFrames={s.d ?? 40}>
        <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={s.v ?? 1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
