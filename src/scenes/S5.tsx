import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {lerp, pr, prog, rnd, sp, easeInOut} from '../anim';
import {useT} from '../time';
import {Chip, Meter, Server} from '../components/parts';

/* ============ 5. BOTNET + SERVER KEWALAHAN (45.05 - 62.93 s) ============ */
type V = [number, number, number];
const D = 2200;
const proj = (p: V, ang: number, cx: number, cy: number, sc: number) => {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const x = (p[0] * c + p[2] * s) * sc;
  const z = (-p[0] * s + p[2] * c) * sc;
  const tilt = 0.3;
  const y = p[1] * sc * Math.cos(tilt) - z * Math.sin(tilt);
  const zz = p[1] * sc * Math.sin(tilt) + z * Math.cos(tilt);
  const k = D / (D + zz);
  return {x: cx + x * k, y: cy + y * k, k, z: zz};
};

const N = 36;
const bots: V[] = Array.from({length: N}, (_, i) => {
  const th = rnd(i) * Math.PI * 2;
  const ph = Math.acos(2 * rnd(i + 20) - 1);
  const r = 380 + rnd(i + 40) * 200;
  return [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.62, r * Math.sin(ph) * Math.sin(th)];
});
const ATTACKER: V = [-520, -300, -80];
const infectAt = (i: number) => 46.0 + i * 0.075;

