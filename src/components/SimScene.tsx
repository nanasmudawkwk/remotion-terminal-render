import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {display, mono} from '../fonts';
import {clamp, sp} from '../anim';
import {Heading} from './Heading';
import {Line, Terminal} from './Terminal';
import {useActive} from './Active';
import {Sfx, SfxItem, typeClicks} from './Sfx';

export type TreeItem = {name: string; depth: number; dir?: boolean};
export type Step = {
  cmd: string;
  out?: string[];
  err?: boolean;
  note: string;
  warn?: boolean;
  after?: string;
  tree?: TreeItem[];
  label?: string;
};
export type Goal = {label: string; step: number};

type Props = {
  title: string;
  subtitle: string;
  steps: Step[];
  accent?: string;
  startCwd?: string;
  treeTitle?: string;
  goals?: Goal[];
};

const keyOf = (t: TreeItem) => `${t.depth}:${t.name}`;

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; border?: string}> = ({
  children,
  style,
  border = '#ffffff18',
}) => (
  <div
    style={{
      background: C.panel,
      border: `1.5px solid ${border}`,
      borderRadius: 28,
      padding: '22px 28px',
      ...style,
    }}
  >
    {children}
  </div>
);

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: display, fontWeight: 700, fontSize: 24, color: C.dim, marginBottom: 12}}>{children}</div>
);

