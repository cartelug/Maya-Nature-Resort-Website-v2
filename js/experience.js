/* ============================================================
   EXPERIENCE LAYER — cinematic motion & interaction
   Everything here is progressive enhancement: it boots only
   when supported and always degrades gracefully.
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   Intro loader — remove after the sunrise animation
   ------------------------------------------------------------ */
function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const finish = () => {
    intro.classList.add('is-done');
    document.querySelector('.hero')?.classList.add('is-ready');
    setTimeout(() => intro.remove(), 1000);
  };
  if (reduceMotion) { finish(); return; }
  // Hold briefly for the animation, but never block forever
  window.setTimeout(finish, 2100);
}

/* ------------------------------------------------------------
   Scroll progress bar
   ------------------------------------------------------------ */
function initProgress() {
  const bar = document.getElementById('xProgress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    bar.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ------------------------------------------------------------
   Custom cursor — soft gold ring + dot with easing
   ------------------------------------------------------------ */
function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || reduceMotion) return;

  const ring = document.createElement('div');
  ring.className = 'x-cursor';
  const dot = document.createElement('div');
  dot.className = 'x-cursor-dot';
  document.body.append(ring, dot);
  document.documentElement.classList.add('x-cursor-on');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  const hoverSel = 'a, button, input, select, textarea, .x-magnetic, .room, .g-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) ring.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
  });
  document.addEventListener('mousedown', () => ring.classList.add('is-down'));
  document.addEventListener('mouseup', () => ring.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => { ring.style.opacity = 0; dot.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = 1; dot.style.opacity = 1; });
}

/* ------------------------------------------------------------
   Magnetic buttons — pull toward the cursor
   ------------------------------------------------------------ */
function initMagnetic() {
  if (reduceMotion) return;
  const els = document.querySelectorAll('.x-magnetic');
  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magnet || '0.4');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

/* ------------------------------------------------------------
   Card tilt — subtle 3D parallax on hover
   ------------------------------------------------------------ */
