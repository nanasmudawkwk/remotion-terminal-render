import {Easing, spring} from 'remotion';

export const sp = (
  frame: number,
  fps: number,
  delay = 0,
  damping = 16,
  stiffness = 110,
) => spring({frame: frame - delay, fps, config: {damping, stiffness}});

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

export const ease = Easing.out(Easing.cubic);
