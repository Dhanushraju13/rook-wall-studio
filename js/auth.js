/**
 * ==============================================================================
 * ROOK WALL STUDIO - AUTHENTICATION MODULE JAVASCRIPT
 * Vanilla JavaScript implementation for Signup, Login, Validation & LocalStorage
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Password Visibility Toggles across all pages
  initPasswordToggles();

  // Determine active page based on DOM element availability
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    initSignupHandler(signupForm);
  }

  if (loginForm) {
    initLoginHandler(loginForm);
  }

  // Initialize Forgot Password modal if present
  initForgotPasswordModal();
});

/**
 * ------------------------------------------------------------------------------
 * 1. PASSWORD VISIBILITY TOGGLE HANDLER
 * Toggles input type between 'password' and 'text' and flips the Font Awesome icon
 * ------------------------------------------------------------------------------
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      // Prevent any parent form submission or unintended bubbling
      event.preventDefault();

      const targetInputId = btn.getAttribute('data-target');
      const input = document.getElementById(targetInputId);
      const icon = btn.querySelector('i');

      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';

      if (isPassword) {
        input.setAttribute('type', 'text');
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.setAttribute('type', 'password');
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 2. VALIDATION UTILITY FUNCTIONS
 * Clean, reusable validation helpers for input fields
 * ------------------------------------------------------------------------------
 */

// Regex for standard RFC-compliant email checking
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

/**
 * Sets error state on a field
 * @param {string} inputId - ID of input element
 * @param {string} errorId - ID of error container
 * @param {string} message - User-facing error message
 */
function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorContainer = document.getElementById(errorId);
  const errorText = errorContainer ? errorContainer.querySelector('.error-text') : null;

  if (input) {
    const wrapper = input.closest('.input-wrapper');
    if (wrapper) wrapper.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
  }

  if (errorContainer && errorText) {
    errorText.textContent = message;
    errorContainer.classList.add('visible');
  }
}

/**
 * Clears error state on a field
 * @param {string} inputId - ID of input element
 * @param {string} errorId - ID of error container
 */
function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const errorContainer = document.getElementById(errorId);

  if (input) {
    const wrapper = input.closest('.input-wrapper');
    if (wrapper) wrapper.classList.remove('has-error');
    input.setAttribute('aria-invalid', 'false');
  }

  if (errorContainer) {
    errorContainer.classList.remove('visible');
  }
}

/**
 * Attaches real-time clearing of error states when user types
 * @param {Array<{inputId: string, errorId: string}>} fieldConfigs
 */
function setupRealtimeErrorClearing(fieldConfigs) {
  fieldConfigs.forEach(({ inputId, errorId }) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', () => {
        clearFieldError(inputId, errorId);
      });
    }
  });
}

/**
 * Displays general alert banner (top of form)
 * @param {string} type - 'success' or 'error'
 * @param {string} title - Heading text
 * @param {string} message - Body text
 * @param {string|null} actionHtml - Optional HTML for action buttons
 */
function showGlobalAlert(type, title, message, actionHtml = null) {
  const alert = document.getElementById('globalAlert');
  if (!alert) return;

  const icon = alert.querySelector('.alert-icon');
  const titleEl = alert.querySelector('.alert-title');
  const msgEl = alert.querySelector('.alert-message');
  const actionEl = alert.querySelector('.alert-action');

  alert.className = `auth-alert alert-${type} visible`;

  if (icon) {
    icon.className = `alert-icon fa-solid ${
      type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'
    }`;
  }

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  if (actionEl) {
    if (actionHtml) {
      actionEl.innerHTML = actionHtml;
      actionEl.style.display = 'block';
    } else {
      actionEl.innerHTML = '';
      actionEl.style.display = 'none';
    }
  }

  // Smooth scroll to alert if needed
  alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hides global alert banner
 */
function hideGlobalAlert() {
  const alert = document.getElementById('globalAlert');
  if (alert) {
    alert.className = 'auth-alert';
  }
}

/**
 * ------------------------------------------------------------------------------
 * 3. LOCAL STORAGE DATA MANAGEMENT
 * Prototype storage for user registrations and authentication credentials
 * ------------------------------------------------------------------------------
 */
const STORAGE_KEYS = {
  USERS: 'rookwall_users',
  LAST_USER: 'rookwall_last_registered',
  REMEMBERED_EMAIL: 'rookwall_remembered_email',
  REMEMBER_ME: 'rookwall_remember_flag',
};

/**
 * Retrieve all registered users from localStorage
 * @returns {Array<{name: string, email: string, password: string}>}
 */
function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return [];
  }
}

