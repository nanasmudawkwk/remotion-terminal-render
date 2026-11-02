import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, CHAPTERS, TOTAL, sec} from '../theme';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / TOTAL);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: '#ffffff12'}}>
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${C.pink}, ${C.amber})`,
        }}
      />
      {CHAPTERS.slice(1).map((c) => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: `${(sec(c.start) / TOTAL) * 100}%`,
            top: 0,
            width: 3,
            height: '100%',
            background: C.bg,
          }}
        />
      ))}
    </div>
  );
};
