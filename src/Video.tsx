import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FPS} from './theme';
import {CUTS, TOTAL} from './timeline';
import {Background3D} from './components/Background3D';
import {Scene} from './components/Scene';
import {Subtitles} from './components/Subtitles';
import {SfxLayer} from './components/Sfx';
import {S1, S2} from './scenes/S1_S2';
import {S3} from './scenes/S3';
import {S4} from './scenes/S4';
import {S5} from './scenes/S5';
import {S6} from './scenes/S6';
import {S7, S8} from './scenes/S7_S8';

const SCENES: React.FC[] = [S1, S2, S3, S4, S5, S6, S7, S8];

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#060A18'}}>
    <Background3D />
    <Audio src={staticFile('voice.mp3')} />
    <Audio src={staticFile('sfx/bed.wav')} loop volume={0.12} />
    {SCENES.map((Comp, i) => {
      const from = Math.round(CUTS[i] * FPS);
      const to = i === SCENES.length - 1 ? TOTAL : Math.round(CUTS[i + 1] * FPS);
      return (
        <Sequence key={i} from={from} durationInFrames={to - from} name={`Adegan ${i + 1}`}>
          <Scene from={from} first={i === 0} last={i === SCENES.length - 1}>
            <Comp />
          </Scene>
        </Sequence>
      );
    })}
    <SfxLayer />
    <Subtitles />
  </AbsoluteFill>
);
