/** src/components/EventCards.jsx — Schedule and prize cards */
export default function EventCards() {
  return (
    <>
      <h2 className="section-heading">Event Details</h2>
      <div className="cards-grid">

        <div className="info-card">
          <span className="card-icon">📅</span>
          <div className="card-date">13th March 2026</div>
          <div className="card-title">🌐 Online Round</div>
          <div className="card-detail">
            Commences at 6:00 PM<br />
            Problem statement release &amp; team formation
          </div>
        </div>

        <div className="info-card">
          <span className="card-icon">📍</span>
          <div className="card-date">14th March 2026</div>
          <div className="card-title">🏫 Offline Round</div>
          <div className="card-detail">
            ADL-03 &amp; ADL-04<br />
            SMV Block, Sixth Floor<br />
            9:00 AM – 4:30 PM
          </div>
        </div>

        <div className="prize-card info-card">
          <div className="prize-label">🏆 Total Prize Pool</div>
          <div className="prize-amount">₹20,000</div>
          <div className="prize-sub">Exciting prizes await the top teams! ✨</div>
        </div>

      </div>
    </>
  );
}
