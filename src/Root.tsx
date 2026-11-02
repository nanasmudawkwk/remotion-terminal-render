import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {Short} from './Short';
import {FPS, TOTAL} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Terminal15s"
    component={Short}
    durationInFrames={450}
    fps={FPS}
    width={1920}
    height={1080}
  />
  <Composition
    id="BelajarTerminal"
    component={Video}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
  />
  </>
);
