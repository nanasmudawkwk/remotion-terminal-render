import {spring} from 'remotion';
import {FPS} from './theme';

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** 0..1 dengan easing keluar, antara detik a dan b */
export const pr = (t: number, a: number, b: number) => easeOut(prog(t, a, b));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
/** spring berbasis detik (mulai di `start`) */
export const sp = (t: number, start: number, damping = 13, stiffness = 140) =>
  t < start ? 0 : spring({frame: (t - start) * FPS, fps: FPS, config: {damping, stiffness}});
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
