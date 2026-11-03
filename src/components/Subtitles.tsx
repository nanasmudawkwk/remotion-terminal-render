import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FPS} from '../theme';
import {subFont} from '../fonts';
import {CUES} from '../cues';

type W = {w: string; a: number; b: number};
type Chunk = {from: number; to: number; words: W[]};

/** Subtitle ala clipper: huruf tebal, outline gelap, kata yang diucapkan menyala dan "pop". */
const build = (): Chunk[] => {
  const out: Chunk[] = [];
  CUES.forEach((c) => {
    const words = c.t.split(/\s+/).filter(Boolean);
    const groups: string[][] = [];
    let cur: string[] = [];
    words.forEach((w) => {
      cur.push(w);
      const brk = /[,:.?!]$/.test(w);
      if (cur.length >= 5 || (brk && cur.length >= 2)) {
        groups.push(cur);
        cur = [];
      }
    });
    if (cur.length) {
      if (cur.length === 1 && groups.length) groups[groups.length - 1].push(cur[0]);
      else groups.push(cur);
    }
    const weight = (g: string[]) => g.reduce((a, w) => a + w.length + 2, 0);
    const tot = groups.reduce((a, g) => a + weight(g), 0);
    let t = c.s;
    groups.forEach((g) => {
      const d = ((c.e - c.s) * weight(g)) / tot;
      const wt = weight(g);
      let wtm = t;
      const ws = g.map((w) => {
        const wd = (d * (w.length + 2)) / wt;
        const r = {w, a: wtm * FPS, b: (wtm + wd) * FPS};
        wtm += wd;
        return r;
      });
      out.push({from: t * FPS, to: (t + d) * FPS, words: ws});
      t += d;
    });
  });
  return out;
};

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const chunks = useMemo(build, []);
  const ch = chunks.find((c) => frame >= c.from && frame < c.to + 3);
  if (!ch) return null;
  const age = frame - ch.from;
  const enter = interpolate(age, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        bottom: 34,
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px) scale(${0.94 + enter * 0.06})`,
      }}
    >
      {ch.words.map((w, i) => {
        const on = frame >= w.a && frame < w.b;
        const pop = on ? interpolate(frame - w.a, [0, 4], [1.25, 1.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: subFont,
              fontSize: 78,
              lineHeight: 1.1,
              letterSpacing: 1,
              color: on ? '#FFE14A' : '#FFFFFF',
              WebkitTextStroke: '15px #050816',
              paintOrder: 'stroke fill',
              textShadow: on ? `0 0 30px #FFE14A99, 0 7px 0 #050816` : '0 7px 0 #050816',
              transform: `scale(${pop}) rotate(${on ? -2 : 0}deg)`,
              whiteSpace: 'nowrap',
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
