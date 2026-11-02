import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';

const Blob: React.FC<{x: number; y: number; size: number; color: string}> = ({x, y, size, color}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
    }}
  />
);

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.4) % 90;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Blob x={300 + Math.sin(f / 140) * 140} y={220 + Math.cos(f / 170) * 90} size={900} color="#FF5C8A22" />
      <Blob x={1620 + Math.cos(f / 160) * 120} y={820 + Math.sin(f / 130) * 100} size={1000} color="#5BE3E01C" />
      <Blob x={980 + Math.sin(f / 200) * 200} y={560 + Math.cos(f / 150) * 120} size={800} color="#B7A6FF18" />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(#ffffff0D 1px, transparent 1px), linear-gradient(90deg, #ffffff0D 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 78%)',
        }}
      />
    </AbsoluteFill>
  );
};
