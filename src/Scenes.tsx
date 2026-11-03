import React from 'react';
import {Easing, interpolate} from 'remotion';
import {
  ArrowRight,
  BookIcon,
  Body,
  Bullet,
  CheckIcon,
  ChipIcon,
  FileIcon,
  FolderIcon,
  Label,
  Phase,
  PhoneIcon,
  Reveal,
  SceneFade,
  Typed,
  VideoFileIcon,
  Window,
  cardStyle,
  lin,
  prog,
  useScene,
  useT,
} from './lib';
import {C, MONO} from './theme';
import {CUES} from './timing';

const RED = '#A93A3A';
const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* =================================================================== JUDUL */

export const TitleScene: React.FC = () => {
  const t = useT();
  const lines = ['CARA MEMBUAT VIDEO', 'MOTION GRAPHICS', 'MENGGUNAKAN CLAUDE AI', 'DAN REMOTION'];
  const ruleW = prog(t, 1.7, 0.6) * 240;
  return (
    <SceneFade fadeIn={false}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
          overflow: 'hidden',
        }}
      >
        {/* kisi halus */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* ornamen kanan */}
        <div
          style={{
            position: 'absolute',
            right: -140,
            top: 140,
            width: 760,
            height: 760,
            border: '2px solid rgba(255,255,255,0.09)',
            borderRadius: 48,
            transform: 'rotate(12deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 280,
            width: 520,
            height: 520,
            border: `2px solid rgba(184,147,47,0.35)`,
            borderRadius: 36,
            transform: 'rotate(12deg)',
          }}
        />
        {/* garis emas vertikal */}
        <Reveal
          at={0.1}
          dy={0}
          dur={0.9}
          style={{
            position: 'absolute',
            left: 120,
            top: 210,
            width: 8,
            height: 660,
            background: C.gold,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 176,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Reveal at={0.15}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: '0.24em',
                color: C.gold,
                marginBottom: 36,
              }}
            >
              PANDUAN PRAKTIS  |  TUTORIAL VIDEO
            </div>
          </Reveal>

          {lines.map((l, i) => (
            <Reveal key={l} at={0.35 + i * 0.28} dy={44} dur={0.8}>
              <div
                style={{
                  fontSize: 104,
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: '0.01em',
                  color: i === 3 ? C.gold : C.white,
                }}
              >
                {l}
              </div>
            </Reveal>
          ))}

          <div style={{height: 6, width: ruleW, background: C.gold, margin: '44px 0 32px'}} />

          <Reveal at={CUES.title.sub}>
            <div style={{fontSize: 38, fontWeight: 500, color: '#C6D3E8'}}>
              Dari naskah hingga video jadi: panduan langkah demi langkah
            </div>
          </Reveal>
        </div>
      </div>
    </SceneFade>
  );
};

/* ================================================================ PENGANTAR */

const FlowCard: React.FC<{at: number; no: string; title: string; sub: string}> = ({
  at,
  no,
  title,
  sub,
}) => (
  <Reveal
    at={at}
    dy={36}
    style={{
      ...cardStyle,
      flex: 1,
      height: 280,
      padding: '34px 38px',
      boxSizing: 'border-box',
      borderTop: `8px solid ${C.navy2}`,
    }}
  >
    <div style={{fontSize: 24, fontWeight: 800, letterSpacing: '0.16em', color: C.gold}}>{no}</div>
    <div style={{fontSize: 50, fontWeight: 800, color: C.navy, marginTop: 18, lineHeight: 1.1}}>
      {title}
    </div>
    <div style={{fontSize: 30, color: C.muted, marginTop: 16, fontWeight: 500}}>{sub}</div>
  </Reveal>
);

