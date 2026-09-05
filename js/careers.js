/**
 * ==============================================================================
 * ROOK WALL STUDIO - CAREERS & APPLICATION JAVASCRIPT
 * js/careers.js
 * Pure Vanilla JavaScript: addEventListener, HTML5 validation, LocalStorage draft
 * ==============================================================================
 */

const DRAFT_KEY = 'rookWallCareerDraft';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Common Global Components (Nav, Theme, Notifs, Clock, Auth, ScrollTop)
  initGlobalComponents();

  // 2. Initialize Advanced Application Form System
  initApplicationForm();

  // 3. Initialize Scroll Reveal Animations
  initScrollAnimations();
});

/**
 * ------------------------------------------------------------------------------
 * 1. ADVANCED FORM CONTROLLER
 * Validation, real-time preview, blur checks, draft auto-save, and modal
 * ------------------------------------------------------------------------------
 */
function initApplicationForm() {
  const form = document.getElementById('careerApplicationForm');
  if (!form) return;

  // Form Fields
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const dobInput = document.getElementById('dob');
  const preferredTimeInput = document.getElementById('preferredTime');
  const ageInput = document.getElementById('age');
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
  const addressTextarea = document.getElementById('address');
  const additionalInfoDiv = document.getElementById('additional-info') || document.getElementById('additionalInfo');
  const charCountEl = document.getElementById('charCount');

  // Preview Elements
  const previewName = document.getElementById('previewName');
  const previewEmail = document.getElementById('previewEmail');
  const previewSkills = document.getElementById('previewSkills');
  const previewAge = document.getElementById('previewAge');
  const previewPhone = document.getElementById('previewPhone');

  // Action Buttons & Modals
  const cancelBtn = document.getElementById('cancelBtn');
  const clearDraftBtn = document.getElementById('clearDraftBtn');
  const draftStatus = document.getElementById('draftStatus');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Validation Error Elements
  const errors = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    dob: document.getElementById('dobError'),
    age: document.getElementById('ageError'),
    gender: document.getElementById('genderError'),
    skills: document.getElementById('skillsError'),
    address: document.getElementById('addressError'),
    additionalInfo: document.getElementById('additionalInfoError'),
  };

  /**
   * Helper: Show or clear field error
   */
  function setFieldError(field, errorEl, msg) {
    if (!errorEl) return;
    const group = field ? field.closest('.form-group') : errorEl.closest('.form-group');
    if (msg) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      if (group) group.classList.add('has-error');
      if (field && field.classList) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
      }
    } else {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
      if (group) group.classList.remove('has-error');
      if (field && field.classList) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      }
    }
  }

  function clearFieldError(field, errorEl) {
    setFieldError(field, errorEl, null);
  }

  /**
   * Character Counter for contenteditable
   */
  function updateCharCount() {
    if (!additionalInfoDiv || !charCountEl) return;
    const text = additionalInfoDiv.innerText || additionalInfoDiv.textContent || '';
    const len = text.replace(/\r?\n/g, '').length;
    charCountEl.textContent = len;
  }

  /**
   * Validation Functions
   */
  function validateFullName() {
    const val = fullNameInput.value.trim();
    if (!val) {
      setFieldError(fullNameInput, errors.fullName, 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      setFieldError(fullNameInput, errors.fullName, 'Full name must contain at least 2 characters.');
      return false;
    }
    clearFieldError(fullNameInput, errors.fullName);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      setFieldError(emailInput, errors.email, 'Email address is required.');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      setFieldError(emailInput, errors.email, 'Please enter a valid email address.');
      return false;
    }
    clearFieldError(emailInput, errors.email);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    if (!val) {
      setFieldError(phoneInput, errors.phone, 'Phone number is required.');
      return false;
    }
    if (!PHONE_REGEX.test(val)) {
      setFieldError(phoneInput, errors.phone, 'Enter a valid 10-digit mobile number starting with 6-9.');
      return false;
    }
    clearFieldError(phoneInput, errors.phone);
    return true;
  }

  function validateDOB() {
    const val = dobInput.value;
    if (!val) {
      setFieldError(dobInput, errors.dob, 'Please select your date of birth.');
      return false;
    }
    const birthDate = new Date(val);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    if (calculatedAge < 18) {
      setFieldError(dobInput, errors.dob, 'Applicant must be at least 18 years old.');
      return false;
    }
    clearFieldError(dobInput, errors.dob);
    return true;
  }

  function validateAge() {
    const val = parseInt(ageInput.value, 10);
    if (isNaN(val)) {
      setFieldError(ageInput, errors.age, 'Age is required.');
      return false;
    }
    if (val < 18 || val > 60) {
      setFieldError(ageInput, errors.age, 'Age must be between 18 and 60.');
      return false;
    }
    clearFieldError(ageInput, errors.age);
    return true;
  }

  function validateGender() {
    let selected = false;
    genderRadios.forEach((r) => {
      if (r.checked) selected = true;
    });
    if (!selected) {
      setFieldError(null, errors.gender, 'Please select your gender.');
      return false;
    }
    clearFieldError(null, errors.gender);
    return true;
  }

  function validateSkills() {
    const checked = Array.from(skillCheckboxes).filter((cb) => cb.checked);
    if (checked.length === 0) {
      setFieldError(null, errors.skills, 'Please select at least one skill or creative interest.');
      return false;
    }
    clearFieldError(null, errors.skills);
    return true;
  }

  function validateAddress() {
    const val = addressTextarea.value.trim();
    if (!val) {
      setFieldError(addressTextarea, errors.address, 'Please enter your address.');
      return false;
    }
    if (val.length < 5) {
      setFieldError(addressTextarea, errors.address, 'Please provide a complete address.');
      return false;
    }
    clearFieldError(addressTextarea, errors.address);
    return true;
  }

  function validateAdditionalInfo() {
    if (!additionalInfoDiv) return true;
    const text = (additionalInfoDiv.innerText || additionalInfoDiv.textContent || '').trim();
    if (!text) {
      setFieldError(additionalInfoDiv, errors.additionalInfo, 'Please tell us about yourself.');
      return false;
    }
    clearFieldError(additionalInfoDiv, errors.additionalInfo);
    return true;
  }

  /**
   * Attach Blur Event Listeners (Requirement 16)
   */
  fullNameInput.addEventListener('blur', validateFullName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  dobInput.addEventListener('blur', validateDOB);
  ageInput.addEventListener('blur', validateAge);
  addressTextarea.addEventListener('blur', validateAddress);
  if (additionalInfoDiv) {
    additionalInfoDiv.addEventListener('blur', validateAdditionalInfo);
  }

  /**
   * Live Input Feedback & Listeners (Requirement 17)
   */
  fullNameInput.addEventListener('input', () => {
    const val = fullNameInput.value.trim();
    if (val.length >= 2) {
      clearFieldError(fullNameInput, errors.fullName);
      fullNameInput.classList.add('is-valid');
    } else if (errors.fullName.classList.contains('visible')) {
      validateFullName();
    }
    updatePreview();
    autoSaveDraft();
  });

  emailInput.addEventListener('input', () => {
    const val = emailInput.value.trim();
    if (val.length > 0) {
      if (EMAIL_REGEX.test(val)) {
        clearFieldError(emailInput, errors.email);
        emailInput.classList.add('is-valid');
      } else if (errors.email.classList.contains('visible')) {
        setFieldError(emailInput, errors.email, 'Please enter a valid email address.');
      }
    } else {
      emailInput.classList.remove('is-valid');
    }
    updatePreview();
    autoSaveDraft();
  });

  phoneInput.addEventListener('input', () => {
    const val = phoneInput.value.trim();
    if (PHONE_REGEX.test(val)) {
      clearFieldError(phoneInput, errors.phone);
      phoneInput.classList.add('is-valid');
    } else if (errors.phone.classList.contains('visible')) {
      validatePhone();
    }
    updatePreview();
    autoSaveDraft();
  });

  dobInput.addEventListener('input', () => {
    if (errors.dob.classList.contains('visible')) validateDOB();
    autoSaveDraft();
  });

  preferredTimeInput.addEventListener('input', () => {
    autoSaveDraft();
  });

  ageInput.addEventListener('input', () => {
    const val = parseInt(ageInput.value, 10);
    if (!isNaN(val) && val >= 18 && val <= 60) {
      clearFieldError(ageInput, errors.age);
      ageInput.classList.add('is-valid');
    } else if (errors.age.classList.contains('visible')) {
      validateAge();
    }
    updatePreview();
    autoSaveDraft();
  });

  genderRadios.forEach((r) => {
    r.addEventListener('change', () => {
      clearFieldError(null, errors.gender);
      autoSaveDraft();
    });
  });

  skillCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const parentLabel = cb.closest('.checkbox-label');
      if (parentLabel) {
        parentLabel.classList.toggle('is-checked', cb.checked);
      }
      clearFieldError(null, errors.skills);
      updatePreview();
      autoSaveDraft();
    });
  });

  addressTextarea.addEventListener('input', () => {
    if (errors.address.classList.contains('visible')) validateAddress();
    autoSaveDraft();
  });

  if (additionalInfoDiv) {
    additionalInfoDiv.addEventListener('input', () => {
      updateCharCount();
      if (errors.additionalInfo && errors.additionalInfo.classList.contains('visible')) {
        validateAdditionalInfo();
      }
      autoSaveDraft();
    });
  }

  // HTML5 native invalid event support
  form.addEventListener('invalid', (e) => {
    const target = e.target;
    if (target === fullNameInput) validateFullName();
    else if (target === emailInput) validateEmail();
    else if (target === phoneInput) validatePhone();
    else if (target === dobInput) validateDOB();
    else if (target === ageInput) validateAge();
    else if (target.name === 'gender') validateGender();
    else if (target === addressTextarea) validateAddress();
  }, true);

  /**
   * --------------------------------------------------------------------------
   * Real-time Application Preview (Requirement 18)
   * --------------------------------------------------------------------------
   */
  function updatePreview() {
    // Name
    const nameVal = fullNameInput ? fullNameInput.value.trim() : '';
    if (previewName) {
      previewName.textContent = nameVal || 'Applicant Name';
      previewName.classList.toggle('empty', !nameVal);
    }

    // Email
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (previewEmail) {
      previewEmail.textContent = emailVal || 'email@example.com';
      previewEmail.classList.toggle('empty', !emailVal);
    }

    // Skills Chips (Preferred Role / Skill)
    const selectedSkills = Array.from(skillCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    if (previewSkills) {
      if (selectedSkills.length > 0) {
        previewSkills.innerHTML = selectedSkills
          .map((s) => `<span class="preview-chip">${s}</span>`)
          .join('');
      } else {
        previewSkills.innerHTML = '<span class="preview-val empty">No skills selected</span>';
      }
    }

    // Age
    const ageVal = ageInput ? ageInput.value.trim() : '';
    if (previewAge) {
      previewAge.textContent = ageVal ? `${ageVal} yrs` : '--';
      previewAge.classList.toggle('empty', !ageVal);
    }

    // Phone (Optional Dossier field)
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (previewPhone) {
      previewPhone.textContent = phoneVal || '+91 ----------';
      previewPhone.classList.toggle('empty', !phoneVal);
    }
  }

  /**
   * Helper: Reset form state and error markers
   */
  function resetFormState() {
    form.reset();
    if (additionalInfoDiv) {
      additionalInfoDiv.innerHTML = '';
      updateCharCount();
    }
    skillCheckboxes.forEach((cb) => {
      const parent = cb.closest('.checkbox-label');
      if (parent) parent.classList.remove('is-checked');
    });
    Object.keys(errors).forEach((key) => {
      if (errors[key]) {
        errors[key].textContent = '';
        errors[key].classList.remove('visible');
      }
    });
    document.querySelectorAll('.is-invalid, .is-valid').forEach((el) => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    document.querySelectorAll('.has-error').forEach((el) => {
      el.classList.remove('has-error');
    });
    updatePreview();
  }

  /**
   * --------------------------------------------------------------------------
   * LocalStorage Draft Management (Requirement 19)
   * --------------------------------------------------------------------------
   */
  let draftTimeout = null;
  function autoSaveDraft() {
    clearTimeout(draftTimeout);
    draftTimeout = setTimeout(() => {
      try {
        let selectedGender = '';
        genderRadios.forEach((r) => {
          if (r.checked) selectedGender = r.value;
        });

        const selectedSkills = Array.from(skillCheckboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.value);

        const draft = {
          fullName: fullNameInput.value,
          email: emailInput.value,
          phone: phoneInput.value,
          dob: dobInput.value,
          preferredTime: preferredTimeInput.value,
          age: ageInput.value,
          gender: selectedGender,
          skills: selectedSkills,
          address: addressTextarea.value,
          additionalInfo: additionalInfoDiv ? additionalInfoDiv.innerHTML : '',
          savedAt: new Date().toLocaleTimeString(),
        };

        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        if (draftStatus) {
          draftStatus.textContent = `Draft auto-saved at ${draft.savedAt}`;
        }
      } catch (e) {
        console.error('Draft auto-save error:', e);
      }
    }, 400);
  }

  function restoreDraft() {
    try {
      const data = localStorage.getItem(DRAFT_KEY);
      if (!data) return;

      const draft = JSON.parse(data);

      if (draft.fullName) fullNameInput.value = draft.fullName;
      if (draft.email) emailInput.value = draft.email;
      if (draft.phone) phoneInput.value = draft.phone;
      if (draft.dob) dobInput.value = draft.dob;
      if (draft.preferredTime) preferredTimeInput.value = draft.preferredTime;
      if (draft.age) ageInput.value = draft.age;

      if (draft.gender) {
        genderRadios.forEach((r) => {
          if (r.value === draft.gender) r.checked = true;
        });
      }

      if (Array.isArray(draft.skills)) {
        skillCheckboxes.forEach((cb) => {
          if (draft.skills.includes(cb.value)) {
            cb.checked = true;
            const parent = cb.closest('.checkbox-label');
            if (parent) parent.classList.add('is-checked');
          }
        });
      }

      if (draft.address) addressTextarea.value = draft.address;
      if (draft.additionalInfo && additionalInfoDiv) {
        additionalInfoDiv.innerHTML = draft.additionalInfo;
        updateCharCount();
      }

      if (draftStatus && draft.savedAt) {
        draftStatus.textContent = `Restored draft from ${draft.savedAt}`;
      }

      updatePreview();
    } catch (e) {
      console.error('Error restoring draft:', e);
    }
  }

  // Clear Saved Draft Button
  if (clearDraftBtn) {
    clearDraftBtn.addEventListener('click', () => {
      localStorage.removeItem(DRAFT_KEY);
      resetFormState();
      if (draftStatus) draftStatus.textContent = 'Saved draft cleared.';
    });
  }

  // Cancel Button listener (Return to index.html)
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '../index.html';
    });
  }

  // Reset event listener on form (Requirement 20)
  form.addEventListener('reset', () => {
    setTimeout(resetFormState, 10);
  });

  /**
   * --------------------------------------------------------------------------
   * Form Submit & Final Validation (Requirement 15)
   * --------------------------------------------------------------------------
   */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDOB();
    const isAgeValid = validateAge();
    const isGenderValid = validateGender();
    const isSkillsValid = validateSkills();
    const isAddressValid = validateAddress();
    const isAdditionalInfoValid = validateAdditionalInfo();

    const isAllValid =
      isNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isDobValid &&
      isAgeValid &&
      isGenderValid &&
      isSkillsValid &&
      isAddressValid &&
      isAdditionalInfoValid;

    if (!isAllValid) {
      const firstError = document.querySelector('.field-error-msg.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Successful Submission: Show Cinematic Success Modal
    if (successModal) {
      successModal.classList.add('active');
      successModal.setAttribute('aria-hidden', 'false');
    }

    // Clear saved draft
    localStorage.removeItem(DRAFT_KEY);
    if (draftStatus) draftStatus.textContent = 'Application submitted.';

    // Reset Form
    resetFormState();
  });

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      successModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Restore any saved draft on initial page load
  restoreDraft();
  updateCharCount();
}

