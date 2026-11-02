import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FPS, srcToSec} from '../theme';
import {display} from '../fonts';
import {clamp} from '../anim';
import {SUBS} from '../subtitles';

type Word = {w: string; from: number; to: number};
type Cue = {from: number; to: number; words: Word[]};

/** Subtitle ala clipper: tebal, besar, kata yang sedang diucapkan menyala dan "pop". */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cues = useMemo<Cue[]>(
    () =>
      SUBS.map((c) => {
        const from = Math.round(srcToSec(c.s) * FPS);
        const to = Math.round(srcToSec(c.e) * FPS);
        const ws = c.text.split(/\s+/).filter(Boolean);
        const tot = ws.reduce((a, w) => a + w.length + 2, 0);
        let t = from;
        const words = ws.map((w) => {
          const d = ((to - from) * (w.length + 2)) / tot;
          const r = {w, from: t, to: t + d};
          t += d;
          return r;
        });
        return {from, to, words};
      }),
    [],
  );
  const cue = cues.find((c) => frame >= c.from && frame <= c.to);
  if (!cue) return null;
  const age = frame - cue.from;
  const enter = interpolate(age, [0, 5], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 26,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        gap: 18,
        transform: `translateY(${(1 - enter) * 16}px) scale(${0.92 + enter * 0.08})`,
        opacity: enter,
      }}
    >
      {cue.words.map((w, i) => {
        const on = frame >= w.from && frame < w.to;
        const pop = on ? interpolate(frame - w.from, [0, 4], [1.28, 1.14], clamp) : 1;
        return (
          <span
            key={i}
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 66,
              lineHeight: 1.1,
              letterSpacing: -1,
              color: on ? C.amber : '#FFFFFF',
              WebkitTextStroke: '14px #080918',
              paintOrder: 'stroke fill',
              textShadow: on ? `0 0 28px ${C.amber}99, 0 6px 0 #080918` : '0 6px 0 #080918',
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
