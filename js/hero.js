/* Hero — procedural sun ornament + parallax */

/**
 * Generates the gold dot-arc ornament that mirrors the Maya logo signature.
 * Creates 48 dots arranged in a circle, sized rhythmically (3 sizes that repeat),
 * with subtle staggered fade-in and a slow orbital animation.
 */
export function initHeroOrnament() {
  const sun = document.getElementById('heroSun');
  if (!sun) return;

  const COUNT = 52;
  const RADIUS_PCT = 48;   // % from center
  const SIZES = [4, 7, 10, 7, 4]; // rhythmic pattern
  const dots = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const angle = (360 / COUNT) * i;
    const rad = (angle - 90) * (Math.PI / 180);
    const size = SIZES[i % SIZES.length];
    // soft jitter to feel hand-placed
    const jitter = 1 + Math.sin(i * 1.7) * 0.04;
    const x = 50 + Math.cos(rad) * RADIUS_PCT * jitter;
    const y = 50 + Math.sin(rad) * RADIUS_PCT * jitter;

    const dot = document.createElement('span');
    dot.className = 'sun-dot';
    dot.style.cssText = `
      position:absolute;
      left:${x}%;
      top:${y}%;
      width:${size}px;
      height:${size}px;
      margin-left:${-size/2}px;
      margin-top:${-size/2}px;
      border-radius:50%;
      background:#EAC059;
      box-shadow:0 0 ${size*1.5}px rgba(234,192,89,0.6);
      opacity:0;
      animation:dot-in 1.2s cubic-bezier(0.16,1,0.3,1) ${0.4 + i*0.018}s forwards,
                dot-pulse ${3 + (i%4)*0.4}s ease-in-out ${i*0.05}s infinite;
    `;
    dots.appendChild(dot);
  }
  sun.appendChild(dots);

  // Inject the keyframes once
  if (!document.getElementById('hero-sun-keyframes')) {
    const style = document.createElement('style');
    style.id = 'hero-sun-keyframes';
    style.textContent = `
      @keyframes dot-in {
        0%   { opacity:0; transform:scale(0); }
        60%  { opacity:1; transform:scale(1.2); }
        100% { opacity:1; transform:scale(1); }
      }
      @keyframes dot-pulse {
        0%,100% { opacity:0.65; }
        50%     { opacity:1; }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Smooth parallax on the hero photo + sun.
 * Uses rAF + transform (GPU) for buttery scroll.
 */
export function initHeroParallax() {
  const photo = document.querySelector('.hero__photo');
  const sun = document.getElementById('heroSun');
  if (!photo) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      // photo: 0.18 ratio, sun: 0.32 (more dramatic)
      photo.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.04)`;
      if (sun) sun.style.transform = `translate3d(-50%, calc(-50% + ${y * 0.32}px), 0)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}
