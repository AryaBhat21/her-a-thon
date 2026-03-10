/**
 * src/components/CountdownTimer.jsx
 * Displays the live countdown. Reads from TimerContext.
 */
import { useEffect, useRef } from 'react';
import { useTimerContext } from '../context/TimerContext';

function pad(n) { return String(n).padStart(2, '0'); }

function DigitBox({ value, label }) {
  const prevRef = useRef(value);
  const boxRef  = useRef(null);

  useEffect(() => {
    if (prevRef.current !== value && boxRef.current) {
      boxRef.current.classList.remove('pulse');
      void boxRef.current.offsetWidth;
      boxRef.current.classList.add('pulse');
    }
    prevRef.current = value;
  }, [value]);

  return (
    <div className="digit-group">
      <div className="digit-box" ref={boxRef}>{value}</div>
      <div className="digit-label">{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    idle:    { cls: 'waiting', text: '⏳ Waiting for hackathon to begin…' },
    running: { cls: 'running', text: '🟢 Hackathon is LIVE! Code away!' },
    paused:  { cls: 'paused',  text: '⏸ Timer paused by admin' },
    ended:   { cls: 'ended',   text: '🏁 Hackathon ended! Submit your projects!' },
  };
  const { cls, text } = map[status] || map.idle;
  return <div className={`timer-status ${cls}`}>{text}</div>;
}

export default function CountdownTimer() {
  const { status, remaining, totalSecs } = useTimerContext();
  const pct = Math.min(100, ((totalSecs - remaining) / totalSecs) * 100);
  const h   = Math.floor(remaining / 3600);
  const m   = Math.floor((remaining % 3600) / 60);
  const s   = remaining % 60;

  // Trigger confetti when timer ends
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current !== 'ended' && status === 'ended') {
      if (window.launchConfetti) window.launchConfetti();
    }
    prevStatus.current = status;
  }, [status]);

  return (
    <section className="timer-section" id="timer-section">
      <div className="timer-label">Hackathon Countdown</div>
      <h2 className="timer-heading">
        <span className="clock-icon">🕐</span> Time Remaining
      </h2>

      <div className="timer-digits">
        <DigitBox value={pad(h)} label="Hours"   />
        <div className="timer-colon">:</div>
        <DigitBox value={pad(m)} label="Minutes" />
        <div className="timer-colon">:</div>
        <DigitBox value={pad(s)} label="Seconds" />
      </div>

      <div className="timer-progress-wrap">
        <div className="timer-progress-bar" style={{ width: `${pct}%` }} />
      </div>

      <StatusBadge status={status} />
    </section>
  );
}
