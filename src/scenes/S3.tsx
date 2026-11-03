import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {lerp, pr, prog, rnd, sp} from '../anim';
import {useT} from '../time';
import {Box, Chip, Flood, Server, XMark} from '../components/parts';

/* ============ 3. DEFINISI (12.2 - 24.6 s) ============ */
const ACR = [
  {big: 'D', word: 'Distributed', id: 'banyak sumber, tersebar', at: 14.9, col: C.cyan},
  {big: 'D', word: 'Denial', id: 'penolakan layanan', at: 16.0, col: C.red},
  {big: 'S', word: 'of Service', id: 'layanan server / website', at: 17.1, col: C.amber},
];

export const S3: React.FC = () => {
  const t = useT();
  // judul besar -> mengecil ke kiri atas
  const shrink = prog(t, 14.2, 14.9);
  const titleE = sp(t, 12.4, 12, 120);
  const fs = lerp(170, 66, shrink);
  const tx = lerp(960, 330, shrink);
  const ty = lerp(430, 78, shrink);

  const flood = prog(t, 19.1, 22.0);
  const stress = Math.min(1, flood * 1.1);
  const down = t > 23.3;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: tx - 600,
          width: 1200,
          top: ty - fs / 2,
          textAlign: 'center',
          fontFamily: display,
          fontWeight: 700,
          fontSize: fs,
          letterSpacing: -4,
          color: C.text,
          opacity: titleE,
          transform: `scale(${0.6 + titleE * 0.4})`,
          textShadow: `0 0 60px ${C.cyan}66, 0 8px 0 #00000066`,
        }}
      >
        Apa itu DDoS?
      </div>

      {/* kartu akronim, berputar 3D */}
      <div style={{position: 'absolute', left: 90, top: 150, perspective: 1600, display: 'flex', gap: 40}}>
        {ACR.map((a, i) => {
          const e = sp(t, a.at, 12, 110);
          const ang = (1 - e) * 180;
          if (e <= 0.001) return <div key={i} style={{width: 540, height: 250}} />;
          const front = ang < 90;
          return (
            <div key={i} style={{width: 540, height: 250, transform: `rotateY(${front ? ang : ang - 180}deg) translateZ(${Math.sin((ang / 180) * Math.PI) * 120}px)`}}>
              <div style={{width: '100%', height: '100%', borderRadius: 30, background: front ? `linear-gradient(145deg, ${C.panel2}, ${C.panel})` : C.panel2, border: `3px solid ${a.col}`, boxShadow: `0 30px 70px #000a, 0 0 ${30 + (1 - e) * 60}px ${a.col}55`, display: 'flex', alignItems: 'center', gap: 28, padding: '0 36px'}}>
                {front && (
                  <>
                    <div style={{fontFamily: display, fontWeight: 700, fontSize: 170, color: a.col, lineHeight: 1, textShadow: `0 0 40px ${a.col}`}}>{a.big}</div>
                    <div>
                      <div style={{fontFamily: display, fontWeight: 700, fontSize: 52, color: C.text}}>{a.word}</div>
                      <div style={{fontFamily: display, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 6}}>{a.id}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* banjir trafik menuju server */}
      {t > 18.8 && (
        <div style={{position: 'absolute', left: 960, top: 700, width: 0, height: 0, perspective: 1300}}>
          <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'rotateX(12deg) rotateY(-14deg)'}}>
            {/* botnet kecil di kiri */}
            {Array.from({length: 16}).map((_, i) => {
              const e = sp(t, 18.9 + i * 0.05, 12, 120);
              const x = -760 + rnd(i) * 300;
              const y = -150 + rnd(i + 9) * 300;
              const z = -200 + rnd(i + 4) * 400;
              return (
                <div key={i} style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${t * 40 + i * 20}deg) scale(${e})`}}>
                  <Box w={44} h={44} d={44} color={i % 3 === 0 ? '#C21F44' : '#7A1633'} />
                </div>
              );
            })}
            <Flood t={t} sources={Array.from({length: 16}, (_, i) => [-740 + rnd(i) * 300, -150 + rnd(i + 9) * 300, -200 + rnd(i + 4) * 400] as [number, number, number])} target={[560, 0, 0]} count={Math.round(170 * flood)} color={C.red} />
            <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(560px, -110px, 0px) rotateY(-20deg)`}}>
              <Server t={t} stress={stress} units={3} />
            </div>
            {down && (
              <div style={{position: 'absolute', transform: 'translate3d(560px, -240px, 80px)', opacity: pr(t, 23.3, 23.7)}}>
                <XMark size={120} />
              </div>
            )}
          </div>
        </div>
      )}
      {t > 19.4 && (
        <div style={{position: 'absolute', left: 90, top: 880 - 330, opacity: pr(t, 19.4, 20)}}>
          <Chip text="Trafik / permintaan sangat besar" color={C.red} size={38} />
        </div>
      )}
      {t > 22.4 && (
        <div style={{position: 'absolute', right: 100, top: 880 - 330, opacity: pr(t, 22.4, 22.9)}}>
          <Chip text={down ? 'Server kewalahan: DOWN' : 'Kapasitas penuh'} color={C.red} size={38} />
        </div>
      )}
    </AbsoluteFill>
  );
};
