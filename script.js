// =============================================
//  HANA ATINAF PORTFOLIO — SCRIPT.JS
// =============================================

// ---------- NAVBAR: scroll shadow + hide/show ----------
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Hide nav on scroll down, show on scroll up
  if (currentScrollY > lastScrollY && currentScrollY > 400) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
});

// ---------- HAMBURGER MENU ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Add reveal class to elements we want to animate in
const revealTargets = document.querySelectorAll(
  '.about-text, .about-image-wrap, .skill-card, .featured-project, .project-card, .contact-container, .exp-panel, .edu-card, .cert-badge'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger skill cards and project cards
  if (el.classList.contains('skill-card') || el.classList.contains('project-card')) {
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
  }
  revealObserver.observe(el);
});

// ---------- ACTIVE NAV LINK ON SCROLL ----------
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach(s => activeLinkObserver.observe(s));

// ---------- EXPERIENCE TABS ----------
document.querySelectorAll('.exp-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + tab.dataset.target);
    if (panel) panel.classList.add('active');
  });
});

// ---------- TYPED EFFECT (hero title) ----------
const titles = [
  'I build things for the web.',
  'I design secure systems.',
  'I bridge tech & business.',
  'I love REST APIs.',
];
let titleIndex = 0;
let charIndex  = 0;
let deleting   = false;
const heroTitle = document.querySelector('.hero-title');

function typeLoop() {
  const current = titles[titleIndex];

  if (!deleting) {
    heroTitle.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
  } else {
    heroTitle.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 50 : 80);
}

// Start typing after hero animation completes
setTimeout(typeLoop, 1200);

// ---------- SMOOTH ANCHOR SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height'), 10) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- CURSOR GLOW (desktop only) ----------
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100,255,218,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ---------- CONSOLE EASTER EGG ----------
console.log('%c Hi there! 👋', 'color:#64ffda;font-size:20px;font-weight:bold;');
console.log('%c Built by Hana Atinaf — Software Developer & Solution Architect Intern', 'color:#a8b2d8;font-size:13px;');
console.log('%c github.com/hanaatinaf  |  linkedin.com/in/hanaatinaf', 'color:#8892b0;font-size:12px;');