export const IntroScene: React.FC = () => {
  const t = useT();
  const c = CUES.intro;
  return (
    <SceneFade>
      <Body>
        <Reveal at={c.head}>
          <Label color={C.gold}>Pengantar</Label>
          <div style={{fontSize: 62, fontWeight: 800, color: C.navy, lineHeight: 1.15}}>
            Membuat Video Motion Graphics dengan Bantuan AI
          </div>
        </Reveal>

        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 60}}>
          <FlowCard at={c.cards[0]} no="01" title="Naskah" sub="Dibuat di ChatGPT" />
          <Reveal at={c.cards[1] - 0.1} dx={-20} dy={0}>
            <ArrowRight />
          </Reveal>
          <FlowCard at={c.cards[1]} no="02" title="Kode Video" sub="Dibuat oleh Claude AI" />
          <Reveal at={c.cards[2] - 0.1} dx={-20} dy={0}>
            <ArrowRight />
          </Reveal>
          <FlowCard at={c.cards[2]} no="03" title="Video Jadi" sub="Dirender oleh Remotion" />
        </div>

        <Reveal at={c.callout} style={{marginTop: 60}}>
          <div
            style={{
              ...cardStyle,
              padding: '32px 44px',
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              borderLeft: `10px solid ${C.gold}`,
            }}
          >
            <div style={{position: 'relative', fontSize: 46, fontWeight: 700, color: C.navy}}>
              Animasi secara manual dari nol
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '56%',
                  height: 6,
                  borderRadius: 3,
                  background: RED,
                  width: `${prog(t, c.strike, 0.5) * 100}%`,
                }}
              />
            </div>
            <Reveal at={c.strike + 0.3} dx={20} dy={0}>
              <div
                style={{
                  background: C.navy,
                  color: C.white,
                  fontSize: 28,
                  fontWeight: 700,
                  padding: '12px 28px',
                  borderRadius: 999,
                }}
              >
                Tidak diperlukan
              </div>
            </Reveal>
          </div>
        </Reveal>
      </Body>
    </SceneFade>
  );
};

/* ============================================================ KERANGKA LANGKAH */

const StepScene: React.FC<{
  n: number;
  title: string;
  bullets: {text: string; at: number}[];
  children: React.ReactNode;
}> = ({n, title, bullets, children}) => {
  const {start} = useScene();
  return (
    <SceneFade>
      <Body>
        <div style={{display: 'flex', gap: 64, height: '100%'}}>
          <div style={{width: 640, flex: 'none'}}>
            <Reveal at={start + 0.15} dy={0} dx={-30} style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 14,
                  background: C.navy,
                  color: C.white,
                  fontSize: 50,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {n}
              </div>
              <div style={{fontSize: 26, fontWeight: 800, letterSpacing: '0.2em', color: C.gold}}>
                LANGKAH {n} DARI 5
              </div>
            </Reveal>

            <Reveal at={start + 0.3} dy={26} style={{marginTop: 34}}>
              <div style={{fontSize: 62, fontWeight: 800, lineHeight: 1.12, color: C.navy}}>{title}</div>
              <div style={{width: 96, height: 6, background: C.gold, marginTop: 28}} />
            </Reveal>

            <div style={{marginTop: 48}}>
              {bullets.map((b) => (
                <Bullet key={b.text} at={b.at} text={b.text} />
              ))}
            </div>
          </div>

          <div style={{flex: 1, position: 'relative'}}>{children}</div>
        </div>
      </Body>
    </SceneFade>
  );
};

const bubble = (bg: string): React.CSSProperties => ({
  background: bg,
  borderRadius: 12,
  padding: '22px 26px',
  fontSize: 30,
  lineHeight: 1.45,
  color: C.ink,
  minHeight: 140,
  boxSizing: 'border-box',
});

/* ==================================================================== LANGKAH 1 */

const Skeleton: React.FC<{w: number; at: number}> = ({w, at}) => {
  const t = useT();
  return (
    <div
      style={{
        height: 16,
        borderRadius: 8,
        background: C.line,
        marginBottom: 14,
        width: `${w * prog(t, at, 0.5)}%`,
      }}
    />
  );
};

