import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {easeInOut, lerp, pr, prog, rnd, sp} from '../anim';
import {useT} from '../time';
import {Chip, Shield3D, Tick, XMark} from '../components/parts';

/* ============ 6. SOLUSI: carousel 3D 5 langkah (62.93 - 96.06 s) ============ */
const STARTS = [69.3, 74.9, 80.1, 86.9, 91.5];
const TITLES = [
  ['Layanan Proteksi', 'Cloudflare menyaring trafik berbahaya', C.cyan],
  ['Rate Limiting', 'Batasi request dari satu sumber', C.amber],
  ['Firewall / WAF', 'Filter permintaan mencurigakan', C.red],
  ['Load Balancer', 'Bagi beban ke beberapa server', C.green],
  ['Hubungi Hosting / ISP', 'Saat serangan sudah terlalu besar', C.violet],
] as const;

// indeks kartu aktif (kontinu) dengan perpindahan halus
const activeIdx = (t: number) => {
  let v = 0;
  for (let i = 1; i < 5; i++) v += easeInOut(prog(t, STARTS[i] - 0.45, STARTS[i] + 0.05));
  return v;
};

const Pkt: React.FC<{x: number; y: number; c: string; s?: number}> = ({x, y, c, s = 14}) => (
  <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={3} fill={c} opacity={0.95} />
);
const ServerIcon: React.FC<{x: number; y: number; c: string}> = ({x, y, c}) => (
  <g>
    {[0, 1, 2].map((k) => (
      <g key={k}>
        <rect x={x - 46} y={y - 62 + k * 42} width={92} height={34} rx={8} fill="#1B2A5E" stroke={c} strokeWidth={3} />
        <circle cx={x - 28} cy={y - 45 + k * 42} r={5} fill={c} />
      </g>
    ))}
  </g>
);

/* --- diagram 1: Cloudflare menyaring --- */
const D1: React.FC<{t: number; tl: number}> = ({t}) => (
  <svg viewBox="0 0 820 330" width="100%" height="100%">
    <text x={10} y={22} fill={C.dim} fontFamily={display} fontSize={22}>Internet</text>
    {Array.from({length: 16}).map((_, i) => {
      const bad = i % 3 !== 0;
      const lane = 50 + (i % 5) * 56;
      const x = bad ? (((t * 170 + i * 91) % 330) + 20) : (((t * 170 + i * 91) % 740) + 20);
      const a = bad ? Math.min(1, (330 - (x - 20)) / 40) : 1;
      return <g key={i} opacity={a}><Pkt x={x} y={lane} c={bad ? C.red : C.blue} /></g>;
    })}
    {/* awan + perisai */}
    <g>
      <circle cx={380} cy={150} r={62} fill="#1D2B66" stroke={C.cyan} strokeWidth={4} />
      <circle cx={330} cy={178} r={44} fill="#1D2B66" stroke={C.cyan} strokeWidth={4} />
      <circle cx={430} cy={178} r={44} fill="#1D2B66" stroke={C.cyan} strokeWidth={4} />
      <rect x={300} y={160} width={160} height={62} rx={30} fill="#1D2B66" />
      <path d="M380 112 L424 130 V162 C424 188 404 204 380 212 C356 204 336 188 336 162 V130 Z" fill={C.cyan} opacity={0.95} />
      <path d="M362 160 L376 174 L400 146" fill="none" stroke="#06121a" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <ServerIcon x={740} y={170} c={C.green} />
    <text x={300} y={300} fill={C.cyan} fontFamily={display} fontWeight={700} fontSize={26}>Trafik buruk diblokir</text>
  </svg>
);

