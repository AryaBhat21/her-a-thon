/**
 * src/components/AdminDrawer.jsx
 *
 * HIDDEN ADMIN SIDE PANEL — not visible to participants.
 *
 * HOW ADMIN ACCESSES IT:
 *   ➜ Press  Ctrl + Shift + A  anywhere on the page
 *   ➜ Enter the password, then control the timer.
 *
 * TO CHANGE THE PASSWORD: set ADMIN_PASS in src/hooks/useTimer.js
 * (search for ADMIN_PASS in that file).
 *
 * This component is mounted in App.jsx but renders nothing visible
 * unless the drawer is opened via the keyboard shortcut.
 */
import { useState, useEffect, useRef } from 'react';
import { useTimerContext } from '../context/TimerContext';

const ADMIN_PASS = 'herathon2026'; // ← change password here

export default function AdminDrawer({ open, onClose }) {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState(false);
  const [startDateTime, setStartDateTime] = useState('');
  const [targetDateTime, setTargetDateTime] = useState('');
  const pwdRef = useRef(null);

  const { status, startTimer, pauseTimer, stopTimer, resetTimer } = useTimerContext();

  // Focus password input when drawer opens
  useEffect(() => {
    if (open && !loggedIn && pwdRef.current) {
      setTimeout(() => pwdRef.current?.focus(), 80);
    }
  }, [open, loggedIn]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setLoggedIn(true);
      setError(false);
      setPassword('');
    } else {
      setError(true);
      setPassword('');
      pwdRef.current?.focus();
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    setPassword('');
    setError(false);
  }

  const statusMap = {
    idle:      '⏳ Not Started',
    scheduled: '⏳ Scheduled',
    running:   '🟢 Running',
    paused:    '⏸ Paused',
    ended:     '🏁 Ended',
  };

  return (
    <>
      {/* Backdrop — click to close */}
      {open && (
        <div className="drawer-backdrop" onClick={onClose} />
      )}

      {/* Drawer panel */}
      <div className={`admin-drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <div className="drawer-title">
            {loggedIn ? '⚙️ Timer Control' : '🔐 Admin Login'}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!loggedIn ? (
          /* ── Login Form ─────────────────────────────────── */
          <form className="drawer-body" onSubmit={handleLogin}>
            <p className="drawer-desc">
              Enter your admin credentials to control the hackathon timer.
            </p>
            <div className="form-group">
              <label htmlFor="drawer-pwd">Password</label>
              <input
                id="drawer-pwd"
                ref={pwdRef}
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="login-error">❌ Incorrect password. Try again.</div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Login →
            </button>
          </form>
        ) : (
          /* ── Timer Controls ─────────────────────────────── */
          <div className="drawer-body">
            <div className="admin-status">
              <div className="admin-status-label">Current Status</div>
              <div className="admin-status-val">{statusMap[status] || statusMap.idle}</div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Start Date &amp; Time (Optional)</label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={e => setStartDateTime(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '10px' }}
              />               
              <label>Target Date &amp; Time (Optional)</label>
              <input
                type="datetime-local"
                value={targetDateTime}
                onChange={e => setTargetDateTime(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>

            <div className="admin-controls">
              <button
                className="admin-btn btn-start"
                onClick={() => {
                  if (startDateTime && targetDateTime) {
                    startTimer(new Date(startDateTime).getTime(), new Date(targetDateTime).getTime());
                  } else if (targetDateTime) {
                    startTimer(Date.now(), new Date(targetDateTime).getTime());
                  } else {
                    startTimer();
                  }
                }}
                disabled={status === 'running' || status === 'ended'}
              >
                {status === 'paused' ? '▶ Resume Timer' : '▶ Start Timer'}
              </button>
              <button
                className="admin-btn btn-pause"
                onClick={pauseTimer}
                disabled={status !== 'running'}
              >
                ⏸ Pause
              </button>
              <button
                className="admin-btn btn-stop"
                onClick={stopTimer}
                disabled={status === 'idle' || status === 'ended'}
              >
                ⏹ Stop &amp; End
              </button>
              <button
                className="admin-btn btn-reset"
                onClick={() => {
                  setStartDateTime('');
                  setTargetDateTime('');
                  resetTimer();
                }}
              >
                ↺ Reset Timer
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
