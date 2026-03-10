/**
 * src/components/Header.jsx
 *
 * Uses the real college and club logo images from public/logos/.
 * To swap logos: replace the files in public/logos/ with your new images.
 */
export default function Header() {
  return (
    <header className="site-header">
      {/* ── Left: College Logo ─────────────────────────── */}
      <div className="logo-left">
        <img
          src="/logos/nmamit-logo.png"
          alt="NITTE (Deemed to be University) — NMAM Institute of Technology"
          className="college-logo-img"
        />
      </div>

      {/* ── Right: Club Logo ───────────────────────────── */}
      <div className="logo-right">
        <img
          src="/logos/finite-loop-logo.png"
          alt="Finite Loop — Inspire the Rest"
          className="club-logo-img"
        />
      </div>
    </header>
  );
}

