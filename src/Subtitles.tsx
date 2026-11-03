import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from './theme';
import {SUBTITLES} from './subtitles';

const HOLD_BEFORE = 0.05; // tampil sedikit sebelum suara
const HOLD_AFTER = 0.18; // bertahan sedikit setelah suara

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const idx = SUBTITLES.findIndex((s, i) => {
    const next = SUBTITLES[i + 1];
    const from = s.start - HOLD_BEFORE;
    const to = Math.min(s.end + HOLD_AFTER, next ? next.start - HOLD_BEFORE : Infinity);
    return t >= from && t < to;
  });
  if (idx < 0) return null;

  const s = SUBTITLES[idx];
  const next = SUBTITLES[idx + 1];
  const from = s.start - HOLD_BEFORE;
  const to = Math.min(s.end + HOLD_AFTER, next ? next.start - HOLD_BEFORE : Infinity);
  const o = interpolate(t, [from, from + 0.12, to - 0.12, to], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 52,
        height: 44,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: o,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: C.navy,
          border: `1px solid rgba(184, 147, 47, 0.7)`,
          color: C.white,
          fontSize: 27,
          fontWeight: 500,
          lineHeight: '42px',
          height: 44,
          padding: '0 26px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
        }}
      >
        {s.text}
      </div>
    </div>
  );
};
