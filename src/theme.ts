export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);
import {CHAPTER_DEFS, TOTAL_SEC} from './timeline';

export const C = {
  bg: '#12132B',
  panel: '#1B1E3F',
  panel2: '#262A55',
  term: '#0C0D20',
  text: '#EEF0FF',
  dim: '#9AA0D0',
  amber: '#FFC857',
  cyan: '#5BE3E0',
  pink: '#FF5C8A',
  green: '#7CF5A4',
  lilac: '#B7A6FF',
};

/**
 * Garis waktu 10 menit dihasilkan oleh scripts/build_audio.py (src/timeline.ts):
 * tiap bab = narasi (active) + jeda (pause). Ubah jeda di DEFS pada skrip itu lalu jalankan ulang.
 */
let acc = 0;
export const CHAPTERS = CHAPTER_DEFS.map((d) => {
  const active = d.srcEnd - d.srcStart;
  const c = {...d, start: acc, active};
  acc += active + d.pause;
  return c;
});
export const TOTAL = sec(TOTAL_SEC);

/** waktu pada narasi asli -> waktu pada video 10 menit (detik) */
export const srcToSec = (t: number) => {
  const c = CHAPTERS.find((x) => t >= x.srcStart && t < x.srcEnd) ?? CHAPTERS[CHAPTERS.length - 1];
  return c.start + (t - c.srcStart);
};
