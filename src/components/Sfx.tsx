import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type SfxItem = {at: number; f: string; v?: number; d?: number};

export const Sfx: React.FC<{list: SfxItem[]; master?: number}> = ({list, master = 1}) => (
  <>
    {list.map((s, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(s.at))} durationInFrames={s.d ?? 40}>
        <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={(s.v ?? 1) * master} />
      </Sequence>
    ))}
  </>
);

/** klik papan ketik tiap `step` huruf */
export const typeClicks = (start: number, len: number, cps: number, v = 0.3, step = 2): SfxItem[] =>
  Array.from({length: Math.ceil(len / step)}, (_, i) => ({
    at: start + Math.ceil((i * step) / cps),
    f: `click${(i % 3) + 1}`,
    v,
    d: 6,
  }));
