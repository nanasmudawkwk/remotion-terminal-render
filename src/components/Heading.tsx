import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {display} from '../fonts';
import {clamp, ease, sp} from '../anim';

export const Heading: React.FC<{title: string; subtitle?: string; color?: string}> = ({
  title,
  subtitle,
  color = C.amber,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = sp(frame, fps, 4, 20, 120);
  const s = sp(frame, fps, 16, 20, 120);
  const bar = interpolate(frame, [8, 34], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 100, top: 52}}>
      <div style={{overflow: 'hidden', paddingBottom: 6}}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: C.text,
            transform: `translateY(${(1 - t) * 115}%)`,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{height: 6, width: 220 * bar, background: color, borderRadius: 3, margin: '4px 0 12px'}} />
      {subtitle && (
        <div
          style={{
            fontFamily: display,
            fontWeight: 500,
            fontSize: 30,
            color: C.dim,
            opacity: s,
            transform: `translateY(${(1 - s) * 16}px)`,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
