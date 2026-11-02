import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {clamp} from '../anim';

const W = 12;

/** Pembungkus adegan: wipe diagonal saat masuk dan keluar. */
export const Scene: React.FC<{first?: boolean; last?: boolean; children: React.ReactNode}> = ({
  first,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: dur} = useVideoConfig();
  let x = -140;
  if (!first && frame < W) {
    x = interpolate(frame, [0, W], [0, 140], clamp);
  } else if (!last && frame > dur - W) {
    x = interpolate(frame, [dur - W, dur], [-140, 0], clamp);
  }
  const visible = x > -139 && x < 139;
  return (
    <AbsoluteFill>
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            bottom: -20,
            left: '-12%',
            width: '125%',
            transform: `translateX(${x}%) skewX(-12deg)`,
            background: `linear-gradient(90deg, ${C.pink}, ${C.amber})`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
