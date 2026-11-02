import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CHAPTERS, TOTAL, sec} from './theme';
import {AUDIO_FILE} from './timeline';
import {display} from './fonts';
import {clamp} from './anim';
import {Background} from './components/Background';
import {ProgressBar} from './components/ProgressBar';
import {Scene} from './components/Scene';
import {ActiveProvider} from './components/Active';
import {Sfx} from './components/Sfx';
import {Subtitles} from './components/Subtitles';
import {
  InterludeScene,
  IntroScene,
  KesimpulanScene,
  NanoScene,
  ObjectivesScene,
  PengenalanScene,
  PermissionScene,
} from './scenes/Story';
import {DasarScene, FileScene, JaringanScene, PaketScene, PraktikumScene, SistemScene} from './scenes/Sims';

const ELEMENTS: Record<string, React.ReactNode> = {
  intro: <IntroScene />,
  tujuan: <ObjectivesScene />,
  pengenalan: <PengenalanScene />,
  dasar: <DasarScene />,
  file: <FileScene />,
  sistem: <SistemScene />,
  jaringan: <JaringanScene />,
  paket: <PaketScene />,
  nano: <NanoScene />,
  permission: <PermissionScene />,
  interlude: <InterludeScene />,
  praktikum: <PraktikumScene />,
  kesimpulan: <KesimpulanScene />,
};
const TRY_SELF = ['dasar', 'file', 'sistem', 'jaringan', 'paket', 'praktikum'];

/** Pil "Jeda" dengan hitung mundur selama bagian jeda di akhir tiap bab. */
const PauseBadge: React.FC<{id: string; active: number}> = ({id, active}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: dur} = useVideoConfig();
  const pauseLen = dur - active;
  if (pauseLen < 90 || frame < active + 10 || frame > dur - 14) return null;
  const p = interpolate(frame, [active + 10, dur - 14], [0, 1], clamp);
  const a = interpolate(frame, [active + 10, active + 24], [0, 1], clamp);
  const R = 26;
  const L = 2 * Math.PI * R;
  return (
    <div
      style={{
        position: 'absolute',
        right: 70,
        bottom: 38,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '14px 30px 14px 18px',
        borderRadius: 60,
        background: C.panel,
        border: `2px solid ${C.amber}`,
        boxShadow: `0 0 40px ${C.amber}44`,
        opacity: a,
        transform: `translateY(${(1 - a) * 30}px)`,
      }}
    >
      <svg width={64} height={64} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={R} fill="none" stroke="#ffffff22" strokeWidth={7} />
        <circle
          cx={32}
          cy={32}
          r={R}
          fill="none"
          stroke={C.amber}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * p}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div style={{fontFamily: display, fontWeight: 800, fontSize: 36, color: C.text}}>
        {TRY_SELF.includes(id) ? 'Coba ketik sendiri' : 'Jeda sejenak'}
      </div>
    </div>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Audio src={staticFile(AUDIO_FILE)} />
    <Audio src={staticFile('sfx/bed.wav')} loop volume={0.1} />
    {CHAPTERS.map((c, i) => {
      const from = sec(c.start);
      const to = i === CHAPTERS.length - 1 ? TOTAL : sec(CHAPTERS[i + 1].start);
      const active = Math.min(sec(c.active), to - from);
      return (
        <Sequence key={c.id} from={from} durationInFrames={to - from} name={c.label}>
          <ActiveProvider frames={active}>
            <Scene first={i === 0} last={i === CHAPTERS.length - 1}>
              {ELEMENTS[c.id]}
              <PauseBadge id={c.id} active={active} />
            </Scene>
          </ActiveProvider>
          {i > 0 && <Sfx list={[{at: 0, f: 'whoosh', v: 0.5, d: 24}]} />}
        </Sequence>
      );
    })}
    <Subtitles />
    <ProgressBar />
  </AbsoluteFill>
);
