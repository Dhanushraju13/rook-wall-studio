/**
 * ==============================================================================
 * ROOK WALL STUDIO - HOMEPAGE JAVASCRIPT
 * js/main.js
 * Pure Vanilla JavaScript: addEventListener, No inline onclick
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check Session & Protect Homepage
  checkAuthProtection();

  // 2. Setup Mobile Navigation Menu
  initMobileNav();

  // 3. Setup Theme Switcher with localStorage persistence
  initThemeSwitcher();

  // 4. Setup Notification Flyout Panel
  initNotificationPanel();

  // 5. Setup Live Studio Clock (Date and Time updating every second)
  initLiveDateTime();

  // 6. Setup Animated Statistics Counters
  initStatsCounters();

  // 7. Setup Floating Scroll-to-Top Button
  initScrollToTop();

  // 8. Setup Scroll Reveal Animations
  initScrollAnimations();

  // 9. Setup Logout & Auth State Button
  initAuthState();

  // 10. Setup Marquee pause/resume without inline handlers (College Requirement)
  initMarquee();

  // 11. Setup Registration Form with Validation (College Requirement)
  initRegistrationForm();

  // 12. Setup Cinematic Spotlight Banner Slider (College Requirement)
  initSpotlightSlider();
});

/**
 * ------------------------------------------------------------------------------
 * 1. AUTHENTICATION PROTECTION & SESSION CHECK
 * If user accesses index.html without a valid session, redirect to login.html
 * ------------------------------------------------------------------------------
 */
function checkAuthProtection() {
  try {
    const sessionData = localStorage.getItem('rookwall_session');
    if (!sessionData) {
      // User is not logged in; redirect immediately to login.html
      window.location.replace('login.html');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Auth verification error:', err);
    window.location.replace('login.html');
    return false;
  }
}

/**
 * ------------------------------------------------------------------------------
 * 2. AUTH STATE & LOGOUT HANDLER
 * Displays user state and handles logout to clear session and return to login.html
 * ------------------------------------------------------------------------------
 */
function initAuthState() {
  const authBtn = document.getElementById('navAuthBtn');
  if (!authBtn) return;

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
        // Clear login session
        localStorage.removeItem('rookwall_session');
        // Redirect to login page
        window.location.href = 'login.html';
      });
    } else {
      authBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> LOGIN';
      authBtn.classList.remove('btn-logout');
      authBtn.setAttribute('href', 'login.html');
    }
  } catch (err) {
    console.error('Error in auth state init:', err);
  }
}

/**
 * ------------------------------------------------------------------------------
 * 3. MOBILE NAVIGATION MENU TOGGLE
 * Handles responsive hamburger toggle and outside clicks
 * ------------------------------------------------------------------------------
 */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburgerBtn || !navMenu) return;

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

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 4. THEME SWITCHER (Dark Mode / Light Mode)
 * Toggles theme and persists preference in localStorage
 * ------------------------------------------------------------------------------
 */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  // Retrieve saved theme or default to dark
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
}

/**
 * ------------------------------------------------------------------------------
 * 5. NOTIFICATION PANEL FLYOUT
 * Shows/hides announcements flyout on bell click
 * ------------------------------------------------------------------------------
 */
