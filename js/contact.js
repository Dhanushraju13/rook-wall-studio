/**
 * ROOK WALL STUDIO — CONTACT PAGE JAVASCRIPT
 * (js/contact.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavAuth();
  initHamburger();
  initLiveClock();
  initNotifications();
  initScrollReveal();
  initChannelLinks();
  initContactForm();
  initFaqAccordion();
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
  const revealElements = document.querySelectorAll('.reveal-cnt');
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
   7. CHANNEL LINKS QUICK-ROUTING
   -------------------------------------------------------------------------- */
function initChannelLinks() {
  const channelLinks = document.querySelectorAll('.js-channel-link');
  const enquirySelect = document.getElementById('contactEnquiryType');

  channelLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const type = link.getAttribute('data-type');
      if (enquirySelect && type) {
        enquirySelect.value = type;
        enquirySelect.dispatchEvent(new Event('change'));
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM WITH HTML5 & JS VALIDATION, DRAFT STORAGE & SUCCESS PANEL
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successPanel = document.getElementById('formSuccessPanel');
  const sendAnotherBtn = document.getElementById('btnSendAnother');
  const clearDraftBtn = document.getElementById('btnClearDraft');
  const draftStatusText = document.getElementById('draftStatusText');

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const subjectInput = document.getElementById('contactSubject');
  const typeSelect = document.getElementById('contactEnquiryType');
  const messageInput = document.getElementById('contactMessage');
  const charCountEl = document.getElementById('charCount');

  const nameFeedback = document.getElementById('nameFeedback');
  const emailFeedback = document.getElementById('emailFeedback');
  const phoneFeedback = document.getElementById('phoneFeedback');
  const subjectFeedback = document.getElementById('subjectFeedback');
  const typeFeedback = document.getElementById('typeFeedback');
  const messageFeedback = document.getElementById('messageFeedback');

  const successSenderName = document.getElementById('successSenderName');
  const successCategory = document.getElementById('successCategory');

  if (!form) return;

  const DRAFT_KEY = 'rookWallContactDraft';

  // Restore draft on page load
  restoreDraft();

  // Character counter for message textarea
  if (messageInput && charCountEl) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCountEl.textContent = currentLength;
      if (currentLength > 480) {
        charCountEl.style.color = 'var(--accent-bright, #ef233c)';
      } else {
        charCountEl.style.color = '';
      }
      saveDraft();
    });
  }

  // Auto-save draft on input/change
  const formFields = [nameInput, emailInput, phoneInput, subjectInput, typeSelect];
  formFields.forEach(field => {
    if (field) {
      field.addEventListener('input', saveDraft);
      field.addEventListener('change', saveDraft);
    }
  });

  // Blur validation handlers
  if (nameInput) nameInput.addEventListener('blur', () => validateName(true));
  if (emailInput) emailInput.addEventListener('blur', () => validateEmail(true));
  if (phoneInput) phoneInput.addEventListener('blur', () => validatePhone(true));
  if (subjectInput) subjectInput.addEventListener('blur', () => validateSubject(true));
  if (typeSelect) typeSelect.addEventListener('change', () => validateType(true));
  if (messageInput) messageInput.addEventListener('blur', () => validateMessage(true));

  // Clear draft button
  if (clearDraftBtn) {
    clearDraftBtn.addEventListener('click', () => {
      localStorage.removeItem(DRAFT_KEY);
      form.reset();
      if (charCountEl) charCountEl.textContent = '0';
      clearAllFeedback();
      if (draftStatusText) {
        draftStatusText.textContent = 'Draft cleared successfully.';
        setTimeout(() => {
          draftStatusText.textContent = 'Auto-saving draft locally...';
        }, 2500);
      }
    });
  }

  // Form Reset handler
  form.addEventListener('reset', () => {
    setTimeout(() => {
      if (charCountEl) charCountEl.textContent = '0';
      clearAllFeedback();
    }, 10);
  });

  // Form Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName(false);
    const isEmailValid = validateEmail(false);
    const isPhoneValid = validatePhone(false);
    const isSubjectValid = validateSubject(false);
    const isTypeValid = validateType(false);
    const isMessageValid = validateMessage(false);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isSubjectValid || !isTypeValid || !isMessageValid) {
      // Focus first invalid element
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Submission success
    const submittedName = nameInput.value.trim();
    const submittedType = typeSelect.value;

    // Clear local storage draft
    localStorage.removeItem(DRAFT_KEY);

    // Update success panel
    if (successSenderName) successSenderName.textContent = submittedName;
    if (successCategory) successCategory.textContent = submittedType;

    // Transition view
    form.style.display = 'none';
    if (successPanel) {
      successPanel.style.display = 'block';
      successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Send another message button in success panel
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
      form.reset();
      clearAllFeedback();
      if (charCountEl) charCountEl.textContent = '0';
      if (successPanel) successPanel.style.display = 'none';
      form.style.display = 'flex';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Helper validation functions
  function validateName(isSoft) {
    const val = nameInput ? nameInput.value.trim() : '';
    if (!val) {
      if (!isSoft) setFeedback(nameInput, nameFeedback, false, 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      setFeedback(nameInput, nameFeedback, false, 'Name must be at least 2 characters.');
      return false;
    }
    setFeedback(nameInput, nameFeedback, true, '');
    return true;
  }

  function validateEmail(isSoft) {
    const val = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      if (!isSoft) setFeedback(emailInput, emailFeedback, false, 'Email address is required.');
      return false;
    }
    if (!emailRegex.test(val)) {
      setFeedback(emailInput, emailFeedback, false, 'Please enter a valid email address (e.g. name@domain.com).');
      return false;
    }
    setFeedback(emailInput, emailFeedback, true, '');
    return true;
  }

  function validatePhone(isSoft) {
    const val = phoneInput ? phoneInput.value.trim() : '';
    const phoneRegex = /^[0-9\+\-\s\(\)]{10,15}$/;
    if (!val) {
      if (!isSoft) setFeedback(phoneInput, phoneFeedback, false, 'Contact phone number is required.');
      return false;
    }
    if (!phoneRegex.test(val)) {
      setFeedback(phoneInput, phoneFeedback, false, 'Please enter a valid 10-digit contact number.');
      return false;
    }
    setFeedback(phoneInput, phoneFeedback, true, '');
    return true;
  }

  function validateSubject(isSoft) {
    const val = subjectInput ? subjectInput.value.trim() : '';
    if (!val) {
      if (!isSoft) setFeedback(subjectInput, subjectFeedback, false, 'Please provide an inquiry subject.');
      return false;
    }
    if (val.length < 3) {
      setFeedback(subjectInput, subjectFeedback, false, 'Subject must be at least 3 characters.');
      return false;
    }
    setFeedback(subjectInput, subjectFeedback, true, '');
    return true;
  }

  function validateType(isSoft) {
    const val = typeSelect ? typeSelect.value : '';
    if (!val) {
      if (!isSoft) setFeedback(typeSelect, typeFeedback, false, 'Please choose an enquiry category.');
      return false;
    }
    setFeedback(typeSelect, typeFeedback, true, '');
    return true;
  }

  function validateMessage(isSoft) {
    const val = messageInput ? messageInput.value.trim() : '';
    if (!val) {
      if (!isSoft) setFeedback(messageInput, messageFeedback, false, 'Message content cannot be empty.');
      return false;
    }
    if (val.length < 10) {
      setFeedback(messageInput, messageFeedback, false, 'Please provide at least 10 characters of detail.');
      return false;
    }
    setFeedback(messageInput, messageFeedback, true, '');
    return true;
  }

  function setFeedback(inputEl, feedbackEl, isValid, msg) {
    if (!inputEl) return;
    if (isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      if (feedbackEl) {
        feedbackEl.className = 'field-feedback feedback-success';
        feedbackEl.textContent = '';
      }
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      if (feedbackEl) {
        feedbackEl.className = 'field-feedback feedback-error';
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${msg}`;
      }
    }
  }

  function clearAllFeedback() {
    const inputs = [nameInput, emailInput, phoneInput, subjectInput, typeSelect, messageInput];
    inputs.forEach(el => {
      if (el) el.classList.remove('is-valid', 'is-invalid');
    });
    const feedbacks = [nameFeedback, emailFeedback, phoneFeedback, subjectFeedback, typeFeedback, messageFeedback];
    feedbacks.forEach(fb => {
      if (fb) fb.textContent = '';
    });
  }

  function saveDraft() {
    const draft = {
      name: nameInput ? nameInput.value : '',
      email: emailInput ? emailInput.value : '',
      phone: phoneInput ? phoneInput.value : '',
      subject: subjectInput ? subjectInput.value : '',
      enquiryType: typeSelect ? typeSelect.value : '',
      message: messageInput ? messageInput.value : ''
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      if (draftStatusText) draftStatusText.textContent = 'Draft saved locally.';
    } catch (e) {
      // Storage unavailable or full
    }
  }

  function restoreDraft() {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved);

      if (draft.name && nameInput) nameInput.value = draft.name;
      if (draft.email && emailInput) emailInput.value = draft.email;
      if (draft.phone && phoneInput) phoneInput.value = draft.phone;
      if (draft.subject && subjectInput) subjectInput.value = draft.subject;
      if (draft.enquiryType && typeSelect) typeSelect.value = draft.enquiryType;
      if (draft.message && messageInput) {
        messageInput.value = draft.message;
        if (charCountEl) charCountEl.textContent = draft.message.length;
      }

      if (draftStatusText && (draft.name || draft.email || draft.message)) {
        draftStatusText.textContent = 'Restored unsaved draft from local storage.';
      }
    } catch (e) {
      // Ignore parse error
    }
  }
}

/* --------------------------------------------------------------------------
   9. FAQ ACCORDION (ONLY ONE OPEN AT A TIME)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. SCROLL TO TOP BUTTON
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
