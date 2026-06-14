/* Navigation — scroll-aware state + accessible mobile drawer */

export function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  if (!nav) return;

  // Scroll state
  let lastY = 0;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 48);
    ticking = false;
    lastY = y;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Mobile menu open/close
  const openMenu = () => {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus first link for keyboard users
    const firstLink = menu.querySelector('.menu__link');
    if (firstLink) firstLink.focus();
  };
  const closeMenu = () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    burger.focus();
  };

  burger?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);

  // Close on link click (anchor navigation)
  menu?.querySelectorAll('.menu__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
