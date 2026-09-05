/**
 * ROOK WALL STUDIO — ABOUT PAGE JAVASCRIPT
 * (js/about.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavAuth();
  initHamburger();
  initLiveClock();
  initNotifications();
  initScrollReveal();
  initAboutCounters();
  initScrollToTop();
});

/* --------------------------------------------------------------------------
   1. THEME MANAGEMENT
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('rookwall_theme') || localStorage.getItem('rookWallTheme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rookwall_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;
  const icon = themeToggleBtn.querySelector('i');
  if (!icon) return;

  if (theme === 'light') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

/* --------------------------------------------------------------------------
   2. AUTHENTICATION STATE IN NAV
   -------------------------------------------------------------------------- */
function initNavAuth() {
  const navAuthBtn = document.getElementById('navAuthBtn');
  if (!navAuthBtn) return;

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem('rookwall_session'));
  } catch (e) {
    session = null;
  }

  if (session && session.username) {
    navAuthBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>LOGOUT</span>';
    navAuthBtn.setAttribute('href', '#');
    navAuthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('rookwall_session');
      window.location.reload();
    });
  }
}

/* --------------------------------------------------------------------------
   3. MOBILE HAMBURGER MENU
   -------------------------------------------------------------------------- */
function initHamburger() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener('click', () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('nav-open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('nav-open');
    }
  });
}

/* --------------------------------------------------------------------------
   4. LIVE CLOCK (FOOTER)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const dateEl = document.getElementById('liveDate');
  const timeEl = document.getElementById('liveTime');

  if (!dateEl && !timeEl) return;

  function update() {
    const now = new Date();
    if (dateEl) {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   5. NOTIFICATIONS PANEL
   -------------------------------------------------------------------------- */
function initNotifications() {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notificationPanel');
  const notifCount = document.getElementById('notifCount');

  if (!notifBtn || !notifPanel) return;

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = notifBtn.getAttribute('aria-expanded') === 'true';
    notifBtn.setAttribute('aria-expanded', String(!isExpanded));
    notifPanel.classList.toggle('is-visible');

    if (notifCount && notifPanel.classList.contains('is-visible')) {
      notifCount.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
      notifBtn.setAttribute('aria-expanded', 'false');
      notifPanel.classList.remove('is-visible');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notifPanel.classList.contains('is-visible')) {
      notifBtn.setAttribute('aria-expanded', 'false');
      notifPanel.classList.remove('is-visible');
    }
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-about');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. ANIMATED STATISTICS COUNTERS
   -------------------------------------------------------------------------- */
function initAboutCounters() {
  const counters = document.querySelectorAll('.js-about-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(counter) {
  const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
  const suffix = counter.getAttribute('data-suffix') || '';
  const duration = 1800; // ms
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic formula
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeOut * target);

    counter.textContent = currentVal + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = target + suffix;
    }
  }

  requestAnimationFrame(updateCount);
}

/* --------------------------------------------------------------------------
   8. SCROLL TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
