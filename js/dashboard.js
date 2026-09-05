/* ==========================================================================
   ROOK WALL STUDIO — STUDIO DASHBOARD SCRIPT
   js/dashboard.js
   All interactions via addEventListener() — NO inline handlers
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   CONSTANTS & STORAGE KEYS
   -------------------------------------------------------------------------- */
const THEME_KEY     = 'rookWallTheme';
const DASH_PREF_KEY = 'rookWallDashPref';

/* --------------------------------------------------------------------------
   DOMContentLoaded — boot all modules
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initNavAuth();
  initHamburger();
  initLiveClock();
  initDashDateTime();
  initNotifications();
  initCounters();
  initProductionCards();
  initProgressBars();
  initScrollReveal();
  initScrollToTop();
  initDashPreferences();
  initCustomisePanel();
});

/* ==========================================================================
   1. THEME — persisted via localStorage (rookWallTheme)
   ========================================================================== */
function initTheme() {
  const root    = document.documentElement;
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  // Load saved theme
  const saved = localStorage.getItem(THEME_KEY) || localStorage.getItem('rookwall_theme') || 'dark';
  root.setAttribute('data-theme', saved);
  updateThemeIcon(themeBtn, saved);

  themeBtn.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    localStorage.setItem('rookwall_theme', next);
    updateThemeIcon(themeBtn, next);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

/* ==========================================================================
   2. NAV AUTH BUTTON — show LOGIN or LOGOUT
   ========================================================================== */
function initNavAuth() {
  const authBtn = document.getElementById('navAuthBtn');
  if (!authBtn) return;

  const session = localStorage.getItem('rookwall_session');
  if (session) {
    try {
      const user = JSON.parse(session);
      authBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>LOGOUT</span>';
      authBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('rookwall_session');
        window.location.href = '../login.html';
      });
    } catch (_) {
      // malformed session
    }
  }
}

/* ==========================================================================
   3. HAMBURGER MENU
   ========================================================================== */
function initHamburger() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   4. LIVE CLOCK — footer clock (liveDate / liveTime)
   ========================================================================== */