/**
 * Store a newly registered user
 * @param {Object} user - { name, email, password }
 */
function saveUser(user) {
  try {
    const users = getRegisteredUsers();
    // Check if user already exists; update or append
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === user.email.toLowerCase()
    );

    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.LAST_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

/**
 * Verify credentials against stored registered users
 * @param {string} email
 * @param {string} password
 * @returns {{isValid: boolean, user: Object|null}}
 */
function verifyCredentials(email, password) {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const foundUser = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  return {
    isValid: Boolean(foundUser),
    user: foundUser || null,
  };
}

/**
 * ------------------------------------------------------------------------------
 * 4. SIGNUP FORM LOGIC & VALIDATION
 * Handles submit, field checking, error reporting, and storage
 * ------------------------------------------------------------------------------
 */
function initSignupHandler(form) {
  const fields = [
    { inputId: 'fullName', errorId: 'nameError' },
    { inputId: 'email', errorId: 'emailError' },
    { inputId: 'password', errorId: 'passwordError' },
    { inputId: 'confirmPassword', errorId: 'confirmPasswordError' },
  ];

  setupRealtimeErrorClearing(fields);

  // Clear terms error on checkbox change
  const termsCheckbox = document.getElementById('termsCheckbox');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      clearFieldError('termsCheckbox', 'termsError');
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideGlobalAlert();

    // Clear previous errors
    fields.forEach((f) => clearFieldError(f.inputId, f.errorId));
    clearFieldError('termsCheckbox', 'termsError');

    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('termsCheckbox');
    const submitBtn = document.getElementById('signupSubmitBtn');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
    const termsAgreed = termsInput ? termsInput.checked : false;

    let hasErrors = false;

    // 1. Full Name Validation
    if (!name) {
      showFieldError('fullName', 'nameError', 'Please enter your name.');
      hasErrors = true;
    }

    // 2. Email Validation
    if (!email) {
      showFieldError('email', 'emailError', 'Please enter a valid email.');
      hasErrors = true;
    } else if (!EMAIL_REGEX.test(email)) {
      showFieldError('email', 'emailError', 'Please enter a valid email.');
      hasErrors = true;
    }

    // 3. Password Validation
    if (!password) {
      showFieldError('password', 'passwordError', 'Password must contain at least 8 characters.');
      hasErrors = true;
    } else if (password.length < 8) {
      showFieldError('password', 'passwordError', 'Password must contain at least 8 characters.');
      hasErrors = true;
    }

    // 4. Confirm Password Validation
    if (!confirmPassword) {
      showFieldError('confirmPassword', 'confirmPasswordError', 'Passwords do not match.');
      hasErrors = true;
    } else if (password !== confirmPassword) {
      showFieldError('confirmPassword', 'confirmPasswordError', 'Passwords do not match.');
      hasErrors = true;
    }

    // 5. Terms Checkbox Validation
    if (!termsAgreed) {
      showFieldError('termsCheckbox', 'termsError', 'You must agree to the Terms & Conditions.');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Check if email already registered
    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      showFieldError('email', 'emailError', 'An account with this email already exists.');
      return;
    }

    // Save user info in localStorage
    const newUser = {
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);

    // Disable button to prevent multi-submissions
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CREATING ACCOUNT...';
    }

    // Show required success message
    const actionHtml = `
      <a href="login.html" class="alert-action-btn">
        <i class="fa-solid fa-arrow-right-to-bracket"></i> Continue to Login
      </a>
      <span style="display:block; margin-top:0.4rem; font-size:0.75rem; color:#a7f3d0;">
        Redirecting in <span id="countdown">3</span>s...
      </span>
    `;

    showGlobalAlert(
      'success',
      'Registration Complete',
      'Account created successfully.',
      actionHtml
    );

    // Reset form inputs
    form.reset();

    // Auto-countdown redirect to login.html
    let secondsLeft = 3;
    const countdownEl = document.getElementById('countdown');
    const timer = setInterval(() => {
      secondsLeft -= 1;
      if (countdownEl) countdownEl.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(timer);
        window.location.href = 'login.html';
      }
    }, 1000);
  });
}

