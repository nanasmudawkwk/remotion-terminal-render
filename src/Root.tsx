import React from 'react';
import { Composition } from 'remotion';
import { TerminalLesson } from './TerminalLesson';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TerminalLesson"
        component={TerminalLesson}
        durationInFrames={3960}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
