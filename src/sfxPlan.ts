export type SfxEvt = {t: number; f: string; v?: number; d?: number};

const L: SfxEvt[] = [];
const add = (t: number, f: string, v = 0.7, d = 1.4) => L.push({t, f, v, d});
const ticks = (a: number, b: number, step: number, v = 0.22) => {
  let i = 0;
  for (let t = a; t < b; t += step) add(t, `click${(i++ % 3) + 1}`, v, 0.2);
};

// pergantian adegan
[3.0, 12.2, 24.6, 45.05, 62.93, 96.06, 110.67].forEach((c) => add(c - 0.15, 'whoosh', 0.55, 0.7));

// 1. judul
add(0.05, 'hit', 0.9, 1.3);
add(0.1, 'whoosh', 0.5, 0.7);
add(1.5, 'riser', 0.4, 1.5);
// 2. hook
add(3.6, 'pop', 0.5, 0.2);
ticks(4.0, 5.8, 0.18, 0.15);
add(5.9, 'buzz', 0.6, 0.6);
add(6.4, 'pop', 0.6, 0.2);
add(6.9, 'ding', 0.35, 1);
add(9.05, 'alert', 0.6, 1.1);
add(9.1, 'hit', 0.9, 1.3);
add(10.6, 'glitch', 0.4, 0.4);
// 3. definisi
add(12.5, 'pop', 0.6, 0.2);
[14.9, 16.0, 17.1].forEach((t) => add(t, 'pop', 0.6, 0.2));
add(18.4, 'riser', 0.5, 1.5);
ticks(19.2, 22.4, 0.07, 0.15);
add(22.6, 'alert', 0.5, 1.1);
add(23.4, 'buzz', 0.7, 0.6);
add(23.45, 'hit', 0.9, 1.3);
// 4. restoran
add(25.1, 'pop', 0.6, 0.2);
ticks(28.0, 31.4, 0.07, 0.17);
add(32.7, 'hit', 0.9, 1.3);
add(32.8, 'alert', 0.5, 1.1);
ticks(33.9, 36.6, 0.05, 0.15);
add(38.2, 'buzz', 0.7, 0.6);
add(38.3, 'hit', 0.5, 1.3);
add(42.6, 'pop', 0.6, 0.2);
add(43.1, 'pop', 0.5, 0.2);
add(43.6, 'pop', 0.5, 0.2);
// 5. botnet
add(45.6, 'pop', 0.6, 0.2);
[46.1, 46.7, 47.3, 47.9].forEach((t) => add(t, 'glitch', 0.45, 0.4));
add(48.8, 'riser', 0.5, 1.5);
add(50.0, 'hit', 0.8, 1.3);
add(51.5, 'alert', 0.45, 1.1);
[56.1, 57.4, 58.5, 59.5].forEach((t) => add(t, 'pop', 0.7, 0.2));
add(60.5, 'buzz', 0.7, 0.6);
add(61.5, 'hit', 0.95, 1.3);
// 6. solusi
add(63.5, 'pop', 0.6, 0.2);
add(63.6, 'shield', 0.5, 1);
add(66.8, 'pop', 0.6, 0.2);
[69.3, 74.9, 80.1, 86.9, 91.5].forEach((t) => {
  add(t, 'whoosh', 0.45, 0.7);
  add(t + 0.25, 'pop', 0.6, 0.2);
  add(t + 3.2, 'ding', 0.4, 1);
});
add(70.4, 'shield', 0.5, 1);
add(83.2, 'glitch', 0.3, 0.4);
// 7. kesimpulan
add(96.6, 'pop', 0.6, 0.2);
add(98.5, 'riser', 0.45, 1.5);
ticks(99.2, 102.6, 0.1, 0.14);
add(102.7, 'buzz', 0.6, 0.6);
add(106.5, 'shield', 0.7, 1);
add(106.6, 'hit', 0.6, 1.3);
add(108.8, 'ding', 0.55, 1);
// 8. penutup
add(111.2, 'hit', 0.8, 1.3);
add(111.3, 'shield', 0.6, 1);
add(113.6, 'ding', 0.7, 1);
add(113.65, 'pop', 0.7, 0.2);

export const SFX: SfxEvt[] = L;
