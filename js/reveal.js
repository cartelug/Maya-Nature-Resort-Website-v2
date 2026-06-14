/* Reveal — IntersectionObserver-based scroll reveal */

export function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length || !('IntersectionObserver' in window)) {
    // Fallback: just show them all
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target); // one-shot
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => io.observe(el));
}