export const Step1Scene: React.FC = () => {
  const c = CUES.step1;
  const chips: [string, string][] = [
    ['Topik', 'Motion Graphics'],
    ['Durasi', '2 menit'],
    ['Gaya Bahasa', 'Formal'],
  ];
  return (
    <StepScene
      n={1}
      title="Buka ChatGPT"
      bullets={[
        {text: 'Buka ChatGPT', at: c.bullets[0]},
        {text: 'Buat naskah video yang ingin dijadikan motion graphics', at: c.bullets[1]},
        {text: 'Tentukan topik, durasi, dan gaya bahasa', at: c.bullets[2]},
      ]}
    >
      <Window title="ChatGPT" at={c.window} h={840}>
        <Label>Perintah</Label>
        <div style={bubble(C.sky)}>
          <Typed
            text="Buatkan naskah video tutorial berdurasi 2 menit dengan gaya bahasa formal."
            from={c.typeStart}
            to={c.typeEnd}
          />
        </div>

        <Reveal at={c.reply} style={{marginTop: 28}}>
          <Label>Naskah dihasilkan</Label>
          <div
            style={{
              ...bubble(C.white),
              minHeight: 0,
              border: `1px solid ${C.line}`,
              padding: '24px 28px 14px',
            }}
          >
            <div style={{fontSize: 26, fontWeight: 700, color: C.navy, marginBottom: 20}}>
              Naskah Video: Cara Membuat Video Motion Graphics
            </div>
            {[96, 88, 92, 70].map((w, i) => (
              <Skeleton key={i} w={w} at={c.reply + 0.2 + i * 0.18} />
            ))}
          </div>
        </Reveal>

        <div style={{display: 'flex', gap: 18, marginTop: 28}}>
          {chips.map(([l, v], i) => (
            <Reveal
              key={l}
              at={c.chips[i]}
              dy={20}
              style={{
                flex: 1,
                background: C.goldSoft,
                border: `1px solid ${C.gold}`,
                borderRadius: 12,
                padding: '18px 22px',
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  marginBottom: 6,
                }}
              >
                {l}
              </div>
              <div style={{fontSize: 30, fontWeight: 700, color: C.navy}}>{v}</div>
            </Reveal>
          ))}
        </div>
      </Window>
    </StepScene>
  );
};

/* ==================================================================== LANGKAH 2 */

export const Step2Scene: React.FC = () => {
  const c = CUES.step2;
  const items = ['Animasi teks', 'Transisi', 'Visual', 'Elemen pendukung'];
  return (
    <StepScene
      n={2}
      title="Masuk ke Claude AI"
      bullets={[
        {text: 'Buka Claude AI', at: c.bullets[0]},
        {text: 'Masukkan naskah yang sudah dibuat', at: c.bullets[1]},
        {text: 'Minta Claude mengubah naskah menjadi kode video Remotion', at: c.bullets[2]},
      ]}
    >
      <Window title="Claude AI" at={c.window} h={840}>
        <Reveal
          at={c.attach}
          dy={20}
          style={{
            ...cardStyle,
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '18px 26px',
            marginBottom: 30,
          }}
        >
          <FileIcon size={46} />
          <div style={{fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.navy}}>naskah-video.txt</div>
          <div style={{marginLeft: 'auto', fontSize: 22, color: C.muted, fontWeight: 500}}>
            Naskah dari ChatGPT
          </div>
        </Reveal>

        <Label>Instruksi</Label>
        <div style={{...bubble(C.sky), minHeight: 130}}>
          <Typed
            text="Ubah naskah ini menjadi kode video menggunakan Remotion."
            from={c.typeStart}
            to={c.typeEnd}
          />
        </div>

        <Reveal at={c.itemsHead} style={{marginTop: 34}}>
          <Label color={C.gold}>Kode yang dihasilkan</Label>
        </Reveal>
        {items.map((it, i) => (
          <Reveal
            key={it}
            at={c.items[i]}
            dx={-24}
            dy={0}
            dur={0.45}
            style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16}}
          >
            <CheckIcon size={34} />
            <div style={{fontSize: 32, fontWeight: 600, color: C.ink}}>{it}</div>
          </Reveal>
        ))}
      </Window>
    </StepScene>
  );
};

/* ================================================= BAGIAN TERMINAL (dipakai langkah 3 dan 4) */

const TermPrompt: React.FC<{text: string; from: number; to: number}> = ({text, from, to}) => {
  const t = useT();
  if (t < from - 0.05) return null;
  return (
    <div style={{fontFamily: MONO, fontSize: 30, color: C.white, marginBottom: 14, lineHeight: 1.4}}>
      <span style={{color: C.gold, marginRight: 14, fontWeight: 700}}>$</span>
      <Typed text={text} from={from} to={to} />
    </div>
  );
};

