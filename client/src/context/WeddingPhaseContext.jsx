import React, { createContext, useContext, useEffect, useState } from 'react';
import { weddingPhaseService } from '../services/api';

const WeddingPhaseContext = createContext(null);

export const WeddingPhaseProvider = ({ children }) => {
  const [weddingPhase, setWeddingPhase] = useState('before');

  useEffect(() => {
    let active = true;
    const refreshPhase = async () => {
      try {
        const result = await weddingPhaseService.getPhase();
        if (active && (result.phase === 'before' || result.phase === 'after')) {
          setWeddingPhase(result.phase);
        }
      } catch {
        // Keep the last known phase if the API is briefly unavailable.
      }
    };

    refreshPhase();
    const intervalId = window.setInterval(refreshPhase, 3000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <WeddingPhaseContext.Provider value={{ weddingPhase, setWeddingPhase }}>
      {children}
    </WeddingPhaseContext.Provider>
  );
};

export const useWeddingPhase = () => {
  const context = useContext(WeddingPhaseContext);
  if (!context) throw new Error('useWeddingPhase must be used within WeddingPhaseProvider');
  return context;
};
