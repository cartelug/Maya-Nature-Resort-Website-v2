/* Fountain — animated water jets + floating light particles */

export function initFountain() {
  const stage = document.getElementById('fountainStage');
  if (!stage) return;

  // Color palette tuned to look like illuminated fountain water at night
  const COLORS = ['#EAC059', '#5BB377', '#7AB8E0', '#E07AB0', '#C98AE0', '#E0A93C', '#A7E0C9'];

  // Build jets
  const JET_COUNT = 16;
  for (let i = 0; i < JET_COUNT; i++) {
    const left = 6 + (i / (JET_COUNT - 1)) * 88; // 6%–94% spread
    const w = 12 + Math.random() * 14;
    const h = 90 + Math.random() * 180;
    const color = COLORS[i % COLORS.length];
    const delay = Math.random() * 2.4;
    const dur = 2.4 + Math.random() * 1.6;

    const jet = document.createElement('div');
    jet.className = 'jet';
    jet.style.cssText = `
      position:absolute;
      left:${left}%;
      bottom:18%;
      width:${w}px;
      height:${h}px;
      border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
      background:linear-gradient(to top, ${color} 0%, ${color}cc 30%, transparent 100%);
      transform-origin:bottom center;
      filter:blur(2px);
      animation:jet-rise ${dur}s ease-in-out ${delay}s infinite;
      mix-blend-mode:screen;
    `;
    stage.appendChild(jet);
  }

  // Floating light particles
  const PARTICLE_COUNT = 22;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    const size = 3 + Math.random() * 5;
    p.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      bottom:${15 + Math.random() * 60}%;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${COLORS[i % COLORS.length]};
      opacity:0.6;
      filter:blur(1px);
      box-shadow:0 0 ${size * 3}px ${COLORS[i % COLORS.length]};
      animation:particle-float ${3 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite;
    `;
    stage.appendChild(p);
  }

  // Inject keyframes once
  if (!document.getElementById('fountain-keyframes')) {
    const style = document.createElement('style');
    style.id = 'fountain-keyframes';
    style.textContent = `
      @keyframes jet-rise {
        0%, 100% { transform: scaleY(0.6); opacity: 0.55; }
        50%      { transform: scaleY(1.15); opacity: 0.95; }
      }
      @keyframes particle-float {
        0%, 100% { transform: translateY(0); opacity: 0.3; }
        50%      { transform: translateY(-36px); opacity: 0.9; }
      }
    `;
    document.head.appendChild(style);
  }
}