/**
 * ------------------------------------------------------------------------------
 * 2. GLOBAL COMPONENTS INTEGRATION
 * Common across Rook Wall Studio pages (Navbar, Theme, Clock, Notifications, Auth)
 * ------------------------------------------------------------------------------
 */
function initGlobalComponents() {
  // Auth state & logout
  const authBtn = document.getElementById('navAuthBtn');
  if (authBtn) {
    try {
      const sessionData = localStorage.getItem('rookwall_session');
      if (sessionData) {
        const user = JSON.parse(sessionData);
        authBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i> LOGOUT';
        authBtn.classList.add('btn-logout');
        authBtn.setAttribute('title', `Logged in as ${user.name || user.email}`);

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
    } catch (e) {}
  }

  // Mobile nav hamburger toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      navMenu.classList.toggle('open', !isOpen);
      hamburgerBtn.classList.toggle('active', !isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
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

  // Theme Switcher
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
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }

  // Notification Panel Flyout
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notificationPanel');

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = notifPanel.classList.contains('active');
      notifPanel.classList.toggle('active', !isActive);
      notifBtn.setAttribute('aria-expanded', String(!isActive));
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

  // Live Studio Clock in Footer
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

  // Scroll to Top
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * ------------------------------------------------------------------------------
 * 3. SCROLL REVEAL ANIMATIONS
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
