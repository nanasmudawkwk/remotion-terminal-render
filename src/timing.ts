// Semua waktu dalam DETIK (absolut terhadap voiceover.mp3, durasi 114 detik).
// Ubah angka di sini bila voiceover diganti; seluruh animasi dan SFX ikut bergeser.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_SEC = 114;
export const TOTAL_FRAMES = Math.round(DURATION_SEC * FPS);

export type SceneId =
  | 'title'
  | 'intro'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'outro';

export const SCENES: {id: SceneId; start: number; end: number}[] = [
  {id: 'title', start: 0, end: 4.4},
  {id: 'intro', start: 4.4, end: 15.2},
  {id: 'step1', start: 15.2, end: 29.6},
  {id: 'step2', start: 29.6, end: 48.2},
  {id: 'step3', start: 48.2, end: 63.1},
  {id: 'step4', start: 63.1, end: 79.0},
  {id: 'step5', start: 79.0, end: 94.8},
  {id: 'outro', start: 94.8, end: 114},
];

export const CUES = {
  title: {sub: 2.4},
  intro: {
    head: 4.8,
    cards: [6.4, 8.3, 9.4],
    callout: 12.3,
    strike: 13.7,
  },
  step1: {
    bullets: [18.9, 20.3, 24.7],
    window: 18.9,
    typeStart: 20.4,
    typeEnd: 23.4,
    reply: 23.9,
    chips: [26.1, 27.0, 27.8],
  },
  step2: {
    bullets: [33.6, 35.3, 38.1],
    window: 33.5,
    attach: 35.5,
    typeStart: 38.3,
    typeEnd: 43.2,
    itemsHead: 43.8,
    items: [44.3, 45.3, 46.0, 46.6],
  },
  step3: {
    bullets: [51.8, 53.9, 57.3, 59.1],
    zip: 54.6,
    dl: [57.4, 58.6],
    term: 59.3,
    typeStart: 59.8,
    typeEnd: 61.4,
    out: 61.7,
  },
  step4: {
    bullets: [67.4, 69.6, 74.9],
    term: 66.8,
    cd: [67.6, 68.9],
    install: [69.8, 70.9],
    installBar: [71.0, 72.3],
    installDone: 72.4,
    render: [75.0, 76.4],
    renderBar: [76.6, 78.3],
    renderDone: 78.4,
  },
  step5: {
    bullets: [83.0, 90.6],
    ring: [82.9, 89.9],
    factors: [86.0, 87.1, 88.6],
    files: [90.6, 90.9, 91.2, 91.5],
    video: 91.9,
  },
  outro: {
    done: 95.0,
    recap: [97.3, 98.1, 98.9, 99.7, 100.5],
    cats: [106.1, 107.1, 108.1],
    tag: 109.0,
    bye: 112.0,
  },
};