export const S5: React.FC = () => {
  const t = useT();
  const ang = (t - 45) * 0.06;
  const shift = easeInOut(prog(t, 53.8, 54.9));
  const cx = lerp(1000, 610, shift);
  const cy = lerp(500, 500, shift);
  const sc = lerp(1, 0.82, shift);
  const stress = t < 50 ? 0.12 : Math.min(1, 0.2 + 0.8 * prog(t, 50, 60));
  const target = proj([0, 0, 0], ang, cx, cy, sc);
  const att = proj(ATTACKER, ang, cx, cy, sc);
  const attE = sp(t, 45.4, 12, 120);

  const order = bots.map((b, i) => ({i, p: proj(b, ang, cx, cy, sc)})).sort((a, b) => b.p.z - a.p.z);
  const status = t < 56 ? ['Online', C.green] : t < 60.3 ? ['Terbebani', C.amber] : t < 61.6 ? ['Lambat', C.red] : ['Tidak dapat diakses', C.red];
  const hud = sp(t, 54.2, 14, 90);
  const caption = t < 49.8 ? 'Botnet = perangkat yang sudah dikuasai penyerang' : 'Trafik dikirim secara bersamaan ke target';

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, top: 50, fontFamily: display, fontWeight: 700, fontSize: 64, color: C.text, opacity: pr(t, 45.2, 45.8)}}>Botnet</div>
      {t > 46 && t < 54.2 && (
        <div style={{position: 'absolute', left: 80, top: 135, opacity: pr(t, 46.1, 46.6) * (1 - pr(t, 53.8, 54.2))}}>
          <Chip text={caption} color={t < 49.8 ? C.amber : C.red} size={34} />
        </div>
      )}

      {/* garis kendali penyerang -> bot */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {order.map(({i, p}) => {
          const a = infectAt(i);
          const e = prog(t, a - 0.25, a);
          if (e <= 0) return null;
          const x2 = lerp(att.x, p.x, e);
          const y2 = lerp(att.y, p.y, e);
          const hot = t - a;
          return <line key={i} x1={att.x} y1={att.y} x2={x2} y2={y2} stroke={C.red} strokeWidth={2.5} strokeDasharray="8 8" strokeDashoffset={-t * 60} opacity={hot < 0.5 ? 0.9 : 0.22} />;
        })}
      </svg>

      {/* bot (perangkat) */}
      {order.map(({i, p}) => {
        const inf = t >= infectAt(i);
        const pulse = inf ? Math.max(0, 1 - (t - infectAt(i)) * 3) : 0;
        const laptop = i % 3 === 0;
        const w = (laptop ? 70 : 38) * p.k;
        const h = (laptop ? 46 : 62) * p.k;
        const col = inf ? C.red : '#5B678F';
        return (
          <div key={i} style={{position: 'absolute', left: p.x - w / 2, top: p.y - h / 2, width: w, height: h, borderRadius: 8 * p.k, background: `linear-gradient(160deg, ${col}, #1a1f3c)`, border: `${2 * p.k}px solid ${inf ? '#ffb0bf' : '#8B97C4'}`, boxShadow: inf ? `0 0 ${24 + pulse * 50}px ${C.red}` : 'none', transform: `scale(${1 + pulse * 0.5})`, opacity: Math.min(1, p.k * 0.9 + 0.1)}}>
            <div style={{position: 'absolute', inset: 5 * p.k, borderRadius: 4 * p.k, background: inf ? '#2a0711' : '#0e1330'}} />
          </div>
        );
      })}

      {/* paket serangan dari bot ke target */}
      {t > 49.2 &&
        order.flatMap(({i, p}) => {
          const per = t < 54 ? 2 : 4;
          return Array.from({length: per}).map((_, k) => {
            const ph = (((t * 0.8 + rnd(i * 5 + k) + k * 0.37) % 1) + 1) % 1;
            const x = lerp(p.x, target.x, ph);
            const y = lerp(p.y, target.y, ph);
            const a = Math.min(1, ph * 5) * Math.min(1, (1 - ph) * 5) * pr(t, 49.2, 50);
            const s = 10 * (0.6 + (1 - ph) * 0.6);
            return <div key={`${i}-${k}`} style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: 2, background: k % 2 ? '#FFB020' : C.red, boxShadow: `0 0 10px ${C.red}`, opacity: a}} />;
          });
        })}

      {/* penyerang */}
      <div style={{position: 'absolute', left: att.x - 70, top: att.y - 50, width: 140, opacity: attE, transform: `scale(${attE * att.k})`}}>
        <div style={{width: 140, height: 92, borderRadius: 12, background: '#12081a', border: `3px solid ${C.red}`, boxShadow: `0 0 50px ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.red}}>{'</>'}</div>
        <div style={{textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 28, color: C.red, marginTop: 10}}>Penyerang</div>
      </div>

      {/* server target 3D */}
      <div style={{position: 'absolute', left: target.x, top: target.y, perspective: 1300, opacity: pr(t, 45.3, 45.9)}}>
        <div style={{transformStyle: 'preserve-3d', transform: `translate(-120px, -111px) scale(${sc * 1.05}) rotateY(${ang * 57}deg) rotateX(-12deg)`}}>
          <Server t={t} stress={stress} units={3} />
        </div>
        <div style={{position: 'absolute', left: -150, top: 130, width: 300, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 32, color: C.text}}>Server target</div>
      </div>

      {/* panel status server */}
      <div style={{position: 'absolute', left: 1240, top: 130, perspective: 1800, opacity: Math.min(1, hud * 1.5)}}>
        <div style={{width: 600, borderRadius: 32, background: C.panel, border: `2px solid ${C.red}77`, boxShadow: `0 50px 100px #000a, 0 0 70px ${C.red}33`, padding: '34px 40px', transform: `rotateY(${-16 + (1 - hud) * 50}deg) translateX(${(1 - hud) * 300}px)`}}>
          <div style={{fontFamily: display, fontWeight: 700, fontSize: 40, color: C.text, marginBottom: 24}}>Kondisi server</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
            <Meter label="Bandwidth" value={pr(t, 56.0, 57.4)} w={520} />
            <Meter label="CPU" value={pr(t, 57.3, 58.7)} w={520} />
            <Meter label="RAM" value={pr(t, 58.4, 59.8)} w={520} />
            <Meter label="Kapasitas koneksi" value={pr(t, 59.4, 60.8)} w={520} />
          </div>
          <div style={{marginTop: 36, display: 'flex', alignItems: 'center', gap: 18}}>
            <span style={{fontFamily: display, fontWeight: 500, fontSize: 30, color: C.dim}}>Website:</span>
            <Chip text={status[0]} color={status[1]} size={36} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
