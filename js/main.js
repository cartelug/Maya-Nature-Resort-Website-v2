/* ============================================================
   MAYA NATURE RESORT — Main entry
   ============================================================ */
import { initNav } from './nav.js';
import { initHeroOrnament, initHeroParallax } from './hero.js';
import { initFountain } from './fountain.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initBooking } from './booking.js';
import { initScrollFx } from './scrollfx.js';

// Wait for DOM, fire everything in order
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroOrnament();
  initHeroParallax();
  initFountain();
  initReveal();
  initCounters();
  initBooking();
  initScrollFx();
});

// Mark fonts loaded once they're truly ready (avoids FOUT jitter on slow connections)
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}
