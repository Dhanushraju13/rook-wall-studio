/**
 * ==============================================================================
 * ROOK WALL STUDIO - PRODUCTIONS CATALOG JAVASCRIPT
 * js/productions.js
 * Pure Vanilla JavaScript: addEventListener, No inline onclick
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Common Global Components (Nav, Theme, Notifs, Clock, Auth, ScrollTop)
  initGlobalComponents();

  // 2. Initialize Productions Search & Filtering Engine
  initProductionsFiltering();

  // 3. Initialize Wishlist Storage & Interactions
  initWishlistSystem();

  // 4. Initialize Production Statistics Animated Counters
  initProductionCounters();

  // 5. Initialize Trailer Modal
  initTrailerModal();

  // 6. Initialize Scroll Reveal Animations
  initScrollAnimations();
});

/**
 * ------------------------------------------------------------------------------
 * 1. GLOBAL COMPONENTS INTEGRATION
 * Matches Home page behaviors for theme, notifications, mobile menu, and live clock
 * ------------------------------------------------------------------------------
 */
function initGlobalComponents() {
  // --- A. Auth State & Session Check ---
  const authBtn = document.getElementById('navAuthBtn');
  if (authBtn) {
    try {
      const sessionData = localStorage.getItem('rookwall_session');
      if (sessionData) {
        const user = JSON.parse(sessionData);
        authBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i> LOGOUT';
        authBtn.classList.add('btn-logout');
        authBtn.setAttribute('title', `Logged in as ${user.name || user.email}`);
        authBtn.setAttribute('aria-label', 'Logout of session');

        authBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('rookwall_session');
          window.location.href = '../login.html';
        });
      } else {
        authBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> LOGIN';
        authBtn.classList.remove('btn-logout');
        authBtn.setAttribute('href', '../login.html');
      }
    } catch (err) {
      console.error('Auth state error:', err);
    }
  }

  // --- B. Mobile Navigation Toggle ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('open');
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- C. Theme Switcher with localStorage Persistence ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const savedTheme = localStorage.getItem('rookwall_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('rookwall_theme', nextTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-sun';
        if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        themeIcon.className = 'fa-solid fa-moon';
        if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }
  }

  // --- D. Notification Panel Flyout ---
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notificationPanel');

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = notifPanel.classList.contains('active');
      if (isActive) {
        notifPanel.classList.remove('active');
        notifBtn.setAttribute('aria-expanded', 'false');
      } else {
        notifPanel.classList.add('active');
        notifBtn.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (e) => {
      if (notifPanel.classList.contains('active') && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.remove('active');
        notifBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && notifPanel.classList.contains('active')) {
        notifPanel.classList.remove('active');
        notifBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- E. Live Date & Time Clock in Footer ---
  const dateEl = document.getElementById('liveDate');
  const timeEl = document.getElementById('liveTime');

  function updateClock() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${day} ${month} ${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    if (dateEl) dateEl.textContent = dateString;
    if (timeEl) timeEl.textContent = timeString;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // --- F. Scroll-to-Top Button ---
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --- G. Graceful Image Error Handling ---
  const fallbackPoster = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.src !== fallbackPoster) {
        img.src = fallbackPoster;
      }
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 2. SEARCH & FILTERING ENGINE
 * Combined real-time search, category filtering, and year filtering
 * ------------------------------------------------------------------------------
 */
function initProductionsFiltering() {
  const searchInput = document.getElementById('prodSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  const yearButtons = document.querySelectorAll('.year-filter-btn');
  const prodCards = document.querySelectorAll('.prod-card');
  const noResultsBox = document.getElementById('noResultsBox');
  const countDisplay = document.getElementById('resultsCountNumber');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  if (!prodCards.length) return;

  // Active filter state
  let currentSearch = '';
  let currentCategory = 'all';
  let currentYear = 'all';

  // Apply filters combined
  function applyCombinedFilters() {
    let visibleCount = 0;
    const query = currentSearch.trim().toLowerCase();

    prodCards.forEach((card) => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const year = (card.getAttribute('data-year') || '').toLowerCase();
      const genre = (card.getAttribute('data-genre') || '').toLowerCase();
      const desc = (card.getAttribute('data-desc') || '').toLowerCase();

      // Search match condition: title, genre, or description contains query
      const matchesSearch = !query || title.includes(query) || genre.includes(query) || desc.includes(query);

      // Category match condition
      const matchesCategory = currentCategory === 'all' || category === currentCategory.toLowerCase();

      // Year match condition
      const matchesYear = currentYear === 'all' || year === currentYear.toLowerCase();

      if (matchesSearch && matchesCategory && matchesYear) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count display
    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }

    // Toggle No Results box
    if (noResultsBox) {
      if (visibleCount === 0) {
        noResultsBox.classList.add('visible');
      } else {
        noResultsBox.classList.remove('visible');
      }
    }
  }

  // Search input event listener
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      if (searchClearBtn) {
        if (currentSearch.length > 0) {
          searchClearBtn.classList.add('visible');
        } else {
          searchClearBtn.classList.remove('visible');
        }
      }
      applyCombinedFilters();
    });
  }

  // Clear search button listener
  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      searchClearBtn.classList.remove('visible');
      searchInput.focus();
      applyCombinedFilters();
    });
  }

  // Category filter buttons listeners
  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      applyCombinedFilters();
    });
  });

  // Year filter buttons listeners
  yearButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      yearButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentYear = btn.getAttribute('data-year') || 'all';
      applyCombinedFilters();
    });
  });

    const handleResetAll = () => {
      // Reset search
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      if (searchClearBtn) searchClearBtn.classList.remove('visible');

      // Reset category buttons
      categoryButtons.forEach((b) => {
        if (b.getAttribute('data-category') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      currentCategory = 'all';

      // Reset year buttons
      yearButtons.forEach((b) => {
        if (b.getAttribute('data-year') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      currentYear = 'all';

      applyCombinedFilters();
    };

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', handleResetAll);
    }

    const noResultsClearBtn = document.getElementById('noResultsClearBtn');
    if (noResultsClearBtn) {
      noResultsClearBtn.addEventListener('click', handleResetAll);
    }

  // Initial calculation
  applyCombinedFilters();
}

/**
 * ------------------------------------------------------------------------------
 * 3. WISHLIST SYSTEM (localStorage: rookWallWishlist)
 * Toggles wishlist status, updates button icon/text, persists in localStorage,
 * and presents animated toast notifications
 * ------------------------------------------------------------------------------
 */
const WISHLIST_KEY = 'rookWallWishlist';

function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error accessing wishlist in localStorage:', err);
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving wishlist to localStorage:', err);
  }
}

function initWishlistSystem() {
  const wishlistButtons = document.querySelectorAll('.btn-wishlist');
  const toast = document.getElementById('wishlistToast');
  const toastText = document.getElementById('wishlistToastText');
  let toastTimer = null;

  function showToast(message, isAdded) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    const icon = toast.querySelector('i');
    if (icon) {
      icon.className = isAdded ? 'fa-solid fa-heart wishlist-toast-icon' : 'fa-regular fa-heart wishlist-toast-icon';
    }
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function updateButtonUI(btn, isWishlisted) {
    const icon = btn.querySelector('i');
    const labelSpan = btn.querySelector('.wishlist-btn-text');

    if (isWishlisted) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      if (icon) icon.className = 'fa-solid fa-heart';
      if (labelSpan) labelSpan.textContent = 'In Wishlist';
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      if (icon) icon.className = 'fa-regular fa-heart';
      if (labelSpan) labelSpan.textContent = 'Wishlist';
    }
  }

  // Sync with current stored wishlist on page load
  const currentWishlist = getWishlist();
  wishlistButtons.forEach((btn) => {
    const prodId = btn.getAttribute('data-prod-id');
    const isWishlisted = currentWishlist.includes(prodId);
    updateButtonUI(btn, isWishlisted);

    // Click event listener
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const list = getWishlist();
      const index = list.indexOf(prodId);
      let isAdded = false;

      if (index >= 0) {
        // Remove from wishlist
        list.splice(index, 1);
        saveWishlist(list);
        updateButtonUI(btn, false);
        showToast('Removed from wishlist', false);
      } else {
        // Add to wishlist
        list.push(prodId);
        saveWishlist(list);
        updateButtonUI(btn, true);
        showToast('Added to wishlist', true);
      }

      // If multiple buttons share the same ID (e.g. featured card + grid card), sync them
      document.querySelectorAll(`.btn-wishlist[data-prod-id="${prodId}"]`).forEach((b) => {
        updateButtonUI(b, !isAdded ? list.includes(prodId) : false);
      });
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 4. PRODUCTION STATISTICS ANIMATED COUNTERS
 * Animates numbers (06, 02, 02, 01, 01) when scrolled into view
 * ------------------------------------------------------------------------------
 */
function initProductionCounters() {
  const counterElements = document.querySelectorAll('.prod-stat-number');
  if (!counterElements.length) return;

  let hasRun = false;

  function runCounters() {
    counterElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const padZero = el.getAttribute('data-pad') === 'true';
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        el.textContent = padZero && currentVal < 10 ? `0${currentVal}` : `${currentVal}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = padZero && target < 10 ? `0${target}` : `${target}`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.prod-stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;
            runCounters();
            observer.unobserve(statsSection);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(statsSection);
  } else {
    runCounters();
  }
}

/**
 * ------------------------------------------------------------------------------
 * 5. WATCH TRAILER MODAL
 * Handles opening and closing of trailer video modal
 * ------------------------------------------------------------------------------
 */
function initTrailerModal() {
  const openButtons = document.querySelectorAll('.btn-watch-trailer');
  const modal = document.getElementById('trailerModal');
  const closeBtn = document.getElementById('closeTrailerModalBtn');
  const iframe = document.getElementById('trailerIframe');

  if (!modal) return;

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    // Load embed or sample video
    if (iframe) {
      iframe.src = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1';
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (iframe) {
      iframe.src = '';
    }
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 6. SCROLL REVEAL ANIMATIONS
 * ------------------------------------------------------------------------------
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}