function initTilt() {
  if (reduceMotion) return;
  document.querySelectorAll('.x-tilt').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${px * 6}deg`);
      el.style.setProperty('--ry', `${-py * 6}deg`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

/* ------------------------------------------------------------
   Clip-path wipe reveals
   ------------------------------------------------------------ */
function initWipes() {
  const els = document.querySelectorAll('.x-wipe');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.2 });
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   Hero word reveal — wrap each word for the masked rise
   ------------------------------------------------------------ */
function initHeroWords() {
  const title = document.querySelector('.hero__title');
  if (!title || title.dataset.split) return;
  title.dataset.split = '1';

  const wrap = (node) => {
    const text = node.textContent;
    const frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach((part) => {
      if (part.trim() === '') { frag.appendChild(document.createTextNode(part)); return; }
      const word = document.createElement('span');
      word.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = part;
      word.appendChild(inner);
      frag.appendChild(word);
    });
    node.replaceWith(frag);
  };

  // Walk top-level text + <em> children, preserving <br>/<em>
  Array.from(title.childNodes).forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
      wrap(n);
    } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'EM') {
      const inner = document.createElement('span');
      inner.textContent = n.textContent;
      const word = document.createElement('span');
      word.className = 'word';
      word.appendChild(inner);
      n.textContent = '';
      n.appendChild(word);
    }
  });
}

/* ------------------------------------------------------------
   Golden-hour clock — live local time at Maya (EAT, UTC+3)
   plus a friendly countdown to sunset (~18:45).
   ------------------------------------------------------------ */
function initClock() {
  const el = document.getElementById('heroClock');
  if (!el) return;
  const timeEl = el.querySelector('[data-time]');
  const tilEl = el.querySelector('[data-til]');

  const tick = () => {
    // Maya is UTC+3 year-round (East Africa Time, no DST)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const maya = new Date(utc + 3 * 3600000);
    const hh = maya.getHours();
    const mm = maya.getMinutes();
    if (timeEl) {
      timeEl.textContent =
        String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
    }
    if (tilEl) {
      // minutes until 18:45 sunset
      const nowMin = hh * 60 + mm;
      let diff = (18 * 60 + 45) - nowMin;
      if (diff < 0) diff += 24 * 60; // next day
      const dh = Math.floor(diff / 60);
      const dm = diff % 60;
      tilEl.textContent = dh > 0 ? `${dh}h ${dm}m` : `${dm}m`;
    }
  };
  tick();
  setInterval(tick, 30000);
}

/* ============================================================
   CANVAS FOUNTAIN — a real particle simulation.
   Color-cycling jets with gravity, splash, and additive glow.
   This is the signature "dancing fountain" centrepiece.
   ============================================================ */
function initCanvasFountain() {
  const canvas = document.getElementById('fountainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const stage = canvas.parentElement;
  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    const r = stage.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  // Emitters spread across the basin
  const EMITTERS = 7;
  const emitters = [];
  for (let i = 0; i < EMITTERS; i++) {
    emitters.push({
      xPct: 0.12 + (i / (EMITTERS - 1)) * 0.76,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.5,
      power: 0.7 + Math.random() * 0.5,
    });
  }

  const particles = [];
  const MAX = 520;
  let hue = 30;            // start warm gold
  let running = true;
  let last = performance.now();

  const spawn = (ex, baseY, power, h) => {
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 0.34;
    const v = (4.2 + Math.random() * 3.2) * power;
    particles.push({
      x: ex + (Math.random() - 0.5) * 6,
      y: baseY,
      vx: Math.cos(ang) * v,
      vy: Math.sin(ang) * v,
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
      size: 1.4 + Math.random() * 2.4,
      hue: h + (Math.random() * 40 - 20),
    });
  };

  const step = (now) => {
    if (!running) { last = now; requestAnimationFrame(step); return; }
    const dt = Math.min((now - last) / 16.67, 2.4);
    last = now;
    const t = now / 1000;
    hue = (hue + 0.25 * dt) % 360;

    // Emit
    const baseY = H * 0.84;
    emitters.forEach((em) => {
      const pulse = 0.55 + 0.45 * Math.sin(t * em.speed + em.phase);
      const count = Math.round(pulse * 4 * em.power);
      const ex = em.xPct * W;
      for (let k = 0; k < count && particles.length < MAX; k++) {
        spawn(ex, baseY, em.power * (0.6 + pulse * 0.8), hue + em.xPct * 60);
      }
    });

    // Clear with a soft trailing fade (motion blur)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(8, 16, 12, 0.22)';
    ctx.fillRect(0, 0, W, H);

    // Draw particles additively
    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.14 * dt;          // gravity
      p.vx *= 0.995;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= p.decay * dt;

      if (p.life <= 0 || p.y > H) { particles.splice(i, 1); continue; }

      const a = Math.max(0, p.life);
      const rad = p.size * (0.6 + a);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3);
      const col = `hsla(${p.hue}, 90%, 64%,`;
      g.addColorStop(0, `${col} ${0.9 * a})`);
      g.addColorStop(0.4, `${col} ${0.35 * a})`);
      g.addColorStop(1, `${col} 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Water-line shimmer at the basin
    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createLinearGradient(0, baseY - 6, 0, baseY + 20);
    grad.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.18)`);
    grad.addColorStop(1, 'hsla(200, 80%, 60%, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, baseY - 6, W, 26);

    requestAnimationFrame(step);
  };

  // Pause when offscreen to save battery
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      running = entries[0].isIntersecting;
    }, { threshold: 0.05 }).observe(stage);
  }

  if (reduceMotion) {
    // Defer to the static CSS fountain for reduced-motion users
    canvas.style.display = 'none';
    return;
  }
  requestAnimationFrame(step);
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
export function initExperience() {
  document.documentElement.classList.add('x-ready');
  initHeroWords();
  initIntro();
  initProgress();
  initCursor();
  initMagnetic();
  initTilt();
  initWipes();
  initClock();
  initCanvasFountain();
}
