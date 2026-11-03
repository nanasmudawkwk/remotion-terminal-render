import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {lerp, pr, prog, rnd, sp} from '../anim';
import {useT} from '../time';
import {Burst, Chip, Flood, Server, Shield3D, Tick, XMark} from '../components/parts';

/* ============ 7. KESIMPULAN (96.06 - 110.67 s) ============ */
export const S7: React.FC = () => {
  const t = useT();
  const titleE = sp(t, 96.6, 12, 110);
  const shrink = prog(t, 98.2, 98.9);
  const fs = lerp(150, 62, shrink);
  const ty = lerp(430, 80, shrink);
  const tx = lerp(960, 330, shrink);

  const atk = prog(t, 98.8, 102.0);
  const protect = prog(t, 106.4, 107.6);
  const cap = Math.max(0.18, atk) * (1 - protect * 0.65);
  const capCol = cap > 0.8 ? C.red : cap > 0.5 ? C.amber : C.green;
  const stress = Math.min(1, atk * 1.1) * (1 - protect);
  const blocked = t > 102.6 && t < 106.5;
  const bounce = prog(t, 102.6, 103.6);
  const R = 120;
  const L = 2 * Math.PI * R;
  const shieldY = lerp(-420, 0, protect);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: tx - 600, width: 1200, top: ty - fs / 2, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: fs, letterSpacing: -3, color: C.text, opacity: titleE, textShadow: `0 0 60px ${C.violet}77`}}>
        Kesimpulan
      </div>

      {t > 98.6 && (
        <>
          {/* pengguna asli */}
          <div style={{position: 'absolute', left: 150, top: 380, width: 260, textAlign: 'center', opacity: pr(t, 98.6, 99.2)}}>
            <div style={{width: 130, height: 130, margin: '0 auto', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #7dffbf, ${C.green})`, boxShadow: `0 0 50px ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 46, height: 46, borderRadius: '50%', background: '#06231a'}} />
            </div>
            <div style={{fontFamily: display, fontWeight: 700, fontSize: 34, color: C.green, marginTop: 14}}>Pengguna asli</div>
          </div>
          {/* permintaan hijau: berhenti/mantul saat diblokir */}
          {Array.from({length: 6}).map((_, i) => {
            const ph = (((t * 0.55 + i / 6) % 1) + 1) % 1;
            const maxX = blocked ? lerp(1, 0.55, bounce) : 1;
            const x = 420 + ph * 380 * maxX;
            return <div key={i} style={{position: 'absolute', left: x, top: 440 + Math.sin(i * 2) * 14, width: 16, height: 16, borderRadius: 4, background: blocked ? '#6e7ba8' : C.green, boxShadow: `0 0 12px ${blocked ? '#6e7ba8' : C.green}`, opacity: Math.min(1, ph * 6) * pr(t, 98.8, 99.2)}} />;
          })}
          {blocked && (
            <div style={{position: 'absolute', left: 560, top: 330, opacity: pr(t, 102.7, 103.2), transform: `scale(${0.5 + sp(t, 102.7, 9, 170) * 0.5})`}}>
              <XMark size={96} />
            </div>
          )}

          {/* server + banjir trafik */}
          <div style={{position: 'absolute', left: 1180, top: 560, width: 0, height: 0, perspective: 1400, opacity: pr(t, 98.6, 99.2)}}>
            <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'rotateX(10deg) rotateY(-16deg)'}}>
              <Flood t={t} sources={[[-760, -160, 100], [-760, 20, -60], [-760, 160, 80], [-700, -60, 160]]} target={[-30, 0, 0]} count={Math.round(120 * (atk * (1 - protect) + 0.0))} color={C.red} />
              <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: 'translate3d(-60px, -150px, 0) rotateY(-24deg)'}}>
                <Server t={t} stress={stress} units={4} scale={1.1} />
              </div>
              <div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `translate3d(-260px, ${-210 + shieldY}px, 140px)`, opacity: protect}}>
                <Shield3D size={210} color={C.green} rot={Math.sin(t * 1.2) * 25} />
              </div>
            </div>
          </div>

          {/* cincin kapasitas */}
          <div style={{position: 'absolute', left: 1180 - 140 + 40, top: 150, width: 280, textAlign: 'center', opacity: pr(t, 98.8, 99.4)}}>
            <svg width={280} height={280} viewBox="0 0 280 280" style={{position: 'absolute', left: 0, top: 0}}>
              <circle cx={140} cy={140} r={R} fill="none" stroke="#ffffff1a" strokeWidth={18} />
              <circle cx={140} cy={140} r={R} fill="none" stroke={capCol} strokeWidth={18} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - cap)} transform="rotate(-90 140 140)" style={{filter: `drop-shadow(0 0 14px ${capCol})`}} />
            </svg>
            <div style={{position: 'relative', top: 82, fontFamily: mono, fontWeight: 700, fontSize: 64, color: capCol}}>{Math.round(cap * 100)}%</div>
            <div style={{position: 'relative', top: 80, fontFamily: display, fontWeight: 500, fontSize: 26, color: C.dim}}>kapasitas</div>
          </div>
        </>
      )}

      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center'}}>
        {t >= 100.2 && t < 103 && <div style={{opacity: pr(t, 100.2, 100.7)}}><Chip text="Kapasitas layanan disalahgunakan" color={C.amber} size={52} /></div>}
        {t >= 103 && t < 106.4 && <div style={{opacity: pr(t, 103, 103.5)}}><Chip text="Pengguna asli tidak bisa mengakses" color={C.red} size={52} /></div>}
        {t >= 106.8 && <div style={{opacity: pr(t, 106.8, 107.3), display: 'flex', alignItems: 'center', gap: 16}}><Tick size={64} /><Chip text="Keamanan server + proteksi trafik" color={C.green} size={50} /></div>}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 8. PENUTUP (110.67 - 116.81 s) ============ */
export const S8: React.FC = () => {
  const t = useT();
  const sh = sp(t, 110.9, 11, 100);
  const finale = sp(t, 113.6, 10, 130);
  return (
    <AbsoluteFill>
      <Burst t={t} at={113.6} cx={960} cy={560} count={56} />
      {[0, 0.5, 1].map((o, i) => {
        const p = (((t * 0.5 + o) % 1) + 1) % 1;
        return <div key={i} style={{position: 'absolute', left: 960 - 300 - p * 600, top: 470 - 300 - p * 600, width: 600 + p * 1200, height: 600 + p * 1200, borderRadius: '50%', border: `4px solid ${C.green}`, opacity: (1 - p) * 0.35}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', fontFamily: display, fontWeight: 500, fontSize: 56, color: C.dim, opacity: pr(t, 111.2, 111.8)}}>
        Sekian penjelasan kali ini
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', perspective: 1500, opacity: Math.min(1, sh * 1.5), transform: `scale(${0.3 + sh * 0.7}) translateY(${Math.sin(t * 1.6) * 10}px)`}}>
        <Shield3D size={330} color={C.green} rot={t * 50} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', opacity: Math.min(1, finale * 1.5), transform: `scale(${0.6 + finale * 0.4})`}}>
        <div style={{fontFamily: display, fontWeight: 700, fontSize: 96, color: C.text, letterSpacing: -2, textShadow: `0 0 50px ${C.green}77`}}>Terus belajar</div>
        <div style={{marginTop: 10}}><Chip text="Cybersecurity!" color={C.green} size={70} /></div>
      </div>
    </AbsoluteFill>
  );
};