function initLiveClock() {
  const dateEl = document.getElementById('liveDate');
  const timeEl = document.getElementById('liveTime');
  if (!dateEl && !timeEl) return;

  function tick() {
    const now = new Date();
    if (dateEl) {
      const day   = String(now.getDate()).padStart(2, '0');
      const month = now.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
      const year  = now.getFullYear();
      dateEl.textContent = `${day} ${month} ${year}`;
    }
    if (timeEl) {
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${hh}:${mm}:${ss}`;
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   5. DASHBOARD HEADER DATE/TIME — dashDate / dashTime
   ========================================================================== */
function initDashDateTime() {
  const dashDateEl = document.getElementById('dashDate');
  const dashTimeEl = document.getElementById('dashTime');
  if (!dashDateEl && !dashTimeEl) return;

  const DAYS   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

  function tickDash() {
    const now = new Date();
    if (dashDateEl) {
      const day   = DAYS[now.getDay()];
      const date  = now.getDate();
      const month = MONTHS[now.getMonth()];
      const year  = now.getFullYear();
      dashDateEl.textContent = `${day}, ${month} ${date}, ${year}`;
    }
    if (dashTimeEl) {
      let hh   = now.getHours();
      const mm   = String(now.getMinutes()).padStart(2, '0');
      const ss   = String(now.getSeconds()).padStart(2, '0');
      const ampm = hh >= 12 ? 'PM' : 'AM';
      hh = hh % 12 || 12;
      dashTimeEl.textContent = `${String(hh).padStart(2,'0')}:${mm}:${ss} ${ampm}`;
    }
  }

  tickDash();
  setInterval(tickDash, 1000);
}

/* ==========================================================================
   6. NOTIFICATIONS
   ========================================================================== */
function initNotifications() {
  const notifBtn    = document.getElementById('notifBtn');
  const notifPanel  = document.getElementById('notificationPanel');
  const markAllBtn  = document.getElementById('markAllReadBtn');
  const notifCount  = document.getElementById('notifCount');
  if (!notifBtn || !notifPanel) return;

  // Open / close on bell click
  notifBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = notifPanel.classList.toggle('active');
    notifPanel.classList.toggle('is-open', isOpen);
    notifBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('active', 'is-open');
      notifBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      notifPanel.classList.remove('active', 'is-open');
      notifBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Mark All As Read
  if (markAllBtn) {
    markAllBtn.addEventListener('click', function () {
      const unread = notifPanel.querySelectorAll('.notif-unread');
      unread.forEach(function (item) {
        item.classList.remove('notif-unread');
        item.classList.add('notif-read');
        const dot = item.querySelector('.unread-dot');
        if (dot) dot.style.display = 'none';
      });

      if (notifCount) {
        notifCount.textContent = '0';
        notifCount.classList.add('notif-badge-read');
        notifCount.style.opacity = '0.4';
      }

      markAllBtn.textContent = 'ALL READ';
      markAllBtn.disabled    = true;
      markAllBtn.style.opacity = '0.5';
    });
  }

  // Update count badge on load
  if (notifCount) {
    const count = notifPanel.querySelectorAll('.notif-unread').length;
    notifCount.textContent = String(count);
    if (count === 0) {
      notifCount.classList.add('notif-badge-read');
      notifCount.style.opacity = '0.4';
    }
  }
}

/* ==========================================================================
   7. ANIMATED COUNTERS — requestAnimationFrame
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.js-counter');
  if (!counters.length) return;

  // Use IntersectionObserver to trigger animation when visible
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (el) { observer.observe(el); });
}

function animateCounter(el) {
  const rawTarget = el.getAttribute('data-target') || '0';
  const target    = parseInt(rawTarget, 10);
  const suffix    = el.getAttribute('data-suffix') || '';
  const isPadded  = rawTarget.startsWith('0') && rawTarget.length > 1;
  const padLen    = rawTarget.length;
  const duration  = 1600; // ms
  const startTime = performance.now();

  function easeOutQuad(t) { return t * (2 - t); }

  function frame(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutQuad(progress);

    if (suffix === 'M+' && target <= 10) {
      // Smoothly animate 1M+ with decimals (0.1M+ -> 0.5M+ -> 1M+)
      const currentFloat = (eased * target).toFixed(1);
      el.textContent = (progress < 1 ? currentFloat : target) + suffix;
    } else {
      const current = Math.round(eased * target);
      const displayVal = isPadded ? String(current).padStart(padLen, '0') : String(current);
      el.textContent = displayVal + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      const finalVal = isPadded ? String(target).padStart(padLen, '0') : String(target);
      el.textContent = finalVal + suffix;
    }
  }

  requestAnimationFrame(frame);
}

/* ==========================================================================
   8. PRODUCTION STATUS CARDS — click to expand details
   ========================================================================== */
function initProductionCards() {
  const cards = document.querySelectorAll('.prod-status-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      toggleCard(card);
    });

    // Keyboard: Enter / Space to expand
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });
}

function toggleCard(card) {
  const detail  = card.querySelector('.prod-status-detail');
  const isOpen  = card.getAttribute('aria-expanded') === 'true';

  // Collapse all others first
  document.querySelectorAll('.prod-status-card').forEach(function (c) {
    if (c !== card) {
      c.setAttribute('aria-expanded', 'false');
      const d = c.querySelector('.prod-status-detail');
      if (d) {
        d.classList.remove('is-open');
        d.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Toggle this card
  if (detail) {
    detail.classList.toggle('is-open', !isOpen);
    detail.setAttribute('aria-hidden', String(isOpen));
  }
  card.setAttribute('aria-expanded', String(!isOpen));

  // Save expanded card to localStorage
  if (!isOpen) {
    localStorage.setItem(DASH_PREF_KEY + '_expandedCard', card.dataset.project || '');
  } else {
    localStorage.removeItem(DASH_PREF_KEY + '_expandedCard');
  }
}

/* ==========================================================================
   9. ANIMATED PROGRESS BARS — IntersectionObserver
   ========================================================================== */
function initProgressBars() {
  const bars = document.querySelectorAll('.prod-progress-bar, .perf-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const width = entry.target.getAttribute('data-width') || '0';
        // Small delay for staggered visual effect
        setTimeout(function () {
          entry.target.style.width = width + '%';
        }, 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(function (bar) { observer.observe(bar); });
}

/* ==========================================================================
   10. SCROLL REVEAL — IntersectionObserver for section entrance animations
   ========================================================================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right, .reveal-scale'
  );
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger children slightly
        const delay = entry.target.dataset.delay || 0;
        setTimeout(function () {
          entry.target.classList.add('revealed', 'is-revealed');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el, i) {
    // Assign stagger delay based on index within same parent
    if (!el.dataset.delay) {
      el.dataset.delay = String((i % 4) * 80);
    }
    observer.observe(el);
  });
}

/* ==========================================================================
   11. SCROLL-TO-TOP BUTTON
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  // Show / hide based on scroll position
  window.addEventListener('scroll', function () {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // Smooth scroll to top
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   12. DASHBOARD PREFERENCES — localStorage
   ========================================================================== */
function initDashPreferences() {
  // Restore previously expanded card
  const expandedProject = localStorage.getItem(DASH_PREF_KEY + '_expandedCard');
  if (expandedProject) {
    const card = document.querySelector(`.prod-status-card[data-project="${expandedProject}"]`);
    if (card) {
      // Slight delay to allow layout paint first
      setTimeout(function () { toggleCard(card); }, 400);
    }
  }

  // Save a basic "last visited" timestamp
  localStorage.setItem(DASH_PREF_KEY + '_lastVisit', new Date().toISOString());
}

/* ==========================================================================
   13. STUDIO CUSTOMISE PANEL — input[type=color] + input[type=range]
   Uses addEventListener (no inline handlers). Persists to localStorage.
   ========================================================================== */
function initCustomisePanel() {
  const colorPicker   = document.getElementById('accentColorPicker');
  const brightnessSlider = document.getElementById('uiBrightness');
  const brightnessVal = document.getElementById('brightnessVal');
  const resetBtn      = document.getElementById('resetCustomiseBtn');

  const CUSTOMISE_KEY = 'rookWallDashCustomise';
  const DEFAULT_ACCENT = '#e63946';
  const DEFAULT_BRIGHTNESS = 100;

  // Restore saved preferences
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOMISE_KEY) || '{}');
    if (saved.accent && colorPicker) {
      colorPicker.value = saved.accent;
      document.documentElement.style.setProperty('--accent-bright', saved.accent);
    }
    if (saved.brightness !== undefined && brightnessSlider) {
      brightnessSlider.value = saved.brightness;
      if (brightnessVal) brightnessVal.textContent = saved.brightness;
      document.body.style.filter = `brightness(${saved.brightness / 100})`;
    }
  } catch (e) {
    console.warn('Could not restore customise preferences:', e);
  }

  // Color picker — input event fires live; change event on final selection
  if (colorPicker) {
    colorPicker.addEventListener('input', function () {
      document.documentElement.style.setProperty('--accent-bright', colorPicker.value);
    });
    colorPicker.addEventListener('change', function () {
      document.documentElement.style.setProperty('--accent-bright', colorPicker.value);
      try {
        const saved = JSON.parse(localStorage.getItem(CUSTOMISE_KEY) || '{}');
        saved.accent = colorPicker.value;
        localStorage.setItem(CUSTOMISE_KEY, JSON.stringify(saved));
      } catch (e) { /* ignore */ }
    });
  }

  // Brightness range slider
  if (brightnessSlider) {
    brightnessSlider.addEventListener('input', function () {
      const val = parseInt(brightnessSlider.value, 10);
      if (brightnessVal) brightnessVal.textContent = val;
      brightnessSlider.setAttribute('aria-valuenow', val);
      document.body.style.filter = `brightness(${val / 100})`;
    });
    brightnessSlider.addEventListener('change', function () {
      const val = parseInt(brightnessSlider.value, 10);
      try {
        const saved = JSON.parse(localStorage.getItem(CUSTOMISE_KEY) || '{}');
        saved.brightness = val;
        localStorage.setItem(CUSTOMISE_KEY, JSON.stringify(saved));
      } catch (e) { /* ignore */ }
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (colorPicker) {
        colorPicker.value = DEFAULT_ACCENT;
        document.documentElement.style.setProperty('--accent-bright', DEFAULT_ACCENT);
      }
      if (brightnessSlider) {
        brightnessSlider.value = DEFAULT_BRIGHTNESS;
        if (brightnessVal) brightnessVal.textContent = DEFAULT_BRIGHTNESS;
        brightnessSlider.setAttribute('aria-valuenow', DEFAULT_BRIGHTNESS);
        document.body.style.filter = '';
      }
      try {
        localStorage.removeItem(CUSTOMISE_KEY);
      } catch (e) { /* ignore */ }
    });
  }
}

