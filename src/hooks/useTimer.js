/**
 * src/hooks/useTimer.js
 *
 * Firebase Realtime Database–backed countdown timer.
 *
 * ── HOW IT WORKS ─────────────────────────────────────────────────────────────
 * Timer state is stored in Firebase at path  /herathon_timer
 *   { status, endAt, remaining }
 *
 * • ALL browsers subscribe to this path via onValue().
 *   When the admin starts/pauses/stops, every participant's screen
 *   updates within ~200ms automatically.
 *
 * • The countdown DISPLAY ticks locally (every 1 s from endAt − Date.now()),
 *   so there is no lag — participants see a smooth countdown without
 *   needing a network request every second.
 *
 * ── TO CHANGE DURATION ───────────────────────────────────────────────────────
 *   Edit TOTAL_SECONDS below (default is 18 hours).
 *
 * ── TO CHANGE ADMIN PASSWORD ─────────────────────────────────────────────────
 *   Edit ADMIN_PASS in src/components/AdminDrawer.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

const TOTAL_SECONDS = 18 * 60 * 60;   // ← change duration here
const TIMER_PATH    = 'herathon_timer';

const DEFAULT_STATE = {
  status:    'idle',
  startAt:   null,
  endAt:     null,
  remaining: TOTAL_SECONDS,
  totalSecs: TOTAL_SECONDS,
};

export function useTimer() {
  // Firebase state (source of truth)
  const [fbState, setFbState] = useState(DEFAULT_STATE);

  // Local display value — ticks every second without hitting Firebase
  const [displayRemaining, setDisplayRemaining] = useState(TOTAL_SECONDS);
  const [displayStatus, setDisplayStatus]       = useState('idle');

  const tickRef = useRef(null);

  // ── Subscribe to Firebase ────────────────────────────────────────────────
  useEffect(() => {
    const timerRef    = ref(db, TIMER_PATH);
    const unsubscribe = onValue(timerRef, (snapshot) => {
      const data = snapshot.val();
      setFbState(data ?? DEFAULT_STATE);
    });
    return () => unsubscribe();
  }, []);

  // ── Local tick based on Firebase state ───────────────────────────────────
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);

    const checkState = () => {
      const now = Date.now();
      if (fbState.status === 'running' && fbState.endAt) {
        if (fbState.startAt && now < fbState.startAt) {
          setDisplayStatus('scheduled');
          // count down to start time instead of total timer duration
          setDisplayRemaining(Math.max(0, Math.round((fbState.startAt - now) / 1000)));
        } else {
          setDisplayStatus('running');
          const rem = Math.max(0, Math.round((fbState.endAt - now) / 1000));
          setDisplayRemaining(rem);

          if (rem <= 0) {
            clearInterval(tickRef.current);
            set(ref(db, TIMER_PATH), { ...fbState, status: 'ended', remaining: 0 });
          }
        }
      } else {
        setDisplayStatus(fbState.status ?? 'idle');
        setDisplayRemaining(fbState.remaining ?? fbState.totalSecs ?? TOTAL_SECONDS);
      }
    };

    checkState();

    if (fbState.status === 'running') {
      tickRef.current = setInterval(checkState, 1000);
    }

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [fbState]);

  // ── Admin actions (write to Firebase → all clients update) ───────────────
  const writeState = useCallback((newState) =>
    set(ref(db, TIMER_PATH), newState), []);

  const startTimer = useCallback((customStartMs, customEndMs) => {
    if (customStartMs && customEndMs) {
      const activeTotal = Math.max(0, Math.round((customEndMs - customStartMs) / 1000));
      return writeState({
        status:    'running',
        startAt:   customStartMs,
        endAt:     customEndMs,
        remaining: activeTotal,
        totalSecs: activeTotal > 0 ? activeTotal : TOTAL_SECONDS,
      });
    }

    const isPaused = fbState.status === 'paused';
    const customSecs = typeof customStartMs === 'number' ? customStartMs : 0;
    const activeTotal = customSecs || fbState.totalSecs || TOTAL_SECONDS;
    const secs = isPaused ? (fbState.remaining ?? activeTotal) : activeTotal;
    
    return writeState({
      status:    'running',
      startAt:   Date.now(),
      endAt:     Date.now() + secs * 1000,
      remaining: secs,
      totalSecs: activeTotal > 0 ? activeTotal : TOTAL_SECONDS,
    });
  }, [fbState, writeState]);

  const pauseTimer = useCallback(() => {
    if (fbState.status !== 'running') return;
    const rem = Math.max(0, Math.round((fbState.endAt - Date.now()) / 1000));
    return writeState({ status: 'paused', startAt: null, endAt: null, remaining: rem, totalSecs: fbState.totalSecs || TOTAL_SECONDS });
  }, [fbState, writeState]);

  const stopTimer = useCallback(() =>
    writeState({ status: 'ended', startAt: null, endAt: null, remaining: 0, totalSecs: fbState.totalSecs || TOTAL_SECONDS }), [fbState.totalSecs, writeState]);

  const resetTimer = useCallback((customSecs) => {
    const secs = customSecs || TOTAL_SECONDS;
    return writeState({
      status: 'idle',
      startAt: null,
      endAt: null,
      remaining: secs,
      totalSecs: secs,
    });
  }, [writeState]);

  return {
    status:     displayStatus,
    remaining:  displayRemaining,
    totalSecs:  fbState.totalSecs || TOTAL_SECONDS,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  };
}
