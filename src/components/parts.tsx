import React from 'react';
import {C, PAL} from '../theme';
import {display, mono} from '../fonts';
import {clamp01, pr, rnd} from '../anim';

/** Balok 3D sungguhan (6 sisi) */
export const Box: React.FC<{
  w: number;
  h: number;
  d: number;
  color: string;
  front?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({w, h, d, color, front, style}) => {
  const base: React.CSSProperties = {
    position: 'absolute',
    background: color,
    border: '1px solid rgba(255,255,255,0.16)',
    boxSizing: 'border-box',
  };
  return (
    <div style={{position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', ...style}}>
      <div style={{...base, width: w, height: h, transform: `translateZ(${d / 2}px)`, filter: 'brightness(1.05)'}}>{front}</div>
      <div style={{...base, width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, filter: 'brightness(0.55)'}} />
      <div style={{...base, width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`, filter: 'brightness(0.8)'}} />
      <div style={{...base, width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, filter: 'brightness(0.65)'}} />
      <div style={{...base, width: w, height: d, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)`, filter: 'brightness(1.3)'}} />
      <div style={{...base, width: w, height: d, top: (h - d) / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, filter: 'brightness(0.45)'}} />
    </div>
  );
};

/** Rak server 3D. stress 0..1 mengubah LED hijau -> kuning -> merah */
export const Server: React.FC<{t: number; stress: number; units?: number; scale?: number}> = ({
  t,
  stress,
  units = 3,
  scale = 1,
}) => {
  const col = stress > 0.66 ? C.red : stress > 0.33 ? C.amber : C.green;
  const shake = stress > 0.5 ? Math.sin(t * 60) * 4 * stress : 0;
  return (
    <div style={{position: 'relative', width: 240, height: units * 74, transformStyle: 'preserve-3d', transform: `translateX(${shake}px) scale(${scale})`}}>
      {Array.from({length: units}).map((_, u) => (
        <div key={u} style={{position: 'absolute', left: 0, top: u * 74}}>
          <Box
            w={240}
            h={66}
            d={170}
            color="#1B2A5E"
            front={
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', height: '100%'}}>
                <div style={{display: 'flex', gap: 9}}>
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 6,
                        background: col,
                        boxShadow: `0 0 14px ${col}`,
                        opacity: 0.45 + 0.55 * Math.abs(Math.sin(t * (3 + stress * 12) + k * 1.3 + u * 2)),
                      }}
                    />
                  ))}
                </div>
                <div style={{width: 96, height: 8, borderRadius: 4, background: '#00000077'}} />
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
};

/** Perisai 3D tebal (SVG berlapis) */
export const Shield3D: React.FC<{size: number; color: string; rot: number; layers?: number}> = ({size, color, rot, layers = 16}) => (
  <div style={{position: 'relative', width: size, height: size * 1.15, transformStyle: 'preserve-3d', transform: `rotateY(${rot}deg)`}}>
    {Array.from({length: layers}).map((_, i) => {
      const front = i === layers - 1;
      return (
        <svg
          key={i}
          viewBox="0 0 100 115"
          width={size}
          height={size * 1.15}
          style={{position: 'absolute', left: 0, top: 0, transform: `translateZ(${(i - layers / 2) * 4}px)`, filter: `brightness(${front ? 1.15 : 0.35 + (0.45 * i) / layers})`}}
        >
          <path d="M50 4 L92 20 V55 C92 85 72 104 50 111 C28 104 8 85 8 55 V20 Z" fill={color} stroke="#ffffff55" strokeWidth="2" />
          {front && <path d="M30 58 L45 73 L72 40" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      );
    })}
  </div>
);

/** Banjir paket: kotak-kotak bercahaya bergerak sumber -> target (ruang 3D, perspective dari induk) */
export const Flood: React.FC<{
  t: number;
  sources: [number, number, number][];
  target: [number, number, number];
  count: number;
  color: string;
  size?: number;
  speed?: number;
}> = ({t, sources, target, count, color, size = 14, speed = 0.9}) => (
  <>
    {Array.from({length: count}).map((_, i) => {
      const s = sources[i % sources.length];
      const p = (((t * speed + i * 0.6180339) % 1) + 1) % 1;
      const x = s[0] + (target[0] - s[0]) * p;
      const y = s[1] + (target[1] - s[1]) * p + Math.sin(i * 12.9) * 26 * (1 - p);
      const z = s[2] + (target[2] - s[2]) * p;
      const a = Math.min(1, p * 6) * Math.min(1, (1 - p) * 6);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: size,
            height: size,
            borderRadius: 3,
            background: color,
            boxShadow: `0 0 12px ${color}`,
            opacity: a,
            transform: `translate3d(${x}px, ${y}px, ${z}px) rotate(${i * 37 + t * 200}deg)`,
          }}
        />
      );
    })}
  </>
);

/** Ledakan partikel 2D */
export const Burst: React.FC<{t: number; at: number; cx: number; cy: number; count?: number}> = ({t, at, cx, cy, count = 40}) => {
  const age = t - at;
  if (age < 0 || age > 1.8) return null;
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const a = rnd(i + 1) * Math.PI * 2;
        const sp = 500 + rnd(i + 50) * 900;
        const d = (sp * (1 - Math.exp(-4 * age))) / 2.5;
        const s = 6 + rnd(i + 99) * 12;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx + Math.cos(a) * d - s / 2,
              top: cy + Math.sin(a) * d + age * age * 90 - s / 2,
              width: s,
              height: rnd(i + 7) > 0.5 ? s : s * 2.4,
              borderRadius: rnd(i + 3) > 0.5 ? s : 2,
              background: PAL[i % PAL.length],
              opacity: 1 - age / 1.8,
              boxShadow: `0 0 14px ${PAL[i % PAL.length]}`,
              transform: `rotate(${a + age * 5}rad)`,
            }}
          />
        );
      })}
    </>
  );
};

