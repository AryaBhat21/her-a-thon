/**
 * js/quotes.js — Auto-rotating Quote Carousel
 *
 * TO ADD / CHANGE QUOTES: edit the slides in index.html (the .quote-slide elements).
 * ROTATION SPEED: change the 4000 below (milliseconds between slides).
 */

(function () {
  'use strict';

  const ROTATION_MS = 4000; // time between auto-advances (ms)

  const slides  = document.querySelectorAll('.quote-slide');
  const dots    = document.querySelectorAll('.qdot');
  let current   = 0;
  let autoTimer = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), ROTATION_MS);
  }

  // Dot navigation — clicking a dot resets the auto-timer
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      goTo(Number(dot.dataset.idx));
      startAuto();
    });
  });

  startAuto();

})();