/* --- diagram 2: rate limiting --- */
const D2: React.FC<{t: number; tl: number}> = ({t, tl}) => {
  const rows = ['IP 10.0.0.21', 'IP 10.0.0.35', 'IP 172.16.4.9', 'IP 45.77.12.3'];
  const limit = 560;
  return (
    <svg viewBox="0 0 820 330" width="100%" height="100%">
      <line x1={limit} y1={20} x2={limit} y2={310} stroke={C.amber} strokeWidth={4} strokeDasharray="10 8" />
      <text x={limit - 8} y={16} textAnchor="end" fill={C.amber} fontFamily={mono} fontWeight={700} fontSize={22}>batas 100 req/menit</text>
      {rows.map((r, i) => {
        const y = 52 + i * 70;
        const fast = i === 3;
        const raw = fast ? tl * 330 : 230 + Math.sin(t * 2 + i * 2) * 60 + i * 30;
        const w = Math.min(limit - 150, Math.max(10, raw));
        const hit = fast && raw >= limit - 150;
        const col = hit ? C.red : C.green;
        return (
          <g key={i}>
            <text x={0} y={y + 22} fill={C.text} fontFamily={mono} fontSize={20}>{r}</text>
            <rect x={150} y={y} width={limit - 150} height={34} rx={17} fill="#ffffff14" />
            <rect x={150} y={y} width={w} height={34} rx={17} fill={col} />
            {hit && (
              <g>
                <rect x={limit + 20} y={y - 2} width={230} height={38} rx={19} fill={`${C.red}33`} stroke={C.red} strokeWidth={3} />
                <text x={limit + 135} y={y + 26} textAnchor="middle" fill={C.red} fontFamily={mono} fontWeight={700} fontSize={22}>429 diblokir</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* --- diagram 3: firewall / WAF --- */
const REQ: [string, boolean][] = [
  ['GET /produk', true],
  ["GET /?id=1' OR 1=1", false],
  ['POST /login', true],
  ['GET /flood x9999', false],
  ['GET /keranjang', true],
];
const D3: React.FC<{t: number; tl: number}> = ({t, tl}) => (
  <svg viewBox="0 0 820 330" width="100%" height="100%">
    {REQ.map(([txt, ok], i) => {
      const p = Math.max(0, Math.min(1, (tl - i * 0.55) / 1.2));
      const x = lerp(10, ok ? 540 : 250, p);
      const y = 20 + i * 60;
      return (
        <g key={i} opacity={Math.min(1, p * 4)}>
          <rect x={x} y={y} width={250} height={42} rx={12} fill="#16204A" stroke={ok ? C.green : C.red} strokeWidth={3} />
          <text x={x + 14} y={y + 28} fill={C.text} fontFamily={mono} fontSize={18}>{txt}</text>
          {p > 0.9 && (ok ? <g transform={`translate(${x + 258},${y})`}><circle cx={21} cy={21} r={18} fill={C.green} /><path d="M11 21 L18 28 L30 13" fill="none" stroke="#06121a" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></g> : <g transform={`translate(${x - 46},${y})`}><circle cx={21} cy={21} r={18} fill={C.red} /><path d="M12 12 L30 30 M30 12 L12 30" stroke="#fff" strokeWidth={5} strokeLinecap="round" /></g>)}
        </g>
      );
    })}
    {/* tembok bata */}
    <g>
      {Array.from({length: 6}).map((_, r) =>
        Array.from({length: 2}).map((__, c) => (
          <rect key={`${r}-${c}`} x={470 + c * 50 - (r % 2) * 25} y={6 + r * 52} width={48} height={48} rx={6} fill="#5A1A33" stroke={C.red} strokeWidth={2} opacity={0.9} />
        )),
      )}
      <rect x={462} y={((t * 160) % 300) + 6} width={110} height={6} rx={3} fill={C.cyan} opacity={0.9} />
    </g>
    <ServerIcon x={760} y={170} c={C.green} />
  </svg>
);

/* --- diagram 4: load balancer --- */
const D4: React.FC<{t: number; tl: number}> = ({t, tl}) => {
  const bal = easeInOut(prog(tl, 0.8, 2.4));
  const loads = [lerp(1, 0.34, bal), lerp(0.04, 0.33, bal), lerp(0.04, 0.33, bal)];
  return (
    <svg viewBox="0 0 820 330" width="100%" height="100%">
      <text x={10} y={22} fill={C.dim} fontFamily={display} fontSize={22}>Trafik masuk</text>
      {[0, 1, 2, 3, 4].map((i) => <Pkt key={i} x={((t * 200 + i * 60) % 300) + 10} y={165 + Math.sin(i * 3) * 18} c={C.blue} />)}
      <circle cx={340} cy={165} r={58} fill="#1D2B66" stroke={C.green} strokeWidth={5} />
      <text x={340} y={176} textAnchor="middle" fill={C.green} fontFamily={mono} fontWeight={700} fontSize={34}>LB</text>
      {loads.map((l, i) => {
        const y = 40 + i * 110;
        const col = l > 0.8 ? C.red : C.green;
        return (
          <g key={i}>
            <line x1={398} y1={165} x2={560} y2={y + 36} stroke={C.green} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-t * 60} opacity={l > 0.1 ? 1 : 0.25} />
            <rect x={560} y={y} width={120} height={72} rx={12} fill="#1B2A5E" stroke={col} strokeWidth={4} />
            <rect x={694} y={y + 4} width={100} height={64} rx={10} fill="#ffffff14" />
            <rect x={694} y={y + 68 - 64 * l} width={100} height={64 * l} rx={10} fill={col} />
            <text x={620} y={y + 44} textAnchor="middle" fill={C.text} fontFamily={mono} fontSize={20}>Server {i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* --- diagram 5: hubungi hosting / ISP --- */
const D5: React.FC<{t: number; tl: number}> = ({t, tl}) => {
  const wave = (x0: number, x1: number, amp: number) =>
    Array.from({length: 60}).map((_, i) => {
      const x = lerp(x0, x1, i / 59);
      return `${i === 0 ? 'M' : 'L'}${x},${165 + Math.sin(i * 0.7 - t * 8) * amp * (0.6 + 0.4 * Math.sin(i * 1.7))}`;
    }).join(' ');
  const call = Math.max(0, 1 - ((t * 1.2) % 1));
  return (
    <svg viewBox="0 0 820 330" width="100%" height="100%">
      {/* telepon */}
      <rect x={20} y={90} width={90} height={150} rx={18} fill="#1B2A5E" stroke={C.violet} strokeWidth={4} />
      <circle cx={65} cy={215} r={9} fill={C.violet} />
      <circle cx={65} cy={165} r={30 + (1 - call) * 50} fill="none" stroke={C.violet} strokeWidth={3} opacity={call} />
      <text x={65} y={290} textAnchor="middle" fill={C.violet} fontFamily={display} fontWeight={700} fontSize={22}>Hubungi</text>
      {/* gedung ISP */}
      <rect x={330} y={70} width={150} height={190} rx={12} fill="#1D2B66" stroke={C.violet} strokeWidth={4} />
      {Array.from({length: 12}).map((_, i) => <rect key={i} x={346 + (i % 3) * 44} y={86 + Math.floor(i / 3) * 40} width={28} height={26} rx={4} fill={C.violet} opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />)}
      <text x={405} y={290} textAnchor="middle" fill={C.violet} fontFamily={display} fontWeight={700} fontSize={22}>ISP / Hosting</text>
      {/* gelombang trafik: besar sebelum ISP, kecil sesudahnya */}
      <path d={wave(120, 330, 70)} fill="none" stroke={C.red} strokeWidth={4} />
      <path d={wave(480, 700, tl > 1.2 ? 10 : 70)} fill="none" stroke={tl > 1.2 ? C.green : C.red} strokeWidth={4} />
      <ServerIcon x={760} y={170} c={C.green} />
    </svg>
  );
};

const DIAGRAMS = [D1, D2, D3, D4, D5];

export const S6: React.FC = () => {
  const t = useT();
  const introOut = 1 - pr(t, 68.2, 68.9);
  const introE = sp(t, 63.5, 12, 110);
  const carE = pr(t, 68.4, 69.4);
  const idx = activeIdx(t);
  const rot = (t - 63.5) * 40;
  return (
    <AbsoluteFill>
      {/* intro */}
      <div style={{position: 'absolute', inset: 0, opacity: introOut, display: introOut > 0.01 ? 'block' : 'none'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 118, color: C.text, letterSpacing: -3, opacity: introE, transform: `translateY(${(1 - introE) * 60}px)`, textShadow: `0 0 60px ${C.cyan}55`}}>
          Cara mengatasi DDoS
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', perspective: 1500, opacity: introE}}>
          <Shield3D size={300} color={C.cyan} rot={rot} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', opacity: pr(t, 66.6, 67.2), transform: `scale(${0.8 + sp(t, 66.6, 10, 150) * 0.2})`}}>
          <Chip text="5 langkah penting" color={C.cyan} size={52} />
        </div>
      </div>

      {/* carousel 3D */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 2200, opacity: carE}}>
        {TITLES.map(([ti, sub, col], i) => {
          const a = i - idx;
          if (Math.abs(a) > 2.4) return null;
          const Dg = DIAGRAMS[i];
          const tl = Math.max(0, t - STARTS[i]);
          const act = Math.max(0, 1 - Math.abs(a));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 960 - 470,
                top: 120,
                width: 940,
                height: 740,
                borderRadius: 40,
                background: `linear-gradient(155deg, ${C.panel2}, ${C.panel})`,
                border: `3px solid ${col}${act > 0.5 ? '' : '66'}`,
                boxShadow: `0 60px 120px #000a, 0 0 ${act * 90}px ${col}55`,
                padding: '34px 44px',
                transform: `translateX(${a * 820 + (1 - carE) * 0}px) translateZ(${-Math.abs(a) * 420}px) rotateY(${-a * 38}deg) translateY(${(1 - carE) * 160}px)`,
                opacity: Math.max(0, 1 - Math.abs(a) * 0.4),
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
                <div style={{width: 100, height: 100, borderRadius: 28, background: `linear-gradient(145deg, ${col}, ${C.panel2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display, fontWeight: 700, fontSize: 70, color: '#fff', boxShadow: `0 0 40px ${col}88`, transform: `rotateY(${Math.sin(t * 1.5 + i) * 20}deg)`}}>
                  {i + 1}
                </div>
                <div>
                  <div style={{fontFamily: display, fontWeight: 700, fontSize: 62, color: C.text, letterSpacing: -1}}>{ti}</div>
                  <div style={{fontFamily: display, fontWeight: 500, fontSize: 30, color: C.dim}}>{sub}</div>
                </div>
              </div>
              <div style={{marginTop: 26, height: 410, borderRadius: 26, background: '#070C20', border: '2px solid #ffffff14', padding: 22}}>
                <Dg t={t} tl={tl} />
              </div>
            </div>
          );
        })}
        {/* indikator langkah */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 890, display: 'flex', justifyContent: 'center', gap: 16}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{width: Math.abs(i - idx) < 0.5 ? 70 : 20, height: 20, borderRadius: 10, background: Math.abs(i - idx) < 0.5 ? TITLES[i][2] : '#ffffff2a'}} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
