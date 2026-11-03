import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckIcon, prog} from './lib';
import {C, FONT, FOOTER_H, HEADER_H, MONO} from './theme';
import {DURATION_SEC, SCENES} from './timing';

const STEP_LABELS = ['Naskah', 'Kode', 'Unduh', 'Render', 'Hasil'];

const activeStep = (t: number) => {
  const idx = (id: string) => SCENES.find((s) => s.id === id)!;
  if (t < idx('step1').start) return 0; // intro
  if (t >= idx('outro').start) return 6; // semua selesai
  for (let i = 1; i <= 5; i++) {
    const s = idx(`step${i}`);
    if (t >= s.start && t < s.end) return i;
  }
  return 0;
};

const fmt = (sec: number) => {
  const s = Math.max(0, Math.min(DURATION_SEC, Math.floor(sec)));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const introStart = SCENES[1].start;
  const o = prog(t, introStart, 0.5);
  const step = activeStep(t);
  const progress = Math.min(1, t / DURATION_SEC);

  return (
    <div style={{opacity: o, fontFamily: FONT}}>
      {/* HEADER */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: HEADER_H,
          background: C.navy,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 72px',
          boxSizing: 'border-box',
          borderBottom: `4px solid ${C.gold}`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: C.gold,
              color: C.navy,
              fontWeight: 800,
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.02em',
            }}
          >
            MG
          </div>
          <div>
            <div style={{color: C.white, fontSize: 28, fontWeight: 700, lineHeight: 1.1}}>
              Panduan Motion Graphics
            </div>
            <div style={{color: '#A9BAD3', fontSize: 18, fontWeight: 500, marginTop: 4}}>
              Claude AI dan Remotion
            </div>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center'}}>
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const isActive = step === n;
            const isDone = step > n;
            return (
              <React.Fragment key={label}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      background: isActive ? C.gold : isDone ? '#2B4A78' : 'transparent',
                      border: isActive || isDone ? 'none' : '2px solid #4A648C',
                      color: isActive ? C.navy : '#8FA5C6',
                    }}
                  >
                    {isDone ? <CheckIcon size={22} color={C.white} /> : n}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? C.white : '#8FA5C6',
                    }}
                  >
                    {label}
                  </div>
                </div>
                {i < STEP_LABELS.length - 1 ? (
                  <div
                    style={{
                      width: 34,
                      height: 2,
                      margin: '0 16px',
                      background: isDone ? '#2B4A78' : '#34507A',
                    }}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: FOOTER_H,
          background: C.white,
          borderTop: `1px solid ${C.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 72px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: -1, height: 5, width: `${progress * 100}%`, background: C.gold}} />
        <div style={{fontSize: 18, color: C.muted, fontWeight: 500}}>
          Cara Membuat Video Motion Graphics Menggunakan Claude AI dan Remotion
        </div>
        <div style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>
          {fmt(t)} / {fmt(DURATION_SEC)}
        </div>
      </div>
    </div>
  );
};
