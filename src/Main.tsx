import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Chrome} from './Chrome';
import {SceneProvider} from './lib';
import {
  IntroScene,
  OutroScene,
  Step1Scene,
  Step2Scene,
  Step3Scene,
  Step4Scene,
  Step5Scene,
  TitleScene,
} from './Scenes';
import {Sfx} from './Sfx';
import {Subtitles} from './Subtitles';
import {C, FONT} from './theme';
import {FPS, SCENES, SceneId} from './timing';

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  title: TitleScene,
  intro: IntroScene,
  step1: Step1Scene,
  step2: Step2Scene,
  step3: Step3Scene,
  step4: Step4Scene,
  step5: Step5Scene,
  outro: OutroScene,
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.paper, fontFamily: FONT}}>
      <Audio src={staticFile('voiceover.mp3')} />

      {SCENES.map((s) => {
        const from = Math.round(s.start * FPS);
        const to = Math.round(s.end * FPS);
        const Scene = SCENE_COMPONENTS[s.id];
        return (
          <Sequence key={s.id} from={from} durationInFrames={to - from}>
            <SceneProvider start={from / FPS} end={to / FPS}>
              <Scene />
            </SceneProvider>
          </Sequence>
        );
      })}

      <Chrome />
      <Subtitles />
      <Sfx />
    </AbsoluteFill>
  );
};