const TermOut: React.FC<{at: number; color?: string; children: React.ReactNode}> = ({
  at,
  color = C.termText,
  children,
}) => {
  const t = useT();
  if (t < at) return null;
  return (
    <Reveal
      at={at}
      dur={0.25}
      dy={0}
      style={{fontFamily: MONO, fontSize: 26, color, marginBottom: 10, lineHeight: 1.4}}
    >
      {children}
    </Reveal>
  );
};

const TermBar: React.FC<{from: number; to: number; label: string; total?: number}> = ({
  from,
  to,
  label,
  total,
}) => {
  const t = useT();
  if (t < from) return null;
  const p = lin(t, from, to);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        fontFamily: MONO,
        fontSize: 26,
        color: C.termText,
        marginBottom: 14,
      }}
    >
      <div style={{width: 250}}>{label}</div>
      <div style={{flex: 1, height: 16, borderRadius: 8, background: '#1B3560', overflow: 'hidden'}}>
        <div style={{width: `${p * 100}%`, height: '100%', background: C.gold}} />
      </div>
      <div style={{width: 190, textAlign: 'right'}}>
        {total ? `${Math.round(p * total)}/${total}` : `${Math.round(p * 100)}%`}
      </div>
    </div>
  );
};

/* ==================================================================== LANGKAH 3 */

const ZipCard: React.FC = () => {
  const t = useT();
  const c = CUES.step3;
  const p = lin(t, c.dl[0], c.dl[1]);
  const state = t < c.dl[0] ? 0 : t < c.dl[1] ? 1 : 2;
  const pill: React.CSSProperties = {
    minWidth: 220,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 700,
    padding: '14px 26px',
    borderRadius: 999,
    boxSizing: 'border-box',
  };
  return (
    <Reveal
      at={c.zip}
      dy={30}
      style={{
        ...cardStyle,
        height: 196,
        padding: '28px 40px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 34,
      }}
    >
      <div
        style={{
          width: 88,
          height: 112,
          borderRadius: 10,
          border: `3px solid ${C.navy2}`,
          background: C.white,
          overflow: 'hidden',
          flex: 'none',
          position: 'relative',
        }}
      >
        <div style={{height: 22, background: C.gold}} />
        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 30,
            fontWeight: 800,
            color: C.navy,
            letterSpacing: '0.04em',
          }}
        >
          ZIP
        </div>
      </div>

      <div style={{flex: 1}}>
        <div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700, color: C.navy}}>
          project-remotion.zip
        </div>
        <div style={{fontSize: 22, color: C.muted, marginTop: 8, fontWeight: 500}}>
          Project Remotion lengkap, siap diekstrak
        </div>
        {state === 1 ? (
          <div style={{marginTop: 18, height: 12, borderRadius: 6, background: C.line, overflow: 'hidden'}}>
            <div style={{width: `${p * 100}%`, height: '100%', background: C.navy2}} />
          </div>
        ) : null}
      </div>

      {state === 0 ? (
        <div style={{...pill, background: C.goldSoft, color: C.gold, border: `1px solid ${C.gold}`}}>
          Siap diunduh
        </div>
      ) : state === 1 ? (
        <div style={{...pill, background: C.sky, color: C.navy2}}>Mengunduh {Math.round(p * 100)}%</div>
      ) : (
        <div
          style={{
            ...pill,
            background: '#E5F2EA',
            color: C.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <CheckIcon size={26} /> Terunduh
        </div>
      )}
    </Reveal>
  );
};

