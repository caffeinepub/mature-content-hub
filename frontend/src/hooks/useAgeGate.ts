import { useState, useEffect, useCallback } from 'react';

const AGE_GATE_KEY = 'mature_content_age_confirmed';

export function useAgeGate() {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem(AGE_GATE_KEY);
    setIsConfirmed(stored === 'true');
    setIsLoading(false);
  }, []);

  const confirm = useCallback(() => {
    localStorage.setItem(AGE_GATE_KEY, 'true');
    setIsConfirmed(true);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(AGE_GATE_KEY);
    setIsConfirmed(false);
  }, []);

  return {
    isConfirmed,
    isLoading,
    confirm,
    clear,
  };
}
