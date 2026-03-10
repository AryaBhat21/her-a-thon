/** src/components/Ticker.jsx — Scrolling info banner */
const ITEMS = [
  'Women Only Hackathon',
  '13th March 2026 — Online, 6 PM',
  '14th March 2026 — ADL-03 & 04, SMV Block, 6th Floor',
  'Prize Pool ₹20,000',
  'Organised by FLWC',
];

export default function Ticker() {
  // Duplicate multiple times to ensure the banner is wider than the screen
  // Must be an even number of sets so that translateX(-50%) creates a seamless loop
  const all = Array(10).fill(ITEMS).flat();
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {all.map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot">♦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
