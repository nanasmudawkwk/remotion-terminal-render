import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {mono} from '../fonts';
import {clamp} from '../anim';

export type Line = {
  kind: 'cmd' | 'out' | 'err' | 'clear';
  text: string;
  at: number;
  cps?: number;
  after?: string; // direktori setelah perintah dijalankan
};

const Cmd: React.FC<{text: string}> = ({text}) => {
  const parts = text.split(/(\s+)/);
  let inQ = false;
  let first = true;
  return (
    <>
      {parts.map((p, i) => {
        if (p === '') return null;
        if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
        let color = C.text;
        if (inQ || p.startsWith('"')) color = C.green;
        else if (first) color = C.cyan;
        else if (p.startsWith('-')) color = C.amber;
        else if (p === '>' || p === '>>') color = C.pink;
        if (((p.match(/"/g) || []).length) % 2 === 1) inQ = !inQ;
        first = false;
        return (
          <span key={i} style={{color, fontWeight: color === C.cyan ? 700 : 400}}>
            {p}
          </span>
        );
      })}
    </>
  );
};

export const Terminal: React.FC<{
  lines: Line[];
  width: number;
  height: number;
  accent: string;
  startCwd?: string;
  user?: string;
}> = ({lines, width, height, accent, startCwd = '~', user = 'siswa'}) => {
  const frame = useCurrentFrame();
  const cpsOf = (l: Line) => l.cps ?? 0.55;
  const doneAt = (l: Line) => l.at + Math.ceil(l.text.length / cpsOf(l));

  const vis = lines.filter((l) => l.at <= frame);
  const lastClear = [...vis].reverse().find((l) => l.kind === 'clear');
  const shownIdx = new Set<number>();
  lines.forEach((l, i) => {
    if (l.at > frame || l.kind === 'clear') return;
    if (lastClear && l.at <= lastClear.at) return;
    shownIdx.add(i);
  });

  // direktori aktif (berubah setelah perintah selesai diketik)
  let cwd = startCwd;
  let glow = 0;
  lines.forEach((l) => {
    if (l.kind !== 'cmd') return;
    const d = doneAt(l);
    if (frame >= d) {
      if (l.after) cwd = l.after;
      glow = Math.max(glow, interpolate(frame - d, [0, 16], [1, 0], clamp));
    }
  });

  const lastShown = [...shownIdx].sort((a, b) => a - b).pop();
  const lastLine = lastShown !== undefined ? lines[lastShown] : undefined;
  const typingLast = !!lastLine && lastLine.kind === 'cmd' && frame < doneAt(lastLine);
  const next = lines.find((l) => l.at > frame);
  const showLive = !typingLast && !(next && next.kind !== 'cmd');
  const cursorOn = typingLast || Math.floor(frame / 15) % 2 === 0;

  const glowHex = Math.round(glow * 150).toString(16).padStart(2, '0');

  const Cursor = (
    <span
      style={{
        display: 'inline-block',
        width: '0.55em',
        height: '1.1em',
        marginLeft: 2,
        verticalAlign: 'text-bottom',
        background: cursorOn ? accent : 'transparent',
      }}
    />
  );

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 28,
        background: C.term,
        border: `1.5px solid ${accent}66`,
        boxShadow: `0 30px 80px #0009, 0 0 ${glow * 70}px ${accent}${glowHex}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 26px',
          gap: 12,
          background: '#16183A',
          borderBottom: '1px solid #ffffff10',
        }}
      >
        {[C.pink, C.amber, C.green].map((c) => (
          <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
        ))}
        <div style={{flex: 1, textAlign: 'center', fontFamily: mono, fontSize: 22, color: C.dim, marginRight: 76}}>
          {user}@belajar: {cwd}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: '20px 36px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          fontFamily: mono,
          fontSize: 32,
          lineHeight: 1.5,
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 70px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 70px)',
        }}
      >
        {lines.map((l, i) => {
          if (!shownIdx.has(i)) return null;
          if (l.kind === 'cmd') {
            const chars = Math.min(l.text.length, Math.floor((frame - l.at) * cpsOf(l)));
            const typing = chars < l.text.length;
            return (
              <div key={i} style={{whiteSpace: 'pre'}}>
                <span style={{color: accent}}>$ </span>
                <Cmd text={l.text.slice(0, chars)} />
                {typing && Cursor}
              </div>
            );
          }
          const a = interpolate(frame - l.at, [0, 6], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                whiteSpace: 'pre',
                color: l.kind === 'err' ? C.pink : '#CFD3F5',
                opacity: a,
                transform: `translateX(${(1 - a) * -14}px)`,
              }}
            >
              {l.text}
            </div>
          );
        })}
        {showLive && (
          <div style={{whiteSpace: 'pre'}}>
            <span style={{color: accent}}>$ </span>
            {Cursor}
          </div>
        )}
      </div>
    </div>
  );
};
