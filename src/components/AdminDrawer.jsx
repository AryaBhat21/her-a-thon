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
  const [customH,   setCustomH]   = useState('');
  const [customM,   setCustomM]   = useState('');
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
    idle:    '⏳ Not Started',
    running: '🟢 Running',
    paused:  '⏸ Paused',
    ended:   '🏁 Ended',
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
              <label>Custom Time (Optional)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="Hours (e.g. 18)"
                  min="0"
                  value={customH}
                  onChange={e => setCustomH(e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Mins"
                  min="0"
                  max="59"
                  value={customM}
                  onChange={e => setCustomM(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="admin-controls">
              <button
                className="admin-btn btn-start"
                onClick={() => {
                  const customSecs = (parseInt(customH, 10) || 0) * 3600 + (parseInt(customM, 10) || 0) * 60;
                  startTimer(customSecs > 0 ? customSecs : undefined);
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
                  const customSecs = (parseInt(customH, 10) || 0) * 3600 + (parseInt(customM, 10) || 0) * 60;
                  resetTimer(customSecs > 0 ? customSecs : undefined);
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
