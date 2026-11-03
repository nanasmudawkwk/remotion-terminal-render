import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from './theme';

const Ctx = createContext(0);

export const SceneTime: React.FC<{from: number; children: React.ReactNode}> = ({from, children}) => (
  <Ctx.Provider value={from}>{children}</Ctx.Provider>
);

/** waktu ABSOLUT (detik pada voice) di dalam adegan */
export const useT = () => {
  const f = useCurrentFrame();
  const from = useContext(Ctx);
  return (f + from) / FPS;
};
