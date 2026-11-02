import React, {createContext, useContext} from 'react';

const Ctx = createContext<number | null>(null);
/** jumlah frame narasi pada bab ini (sisanya = jeda) */
export const ActiveProvider: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => (
  <Ctx.Provider value={frames}>{children}</Ctx.Provider>
);
export const useActive = () => useContext(Ctx);