export const Step3Scene: React.FC = () => {
  const c = CUES.step3;
  const lines = [
    '  creating: project-remotion/',
    '  inflating: project-remotion/package.json',
    '  inflating: project-remotion/src/Root.tsx',
    '  inflating: project-remotion/public/voiceover.mp3',
  ];
  return (
    <StepScene
      n={3}
      title="Unduh Kode Project"
      bullets={[
        {text: 'Claude selesai membuat kode', at: c.bullets[0]},
        {text: 'Minta project dikemas menjadi file ZIP', at: c.bullets[1]},
        {text: 'Unduh file ZIP tersebut', at: c.bullets[2]},
        {text: 'Ekstrak melalui terminal', at: c.bullets[3]},
      ]}
    >
      <ZipCard />
      <div style={{position: 'absolute', left: 0, right: 0, top: 224}}>
        <Window title="Terminal" at={c.term} h={616} dark>
          <TermPrompt text="unzip project-remotion.zip" from={c.typeStart} to={c.typeEnd} />
          {lines.map((l, i) => (
            <TermOut key={l} at={c.out + i * 0.4}>
              {l}
            </TermOut>
          ))}
          <TermOut at={c.out + 1.8} color="#6FCF97">
            Selesai mengekstrak project.
          </TermOut>
        </Window>
      </div>
    </StepScene>
  );
};

/* ==================================================================== LANGKAH 4 */

export const Step4Scene: React.FC = () => {
  const c = CUES.step4;
  return (
    <StepScene
      n={4}
      title="Install Remotion dan Render Video"
      bullets={[
        {text: 'Masuk ke direktori project melalui terminal', at: c.bullets[0]},
        {text: 'Install semua dependency yang dibutuhkan', at: c.bullets[1]},
        {text: 'Jalankan perintah render Remotion', at: c.bullets[2]},
      ]}
    >
      <Window title="Terminal" at={c.term} h={840} dark>
        <TermPrompt text="cd project-remotion" from={c.cd[0]} to={c.cd[1]} />
        <TermPrompt text="npm install" from={c.install[0]} to={c.install[1]} />
        <TermBar from={c.installBar[0]} to={c.installBar[1]} label="Menginstal" />
        <TermOut at={c.installDone} color="#6FCF97">
          added 312 packages in 14s
        </TermOut>
        <div style={{height: 18}} />
        <TermPrompt text="npx remotion render Main out/video.mp4" from={c.render[0]} to={c.render[1]} />
        <TermBar from={c.renderBar[0]} to={c.renderBar[1]} label="Rendering" total={3420} />
        <TermOut at={c.renderDone} color="#6FCF97">
          Selesai: out/video.mp4
        </TermOut>
      </Window>
    </StepScene>
  );
};

/* ==================================================================== LANGKAH 5 */

const Ring: React.FC = () => {
  const t = useT();
  const [a, b] = CUES.step5.ring;
  const p = interpolate(t, [a, b], [0, 1], {...clampOpts, easing: Easing.inOut(Easing.quad)});
  const r = 140;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{position: 'relative', width: 380, height: 380, flex: 'none'}}>
      <svg width={380} height={380} viewBox="0 0 380 380">
        <circle cx={190} cy={190} r={r} fill="none" stroke={C.line} strokeWidth={24} />
        <circle
          cx={190}
          cy={190}
          r={r}
          fill="none"
          stroke={C.navy2}
          strokeWidth={24}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={(1 - p) * circ}
          transform="rotate(-90 190 190)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{fontSize: 86, fontWeight: 800, color: C.navy, lineHeight: 1}}>
          {Math.round(p * 100)}%
        </div>
        <div style={{fontSize: 24, color: C.muted, fontWeight: 600, marginTop: 10}}>
          {p >= 1 ? 'Selesai' : 'Rendering video'}
        </div>
      </div>
    </div>
  );
};

const FactorCard: React.FC<{at: number; title: string; sub: string}> = ({at, title, sub}) => (
  <Reveal
    at={at}
    dx={40}
    dy={0}
    style={{
      ...cardStyle,
      borderLeft: `10px solid ${C.gold}`,
      padding: '24px 32px',
      marginBottom: 22,
    }}
  >
    <div style={{fontSize: 34, fontWeight: 800, color: C.navy}}>{title}</div>
    <div style={{fontSize: 24, color: C.muted, marginTop: 6, fontWeight: 500}}>{sub}</div>
  </Reveal>
);