export const SimScene: React.FC<Props> = ({
  title,
  subtitle,
  steps,
  accent = C.amber,
  startCwd = '~',
  treeTitle = 'Isi folder',
  goals,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: dur0, fps} = useVideoConfig();
  const activeFrames = useActive();
  const dur = activeFrames ?? dur0;

  const plan = useMemo(() => {
    const lead = 34;
    const tail = 36;
    const avail = dur - lead - tail;
    const w = steps.map((s) => 60 + s.cmd.length * 1.6 + (s.out?.length ?? 0) * 9);
    const W = w.reduce((a, b) => a + b, 0);
    const lines: Line[] = [];
    const starts: number[] = [];
    const outStarts: number[] = [];
    let cur = lead;
    let cwd = startCwd;
    steps.forEach((s, i) => {
      const alloc = Math.floor((avail * w[i]) / W);
      starts.push(cur);
      const typeStart = cur + 10;
      const cps = Math.min(0.55, s.cmd.length / (alloc * 0.4));
      const outStart = typeStart + Math.ceil(s.cmd.length / cps) + 9;
      outStarts.push(outStart);
      const after = s.after ?? cwd;
      lines.push({kind: 'cmd', text: s.cmd, at: typeStart, cps, after});
      cwd = after;
      if (s.cmd === 'clear') lines.push({kind: 'clear', text: '', at: outStart});
      (s.out ?? []).forEach((o, j) =>
        lines.push({kind: s.err ? 'err' : 'out', text: o, at: outStart + j * 4}),
      );
      cur += alloc;
    });
    const sfx: SfxItem[] = [];
    steps.forEach((st, i) => {
      const cl = lines.find((l) => l.kind === 'cmd' && l.at === starts[i] + 10)!;
      const cps = cl.cps ?? 0.55;
      sfx.push(...typeClicks(cl.at, st.cmd.length, cps, 0.22, 2));
      sfx.push({at: cl.at + Math.ceil(st.cmd.length / cps), f: 'pop', v: 0.3, d: 12});
      if (st.out?.length) sfx.push({at: outStarts[i], f: 'ding', v: 0.22, d: 30});
    });
    return {lines, starts, outStarts, sfx};
  }, [steps, dur, startCwd]);

  const lastIdx = (arr: number[]) => {
    let r = -1;
    arr.forEach((v, i) => {
      if (v <= frame) r = i;
    });
    return r;
  };
  const ai = Math.max(0, lastIdx(plan.starts)); // langkah aktif (catatan)
  const ti = lastIdx(plan.outStarts); // langkah yang sudah dieksekusi (pohon/tujuan)
  const step = steps[ai];
  const local = frame - plan.starts[ai];
  const e = sp(local, fps, 0, 18, 140);

  const treeFor = (i: number): TreeItem[] => {
    for (let k = i; k >= 0; k--) if (steps[k].tree) return steps[k].tree as TreeItem[];
    return [];
  };
  const hasTree = steps.some((s) => s.tree);
  const cur = treeFor(ti);
  const prev = treeFor(ti - 1);
  const tLocal = ti >= 0 ? frame - plan.outStarts[ti] : 0;
  const removed = prev.filter((p) => !cur.some((c) => keyOf(c) === keyOf(p)));

  const labelOf = (s: Step) => s.label ?? (s.cmd.length <= 12 ? s.cmd : s.cmd.split(' ')[0]);
  const compact = !!goals;
  const termH = compact ? 610 : 710;

  const noteBox = (
    <Card
      border={step.warn ? C.pink : `${accent}55`}
      style={{
        opacity: e,
        transform: `translateY(${(1 - e) * 24}px)`,
        boxShadow: step.warn ? `0 0 40px ${C.pink}33` : undefined,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontWeight: 700,
          fontSize: compact ? 26 : 30,
          color: accent,
          background: '#00000040',
          padding: '8px 16px',
          borderRadius: 14,
          display: 'inline-block',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: 14,
        }}
      >
        {step.cmd}
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 500,
          fontSize: compact ? 28 : 34,
          lineHeight: 1.3,
          color: step.warn ? C.pink : C.text,
        }}
      >
        {step.note}
      </div>
    </Card>
  );

  return (
    <AbsoluteFill>
      <Sfx list={plan.sfx} />
      <Heading title={title} subtitle={subtitle} color={accent} />
      <div style={{position: 'absolute', left: 100, top: 240}}>
        <div
          style={{
            opacity: sp(frame, fps, 10, 20, 100),
            transform: `translateY(${(1 - sp(frame, fps, 10, 20, 100)) * 40}px)`,
          }}
        >
          <Terminal lines={plan.lines} width={1090} height={termH} accent={accent} startCwd={startCwd} />
        </div>
      </div>

      {compact && (
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 240 + termH + 16,
            width: 1090,
            opacity: e,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              background: C.panel,
              border: `1.5px solid ${step.warn ? C.pink : accent + '55'}`,
              borderRadius: 22,
              padding: '14px 24px',
            }}
          >
            <div style={{fontFamily: mono, fontWeight: 700, fontSize: 24, color: accent, whiteSpace: 'nowrap'}}>
              {labelOf(step)}
            </div>
            <div style={{fontFamily: display, fontSize: 28, color: C.text}}>{step.note}</div>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: 1230,
          top: 240,
          width: 590,
          height: 720,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          opacity: sp(frame, fps, 18, 20, 100),
        }}
      >
        {!compact && noteBox}

        {!compact && (
          <div style={{display: 'flex', gap: 8, padding: '0 6px'}}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 10,
                  width: i === ai ? 34 : 10,
                  borderRadius: 5,
                  background: i <= ai ? accent : '#ffffff22',
                }}
              />
            ))}
          </div>
        )}

        {hasTree && (
          <Card style={{flex: compact ? '0 0 auto' : 1}}>
            <Label>{treeTitle}</Label>
            {cur.map((t) => {
              const isNew = ti >= 0 && !prev.some((p) => keyOf(p) === keyOf(t));
              const a = isNew ? sp(tLocal, fps, 0, 14, 140) : 1;
              const flash = isNew ? interpolate(tLocal, [0, 40], [1, 0], clamp) : 0;
              return (
                <div
                  key={keyOf(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    height: 40,
                    paddingLeft: t.depth * 32,
                    opacity: a,
                    transform: `translateX(${(1 - a) * -24}px)`,
                    fontFamily: mono,
                    fontSize: 26,
                    color: t.dir ? C.amber : C.cyan,
                    background: `linear-gradient(90deg, ${accent}${Math.round(flash * 60)
                      .toString(16)
                      .padStart(2, '0')}, transparent)`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      width: t.dir ? 26 : 20,
                      height: 20,
                      borderRadius: t.dir ? '4px 8px 4px 4px' : 3,
                      background: t.dir ? C.amber : C.cyan,
                    }}
                  />
                  {t.name}
                </div>
              );
            })}
            {removed.map((t) => {
              const a = interpolate(tLocal, [0, 22], [1, 0], clamp);
              return (
                <div
                  key={'r' + keyOf(t)}
                  style={{
                    height: 40 * a,
                    overflow: 'hidden',
                    opacity: a,
                    paddingLeft: t.depth * 32,
                    fontFamily: mono,
                    fontSize: 26,
                    color: C.pink,
                    textDecoration: 'line-through',
                    lineHeight: '40px',
                  }}
                >
                  {t.name}
                </div>
              );
            })}
          </Card>
        )}

        {goals && (
          <Card style={{flex: 1}}>
            <Label>Tujuan praktikum</Label>
            {goals.map((g, i) => {
              const done = ti >= g.step;
              const p = done ? sp(frame - plan.outStarts[g.step], fps, 0, 12, 160) : 0;
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, height: 38}}>
                  <svg width={30} height={30} viewBox="0 0 30 30">
                    <circle cx={15} cy={15} r={12} fill="none" stroke="#ffffff30" strokeWidth={2.5} />
                    <circle cx={15} cy={15} r={12 * p} fill={C.green} />
                    <path
                      d="M8 15 L13 20 L22 10"
                      fill="none"
                      stroke={C.bg}
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={30}
                      strokeDashoffset={(1 - p) * 30}
                    />
                  </svg>
                  <div style={{fontFamily: display, fontSize: 26, color: done ? C.text : C.dim}}>{g.label}</div>
                </div>
              );
            })}
          </Card>
        )}

        {!hasTree && !goals && (
          <Card style={{flex: 1}}>
            <Label>Perintah di bagian ini</Label>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
              {steps.map((s, i) => {
                const active = i === ai;
                const done = i < ai;
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 24,
                      padding: '8px 14px',
                      borderRadius: 12,
                      background: active ? accent : done ? '#ffffff0D' : 'transparent',
                      color: active ? C.bg : done ? C.dim : '#ffffff55',
                      border: `1.5px solid ${active ? accent : '#ffffff22'}`,
                      transform: `scale(${active ? 1.06 : 1})`,
                    }}
                  >
                    {labelOf(s)}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </AbsoluteFill>
  );
};
