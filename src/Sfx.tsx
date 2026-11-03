import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CUES, FPS, SCENES} from './timing';

const LEN = {whoosh: 0.9, pop: 0.28, check: 0.6, chime: 1.6, thud: 1.2, typing: 6, blip: 0.4};
type Kind = keyof typeof LEN;
type Cue = {at: number; k: Kind; vol: number; dur?: number};

const buildCues = (): Cue[] => {
  const c: Cue[] = [];
  const pop = (times: readonly number[], vol = 0.3) =>
    times.forEach((at) => c.push({at, k: 'pop', vol}));
  const check = (times: readonly number[], vol = 0.28) =>
    times.forEach((at) => c.push({at, k: 'check', vol}));
  const typing = (from: number, to: number) =>
    c.push({at: from, k: 'typing', vol: 0.32, dur: to - from});

  // pembuka judul
  c.push({at: 0.05, k: 'thud', vol: 0.5});
  c.push({at: CUES.title.sub, k: 'pop', vol: 0.28});

  // transisi antar-adegan
  SCENES.slice(1).forEach((s) => c.push({at: Math.max(0, s.start - 0.05), k: 'whoosh', vol: 0.28}));

  // pengantar
  pop(CUES.intro.cards);
  pop([CUES.intro.callout]);
  c.push({at: CUES.intro.strike, k: 'whoosh', vol: 0.22, dur: 0.5});

  // langkah 1
  pop(CUES.step1.bullets);
  c.push({at: CUES.step1.window, k: 'pop', vol: 0.3});
  typing(CUES.step1.typeStart, CUES.step1.typeEnd);
  pop([CUES.step1.reply]);
  pop(CUES.step1.chips);

  // langkah 2
  pop(CUES.step2.bullets);
  pop([CUES.step2.window, CUES.step2.attach]);
  typing(CUES.step2.typeStart, CUES.step2.typeEnd);
  check(CUES.step2.items);

  // langkah 3
  pop(CUES.step3.bullets);
  pop([CUES.step3.zip, CUES.step3.term]);
  c.push({at: CUES.step3.dl[0], k: 'blip', vol: 0.3});
  check([CUES.step3.dl[1]]);
  typing(CUES.step3.typeStart, CUES.step3.typeEnd);
  pop([CUES.step3.out], 0.2);

  // langkah 4
  pop(CUES.step4.bullets);
  pop([CUES.step4.term]);
  typing(CUES.step4.cd[0], CUES.step4.cd[1]);
  typing(CUES.step4.install[0], CUES.step4.install[1]);
  typing(CUES.step4.render[0], CUES.step4.render[1]);
  c.push({at: CUES.step4.installDone, k: 'check', vol: 0.26});
  c.push({at: CUES.step4.renderDone, k: 'chime', vol: 0.28});

  // langkah 5
  pop(CUES.step5.bullets);
  pop(CUES.step5.factors);
  c.push({at: CUES.step5.ring[1], k: 'chime', vol: 0.28});
  pop(CUES.step5.files, 0.22);
  check([CUES.step5.video]);

  // penutup
  c.push({at: CUES.outro.done, k: 'chime', vol: 0.34});
  check(CUES.outro.recap);
  pop(CUES.outro.cats, 0.3);
  pop([CUES.outro.tag], 0.3);
  c.push({at: CUES.outro.bye, k: 'chime', vol: 0.34});

  return c;
};

const CUE_LIST = buildCues();

export const Sfx: React.FC = () => (
  <>
    {CUE_LIST.map((cue, i) => (
      <Sequence
        key={i}
        from={Math.round(cue.at * FPS)}
        durationInFrames={Math.ceil((cue.dur ?? LEN[cue.k]) * FPS) + 1}
        layout="none"
      >
        <Audio src={staticFile(`sfx/${cue.k}.wav`)} volume={cue.vol} />
      </Sequence>
    ))}
  </>
);
