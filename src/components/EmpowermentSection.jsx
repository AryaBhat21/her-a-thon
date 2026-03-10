/**
 * src/components/EmpowermentSection.jsx
 *
 * Women empowerment section with:
 *  - 3 random stats (from pool of 6)
 *  - 4 random fact cards (from pool of 12)
 *  - 5 random quotes in auto-carousel (from pool of 15)
 *  - CTA banner
 *
 * Content changes on every page refresh automatically.
 * To add content: edit src/data/empowerment.js
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { FACTS_POOL, QUOTES_POOL, STATS, randomPick } from '../data/empowerment';

/* ── Quote Carousel ─────────────────────────────────────── */
function QuoteCarousel({ quotes }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % quotes.length), 4000);
    return () => clearInterval(t);
  }, [quotes.length]);

  return (
    <div className="quote-section">
      <div className="quote-track">
        {quotes.map((q, i) => (
          <div key={i} className={`quote-slide${i === current ? ' active' : ''}`}>
            <div className="quote-mark">"</div>
            <p className="quote-text">{q.text}</p>
            <div className="quote-author">— {q.author}</div>
          </div>
        ))}
      </div>
      <div className="quote-dots">
        {quotes.map((_, i) => (
          <span
            key={i}
            className={`qdot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Section ────────────────────────────────────────── */
export default function EmpowermentSection() {
  // Random picks happen once per mount (i.e. per page load) via useMemo
  const stats  = useMemo(() => randomPick(STATS,       3), []);
  const facts  = useMemo(() => randomPick(FACTS_POOL,  4), []);
  const quotes = useMemo(() => randomPick(QUOTES_POOL, 5), []);

  return (
    <>
      <h2 className="section-heading">✨ Women Who Changed the World</h2>

      {/* Stats */}
      <div className="empower-stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fact cards */}
      <div className="facts-grid">
        {facts.map((f, i) => (
          <div key={i} className={`fact-card fact-${f.variant}`}>
            <div className="fact-icon">{f.icon}</div>
            <div className="fact-title">{f.title}</div>
            <div className="fact-body">{f.body}</div>
          </div>
        ))}
      </div>

      {/* Quote Carousel */}
      <QuoteCarousel quotes={quotes} />

      {/* CTA */}
      <div className="cta-banner">
        <div className="cta-left">
          <div className="cta-emoji">🎀</div>
          <div>
            <div className="cta-heading">You belong here.</div>
            <div className="cta-sub">
              Every great line of code starts with one brave woman who decided to try.
            </div>
          </div>
        </div>
        <div className="cta-tag">#HerAThon2026</div>
      </div>
    </>
  );
}
