import {loadFont as loadDisplay} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadSub} from '@remotion/google-fonts/Anton';

export const display = loadDisplay('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
export const mono = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;
export const subFont = loadSub('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