const TreeRow: React.FC<{
  at: number;
  depth: number;
  kind: 'folder' | 'video';
  name: string;
  note?: string;
}> = ({at, depth, kind, name, note}) => (
  <Reveal
    at={at}
    dx={-20}
    dy={0}
    dur={0.45}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      height: 78,
      marginBottom: 12,
      marginLeft: depth * 60,
      padding: '0 24px',
      borderRadius: 12,
      background: note ? C.goldSoft : 'transparent',
      border: note ? `2px solid ${C.gold}` : '2px solid transparent',
    }}
  >
    {kind === 'folder' ? <FolderIcon size={44} /> : <VideoFileIcon size={44} />}
    <div style={{fontFamily: MONO, fontSize: 34, fontWeight: note ? 700 : 500, color: C.navy}}>{name}</div>
    {note ? (
      <div
        style={{
          marginLeft: 'auto',
          background: C.navy,
          color: C.white,
          fontSize: 22,
          fontWeight: 700,
          padding: '8px 20px',
          borderRadius: 999,
        }}
      >
        {note}
      </div>
    ) : null}
  </Reveal>
);

export const Step5Scene: React.FC = () => {
  const c = CUES.step5;
  return (
    <StepScene
      n={5}
      title="Tunggu Proses Rendering Selesai"
      bullets={[
        {text: 'Rendering membutuhkan waktu', at: c.bullets[0]},
        {text: 'Video tersedia di folder output project', at: c.bullets[1]},
      ]}
    >
      <Phase from={c.ring[0] - 0.1} to={c.files[0] - 0.1}>
        <Reveal at={c.ring[0]} style={{marginBottom: 30}}>
          <Label color={C.gold}>Faktor yang memengaruhi waktu render</Label>
        </Reveal>
        <div style={{display: 'flex', alignItems: 'center', gap: 56, marginTop: 40}}>
          <Reveal at={c.ring[0] + 0.1} dy={30} style={{flex: 'none'}}>
            <Ring />
          </Reveal>
          <div style={{flex: 1}}>
            <FactorCard at={c.factors[0]} title="Durasi video" sub="Semakin panjang, semakin lama" />
            <FactorCard at={c.factors[1]} title="Kompleksitas animasi" sub="Efek dan elemen visual yang banyak" />
            <FactorCard at={c.factors[2]} title="Spesifikasi perangkat" sub="CPU dan RAM menentukan kecepatan" />
          </div>
        </div>
      </Phase>

      <Phase from={c.files[0] - 0.1} to={999}>
        <Window title="Folder project" at={c.files[0]} h={520}>
          <TreeRow at={c.files[0]} depth={0} kind="folder" name="project-remotion" />
          <TreeRow at={c.files[1]} depth={1} kind="folder" name="src" />
          <TreeRow at={c.files[2]} depth={1} kind="folder" name="public" />
          <TreeRow at={c.files[3]} depth={1} kind="folder" name="out" />
          <TreeRow at={c.video} depth={2} kind="video" name="video.mp4" note="Hasil render" />
        </Window>
      </Phase>
    </StepScene>
  );
};

/* ==================================================================== PENUTUP */

const CatCard: React.FC<{at: number; icon: React.ReactNode; title: string; sub: string}> = ({
  at,
  icon,
  title,
  sub,
}) => (
  <Reveal
    at={at}
    dy={36}
    style={{
      ...cardStyle,
      flex: 1,
      height: 380,
      padding: '40px 40px',
      boxSizing: 'border-box',
      borderTop: `8px solid ${C.gold}`,
    }}
  >
    {icon}
    <div style={{fontSize: 46, fontWeight: 800, color: C.navy, marginTop: 26}}>{title}</div>
    <div style={{fontSize: 28, color: C.muted, marginTop: 12, fontWeight: 500, lineHeight: 1.4}}>{sub}</div>
  </Reveal>
);

