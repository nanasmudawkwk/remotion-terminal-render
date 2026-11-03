import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {C, FPS} from '../theme';
import {rnd} from '../anim';

// warna suasana: biru/cyan = tenang, merah = serangan, hijau = aman
const MOOD: [number, string][] = [
  [0, C.cyan], [8.5, C.cyan], [9.2, C.red], [11.8, C.red], [12.8, C.blue], [19, C.blue], [20, C.red], [24, C.red],
  [25, C.amber], [32.5, C.amber], [33.2, C.red], [45, C.red], [62, C.red], [63.5, C.blue], [96, C.blue],
  [97, C.violet], [106, C.violet], [107, C.green], [117, C.green],
];

export const Background3D: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const mood = interpolateColors(t, MOOD.map((m) => m[0]), MOOD.map((m) => m[1]));
  const off = (f * 1.6) % 120;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #0E1838 0%, ${C.bg} 70%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 100%, ${mood} 0%, transparent 60%)`, opacity: 0.22}} />
      {/* lantai grid perspektif */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 620, perspective: 600, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: '-60%',
            right: '-60%',
            bottom: -260,
            height: 1300,
            transform: 'rotateX(72deg)',
            transformOrigin: '50% 100%',
            backgroundImage: `linear-gradient(${mood} 2px, transparent 2px), linear-gradient(90deg, ${mood} 2px, transparent 2px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: `0 ${off}px`,
            opacity: 0.32,
            maskImage: 'linear-gradient(to top, #000 15%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to top, #000 15%, transparent 85%)',
          }}
        />
      </div>
      {/* debu cahaya melayang */}
      {Array.from({length: 46}).map((_, i) => {
        const x = rnd(i) * 1920;
        const y = (rnd(i + 40) * 1200 - f * (0.3 + rnd(i + 9) * 0.7) + 1200) % 1200;
        const s = 2 + rnd(i + 3) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y - 60,
              width: s,
              height: s,
              borderRadius: s,
              background: mood,
              opacity: 0.25 + 0.35 * Math.abs(Math.sin(f / 30 + i)),
            }}
          />
        );
      })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, #00000088 100%)'}} />
    </AbsoluteFill>
  );
};