function initNotificationPanel() {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notificationPanel');

  if (!notifBtn || !notifPanel) return;

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

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (notifPanel.classList.contains('active') && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
      notifPanel.classList.remove('active');
      notifBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close panel on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notifPanel.classList.contains('active')) {
      notifPanel.classList.remove('active');
      notifBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 6. DYNAMIC CURRENT DATE AND TIME
 * Updates real-time studio clock every second using DOM manipulation
 * ------------------------------------------------------------------------------
 */
function initLiveDateTime() {
  const dateEl = document.getElementById('liveDate');
  const timeEl = document.getElementById('liveTime');

  function updateClock() {
    const now = new Date();

    // Format Date: e.g. "05 SEP 2026"
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${day} ${month} ${year}`;

    // Format Time: e.g. "14:28:05"
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    if (dateEl) dateEl.textContent = dateString;
    if (timeEl) timeEl.textContent = timeString;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * ------------------------------------------------------------------------------
 * 7. ANIMATED STATISTICS COUNTERS
 * Animates numbers (50+, 10+, 100+, 1M+) when scrolled into viewport
 * ------------------------------------------------------------------------------
 */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  function runCounters() {
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '+';
      const duration = 2000; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        el.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Use IntersectionObserver to trigger counter when stats section enters viewport
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            runCounters();
            observer.unobserve(statsSection);
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(statsSection);
  } else {
    // Fallback: run immediately
    runCounters();
  }
}

/**
 * ------------------------------------------------------------------------------
 * 8. SCROLL TO TOP FLOATING BUTTON
 * Displays when user scrolls down and smoothly scrolls window to top on click
 * ------------------------------------------------------------------------------
 */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

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

/**
 * ------------------------------------------------------------------------------
 * 9. SCROLL-BASED ANIMATION TRIGGER
 * Adds .is-revealed class to elements as they enter viewport
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
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: reveal all
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
}

/**
 * ------------------------------------------------------------------------------
 * 10. MARQUEE PAUSE/RESUME VIA EVENT LISTENERS (COLLEGE REQUIREMENT)
 * Eliminates inline onmouseover/onmouseout handlers and uses modern addEventListener
 * ------------------------------------------------------------------------------
 */
function initMarquee() {
  const marquee = document.querySelector('.studio-marquee');
  if (!marquee) return;

  marquee.addEventListener('mouseenter', () => {
    if (typeof marquee.stop === 'function') {
      marquee.stop();
    }
  });

  marquee.addEventListener('mouseleave', () => {
    if (typeof marquee.start === 'function') {
      marquee.start();
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 11. REGISTRATION FORM VALIDATION & HANDLING (COLLEGE REQUIREMENT)
 * Validates inputs on submit & blur, presents clear feedback, displays success card
 * ------------------------------------------------------------------------------
 */
function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  const successBox = document.getElementById('registrationSuccess');
  const resetAnotherBtn = document.getElementById('regResetAnother');

  const nameInput = document.getElementById('registration-name');
  const emailInput = document.getElementById('registration-email');
  const phoneInput = document.getElementById('registration-phone');
  const passwordInput = document.getElementById('registration-password');
  const dobInput = document.getElementById('registration-dob');
  const addressInput = document.getElementById('registration-address');

  const nameFeedback = document.getElementById('regNameFeedback');
  const emailFeedback = document.getElementById('regEmailFeedback');
  const phoneFeedback = document.getElementById('regPhoneFeedback');
  const passwordFeedback = document.getElementById('regPasswordFeedback');
  const genderFeedback = document.getElementById('regGenderFeedback');
  const dobFeedback = document.getElementById('regDobFeedback');
  const addressFeedback = document.getElementById('regAddressFeedback');

  if (!form) return;

  // Real-time / Blur validation
  if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, nameFeedback, () => nameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).'));
  if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, emailFeedback, () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Please enter a valid email address (e.g. name@domain.com).'));
  if (phoneInput) phoneInput.addEventListener('blur', () => validateField(phoneInput, phoneFeedback, () => /^[0-9\+\-\s\(\)]{10,15}$/.test(phoneInput.value.trim()), 'Please enter a valid phone number (10-15 digits).'));
  if (passwordInput) passwordInput.addEventListener('blur', () => validateField(passwordInput, passwordFeedback, () => passwordInput.value.length >= 6, 'Password must be at least 6 characters.'));
  if (dobInput) dobInput.addEventListener('change', () => validateField(dobInput, dobFeedback, () => dobInput.value !== '', 'Please select your date of birth.'));
  if (addressInput) addressInput.addEventListener('blur', () => validateField(addressInput, addressFeedback, () => addressInput.value.trim().length >= 5, 'Please enter your complete address.'));

  // Gender change listener
  const genderRadios = form.querySelectorAll('input[name="gender"]');
  genderRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (genderFeedback) {
        genderFeedback.textContent = '';
        genderFeedback.className = 'reg-feedback';
      }
    });
  });

  // Form Reset handler
  form.addEventListener('reset', () => {
    setTimeout(() => {
      clearAllValidation();
    }, 10);
  });

  // Form Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameFeedback, () => nameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
    const isEmailValid = validateField(emailInput, emailFeedback, () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()), 'Please enter a valid email address.');
    const isPhoneValid = validateField(phoneInput, phoneFeedback, () => /^[0-9\+\-\s\(\)]{10,15}$/.test(phoneInput.value.trim()), 'Please enter a valid contact phone number.');
    const isPasswordValid = validateField(passwordInput, passwordFeedback, () => passwordInput.value.length >= 6, 'Password must be at least 6 characters.');
    
    // Gender validation
    const checkedGender = form.querySelector('input[name="gender"]:checked');
    let isGenderValid = true;
    if (!checkedGender) {
      isGenderValid = false;
      if (genderFeedback) {
        genderFeedback.className = 'reg-feedback error';
        genderFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Please select your gender.';
      }
    } else {
      if (genderFeedback) {
        genderFeedback.textContent = '';
        genderFeedback.className = 'reg-feedback';
      }
    }

    const isDobValid = validateField(dobInput, dobFeedback, () => dobInput.value !== '', 'Please select your date of birth.');
    const isAddressValid = validateField(addressInput, addressFeedback, () => addressInput.value.trim().length >= 5, 'Please enter your complete address.');

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isGenderValid || !isDobValid || !isAddressValid) {
      const firstInvalid = form.querySelector('.is-invalid') || (!isGenderValid ? genderRadios[0] : null);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Submission Success: Show confirmation, hide form (do NOT store password in localStorage)
    form.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Register another account button
  if (resetAnotherBtn) {
    resetAnotherBtn.addEventListener('click', () => {
      form.reset();
      clearAllValidation();
      if (successBox) successBox.style.display = 'none';
      form.style.display = 'flex';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function validateField(inputEl, feedbackEl, validatorFn, errorMsg) {
    if (!inputEl) return false;
    const isValid = validatorFn();
    if (isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.className = 'reg-feedback success';
      }
      return true;
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      if (feedbackEl) {
        feedbackEl.className = 'reg-feedback error';
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${errorMsg}`;
      }
      return false;
    }
  }

  function clearAllValidation() {
    const inputs = [nameInput, emailInput, phoneInput, passwordInput, dobInput, addressInput];
    inputs.forEach(el => {
      if (el) el.classList.remove('is-valid', 'is-invalid');
    });
    const feedbacks = [nameFeedback, emailFeedback, phoneFeedback, passwordFeedback, genderFeedback, dobFeedback, addressFeedback];
    feedbacks.forEach(fb => {
      if (fb) {
        fb.textContent = '';
        fb.className = 'reg-feedback';
      }
    });
  }
}

/**
 * ------------------------------------------------------------------------------
 * 12. CINEMATIC SPOTLIGHT BANNER SLIDER (COLLEGE REQUIREMENT)
 * Supports automatic rotation, pause on hover, next/prev controls, and indicator dots
 * ------------------------------------------------------------------------------
 */
function initSpotlightSlider() {
  const slider = document.getElementById('cinematicSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dots = slider.querySelectorAll('.slider-dot');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoplayInterval = null;
  const slideDelay = 5500; // 5.5s autoplay rotation

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    if (dots[currentIndex]) {
      dots[currentIndex].classList.remove('active');
      dots[currentIndex].setAttribute('aria-selected', 'false');
    }

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
      dots[currentIndex].setAttribute('aria-selected', 'true');
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, slideDelay);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Next / Prev Button Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay(); // reset timer
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  // Dots indicator click listeners
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Keyboard accessibility
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  // Start autoplay
  startAutoplay();
}
