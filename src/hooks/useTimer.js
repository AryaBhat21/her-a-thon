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
  endAt:     null,
  remaining: TOTAL_SECONDS,
  totalSecs: TOTAL_SECONDS,
};

export function useTimer() {
  // Firebase state (source of truth)
  const [fbState, setFbState] = useState(DEFAULT_STATE);

  // Local display value — ticks every second without hitting Firebase
  const [displayRemaining, setDisplayRemaining] = useState(TOTAL_SECONDS);

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

    if (fbState.status === 'running' && fbState.endAt) {
      const calcRemaining = () =>
        Math.max(0, Math.round((fbState.endAt - Date.now()) / 1000));

      // Set immediately so display doesn't lag on first render
      setDisplayRemaining(calcRemaining());

      tickRef.current = setInterval(() => {
        const rem = calcRemaining();
        setDisplayRemaining(rem);

        // If we hit zero, write "ended" to Firebase so all clients see it
        if (rem <= 0) {
          clearInterval(tickRef.current);
          set(ref(db, TIMER_PATH), { status: 'ended', endAt: null, remaining: 0 });
        }
      }, 1000);

    } else {
      setDisplayRemaining(fbState.remaining ?? TOTAL_SECONDS);
    }

    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [fbState]);

  // ── Admin actions (write to Firebase → all clients update) ───────────────
  const writeState = useCallback((newState) =>
    set(ref(db, TIMER_PATH), newState), []);

  const startTimer = useCallback((customSecs) => {
    // If paused: resume from where it left off. Otherwise: use customSecs or previous total or fresh 18h.
    const isPaused = fbState.status === 'paused';
    const activeTotal = customSecs || fbState.totalSecs || TOTAL_SECONDS;
    const secs = isPaused ? (fbState.remaining ?? activeTotal) : activeTotal;
    
    return writeState({
      status:    'running',
      endAt:     Date.now() + secs * 1000,
      remaining: secs,
      totalSecs: activeTotal,
    });
  }, [fbState, writeState]);

  const pauseTimer = useCallback(() => {
    if (fbState.status !== 'running') return;
    const rem = Math.max(0, Math.round((fbState.endAt - Date.now()) / 1000));
    return writeState({ status: 'paused', endAt: null, remaining: rem, totalSecs: fbState.totalSecs || TOTAL_SECONDS });
  }, [fbState, writeState]);

  const stopTimer = useCallback(() =>
    writeState({ status: 'ended', endAt: null, remaining: 0, totalSecs: fbState.totalSecs || TOTAL_SECONDS }), [fbState.totalSecs, writeState]);

  const resetTimer = useCallback((customSecs) => {
    const secs = customSecs || TOTAL_SECONDS;
    return writeState({
      status: 'idle',
      endAt: null,
      remaining: secs,
      totalSecs: secs,
    });
  }, [writeState]);

  return {
    status:     fbState.status,
    remaining:  displayRemaining,
    totalSecs:  fbState.totalSecs || TOTAL_SECONDS,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  };
}
