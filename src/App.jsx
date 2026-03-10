/**
 * src/App.jsx — Root component
 *
 * ADMIN ACCESS (hidden from participants):
 *   Press  Ctrl + Shift + A  anywhere on the page to open the admin side drawer.
 *   Participants only see the countdown timer — there is no visible button.
 */
import { useState, useEffect, useCallback } from 'react';
import { TimerProvider } from './context/TimerContext';
import Header            from './components/Header';
import Ticker            from './components/Ticker';
import Hero              from './components/Hero';
import CountdownTimer    from './components/CountdownTimer';
import EventCards        from './components/EventCards';
import EmpowermentSection from './components/EmpowermentSection';
import Footer            from './components/Footer';
import AdminDrawer       from './components/AdminDrawer';
import Illustration      from './components/Illustration';
import Confetti          from './components/Confetti';

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  // Secret keyboard shortcut: Ctrl + Shift + A
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      setAdminOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <TimerProvider>
      {/* Floating bow decorations */}
      <div className="bow" aria-hidden="true">🎀</div>
      <div className="bow" aria-hidden="true">🎀</div>
      <div className="bow" aria-hidden="true">🎀</div>
      <div className="bow" aria-hidden="true">🎀</div>
      <div className="bow" aria-hidden="true">🎀</div>
      <div className="bow" aria-hidden="true">🎀</div>

      {/* Confetti canvas for timer-end animation */}
      <Confetti />

      <div className="page-content">
        <Header />
        <Ticker />
        <Hero />
        <CountdownTimer />
        <Illustration />
        <EventCards />
        <EmpowermentSection />
        <Footer />
      </div>

      {/* Hidden admin drawer — no visible trigger for participants */}
      <AdminDrawer
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </TimerProvider>
  );
}
