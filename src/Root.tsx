import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, TOTAL} from './theme';

// HANYA satu komposisi: BelajarTerminal (10 menit = 18.000 frame)
export const RemotionRoot: React.FC = () => (
  <Composition
    id="BelajarTerminal"
    component={Video}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
