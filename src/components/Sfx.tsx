import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS} from '../theme';
import {SFX} from '../sfxPlan';

export const SfxLayer: React.FC = () => (
  <>
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(s.t * FPS))} durationInFrames={Math.max(4, Math.round((s.d ?? 1.2) * FPS))}>
        <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={s.v ?? 0.6} />
      </Sequence>
    ))}
  </>
);
