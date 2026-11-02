import {loadFont as loadDisplay} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

export const display = loadDisplay('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
}).fontFamily;

export const mono = loadMono('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
}).fontFamily;
