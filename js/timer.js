/**
 * js/timer.js — Her-a-thon 18-Hour Countdown Timer
 *
 * HOW IT WORKS:
 *  - Timer state is saved in localStorage so it survives page reloads.
 *  - Admin clicks the 🔒 button → enters password → gets Start/Pause/Stop/Reset.
 *  - Participants only see the countdown + status badge.
 *
 * TO CHANGE THE PASSWORD: update ADMIN_PASS below.
 * TO CHANGE DURATION:     update TOTAL_SECONDS below (default = 18 * 3600).
 */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  const ADMIN_PASS    = 'herathon2026';  // ← change admin password here
  const TOTAL_SECONDS = 18 * 60 * 60;   // ← change duration here (18 hours)
  const STORAGE_KEY   = 'herathon_timer';

  /* ── STATE (persisted to localStorage) ─────────────────── */
  //  shape: { status: 'idle'|'running'|'paused'|'ended', remaining: <sec>, endAt: <ms> }
  let state      = loadState();
  let tickHandle = null;

  /* ── DOM REFS ────────────────────────────────────────────── */
  const hoursBox    = document.getElementById('hours-box');
  const minutesBox  = document.getElementById('minutes-box');
  const secondsBox  = document.getElementById('seconds-box');
  const statusBadge = document.getElementById('timer-status-badge');
  const progressBar = document.getElementById('progress-bar');
  const lockBtn     = document.getElementById('admin-lock-btn');
  const modal       = document.getElementById('admin-modal');
  const closeBtn    = document.getElementById('modal-close-btn');
  const loginForm   = document.getElementById('login-form');
  const adminPanel  = document.getElementById('admin-panel');
  const pwdInput    = document.getElementById('admin-password');
  const loginBtn    = document.getElementById('login-btn');
  const loginError  = document.getElementById('login-error');
  const adminStat   = document.getElementById('admin-status-val');
  const btnStart    = document.getElementById('btn-start');
  const btnPause    = document.getElementById('btn-pause');
  const btnStop     = document.getElementById('btn-stop');
  const btnReset    = document.getElementById('btn-reset');
  const logoutBtn   = document.getElementById('logout-btn');

  /* ── PERSIST / LOAD ──────────────────────────────────────── */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { status: 'idle', remaining: TOTAL_SECONDS, endAt: null };
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  /* ── TIMER HELPERS ───────────────────────────────────────── */
  function getRemainingSeconds() {
    if (state.status === 'running' && state.endAt) {
      return Math.max(0, Math.round((state.endAt - Date.now()) / 1000));
    }
    return Math.max(0, state.remaining);
  }

  function renderTimer(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    setText(hoursBox,   pad(h));
    setText(minutesBox, pad(m));
    setText(secondsBox, pad(s));
    const elapsed = TOTAL_SECONDS - secs;
    progressBar.style.width = Math.min(100, (elapsed / TOTAL_SECONDS) * 100) + '%';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function setText(el, val) {
    if (el.textContent !== val) {
      el.textContent = val;
      el.classList.remove('pulse');
      void el.offsetWidth;    // force reflow to restart animation
      el.classList.add('pulse');
    }
  }

  /* ── STATUS BADGE & BUTTONS ──────────────────────────────── */
  function renderStatus() {
    statusBadge.className = 'timer-status';
    adminStat.textContent = '';
    switch (state.status) {
      case 'idle':
        statusBadge.classList.add('waiting');
        statusBadge.textContent = '⏳ Waiting for hackathon to begin…';
        adminStat.textContent   = '⏳ Not Started';
        break;
      case 'running':
        statusBadge.classList.add('running');
        statusBadge.textContent = '🟢 Hackathon is LIVE! Code away!';
        adminStat.textContent   = '🟢 Running';
        break;
      case 'paused':
        statusBadge.classList.add('paused');
        statusBadge.textContent = '⏸ Timer paused by admin';
        adminStat.textContent   = '⏸ Paused';
        break;
      case 'ended':
        statusBadge.classList.add('ended');
        statusBadge.textContent = '🏁 Hackathon ended! Submit your projects!';
        adminStat.textContent   = '🏁 Ended';
        break;
    }
    lockBtn.textContent = state.status === 'running' ? '⚙️' : '🔒';
    renderButtons();
  }

  function renderButtons() {
    const s = state.status;
    btnStart.textContent   = s === 'paused' ? '▶ Resume Timer' : '▶ Start Timer';
    btnStart.disabled      = (s === 'running' || s === 'ended');
    btnPause.disabled      = (s !== 'running');
    btnStop.disabled       = (s === 'idle' || s === 'ended');
    btnStart.style.opacity = (s === 'running' || s === 'ended') ? '0.45' : '1';
    btnPause.style.opacity = s !== 'running' ? '0.45' : '1';
    btnStop.style.opacity  = (s === 'idle' || s === 'ended')  ? '0.45' : '1';
  }

  /* ── TICK ────────────────────────────────────────────────── */
  function tick() {
    const secs = getRemainingSeconds();
    renderTimer(secs);
    if (secs <= 0 && state.status === 'running') endTimer();
  }

  function startTicking() {
    if (tickHandle) clearInterval(tickHandle);
    tickHandle = setInterval(tick, 1000);
    tick();
  }
  function stopTicking() { if (tickHandle) clearInterval(tickHandle); tickHandle = null; }

  /* ── TIMER ACTIONS ───────────────────────────────────────── */
  function startTimer() {
    if (state.status === 'running') return;
    const secs = state.status === 'paused' ? state.remaining : TOTAL_SECONDS;
    state = { status: 'running', remaining: secs, endAt: Date.now() + secs * 1000 };
    saveState(); renderStatus(); startTicking();
  }

  function pauseTimer() {
    if (state.status !== 'running') return;
    state.remaining = getRemainingSeconds();
    state.status    = 'paused';
    state.endAt     = null;
    saveState(); stopTicking(); renderTimer(state.remaining); renderStatus();
  }

  function stopTimer() {
    if (state.status === 'idle' || state.status === 'ended') return;
    endTimer();
  }

  function endTimer() {
    stopTicking();
    state = { status: 'ended', remaining: 0, endAt: null };
    saveState(); renderTimer(0); renderStatus();
    if (window.launchConfetti) window.launchConfetti();
  }

  function resetTimer() {
    stopTicking();
    state = { status: 'idle', remaining: TOTAL_SECONDS, endAt: null };
    saveState(); renderTimer(TOTAL_SECONDS); renderStatus();
  }

  /* ── INIT ────────────────────────────────────────────────── */
  function init() {
    if (state.status === 'running') {
      const secs = getRemainingSeconds();
      if (secs <= 0) { endTimer(); }
      else           { renderTimer(secs); startTicking(); }
    } else {
      renderTimer(state.remaining);
    }
    renderStatus();
  }

  /* ── ADMIN MODAL ─────────────────────────────────────────── */
  let isLoggedIn = false;

  lockBtn.addEventListener('click', () => {
    modal.classList.add('active');
    if (isLoggedIn) {
      loginForm.style.display  = 'none';
      adminPanel.style.display = 'block';
    } else {
      loginForm.style.display  = 'block';
      adminPanel.style.display = 'none';
      pwdInput.value           = '';
      loginError.style.display = 'none';
    }
    setTimeout(() => (isLoggedIn ? adminStat : pwdInput).focus(), 100);
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.remove('active'); });

  function doLogin() {
    if (pwdInput.value === ADMIN_PASS) {
      isLoggedIn               = true;
      loginError.style.display = 'none';
      loginForm.style.display  = 'none';
      adminPanel.style.display = 'block';
      renderStatus();
    } else {
      loginError.style.display = 'block';
      pwdInput.value           = '';
      pwdInput.focus();
    }
  }
  loginBtn.addEventListener('click', doLogin);
  pwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });

  logoutBtn.addEventListener('click', () => {
    isLoggedIn               = false;
    adminPanel.style.display = 'none';
    loginForm.style.display  = 'block';
    pwdInput.value           = '';
  });

  btnStart.addEventListener('click', startTimer);
  btnPause.addEventListener('click', pauseTimer);
  btnStop.addEventListener('click',  stopTimer);
  btnReset.addEventListener('click', resetTimer);

  /* ── GO ──────────────────────────────────────────────────── */
  init();

})();
