/** src/components/Ticker.jsx — Scrolling info banner */
const ITEMS = [
  'Women Only Hackathon',
  '13th March 2026 — Online, 6 PM',
  '14th March 2026 — ADL-03 & 04, SMV Block, 6th Floor',
  'Prize Pool ₹20,000',
  '18-Hour Hackathon Challenge',
  'Organised by Finite Loop Women\'s Community',
];

export default function Ticker() {
  // Duplicate for seamless infinite scroll
  const all = [...ITEMS, ...ITEMS];
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
