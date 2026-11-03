import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {easeInOut, lerp, pr, prog, rnd, sp} from '../anim';
import {useT} from '../time';
import {Box, Chip, XMark} from '../components/parts';

/* ============ 4. ANALOGI RESTORAN (24.6 - 45.05 s) ============ */
const TILT = 58;

const Person: React.FC<{x: number; y: number; color: string; rz: number; s?: number; o?: number; glow?: boolean}> = ({x, y, color, rz, s = 1, o = 1, glow}) => (
  <>
    <div style={{position: 'absolute', left: 0, top: 0, width: 30 * s, height: 16 * s, marginLeft: -15 * s, marginTop: -8 * s, borderRadius: '50%', background: '#000', opacity: 0.35 * o, transform: `translate3d(${x}px, ${y}px, 0)`}} />
    <div style={{position: 'absolute', left: 0, top: 0, opacity: o, transform: `translate3d(${x}px, ${y}px, 0) rotateZ(${rz}deg) rotateX(${-TILT}deg) scale(${s})`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', left: -12, top: -44, width: 24, height: 44}}>
        <div style={{position: 'absolute', left: 4, top: 0, width: 16, height: 16, borderRadius: 8, background: color, filter: 'brightness(1.25)'}} />
        <div style={{position: 'absolute', left: 0, top: 17, width: 24, height: 27, borderRadius: '12px 12px 4px 4px', background: color, boxShadow: glow ? `0 0 26px ${color}` : undefined}} />
      </div>
    </div>
  </>
);

const seats = Array.from({length: 100}, (_, i) => ({x: -150 + ((i % 10) - 4.5) * 52, y: (Math.floor(i / 10) - 4.5) * 50}));
const crowd = Array.from({length: 240}, (_, i) => {
  const inside = i < 110;
  return {
    x: inside ? 120 + rnd(i) * 360 : 530 + rnd(i + 5) * 380,
    y: inside ? -300 + rnd(i + 11) * 600 : (rnd(i + 7) - 0.5) * 520 * (0.5 + rnd(i + 2) * 0.6),
    at: 32.9 + (i / 240) * 3.6,
  };
});

export const S4: React.FC = () => {
  const t = useT();
  const rz = -38 + Math.sin(t * 0.5) * 2.2;
  const stageE = sp(t, 24.9, 16, 80);
  const filled = Math.max(0, Math.min(100, Math.floor((t - 27.95) / 0.035)));
  const crowdN = Math.round(prog(t, 32.9, 36.5) * 1240);
  const overflow = t > 32.9;
  const realIn = prog(t, 37.9, 39.3);
  const realOut = prog(t, 40.4, 41.5);
  const realX = t < 40.4 ? lerp(1250, 600, easeInOut(realIn)) : lerp(600, 1100, easeInOut(realOut));
  const realO = t < 37.9 ? 0 : 1 - realOut;
  const shake = overflow && t < 38 ? Math.sin(t * 50) * 3 : 0;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, top: 50, fontFamily: display, fontWeight: 700, fontSize: 64, color: C.text, opacity: pr(t, 25.0, 25.6), transform: `translateX(${(1 - pr(t, 25.0, 25.6)) * -60}px)`}}>
        Analogi restoran
      </div>

      {/* panggung isometrik */}
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: 960 + shake, top: 520, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `rotateX(${TILT}deg) rotateZ(${rz}deg) scale(${0.6 + stageE * 0.4})`, opacity: Math.min(1, stageE * 2)}}>
          <div style={{position: 'absolute', left: -500, top: -320, width: 1000, height: 640, borderRadius: 12, background: '#0F1A3D', border: `3px solid ${overflow ? C.red : C.cyan}88`, boxShadow: `0 0 80px ${overflow ? C.red : C.cyan}44`, backgroundImage: 'linear-gradient(#ffffff0F 2px, transparent 2px), linear-gradient(90deg, #ffffff0F 2px, transparent 2px)', backgroundSize: '50px 50px'}} />
          {/* dinding belakang (utara) dan timur, pintu di tengah dinding timur */}
          <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'translate3d(-500px, -327px, 45px)'}}><Box w={1000} h={14} d={90} color="#2A3A7A" /></div>
          <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'translate3d(493px, -320px, 45px)'}}><Box w={14} h={260} d={90} color="#2A3A7A" /></div>
          <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'translate3d(493px, 60px, 45px)'}}><Box w={14} h={260} d={90} color="#2A3A7A" /></div>
          <div style={{position: 'absolute', left: 470, top: -60, width: 60, height: 120, background: `${C.green}33`, border: `2px dashed ${C.green}`, borderRadius: 8}} />

          {/* 100 kursi */}
          {seats.map((s, i) => (
            <div key={i} style={{position: 'absolute', left: s.x - 17, top: s.y - 17, width: 34, height: 34, borderRadius: 8, border: `2px solid ${i < filled ? C.blue : '#ffffff22'}`, background: i < filled ? `${C.blue}33` : 'transparent'}} />
          ))}
          {/* pelanggan asli (biru) */}
          {seats.map((s, i) => {
            const e = sp(t, 27.95 + i * 0.035, 14, 200);
            return e > 0.01 ? <Person key={i} x={s.x} y={s.y} color={C.blue} rz={-rz} s={e} /> : null;
          })}
          {/* kerumunan penyerang (merah) */}
          {crowd.map((c, i) => {
            const e = prog(t, c.at, c.at + 0.8);
            if (e <= 0) return null;
            const k = easeInOut(e);
            return <Person key={i} x={lerp(1150, c.x, k)} y={lerp(c.y * 0.6, c.y, k)} color={i % 4 === 0 ? '#FF7A93' : C.red} rz={-rz} o={Math.min(1, e * 3)} />;
          })}
          {/* pelanggan asli datang (hijau), ditolak */}
          {realO > 0 && <Person x={realX} y={0} color={C.green} rz={-rz} s={1.7} o={realO} glow />}
        </div>
      </AbsoluteFill>

      {/* HUD */}
      <div style={{position: 'absolute', left: 80, top: 150, width: 430, opacity: pr(t, 27.2, 27.8)}}>
        <div style={{fontFamily: display, fontWeight: 500, fontSize: 30, color: C.dim}}>Kapasitas restoran</div>
        <div style={{fontFamily: mono, fontWeight: 700, fontSize: 84, color: overflow ? C.red : C.blue, lineHeight: 1.1}}>
          {filled}<span style={{fontSize: 40, color: C.dim}}> / 100</span>
        </div>
        <div style={{height: 20, borderRadius: 10, background: '#ffffff18', marginTop: 8, overflow: 'hidden'}}>
          <div style={{width: `${filled}%`, height: '100%', background: overflow ? C.red : C.blue, boxShadow: `0 0 24px ${overflow ? C.red : C.blue}`}} />
        </div>
        {overflow && (
          <div style={{marginTop: 26, opacity: pr(t, 32.9, 33.4)}}>
            <div style={{fontFamily: display, fontWeight: 500, fontSize: 30, color: C.dim}}>Pengunjung sekarang</div>
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 84, color: C.red, lineHeight: 1.1, textShadow: `0 0 30px ${C.red}`}}>{crowdN.toLocaleString('id-ID')}+</div>
          </div>
        )}
      </div>

      {t > 38.1 && t < 42.3 && (
        <div style={{position: 'absolute', left: 70, top: 470, display: 'flex', alignItems: 'center', gap: 16, opacity: pr(t, 38.1, 38.5) * (1 - pr(t, 41.8, 42.3)), transform: `scale(${0.7 + sp(t, 38.1, 9, 160) * 0.3}) rotate(-3deg)`}}>
          <XMark size={70} />
          <Chip text="Pelanggan asli ditolak" color={C.red} size={40} />
        </div>
      )}

      {/* pemetaan analogi */}
      <div style={{position: 'absolute', right: 70, top: 640, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end'}}>
        {[
          ['Restoran = Server', C.cyan, 42.6],
          ['Kerumunan = Trafik palsu', C.red, 43.1],
          ['Kursi = Kapasitas', C.blue, 43.6],
        ].map(([txt, col, at], i) => {
          const e = sp(t, at as number, 12, 140);
          return (
            <div key={i} style={{opacity: Math.min(1, e * 2), transform: `translateX(${(1 - e) * 140}px)`}}>
              <Chip text={txt as string} color={col as string} size={38} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
