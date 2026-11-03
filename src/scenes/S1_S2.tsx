import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, PAL} from '../theme';
import {display, mono} from '../fonts';
import {pr, prog, rnd, sp} from '../anim';
import {useT} from '../time';
import {Box, Burst, Tick, Warn, Wifi, XMark} from '../components/parts';

/* ============ 1. JUDUL (0 - 3.0 s) ============ */
export const S1: React.FC = () => {
  const t = useT();
  const e = sp(t, 0.05, 10, 110);
  const rot = (1 - e) * 80 + Math.sin(t * 1.8) * 12;
  return (
    <AbsoluteFill>
      <Burst t={t} at={0.05} cx={960} cy={460} count={46} />
      {Array.from({length: 9}).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + t * 0.25;
        const r = 560 + rnd(i) * 160;
        const s = 40 + rnd(i + 3) * 50;
        const pe = sp(t, 0.2 + i * 0.05);
        return (
          <div key={i} style={{position: 'absolute', left: 960 + Math.cos(a) * r * 1.25, top: 470 + Math.sin(a) * r * 0.42, perspective: 600, opacity: pe}}>
            <div style={{transformStyle: 'preserve-3d', transform: `rotateX(${t * 60 + i * 40}deg) rotateY(${t * 80 + i * 30}deg) scale(${pe})`}}>
              <Box w={s} h={s} d={s} color={PAL[i % 5]} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 76, color: C.dim, opacity: e}}>
        Apa itu
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', perspective: 1500}}>
        <div style={{display: 'grid', transformStyle: 'preserve-3d', transform: `rotateY(${rot}deg) rotateX(-8deg) scale(${0.4 + e * 0.6})`, opacity: Math.min(1, e * 2)}}>
          {Array.from({length: 22}).map((_, i) => (
            <div
              key={i}
              style={{
                gridArea: '1 / 1',
                fontFamily: display,
                fontWeight: 700,
                fontSize: 340,
                letterSpacing: -10,
                lineHeight: 1,
                color: i === 0 ? C.cyan : `rgb(${20 + i * 2}, ${50 + i * 3}, ${120 + i * 3})`,
                transform: `translateZ(${-i * 7}px)`,
                textShadow: i === 0 ? `0 0 60px ${C.cyan}99` : undefined,
              }}
            >
              DDoS
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: display, fontWeight: 700, fontSize: 62, color: C.text, opacity: pr(t, 0.9, 1.5), transform: `translateY(${(1 - pr(t, 0.9, 1.5)) * 30}px)`}}>
        dan bagaimana cara mengatasinya?
      </div>
    </AbsoluteFill>
  );
};

/* ============ 2. HOOK: website tidak bisa diakses (3.0 - 12.2 s) ============ */
export const S2: React.FC = () => {
  const t = useT();
  const enter = sp(t, 3.3, 14, 90);
  const alertT = t - 9.05;
  const glitch = alertT > 0 && alertT < 3 ? Math.sin(t * 40) * 10 * Math.exp(-alertT * 1.2) : 0;
  const loading = t < 5.9;
  const float = Math.sin(t * 1.4) * 8;
  const wifiE = sp(t, 6.4, 12, 130) * (1 - pr(t, 8.9, 9.4));
  const alertE = sp(t, 9.1, 9, 120);
  const flash = alertT > 0 ? Math.max(0, 0.45 - alertT * 0.6) : 0;
  return (
    <AbsoluteFill>
      {/* jendela browser 3D */}
      <div style={{position: 'absolute', left: 110, top: 190, perspective: 1800}}>
        <div
          style={{
            width: 1000,
            height: 640,
            borderRadius: 26,
            background: C.panel,
            border: `2px solid ${alertT > 0 ? C.red : C.cyan}66`,
            boxShadow: `0 60px 120px #000a, 0 0 70px ${alertT > 0 ? C.red : C.cyan}33`,
            transform: `rotateY(${-16 + (1 - enter) * 60 + float * 0.3}deg) rotateX(${5 + (1 - enter) * 20}deg) translateY(${float + (1 - enter) * 200}px) translateX(${glitch}px)`,
            opacity: Math.min(1, enter * 2),
            overflow: 'hidden',
          }}
        >
          <div style={{height: 70, background: '#0A1028', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12}}>
            {[C.red, C.amber, C.green].map((c) => (
              <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
            ))}
            <div style={{marginLeft: 20, flex: 1, height: 38, borderRadius: 19, background: '#1A2455', fontFamily: mono, fontSize: 22, color: C.dim, display: 'flex', alignItems: 'center', padding: '0 22px'}}>
              https://www.tokoku.id
            </div>
          </div>
          {loading ? (
            <div style={{padding: 40}}>
              {[0.9, 0.6, 0.75].map((w, i) => (
                <div key={i} style={{height: 40, width: `${w * 100}%`, borderRadius: 12, marginBottom: 26, background: `linear-gradient(90deg, #1B2757 ${((t * 80 + i * 30) % 140) - 20}%, #2E3F86 ${((t * 80 + i * 30) % 140)}%, #1B2757 ${((t * 80 + i * 30) % 140) + 20}%)`}} />
              ))}
              <div style={{display: 'flex', justifyContent: 'center', marginTop: 80}}>
                <div style={{width: 110, height: 110, borderRadius: '50%', border: `10px solid #ffffff18`, borderTopColor: C.cyan, transform: `rotate(${t * 420}deg)`}} />
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 70, opacity: pr(t, 5.9, 6.3)}}>
              <XMark size={140} />
              <div style={{fontFamily: display, fontWeight: 700, fontSize: 56, color: C.text, marginTop: 30}}>Situs ini tidak dapat dijangkau</div>
              <div style={{fontFamily: mono, fontSize: 26, color: C.red, marginTop: 16}}>ERR_CONNECTION_TIMED_OUT</div>
            </div>
          )}
        </div>
      </div>

      {/* koneksi normal */}
      <div style={{position: 'absolute', left: 1210, top: 250, perspective: 1600, opacity: wifiE}}>
        <div style={{width: 560, height: 360, borderRadius: 30, background: C.panel, border: `2px solid ${C.green}77`, boxShadow: `0 40px 90px #000a, 0 0 60px ${C.green}33`, transform: `rotateY(${14 - wifiE * 4}deg) translateY(${(1 - wifiE) * 120}px) scale(${0.7 + wifiE * 0.3})`, padding: 34, textAlign: 'center'}}>
          <Wifi size={150} color={C.green} />
          <div style={{fontFamily: display, fontWeight: 700, fontSize: 46, color: C.text, marginTop: 6}}>Koneksi internet</div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 8}}>
            <Tick size={44} />
            <span style={{fontFamily: display, fontWeight: 700, fontSize: 44, color: C.green}}>Normal</span>
          </div>
        </div>
      </div>

      {/* alarm DDoS */}
      <div style={{position: 'absolute', left: 1180, top: 210, width: 640, textAlign: 'center', opacity: Math.min(1, alertE * 1.5), transform: `scale(${0.3 + alertE * 0.7}) rotate(${(1 - alertE) * -20}deg)`}}>
        <div style={{display: 'flex', justifyContent: 'center', filter: `drop-shadow(0 0 40px ${C.red})`, transform: `translateY(${Math.sin(t * 6) * 6}px)`}}>
          <Warn size={330} />
        </div>
        <div style={{fontFamily: display, fontWeight: 700, fontSize: 96, color: C.red, textShadow: `0 0 40px ${C.red}99`, letterSpacing: -2, marginTop: 10}}>Serangan DDoS?</div>
      </div>
      <AbsoluteFill style={{background: C.red, opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
