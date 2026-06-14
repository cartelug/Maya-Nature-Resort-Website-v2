/* Counters — animated number counters with proper easing + format */

export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const format = (n) => {
    if (n >= 1000) return n.toLocaleString('en-US');
    return n.toString();
  };

  const animate = (el, target, duration = 1500) => {
    const start = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(p);
      const value = Math.floor(eased * target);
      el.textContent = format(value);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        // Lock the final value exactly
        el.textContent = format(target);
      }
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        if (!Number.isNaN(target)) {
          animate(entry.target, target);
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}
