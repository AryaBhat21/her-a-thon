/**
 * src/context/TimerContext.jsx
 * Provides timer state and actions to any component via React Context.
 * This lets CountdownTimer (display) and AdminDrawer (controls) share the same timer.
 */
import { createContext, useContext } from 'react';
import { useTimer } from '../hooks/useTimer';

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const timer = useTimer();
  return <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>;
}

export function useTimerContext() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimerContext must be used inside TimerProvider');
  return ctx;
}
