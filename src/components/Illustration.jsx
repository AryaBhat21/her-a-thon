/**
 * src/components/Illustration.jsx — SVG coding women illustration
 */
export default function Illustration() {
  return (
    <div className="illustration" aria-hidden="true">
      <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80"  cy="80" r="60" fill="none" stroke="#1a472a" strokeWidth="4"/>
        <circle cx="80"  cy="80" r="4"  fill="#1a472a"/>
        <line x1="80" y1="80" x2="80"  y2="36" stroke="#1a472a" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="80" y1="80" x2="114" y2="96" stroke="#e85d3c" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M80 24 A56 56 0 0 1 136 80" fill="none" stroke="#e85d3c" strokeWidth="2.5" strokeDasharray="6 4"/>
        <polygon points="136,80 128,70 144,70" fill="#e85d3c"/>
        <path d="M80 136 A56 56 0 0 1 24 80" fill="none" stroke="#1a472a" strokeWidth="2.5" strokeDasharray="6 4"/>
        <polygon points="24,80 32,90 16,90" fill="#1a472a"/>
        <circle cx="210" cy="62" r="16" fill="#1a472a"/>
        <rect x="196" y="80"  width="28" height="32" rx="6" fill="#1a472a"/>
        <rect x="200" y="94"  width="20" height="26" rx="4" fill="#e85d3c"/>
        <rect x="188" y="110" width="44" height="28" rx="4" fill="#ccc"/>
        <rect x="191" y="113" width="38" height="20" rx="2" fill="#555"/>
        <circle cx="272" cy="62" r="16" fill="#e85d3c"/>
        <rect x="258" y="80"  width="28" height="32" rx="6" fill="#fbe9e7"/>
        <rect x="262" y="94"  width="20" height="26" rx="4" fill="#1a472a"/>
        <rect x="185" y="136" width="110" height="6" rx="3" fill="#888"/>
        <rect x="192" y="142" width="6"   height="16" rx="2" fill="#888"/>
        <rect x="289" y="142" width="6"   height="16" rx="2" fill="#888"/>
      </svg>
    </div>
  );
}