export const Chip: React.FC<{text: string; color: string; size?: number; style?: React.CSSProperties}> = ({text, color, size = 40, style}) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: display,
      fontWeight: 700,
      fontSize: size,
      color: C.text,
      padding: `${size * 0.25}px ${size * 0.6}px`,
      borderRadius: 999,
      background: `${color}22`,
      border: `2px solid ${color}`,
      boxShadow: `0 0 28px ${color}44`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </div>
);

export const Title: React.FC<{text: string; t: number; at: number; size?: number; color?: string; style?: React.CSSProperties}> = ({
  text,
  t,
  at,
  size = 110,
  color = C.text,
  style,
}) => {
  const e = pr(t, at, at + 0.6);
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: -3,
        lineHeight: 1.05,
        color,
        opacity: e,
        transform: `translateY(${(1 - e) * 60}px) rotateX(${(1 - e) * -40}deg)`,
        textShadow: `0 0 50px ${color}44, 0 6px 0 #00000055`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Ikon wifi, peringatan, silang, centang (SVG) */
export const Wifi: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round">
    <path d="M10 38 Q50 4 90 38" />
    <path d="M24 53 Q50 31 76 53" />
    <path d="M38 68 Q50 58 62 68" />
    <circle cx="50" cy="82" r="5" fill={color} stroke="none" />
  </svg>
);
export const Warn: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 8 L96 90 H4 Z" fill={C.red} stroke="#ffd1da" strokeWidth="4" strokeLinejoin="round" />
    <rect x="45" y="34" width="10" height="30" rx="5" fill="#fff" />
    <circle cx="50" cy="75" r="6" fill="#fff" />
  </svg>
);
export const XMark: React.FC<{size: number; color?: string}> = ({size, color = C.red}) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={color} /><path d="M12 12 L28 28 M28 12 L12 28" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></svg>
);
export const Tick: React.FC<{size: number; color?: string}> = ({size, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={color} /><path d="M11 21 L18 28 L30 13" fill="none" stroke="#06121a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const Meter: React.FC<{label: string; value: number; w?: number}> = ({label, value, w = 460}) => {
  const v = clamp01(value);
  const col = v > 0.8 ? C.red : v > 0.5 ? C.amber : C.green;
  return (
    <div style={{width: w}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: display, fontWeight: 700, fontSize: 34, color: C.text, marginBottom: 8}}>
        <span>{label}</span>
        <span style={{fontFamily: mono, color: col}}>{Math.round(v * 100)}%</span>
      </div>
      <div style={{height: 26, borderRadius: 13, background: '#ffffff18', overflow: 'hidden'}}>
        <div style={{width: `${v * 100}%`, height: '100%', background: col, boxShadow: `0 0 24px ${col}`}} />
      </div>
    </div>
  );
};
