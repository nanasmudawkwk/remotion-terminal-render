import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});
const mono = loadMono('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
});

export const FONT = inter.fontFamily;
export const MONO = mono.fontFamily;

export const C = {
  navy: '#0B2545',
  navy2: '#13315C',
  blue: '#1F5FA8',
  sky: '#E6EDF7',
  paper: '#F4F6FA',
  white: '#FFFFFF',
  gold: '#B8932F',
  goldSoft: '#FBF3DC',
  ink: '#1B2635',
  muted: '#5E6B7D',
  line: '#D5DDE8',
  green: '#2E7D4F',
  term: '#0A1930',
  termBar: '#10264A',
  termText: '#C9D6E8',
};

export const HEADER_H = 96;
export const FOOTER_H = 48;
export const BODY_H = 1080 - HEADER_H - FOOTER_H; // 936