export const OutroScene: React.FC = () => {
  const t = useT();
  const c = CUES.outro;
  const recap = [
    'Buat naskah di ChatGPT',
    'Ubah naskah menjadi kode di Claude AI',
    'Unduh dan ekstrak file ZIP project',
    'Install dependency lalu jalankan render',
    'Tunggu rendering, ambil video di folder output',
  ];
  const circ = 2 * Math.PI * 100;
  const pCircle = prog(t, c.done, 0.8);
  const pCheck = prog(t, c.done + 0.5, 0.5);

  return (
    <SceneFade fadeOut={false}>
      <Body>
        <div style={{position: 'relative', height: '100%'}}>
          {/* A: Selesai */}
          <Phase from={94.9} to={96.85}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={240} height={240} viewBox="0 0 240 240">
                <circle
                  cx={120}
                  cy={120}
                  r={100}
                  fill="none"
                  stroke={C.navy}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={(1 - pCircle) * circ}
                  transform="rotate(-90 120 120)"
                />
                <path
                  d="M72 124 l33 33 l66 -76"
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={170}
                  strokeDashoffset={(1 - pCheck) * 170}
                />
              </svg>
              <Reveal at={c.done + 0.4} dy={30}>
                <div style={{fontSize: 120, fontWeight: 800, color: C.navy, marginTop: 20}}>Selesai!</div>
              </Reveal>
              <Reveal at={c.done + 0.9}>
                <div style={{fontSize: 38, color: C.muted, fontWeight: 500, marginTop: 6}}>
                  Video motion graphics berhasil dibuat
                </div>
              </Reveal>
            </div>
          </Phase>

          {/* B: Ringkasan */}
          <Phase from={96.85} to={102.6}>
            <div style={{width: 1400, margin: '0 auto', paddingTop: 20}}>
              <Reveal at={97.0}>
                <Label color={C.gold}>Ringkasan</Label>
                <div style={{fontSize: 56, fontWeight: 800, color: C.navy, marginBottom: 28}}>
                  Lima Langkah Menuju Video Jadi
                </div>
              </Reveal>
              {recap.map((r, i) => (
                <Reveal
                  key={r}
                  at={c.recap[i]}
                  dx={-30}
                  dy={0}
                  dur={0.5}
                  style={{
                    ...cardStyle,
                    height: 96,
                    marginBottom: 16,
                    padding: '0 36px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 28,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: C.navy,
                      color: C.white,
                      fontSize: 30,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{fontSize: 34, fontWeight: 600, color: C.ink, flex: 1}}>{r}</div>
                  <CheckIcon size={40} />
                </Reveal>
              ))}
            </div>
          </Phase>

          {/* C: Jenis video */}
          <Phase from={102.6} to={111.95}>
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <Reveal at={102.9}>
                <Label color={C.gold}>Penerapan</Label>
                <div style={{fontSize: 58, fontWeight: 800, color: C.navy, marginBottom: 40}}>
                  Cocok untuk Berbagai Jenis Video
                </div>
              </Reveal>
              <div style={{display: 'flex', gap: 36}}>
                <CatCard
                  at={c.cats[0]}
                  icon={<BookIcon />}
                  title="Edukasi"
                  sub="Materi pelajaran dan pelatihan"
                />
                <CatCard
                  at={c.cats[1]}
                  icon={<ChipIcon />}
                  title="Teknologi"
                  sub="Panduan produk dan tutorial teknis"
                />
                <CatCard
                  at={c.cats[2]}
                  icon={<PhoneIcon />}
                  title="Media Sosial"
                  sub="Konten singkat yang menarik"
                />
              </div>
              <Reveal at={c.tag} dy={30} style={{marginTop: 44}}>
                <div
                  style={{
                    background: C.navy,
                    borderRadius: 14,
                    padding: '30px 48px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 28,
                    borderLeft: `12px solid ${C.gold}`,
                  }}
                >
                  <div style={{fontSize: 42, fontWeight: 700, color: C.white}}>
                    Cukup dengan bantuan AI dan sedikit konfigurasi
                  </div>
                </div>
              </Reveal>
            </div>
          </Phase>

          {/* D: Penutup */}
          <Phase from={c.bye - 0.1} to={999}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Reveal at={c.bye} dy={34} dur={0.8}>
                <div style={{fontSize: 132, fontWeight: 800, color: C.navy, letterSpacing: '0.01em'}}>
                  Selamat Mencoba!
                </div>
              </Reveal>
              <div style={{width: 160, height: 6, background: C.gold, margin: '30px 0 28px'}} />
              <Reveal at={c.bye + 0.4}>
                <div style={{fontSize: 40, color: C.muted, fontWeight: 500}}>Claude AI dan Remotion</div>
              </Reveal>
            </div>
          </Phase>
        </div>
      </Body>
    </SceneFade>
  );
};
