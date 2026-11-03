import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {SceneTime} from '../time';

const W = 12;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Pembungkus adegan: menyediakan waktu absolut + wipe diagonal di pergantian. */
export const Scene: React.FC<{from: number; first?: boolean; last?: boolean; children: React.ReactNode}> = ({
  from,
  first,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: dur} = useVideoConfig();
  let x = -140;
  if (!first && frame < W) x = interpolate(frame, [0, W], [0, 140], clamp);
  else if (!last && frame > dur - W) x = interpolate(frame, [dur - W, dur], [-140, 0], clamp);
  const visible = x > -139 && x < 139;
  return (
    <SceneTime from={from}>
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
              background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
            }}
          />
        )}
      </AbsoluteFill>
    </SceneTime>
  );
};
