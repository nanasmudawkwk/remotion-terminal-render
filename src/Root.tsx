import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS} from './theme';
import {TOTAL} from './timeline';

// HANYA satu komposisi: "DDoS" (116,8 detik, mengikuti voice)
export const RemotionRoot: React.FC = () => (
  <Composition id="DDoS" component={Video} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
