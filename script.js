/* =============================================
   MIT-Inspired Website — script.js
   Handles: Animated counters, form validation,
   active nav, search filter, scroll effects
   ============================================= */

// ---- Animated Counter ----
function animateCounter(id, target, duration = 2000, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString() + suffix;
    }
  }, 16);
}

// ---- Intersection Observer for Stats Section ----
function initCounters() {
  const statsSection = document.getElementById('research');
  if (!statsSection) return;

  let triggered = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        animateCounter('stat-nobel', 100, 2000, '+');
        animateCounter('stat-patents', 3500, 2000, '+');
        animateCounter('stat-faculty', 1069, 2000);
        animateCounter('stat-students', 11500, 2000, '+');
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);
}

// ---- Active Navigation Highlight on Scroll ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ---- Sticky Header Shadow on Scroll ----
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ---- Contact Form Validation ----
function handleForm(e) {
  e.preventDefault();
  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  const msg     = document.getElementById('form-msg');

  msg.style.display = 'none';
  msg.textContent = '';

  // Basic validation
  if (!name.value.trim()) {
    showMsg('⚠️ Please enter your full name.', 'red');
    name.focus();
    return;
  }
  if (!validateEmail(email.value.trim())) {
    showMsg('⚠️ Please enter a valid email address.', 'red');
    email.focus();
    return;
  }
  if (!message.value.trim() || message.value.trim().length < 10) {
    showMsg('⚠️ Please enter a message (min 10 characters).', 'red');
    message.focus();
    return;
  }

  // Success
  showMsg('✅ Thank you! Your message has been sent successfully.', 'green');
  name.value = '';
  email.value = '';
  message.value = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMsg(text, color) {
  const msg = document.getElementById('form-msg');
  msg.textContent = text;
  msg.style.display = 'block';
  msg.style.color = color === 'green' ? '#2e7d32' : '#A31F34';
}

// ---- Search Filter for News ----
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const newsItems = document.querySelectorAll('.news-item');

    newsItems.forEach(item => {
      const title   = item.querySelector('.news-title')?.textContent.toLowerCase() || '';
      const excerpt = item.querySelector('.news-excerpt')?.textContent.toLowerCase() || '';
      if (title.includes(query) || excerpt.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// ---- Smooth Scroll for anchor links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---- Scroll Reveal Animation for Cards ----
function initScrollReveal() {
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}

// ---- Back to Top Button ----
function initBackToTop() {
  const btn = document.createElement('button');
  btn.textContent = '↑';
  btn.title = 'Back to Top';
  btn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #A31F34;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- Table Row Highlight ----
function initTableHighlight() {
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.style.backgroundColor = '');
      row.style.backgroundColor = '#fde8ec';
    });
  });
}

// ---- Dark Mode Toggle (optional) ----
function initDarkModeToggle() {
  const toggle = document.createElement('button');
  toggle.textContent = '🌙';
  toggle.title = 'Toggle Dark Mode';
  toggle.style.cssText = `
    position: fixed;
    bottom: 5rem;
    right: 2rem;
    background: #333;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toggle);

  let dark = false;
  toggle.addEventListener('click', () => {
    dark = !dark;
    document.body.style.backgroundColor = dark ? '#121212' : '';
    document.body.style.color           = dark ? '#e0e0e0' : '';
    toggle.textContent = dark ? '☀️' : '🌙';
  });
}

// ---- Init All on DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initActiveNav();
  initStickyHeader();
  initSearch();
  initSmoothScroll();
  initScrollReveal();
  initBackToTop();
  initTableHighlight();
  initDarkModeToggle();
  console.log('MIT Website JS loaded ✅');
});
