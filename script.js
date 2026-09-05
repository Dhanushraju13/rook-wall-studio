/**
 * ============================================================================
 * ROOK WALL STUDIO — ASSIGNMENT VII CLIENT-SIDE VALIDATION & INTERACTION
 * File: script.js
 * Pure JavaScript with addEventListener() — ZERO inline event handlers
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const regForm = document.getElementById('registrationForm');
  const profilePicInput = document.getElementById('profile_pic');
  const filePreview = document.getElementById('filePreview');
  const previewImg = document.getElementById('previewImg');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const fileDropzone = document.getElementById('fileDropzone');

  // Allowed mime types & max file size (2MB)
  const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

  // 1. Live Validation Helpers
  function setFieldValid(input, errorElement) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('active');
    }
  }

  function setFieldInvalid(input, errorElement, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('active');
    }
  }

  // 2. Individual Field Validators
  function validateName() {
    const input = document.getElementById('name');
    const err = document.getElementById('nameError');
    const val = input.value.trim();
    if (val.length === 0) {
      setFieldInvalid(input, err, 'Full name is required.');
      return false;
    } else if (val.length < 3) {
      setFieldInvalid(input, err, 'Name must be at least 3 characters.');
      return false;
    } else if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
      setFieldInvalid(input, err, 'Name can only contain letters, spaces, hyphens, and periods.');
      return false;
    }
    setFieldValid(input, err);
    return true;
  }

  function validateEmail() {
    const input = document.getElementById('email');
    const err = document.getElementById('emailError');
    const val = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length === 0) {
      setFieldInvalid(input, err, 'Email address is required.');
      return false;
    } else if (!emailRegex.test(val)) {
      setFieldInvalid(input, err, 'Please enter a valid email address (e.g., user@domain.com).');
      return false;
    }
    setFieldValid(input, err);
    return true;
  }

  function validatePhone() {
    const input = document.getElementById('phone');
    const err = document.getElementById('phoneError');
    const val = input.value.trim();
    // Allows 10-15 digits, optional + prefix, optional spaces/hyphens
    const phoneDigits = val.replace(/[\s\-\(\)]/g, '');
    if (val.length === 0) {
      setFieldInvalid(input, err, 'Phone number is required.');
      return false;
    } else if (!/^\+?[0-9]{10,15}$/.test(phoneDigits)) {
      setFieldInvalid(input, err, 'Enter a valid phone number (10 to 15 digits).');
      return false;
    }
    setFieldValid(input, err);
    return true;
  }

  function validateDOB() {
    const input = document.getElementById('dob');
    const err = document.getElementById('dobError');
    const val = input.value;
    if (!val) {
      setFieldInvalid(input, err, 'Date of birth is required.');
      return false;
    }
    const selectedDate = new Date(val);
    const today = new Date();
    if (selectedDate >= today) {
      setFieldInvalid(input, err, 'Date of birth must be in the past.');
      return false;
    }
    // Simple age check: at least 10 years old
    const ageDiff = today.getFullYear() - selectedDate.getFullYear();
    if (ageDiff < 10) {
      setFieldInvalid(input, err, 'Please enter a realistic date of birth.');
      return false;
    }
    setFieldValid(input, err);
    return true;
  }

  function validateGender() {
    const radios = document.querySelectorAll('input[name="gender"]');
    const err = document.getElementById('genderError');
    let selected = false;
    radios.forEach(function (r) {
      if (r.checked) selected = true;
    });
    if (!selected) {
      if (err) {
        err.textContent = 'Please select a gender.';
        err.classList.add('active');
      }
      return false;
    }
    if (err) {
      err.textContent = '';
      err.classList.remove('active');
    }
    return true;
  }

  function validateCourse() {
    const input = document.getElementById('course');
    const err = document.getElementById('courseError');
    const val = input.value;
    if (!val || val === '') {
      setFieldInvalid(input, err, 'Please select your department or course.');
      return false;
    }
    setFieldValid(input, err);
    return true;
  }

  function validateAddress() {
    const input = document.getElementById('address');
    const err = document.getElementById('addressError');
    const val = input.value.trim();
    if (val.length === 0) {
      setFieldInvalid(input, err, 'Address is required.');
      return false;
    } else if (val.length < 8) {
      setFieldInvalid(input, err, 'Address must be at least 8 characters long.');
      return false;
    }
    setFieldValid(input, err);
    return true;
  }

  function validateProfilePic(isEditMode) {
    const input = document.getElementById('profile_pic');
    const err = document.getElementById('profilePicError');
    if (!input) return true;

    // In edit mode, file is optional if an existing image exists
    if (isEditMode && (!input.files || input.files.length === 0)) {
      if (err) {
        err.textContent = '';
        err.classList.remove('active');
      }
      return true;
    }

    // In registration mode, file is required
    if (!input.files || input.files.length === 0) {
      if (err) {
        err.textContent = 'Profile picture is required.';
        err.classList.add('active');
      }
      return false;
    }

    const file = input.files[0];
    if (!ALLOWED_MIME.includes(file.type)) {
      if (err) {
        err.textContent = 'Only JPG, JPEG, PNG, or WEBP image formats are allowed.';
        err.classList.add('active');
      }
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      if (err) {
        err.textContent = 'File size must not exceed 2MB.';
        err.classList.add('active');
      }
      return false;
    }

    if (err) {
      err.textContent = '';
      err.classList.remove('active');
    }
    return true;
  }

  // 3. Attach Live Input/Blur Listeners
  const nameInput = document.getElementById('name');
  if (nameInput) {
    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName);
  }

  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
  }

  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', validatePhone);
    phoneInput.addEventListener('blur', validatePhone);
  }

  const dobInput = document.getElementById('dob');
  if (dobInput) {
    dobInput.addEventListener('change', validateDOB);
    dobInput.addEventListener('blur', validateDOB);
  }

  const courseSelect = document.getElementById('course');
  if (courseSelect) {
    courseSelect.addEventListener('change', validateCourse);
    courseSelect.addEventListener('blur', validateCourse);
  }

  const addressInput = document.getElementById('address');
  if (addressInput) {
    addressInput.addEventListener('input', validateAddress);
    addressInput.addEventListener('blur', validateAddress);
  }

  const genderRadios = document.querySelectorAll('input[name="gender"]');
  genderRadios.forEach(function (radio) {
    radio.addEventListener('change', validateGender);
  });

  // 4. File Upload Preview & Drag-and-Drop
  if (profilePicInput) {
    profilePicInput.addEventListener('change', function () {
      const isEdit = document.getElementById('isEditMode') ? true : false;
      const valid = validateProfilePic(isEdit);
      if (valid && profilePicInput.files && profilePicInput.files[0]) {
        const file = profilePicInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
          if (previewImg) previewImg.src = e.target.result;
          if (fileNameDisplay) fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
          if (filePreview) filePreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      } else if (!valid && filePreview) {
        filePreview.style.display = 'none';
      }
    });
  }

  if (fileDropzone && profilePicInput) {
    fileDropzone.addEventListener('click', function () {
      profilePicInput.click();
    });

    ['dragenter', 'dragover'].forEach(function (eventName) {
      fileDropzone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(function (eventName) {
      fileDropzone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropzone.classList.remove('dragover');
      });
    });

    fileDropzone.addEventListener('drop', function (e) {
      const dt = e.dataTransfer;
      if (dt.files && dt.files.length > 0) {
        profilePicInput.files = dt.files;
        // Trigger change event
        const changeEvent = new Event('change');
        profilePicInput.dispatchEvent(changeEvent);
      }
    });
  }

  // 5. Form Submission Interception & Validation
  if (regForm) {
    regForm.addEventListener('submit', function (event) {
      const isEdit = document.getElementById('isEditMode') ? true : false;

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isDobValid = validateDOB();
      const isGenderValid = validateGender();
      const isCourseValid = validateCourse();
      const isAddressValid = validateAddress();
      const isPicValid = validateProfilePic(isEdit);

      const allValid = isNameValid && isEmailValid && isPhoneValid && isDobValid && 
                       isGenderValid && isCourseValid && isAddressValid && isPicValid;

      if (!allValid) {
        event.preventDefault(); // Stop submission on validation failure
        
        // Show banner alert
        let errorBanner = document.getElementById('clientErrorBanner');
        if (!errorBanner) {
          errorBanner = document.createElement('div');
          errorBanner.id = 'clientErrorBanner';
          errorBanner.className = 'alert-banner alert-error';
          regForm.parentNode.insertBefore(errorBanner, regForm);
        }
        errorBanner.innerHTML = '<strong>Attention:</strong> Please correct the highlighted fields before submitting.';
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // 6. Delete Confirmation Modal Hooks (for view_records.php)
  const deleteButtons = document.querySelectorAll('.btn-delete-trigger');
  const deleteModal = document.getElementById('deleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteUserName = document.getElementById('deleteUserName');

  if (deleteButtons.length > 0 && deleteModal) {
    deleteButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const userId = btn.getAttribute('data-id');
        const userName = btn.getAttribute('data-name');

        if (deleteUserName) deleteUserName.textContent = userName || 'this record';
        if (confirmDeleteBtn) {
          confirmDeleteBtn.href = `delete.php?id=${encodeURIComponent(userId)}`;
        }
        deleteModal.classList.add('active');
      });
    });

    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', function () {
        deleteModal.classList.remove('active');
      });
    }

    deleteModal.addEventListener('click', function (e) {
      if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && deleteModal.classList.contains('active')) {
        deleteModal.classList.remove('active');
      }
    });
  }
});
