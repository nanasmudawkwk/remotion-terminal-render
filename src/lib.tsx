import React, {createContext, useContext} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY_H, C, FONT, HEADER_H, MONO} from './theme';

/* ------------------------------------------------------------------ waktu */

const SceneCtx = createContext<{start: number; end: number}>({start: 0, end: 0});

export const SceneProvider: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
}> = ({start, end, children}) => (
  <SceneCtx.Provider value={{start, end}}>{children}</SceneCtx.Provider>
);

export const useScene = () => useContext(SceneCtx);

/** Waktu ABSOLUT (detik) terhadap voiceover, dipakai di dalam adegan. */
export const useT = () => {
  const {start} = useScene();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return start + frame / fps;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Progres 0..1 mulai detik `at` selama `dur` detik (easing halus). */
export const prog = (t: number, at: number, dur = 0.6) =>
  interpolate(t, [at, at + dur], [0, 1], {...clamp, easing: ease});

/** Progres linear 0..1 antara dua detik. */
export const lin = (t: number, from: number, to: number) =>
  interpolate(t, [from, to], [0, 1], clamp);

/* ------------------------------------------------------------- animasi UI */

export const Reveal: React.FC<{
  at: number;
  dur?: number;
  dy?: number;
  dx?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({at, dur = 0.6, dy = 22, dx = 0, style, children}) => {
  const t = useT();
  const p = prog(t, at, dur);
  return (
    <div
      style={{
        opacity: p,
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Muncul pada rentang [from, to] lalu hilang (untuk pergantian tampilan). */
export const Phase: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({from, to, children}) => {
  const t = useT();
  if (t < from - 0.02 || t > to + 0.02) return null;
  const o = interpolate(t, [from, from + 0.4, to - 0.35, to], [0, 1, 1, 0], clamp);
  const y = (1 - Math.min(o, 1)) * 14;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Typed: React.FC<{text: string; from: number; to: number}> = ({
  text,
  from,
  to,
}) => {
  const t = useT();
  const p = lin(t, from, to);
  const n = Math.floor(p * text.length);
  const active = t >= from && t < to + 1.0;
  const blink = Math.floor(t * 2.4) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      {active ? (
        <span
          style={{
            display: 'inline-block',
            width: 3,
            height: '1.05em',
            marginLeft: 3,
            verticalAlign: 'text-bottom',
            background: 'currentColor',
            opacity: blink ? 1 : 0,
          }}
        />
      ) : null}
    </span>
  );
};

/** Transisi masuk/keluar adegan (fade + geser halus). */
export const SceneFade: React.FC<{
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({children, fadeIn = true, fadeOut = true}) => {
  const t = useT();
  const {start, end} = useScene();
  const inP = fadeIn ? interpolate(t, [start, start + 0.4], [0, 1], {...clamp, easing: ease}) : 1;
  const outP = fadeOut ? interpolate(t, [end - 0.3, end], [1, 0], clamp) : 1;
  const o = Math.min(inP, outP);
  const x = (1 - inP) * 36 - (1 - outP) * 36;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        opacity: o,
        transform: `translateX(${x}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Area isi di antara header dan footer. */
export const Body: React.FC<{children: React.ReactNode; pad?: string}> = ({
  children,
  pad = '48px 72px',
}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: HEADER_H,
      height: BODY_H,
      padding: pad,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

/* --------------------------------------------------------------- komponen */

export const cardStyle: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  boxShadow: '0 6px 24px rgba(11, 37, 69, 0.08)',
};

export const Label: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = C.muted,
}) => (
  <div
    style={{
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      marginBottom: 10,
    }}
  >
    {children}
  </div>
);

export const Window: React.FC<{
  title: string;
  at: number;
  h: number;
  dark?: boolean;
  children: React.ReactNode;
}> = ({title, at, h, dark = false, children}) => {
  const bar = dark ? C.termBar : '#EDF1F7';
  const dot = dark ? '#3A5278' : '#C3CCD9';
  return (
    <Reveal at={at} dy={40} dur={0.7} style={{height: h}}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${dark ? '#1B3560' : C.line}`,
          boxShadow: '0 10px 36px rgba(11, 37, 69, 0.14)',
          background: dark ? C.term : C.white,
        }}
      >
        <div
          style={{
            height: 62,
            flex: 'none',
            background: bar,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 24px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: dot}} />
          ))}
          <div
            style={{
              marginLeft: 16,
              fontSize: 22,
              fontWeight: 600,
              color: dark ? '#9FB3CE' : C.muted,
              fontFamily: dark ? MONO : FONT,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{flex: 1, padding: 36, boxSizing: 'border-box'}}>{children}</div>
      </div>
    </Reveal>
  );
};

export const Bullet: React.FC<{at: number; text: string}> = ({at, text}) => (
  <Reveal
    at={at}
    dx={-34}
    dy={0}
    style={{display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24}}
  >
    <div
      style={{
        width: 14,
        height: 14,
        marginTop: 17,
        background: C.gold,
        borderRadius: 3,
        flex: 'none',
      }}
    />
    <div style={{fontSize: 34, lineHeight: 1.35, color: C.ink, fontWeight: 500}}>{text}</div>
  </Reveal>
);

/* ------------------------------------------------------------------ ikon */

type IconProps = {size?: number; color?: string};

export const CheckIcon: React.FC<IconProps> = ({size = 30, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({size = 56, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12h15M13 6l6 6-6 6"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({size = 34, color = C.navy2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6.5z"
      fill={color}
    />
  </svg>
);

export const FileIcon: React.FC<IconProps> = ({size = 34, color = C.blue}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 3h8l5 5v13H6z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M14 3v5h5" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M9 13h7M9 17h7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const VideoFileIcon: React.FC<IconProps> = ({size = 34, color = C.gold}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth={1.8} />
    <path d="M10 9.5v5l4.5-2.5z" fill={color} />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({size = 84, color = C.navy2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M9 8h7M9 12h5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const ChipIcon: React.FC<IconProps> = ({size = 84, color = C.navy2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" stroke={color} strokeWidth={1.6} />
    <rect x="10" y="10" width="4" height="4" fill={color} />
    <path
      d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({size = 84, color = C.navy2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke={color} strokeWidth={1.6} />
    <path d="M10.5 9.5v5l4-2.5z" fill={color} />
    <path d="M10.5 19h3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);
