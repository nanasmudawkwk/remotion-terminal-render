import {FPS} from './theme';

/** Panjang voice = 116.808 detik */
export const END = 116.808;
export const TOTAL = Math.ceil(END * FPS);

/** Batas adegan (detik), semuanya di tengah jeda antar kalimat pada voice. */
export const CUTS = [0, 3.0, 12.2, 24.6, 45.05, 62.93, 96.06, 110.67];
