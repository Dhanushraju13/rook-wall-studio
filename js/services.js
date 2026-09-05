/**
 * ROOK WALL STUDIO — SERVICES PAGE JAVASCRIPT
 * (js/services.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavAuth();
  initHamburger();
  initLiveClock();
  initNotifications();
  initScrollReveal();
  initCapabilitiesBars();
  initServiceModal();
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
   6. SCROLL REVEAL UTILITY
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-svc');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. CAPABILITIES ANIMATED PROGRESS BARS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initCapabilitiesBars() {
  const bars = document.querySelectorAll('.js-capability-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width') || '0%';
        bar.style.width = targetWidth;
        obs.unobserve(bar);
      }
    });
  }, {
    threshold: 0.25
  });

  bars.forEach(bar => observer.observe(bar));
}

/* --------------------------------------------------------------------------
   8. SERVICE INTERACTIVE MODAL DIALOG
   -------------------------------------------------------------------------- */
const SERVICE_DATA = {
  'development': {
    category: 'Creative Phase',
    title: 'Film Development',
    iconClass: 'fa-solid fa-pen-nib',
    desc: 'Concept ideation, narrative design, script doctoring, character architecture, and investor-ready lookbooks.',
    provides: [
      'Narrative premise & treatment design',
      'Full screenplay drafting & doctoring',
      'Pitch decks & financial lookbooks',
      'Audience demographic & market calibration'
    ],
    workflow: 'Initial creative consultation → Premise delivery → First draft script → Polish & pitch readiness.'
  },
  'pre-production': {
    category: 'Planning Phase',
    title: 'Pre-Production',
    iconClass: 'fa-solid fa-clipboard-list',
    desc: 'Comprehensive storyboarding, location scouting, casting calls, breakdown sheets, and rigorous call scheduling.',
    provides: [
      'Visual storyboarding & animatics',
      'Comprehensive cast auditing & contracts',
      'Technical location permits & logistics',
      'Master production breakdown & day-out-of-days'
    ],
    workflow: 'Script breakdown → Department heads attachment → Tech scouts → Final production meeting.'
  },
  'production': {
    category: 'Execution Phase',
    title: 'Film Production',
    iconClass: 'fa-solid fa-film',
    desc: 'Principal photography, RED/ARRI multi-camera setups, cinematic gaffer lighting, and pristine location sound capture.',
    provides: [
      'Cinema camera packages (ARRI/RED 8K)',
      'Full lighting and grip electrical package',
      'Multi-channel location sound recording',
      'Professional union & indie crew staffing'
    ],
    workflow: 'Call sheet release → Crew call & setup → Principal photography → Daily digital asset transfer.'
  },
  'post-production': {
    category: 'Finishing Phase',
    title: 'Post-Production',
    iconClass: 'fa-solid fa-sliders',
    desc: 'Offline/online picture cut, DaVinci Resolve color grading, Dolby Atmos sound design, original scoring, and VFX compositing.',
    provides: [
      'Offline rough assembly to picture lock',
      'DaVinci Resolve HDR color grading',
      'Dolby Atmos 7.1.4 sound mix & foley',
      'Original thematic orchestral scoring'
    ],
    workflow: 'Ingest & sync → Director assembly cut → Sound/color lock → Master delivery.'
  },
  'promotional': {
    category: 'Marketing Phase',
    title: 'Promotional Content',
    iconClass: 'fa-solid fa-clapperboard',
    desc: 'Impactful cinematic trailers, festival cut downs, social media teasers, high-resolution key art, and press materials.',
    provides: [
      'Theatrical teaser & official trailer cuts',
      'Social aspect ratio re-frames (9:16, 1:1, 4:5)',
      'High-resolution poster & typography design',
      'EPK (Electronic Press Kit) interview packages'
    ],
    workflow: 'Footage mining → Trailer music licensing → Sound design hit-points → Multi-platform release master.'
  },
  'documentary': {
    category: 'Non-Fiction Phase',
    title: 'Documentary Production',
    iconClass: 'fa-solid fa-video',
    desc: 'Investigative research, intimate observational cinema, verité camera technique, archival restoration, and human interest portraits.',
    provides: [
      'Deep archival & investigative research',
      'Verité cinema direct cinematography',
      'Ethical participant interviewing',
      'Historical archive scan & restoration'
    ],
    workflow: 'Subject immersion → Field filming blocks → Paper edit architecture → Final documentary master.'
  },
  'consultation': {
    category: 'Advisory Phase',
    title: 'Creative Consultation',
    iconClass: 'fa-solid fa-lightbulb',
    desc: 'Independent creative auditing, budget engineering, film market analysis, visual tone calibration, and festival route planning.',
    provides: [
      'Screenplay feedback & narrative restructuring',
      'Tax incentive & line item budgeting',
      'Camera & lens aesthetic testing',
      'International film festival roadmap'
    ],
    workflow: 'Project review → Diagnostic written report → 1-on-1 strategy workshop → Ongoing milestone check-ins.'
  },
  'distribution': {
    category: 'Delivery Phase',
    title: 'Digital Distribution',
    iconClass: 'fa-solid fa-satellite-dish',
    desc: 'DCP cinema mastering, Apple ProRes / Netflix spec delivery packaging, metadata structuring, and streaming platform handoffs.',
    provides: [
      'DCI-compliant encrypted/unencrypted DCPs',
      'Netflix / OTT technical QC verification',
      'International subtitling & closed-captioning',
      'VOD / theatrical delivery packaging'
    ],
    workflow: 'Quality control screening → Encoding & checksums → Hard drive / Aspera transfer → Platform acceptance.'
  }
};

function initServiceModal() {
  const modal = document.getElementById('serviceModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const triggerBtns = document.querySelectorAll('.js-open-modal');

  const categoryEl = document.getElementById('modalServiceCategory');
  const titleEl = document.getElementById('modalServiceTitle');
  const iconEl = document.getElementById('modalServiceIcon');
  const descEl = document.getElementById('modalServiceDesc');
  const provideListEl = document.getElementById('modalServiceProvide');
  const workflowEl = document.getElementById('modalServiceWorkflow');

  if (!modal) return;

  function openModal(serviceKey) {
    const data = SERVICE_DATA[serviceKey];
    if (!data) return;

    if (categoryEl) categoryEl.textContent = data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (iconEl) iconEl.innerHTML = `<i class="${data.iconClass}"></i>`;
    if (descEl) descEl.textContent = data.desc;
    if (workflowEl) workflowEl.textContent = data.workflow;

    if (provideListEl) {
      provideListEl.innerHTML = '';
      data.provides.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        provideListEl.appendChild(li);
      });
    }

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-service');
      openModal(serviceKey);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   9. SCROLL TO TOP BUTTON
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
