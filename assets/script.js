// ===== Header on scroll =====
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive:true });

// ===== Active nav link by current page =====
const currentPage = document.body.getAttribute('data-page');
document.querySelectorAll('.nav-link[data-page], .mobile-nav a[data-page]').forEach(l => {
  l.classList.toggle('active', l.getAttribute('data-page') === currentPage);
});

// ===== Active dropdown/subnav pill by current scroll (only where present) =====
const subLinks = document.querySelectorAll('.subsection-nav a[href^="#"]');
if (subLinks.length){
  const subTargets = Array.from(subLinks).map(l => document.getElementById(l.getAttribute('href').slice(1))).filter(Boolean);
  const setSubActive = () => {
    let current = subTargets[0];
    subTargets.forEach(s => { if (window.scrollY >= s.offsetTop - 220) current = s; });
    subLinks.forEach(l => l.classList.toggle('active', current && l.getAttribute('href') === '#' + current.id));
  };
  window.addEventListener('scroll', setSubActive, { passive:true });
  setSubActive();
}

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

// ===== Reveal on scroll =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal, .skill-row');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// ===== Custom cursor =====
const isFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
if (isFinePointer && !reduceMotion) {
  const cursor = document.getElementById('cursor');
  const label = document.getElementById('cursorLabel');
  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    label.style.left = mx + 'px'; label.style.top = my + 'px';
  });

  const setState = (text) => {
    if (text) {
      cursor.style.width = '64px'; cursor.style.height = '64px';
      cursor.style.borderColor = 'transparent'; cursor.style.background = 'var(--ink)';
      label.textContent = text; label.style.opacity = '1'; label.style.transform = 'translate(-50%,-50%) scale(1)';
    } else {
      cursor.style.width = '14px'; cursor.style.height = '14px';
      cursor.style.borderColor = 'var(--ink)'; cursor.style.background = 'transparent';
      label.style.opacity = '0'; label.style.transform = 'translate(-50%,-50%) scale(.7)';
    }
  };

  document.querySelectorAll('[data-cursor]').forEach(el => {
    const text = el.getAttribute('data-cursor') === 'voir' ? 'VOIR' : 'ENVOYER';
    el.addEventListener('mouseenter', () => setState(text));
    el.addEventListener('mouseleave', () => setState(null));
  });
  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    if (el.hasAttribute('data-cursor')) return;
    el.addEventListener('mouseenter', () => { cursor.style.width='26px'; cursor.style.height='26px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width='14px'; cursor.style.height='14px'; });
  });
}
