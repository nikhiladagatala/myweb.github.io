/* =============================================
   MIT DYNAMIC WEBSITE — script.js
   Features: Particles, Custom Cursor, Typing,
   Counters, Scroll Reveal, Parallax, Form,
   Search, Hamburger, Magnetic Buttons, Tilt
   ============================================= */

'use strict';

/* ============ PAGE LOADER ============ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1900);
});

/* ============ CUSTOM CURSOR ============ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
  }
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
  }
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.querySelectorAll('a, button, input, textarea, select, .card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) { cursor.style.transform += ' scale(2)'; cursor.style.opacity = '0.6'; }
    if (cursorRing) cursorRing.style.transform += ' scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '1';
  });
});

/* ============ PARTICLE SYSTEM ============ */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas ? canvas.getContext('2d') : null;

let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size   = Math.random() * 2 + 0.5;
    this.alpha  = Math.random() * 0.5 + 0.1;
    this.color  = Math.random() > 0.6 ? '#A31F34' : '#ffffff';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  if (!canvas || !ctx) return;
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = '#A31F34';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Mouse repel
document.addEventListener('mousemove', e => {
  particles.forEach(p => {
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      p.vx -= (dx / dist) * 0.3;
      p.vy -= (dy / dist) * 0.3;
    }
  });
});

/* ============ TYPING ANIMATION ============ */
const typingEl = document.getElementById('hero-typing');
const phrases = [
  'Solving tomorrow\'s problems today.',
  'Where science meets society.',
  'Ranked #1 university in the world.',
  'Innovation starts here.',
  'Mens et Manus — Mind and Hand.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeText() {
  if (!typingEl) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeText, 2000);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeText, deleting ? 40 : 70);
}
setTimeout(typeText, 2200);

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}
initScrollReveal();

/* ============ ANIMATED COUNTERS ============ */
function animateCount(id, target, suffix = '', duration = 2200) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;
  let fired = false;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      animateCount('stat-nobel',    97,    '+');
      animateCount('stat-companies',30000, '+');
      animateCount('stat-faculty',  1069,  '');
      animateCount('stat-students', 11500, '+');
    }
  }, { threshold: 0.4 }).observe(statsSection);
}
initCounters();

/* ============ STICKY HEADER ============ */
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ============ ACTIVE NAV ON SCROLL ============ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('nav ul li a:not(.nav-cta)');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });
}
initActiveNav();

/* ============ HAMBURGER MENU ============ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu?.classList.toggle('open');
});
navMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navMenu?.classList.remove('open');
  });
});

/* ============ SMOOTH SCROLL ============ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ============ SEARCH OVERLAY ============ */
const searchOverlay = document.getElementById('search-overlay');
const searchBtn     = document.getElementById('search-btn');
const searchClose   = document.getElementById('search-close');
const searchBig     = document.getElementById('search-big');

searchBtn?.addEventListener('click', e => {
  e.preventDefault();
  searchOverlay?.classList.add('open');
  setTimeout(() => searchBig?.focus(), 300);
});
searchClose?.addEventListener('click', () => searchOverlay?.classList.remove('open'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') searchOverlay?.classList.remove('open');
});

/* ============ CARD TILT + MOUSE GLOW ============ */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const rotX = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * -8;
    const rotY = ((e.clientX - rect.left - rect.width  / 2) / rect.width)  *  8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============ MAGNETIC BUTTONS ============ */
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ============ CONTACT FORM ============ */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('f-name')?.value.trim();
  const email   = document.getElementById('f-email')?.value.trim();
  const subject = document.getElementById('f-subject')?.value;
  const message = document.getElementById('f-message')?.value.trim();
  const msg     = document.getElementById('form-msg');

  const showMsg = (text, type) => {
    if (!msg) return;
    msg.textContent = text;
    msg.className   = `form-msg ${type}`;
    msg.style.display = 'block';
  };

  if (!name)    return showMsg('⚠ Please enter your full name.',       'error');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return showMsg('⚠ Please enter a valid email address.', 'error');
  if (!subject) return showMsg('⚠ Please select a subject.',           'error');
  if (message.length < 10) return showMsg('⚠ Message must be at least 10 characters.', 'error');

  // Simulate send
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
  setTimeout(() => {
    showMsg('✓ Message sent! We\'ll be in touch within 2 business days.', 'success');
    e.target.reset();
    if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
  }, 1200);
});

/* ============ TABLE ROW CLICK ============ */
document.querySelectorAll('tbody tr').forEach(row => {
  row.style.cursor = 'none';
  row.addEventListener('click', () => {
    document.querySelectorAll('tbody tr').forEach(r => r.style.background = '');
    row.style.background = 'rgba(163,31,52,0.12)';
  });
});

/* ============ BACK TO TOP ============ */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  Object.assign(btn.style, {
    position:    'fixed',
    bottom:      '2rem',
    right:       '2rem',
    width:       '44px',
    height:      '44px',
    background:  '#A31F34',
    color:       '#fff',
    border:      'none',
    borderRadius:'50%',
    fontSize:    '1.2rem',
    cursor:      'none',
    zIndex:      '9000',
    opacity:     '0',
    transition:  'opacity 0.3s ease, transform 0.3s ease',
    boxShadow:   '0 4px 16px rgba(163,31,52,0.5)',
    pointerEvents: 'none',
  });
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity       = show ? '1'    : '0';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
initBackToTop();

/* ============ PARALLAX HERO ============ */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
  const glow = document.querySelector('.hero-glow');
  if (glow) glow.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.15}px))`;
});

/* ============ MARQUEE PAUSE ON HOVER ============ */
// Already handled in CSS: .marquee-track:hover { animation-play-state: paused; }

/* ============ KEYBOARD SHORTCUT: / for Search ============ */
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('search-overlay')?.classList.add('open');
    setTimeout(() => document.getElementById('search-big')?.focus(), 300);
  }
});

console.log('%cMIT Dynamic Site Loaded ✅', 'color:#A31F34; font-family:monospace; font-size:14px; font-weight:bold;');