/**
 * ------------------------------------------------------------------------------
 * 5. LOGIN FORM LOGIC & AUTHENTICATION
 * Handles signin, validation, credential comparison with localStorage, & Remember Me
 * ------------------------------------------------------------------------------
 */
function initLoginHandler(form) {
  const fields = [
    { inputId: 'loginEmail', errorId: 'loginEmailError' },
    { inputId: 'loginPassword', errorId: 'loginPasswordError' },
  ];

  setupRealtimeErrorClearing(fields);

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const rememberCheckbox = document.getElementById('rememberMe');
  const submitBtn = document.getElementById('loginSubmitBtn');

  // Populate remembered email if present
  try {
    const rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    const rememberFlag = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);

    if (rememberedEmail && emailInput) {
      emailInput.value = rememberedEmail;
      if (rememberCheckbox && rememberFlag === 'true') {
        rememberCheckbox.checked = true;
      }
    }
  } catch (err) {
    console.error('Error reading rememberMe state:', err);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideGlobalAlert();

    // Clear previous errors
    fields.forEach((f) => clearFieldError(f.inputId, f.errorId));

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const isRememberChecked = rememberCheckbox ? rememberCheckbox.checked : false;

    let hasErrors = false;

    // 1. Email validation
    if (!email) {
      showFieldError('loginEmail', 'loginEmailError', 'Please enter a valid email.');
      hasErrors = true;
    } else if (!EMAIL_REGEX.test(email)) {
      showFieldError('loginEmail', 'loginEmailError', 'Please enter a valid email.');
      hasErrors = true;
    }

    // 2. Password validation
    if (!password) {
      showFieldError('loginPassword', 'loginPasswordError', 'Please enter your password.');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Handle "Remember Me"
    try {
      if (isRememberChecked) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }
    } catch (err) {
      console.error('Error updating rememberMe:', err);
    }

    // Compare credentials against saved user information
    const { isValid, user } = verifyCredentials(email, password);

    if (isValid && user) {
      // Display required login success message
      showGlobalAlert(
        'success',
        'Welcome',
        'Login successful. Welcome to ROOK WALL STUDIO.'
      );

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> AUTHENTICATED';
      }

      // Record current logged-in session in localStorage
      try {
        localStorage.setItem(
          'rookwall_session',
          JSON.stringify({
            name: user.name,
            email: user.email,
            loggedInAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error(e);
      }

      // Automatically redirect to index.html after brief success display
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    } else {
      // Display required invalid credentials message
      showGlobalAlert(
        'error',
        'Authentication Failed',
        'Invalid email or password.'
      );
      showFieldError('loginPassword', 'loginPasswordError', 'Invalid email or password.');
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 6. FORGOT PASSWORD MODAL (Accessible Prototype Interaction)
 * ------------------------------------------------------------------------------
 */
function initForgotPasswordModal() {
  const trigger = document.getElementById('forgotPasswordLink');
  const modal = document.getElementById('forgotPasswordModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const resetForm = document.getElementById('resetPasswordForm');

  if (!modal) return;

  const openModal = (e) => {
    e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    const resetInput = document.getElementById('resetEmail');
    if (resetInput) {
      // Pre-fill with login email if present
      const loginEmail = document.getElementById('loginEmail');
      if (loginEmail && loginEmail.value) {
        resetInput.value = loginEmail.value;
      }
      resetInput.focus();
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    const statusEl = document.getElementById('resetStatusMessage');
    if (statusEl) statusEl.style.display = 'none';
  };

  if (trigger) trigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Prototype Reset Submit
  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const resetInput = document.getElementById('resetEmail');
      const statusEl = document.getElementById('resetStatusMessage');
      const email = resetInput ? resetInput.value.trim() : '';

      if (!email || !EMAIL_REGEX.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (statusEl) {
        statusEl.textContent = `A prototype password reset link has been dispatched to ${email}.`;
        statusEl.style.display = 'block';
      }

      setTimeout(() => {
        closeModal();
      }, 2500);
    });
  }
}
