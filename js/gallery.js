/**
 * ==============================================================================
 * ROOK WALL STUDIO - GALLERY & STUDIO ARCHIVE JAVASCRIPT
 * js/gallery.js
 * HTML5 Drag & Drop, Web Storage (localStorage & sessionStorage), Lightbox, Filter
 * Pure Vanilla JavaScript: 100% addEventListener, zero inline handlers
 * ==============================================================================
 */

// Storage Keys
const LOCAL_STORAGE_BOARD_KEY = 'rookWallProductionBoard';
const SESSION_STORAGE_PROD_KEY = 'rookWallCurrentProduction';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Common Global Components (Nav, Theme, Notifs, Clock, Auth, ScrollTop)
  initGlobalComponents();

  // 2. Initialize Gallery Filtering & Lightbox Modal
  initGallerySystem();

  // 3. Initialize HTML5 Drag & Drop Production Board
  initDragAndDropSystem();

  // 4. Initialize Web Storage Demonstration (Local & Session Storage)
  initStorageDemoSystem();
});

/**
 * ------------------------------------------------------------------------------
 * 1. TOAST NOTIFICATION HELPER
 * ------------------------------------------------------------------------------
 */
let toastTimeout = null;
function showToast(message, iconClass = 'fa-solid fa-circle-check') {
  const toast = document.getElementById('galleryToast');
  const toastText = document.getElementById('galleryToastText');
  const toastIcon = document.getElementById('galleryToastIcon');

  if (!toast || !toastText) return;

  clearTimeout(toastTimeout);
  toastText.textContent = message;
  if (toastIcon) {
    toastIcon.className = `gallery-toast-icon ${iconClass}`;
  }

  toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * ------------------------------------------------------------------------------
 * 2. GALLERY FILTERING & LIGHTBOX MODAL
 * ------------------------------------------------------------------------------
 */
function initGallerySystem() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCat = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  // Category Filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease both';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Open
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-item-img');
      const title = item.querySelector('.gallery-item-title');
      const cat = item.querySelector('.gallery-item-category');
      const desc = item.querySelector('.gallery-item-desc');

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxImg && img) lightboxImg.alt = img.alt || 'Gallery view';
      if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
      if (lightboxCat && cat) lightboxCat.textContent = cat.textContent;
      if (lightboxDesc && desc) lightboxDesc.textContent = desc.textContent;

      if (lightbox) {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });

    // Keyboard support: Enter key opens lightbox
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        item.click();
      }
    });
  });

  // Lightbox Close Helper
  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  // Close on Backdrop Click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close on Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 3. HTML5 DRAG & DROP API: PRODUCTION BOARD
 * dragstart, dragover, drop, dragenter, dragleave, dragend
 * ------------------------------------------------------------------------------
 */
let inMemoryDraggedItem = null; // Backup for seamless cross-browser dataTransfer
let productionBoardItems = [];

function initDragAndDropSystem() {
  const draggableCards = document.querySelectorAll('.draggable-card');
  const dropZone = document.getElementById('productionBoardDropZone');
  const boardItemsContainer = document.getElementById('boardItemsContainer');
  const dropzonePlaceholder = document.getElementById('dropzonePlaceholder');
  const boardCounter = document.getElementById('boardCounter');
  const dropzoneHeading = document.getElementById('dropzoneHeading');

  const saveBoardBtn = document.getElementById('saveBoardBtn');
  const clearBoardBtn = document.getElementById('clearBoardBtn');

  // Load saved board from localStorage on initial page load
  loadBoardFromLocalStorage();

  /**
   * 1. Drag Event Listeners & Keyboard Accessibility for Draggable Cards
   */
  draggableCards.forEach((card) => {
    // DRAGSTART: Store dragged item's ID & metadata
    card.addEventListener('dragstart', (e) => {
      const itemData = {
        id: card.getAttribute('data-id') || Date.now().toString(),
        title: card.getAttribute('data-title') || 'Production Element',
        icon: card.getAttribute('data-icon') || 'fa-clapperboard',
        desc: card.getAttribute('data-desc') || '',
      };

      inMemoryDraggedItem = itemData;

      // Set dataTransfer for standard HTML5 drag & drop compliance
      try {
        e.dataTransfer.setData('text/plain', JSON.stringify(itemData));
        e.dataTransfer.effectAllowed = 'copy';
      } catch (err) {
        console.warn('dataTransfer error:', err);
      }

      card.classList.add('is-dragging');
    });

    // DRAGEND: Clean up dragging visual styles
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      inMemoryDraggedItem = null;
      if (dropZone) dropZone.classList.remove('drag-over');
    });

    // KEYBOARD ACCESSIBILITY: Enter or Space adds element to board
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const itemData = {
          id: card.getAttribute('data-id') || Date.now().toString(),
          title: card.getAttribute('data-title') || 'Production Element',
          icon: card.getAttribute('data-icon') || 'fa-clapperboard',
          desc: card.getAttribute('data-desc') || '',
        };
        addItemToProductionBoard(itemData);
      }
    });
  });

  /**
   * 2. Drag Event Listeners for the Drop Zone
   */
  if (dropZone) {
    // DRAGOVER: MUST call event.preventDefault() to allow drop!
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (!dropZone.classList.contains('drag-over')) {
        dropZone.classList.add('drag-over');
        if (dropzoneHeading) dropzoneHeading.textContent = 'RELEASE TO ADD TO BOARD';
      }
    });

    // DRAGENTER: Visual feedback
    dropZone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
      if (dropzoneHeading) dropzoneHeading.textContent = 'RELEASE TO ADD TO BOARD';
    });

    // DRAGLEAVE: Revert visual feedback
    dropZone.addEventListener('dragleave', (e) => {
      // Check if actually leaving container
      const rect = dropZone.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX >= rect.right ||
        e.clientY < rect.top ||
        e.clientY >= rect.bottom
      ) {
        dropZone.classList.remove('drag-over');
        if (dropzoneHeading) dropzoneHeading.textContent = 'YOUR PRODUCTION BOARD';
      }
    });

    // DROP: Retrieve dragged item & append to board
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (dropzoneHeading) dropzoneHeading.textContent = 'YOUR PRODUCTION BOARD';

      let droppedData = null;

      // Attempt to retrieve from dataTransfer
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) {
          droppedData = JSON.parse(raw);
        }
      } catch (err) {
        console.warn('Could not parse drop dataTransfer:', err);
      }

      // Fallback to in-memory store if dataTransfer is empty
      if (!droppedData && inMemoryDraggedItem) {
        droppedData = inMemoryDraggedItem;
      }

      if (droppedData) {
        addItemToProductionBoard(droppedData);
      }
    });
  }

  /**
   * Add Item to Production Board & Auto-save to localStorage
   * Prevent duplicates based on title and store recent drop in sessionStorage
   */
  function addItemToProductionBoard(item) {
    // Duplicate check
    const duplicate = productionBoardItems.some((i) => i.title === item.title);
    if (duplicate) {
      showToast(`Production "${item.title}" already exists in board.`, 'fa-solid fa-circle-exclamation');
      return;
    }

    const uniqueInstance = {
      instanceId: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: item.title,
      icon: item.icon,
      desc: item.desc,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    productionBoardItems.push(uniqueInstance);
    renderProductionBoard();
    saveBoardToLocalStorage(false); // silent save
    showToast(`Added "${uniqueInstance.title}" to production board.`, 'fa-solid fa-plus-circle');

    // Store latest dropped production in sessionStorage
    try {
      sessionStorage.setItem(SESSION_STORAGE_PROD_KEY, JSON.stringify({
        productionName: item.title,
        sessionType: 'Active Board Drop',
        savedTimestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleTimeString(),
      }));
      const sessionInput = document.getElementById('sessionProductionInput');
      if (sessionInput) sessionInput.value = item.title;
      updateStorageDemoStatus();
    } catch (e) {
      console.warn('SessionStorage error:', e);
    }
  }

  /**
   * Render the items inside the board
   */
  function renderProductionBoard() {
    if (!boardItemsContainer) return;

    boardItemsContainer.innerHTML = '';

    if (productionBoardItems.length === 0) {
      if (dropzonePlaceholder) dropzonePlaceholder.style.display = 'flex';
      if (boardCounter) boardCounter.textContent = '0 ITEMS';
      updateStorageDemoStatus();
      return;
    }

    if (dropzonePlaceholder) dropzonePlaceholder.style.display = 'none';
    if (boardCounter) {
      boardCounter.textContent = `${productionBoardItems.length} ITEM${productionBoardItems.length > 1 ? 'S' : ''}`;
    }

    productionBoardItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'board-item-card';

      card.innerHTML = `
        <div class="board-item-header">
          <span class="board-item-badge">SLOT #${index + 1}</span>
          <button type="button" class="btn-remove-board-item" title="Remove element" aria-label="Remove ${item.title}">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div class="board-item-main">
          <div class="board-item-icon">
            <i class="fa-solid ${item.icon}" aria-hidden="true"></i>
          </div>
          <div>
            <div class="board-item-title">${item.title}</div>
            <div class="board-item-time"><i class="fa-regular fa-clock"></i> ${item.addedAt}</div>
          </div>
        </div>
      `;

      // Remove single item listener
      const removeBtn = card.querySelector('.btn-remove-board-item');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeItemFromProductionBoard(item.instanceId);
        });
      }

      boardItemsContainer.appendChild(card);
    });

    updateStorageDemoStatus();
  }

  /**
   * Remove single item from board
   */
  function removeItemFromProductionBoard(instanceId) {
    const itemIndex = productionBoardItems.findIndex((i) => i.instanceId === instanceId);
    if (itemIndex > -1) {
      const removedTitle = productionBoardItems[itemIndex].title;
      productionBoardItems.splice(itemIndex, 1);
      renderProductionBoard();
      saveBoardToLocalStorage(false);
      showToast(`Removed "${removedTitle}" from board.`, 'fa-solid fa-trash-can');
    }
  }

  /**
   * Clear entire production board
   */
  function executeClearProductionBoard() {
    productionBoardItems = [];
    localStorage.removeItem(LOCAL_STORAGE_BOARD_KEY);
    renderProductionBoard();
    updateStorageDemoStatus();
    showToast('Production board cleared.', 'fa-solid fa-trash-can');

    // Also update inspection console if currently showing board data
    const consoleDisplay = document.getElementById('storedDataDisplay');
    const consoleTitle = document.getElementById('storedDataTitle');
    if (consoleDisplay && consoleTitle && consoleTitle.textContent.includes('PRODUCTION BOARD')) {
      consoleDisplay.textContent = 'No saved data found.';
      consoleDisplay.classList.add('empty');
    }
  }

  /**
   * Open confirmation dialog before clearing
   */
  const confirmModal = document.getElementById('confirmClearModal');
  const confirmClearBtn = document.getElementById('confirmClearBtn');
  const cancelClearBtn = document.getElementById('cancelClearBtn');

  function openClearConfirm() {
    if (productionBoardItems.length === 0) {
      showToast('Board is already empty.', 'fa-solid fa-circle-info');
      return;
    }
    if (confirmModal) {
      confirmModal.classList.add('active');
      confirmModal.setAttribute('aria-hidden', 'false');
      if (confirmClearBtn) confirmClearBtn.focus();
    } else {
      // Fallback
      if (window.confirm('Are you sure you want to clear the entire production board?')) {
        executeClearProductionBoard();
      }
    }
  }

  function closeClearConfirm() {
    if (confirmModal) {
      confirmModal.classList.remove('active');
      confirmModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (confirmClearBtn) {
    confirmClearBtn.addEventListener('click', () => {
      closeClearConfirm();
      executeClearProductionBoard();
    });
  }

  if (cancelClearBtn) {
    cancelClearBtn.addEventListener('click', closeClearConfirm);
  }

  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        closeClearConfirm();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && confirmModal && confirmModal.classList.contains('active')) {
      closeClearConfirm();
    }
  });

  /**
   * Save board to localStorage (Requirement 8)
   */
  function saveBoardToLocalStorage(notify = true) {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOARD_KEY, JSON.stringify(productionBoardItems));
      updateStorageDemoStatus();
      if (notify) {
        showToast('Production board saved.', 'fa-solid fa-floppy-disk');
      }
    } catch (e) {
      console.error('Error saving board to localStorage:', e);
    }
  }

  /**
   * Load saved board from localStorage on startup
   */
  function loadBoardFromLocalStorage() {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_BOARD_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) {
          productionBoardItems = parsed;
        }
      }
    } catch (e) {
      console.error('Error loading board from localStorage:', e);
      productionBoardItems = [];
    }
    renderProductionBoard();
  }

  // Button Listeners
  if (saveBoardBtn) {
    saveBoardBtn.addEventListener('click', () => saveBoardToLocalStorage(true));
  }

  if (clearBoardBtn) {
    clearBoardBtn.addEventListener('click', openClearConfirm);
  }
}

/**
 * ------------------------------------------------------------------------------
 * 4. WEB STORAGE DEMONSTRATION SYSTEM (localStorage & sessionStorage)
 * Requirements 8, 9, 10, 11, 12, 13
 * ------------------------------------------------------------------------------
 */
function initStorageDemoSystem() {
  // LocalStorage Demo Buttons
  const storageSaveBoardBtn = document.getElementById('storageSaveBoardBtn');
  const storageRetrieveBoardBtn = document.getElementById('storageRetrieveBoardBtn');
  const storageClearBoardBtn = document.getElementById('storageClearBoardBtn');

  // SessionStorage Demo Buttons & Input
  const sessionProductionInput = document.getElementById('sessionProductionInput');
  const saveSessionBtn = document.getElementById('saveSessionBtn');
  const retrieveSessionBtn = document.getElementById('retrieveSessionBtn');
  const clearSessionBtn = document.getElementById('clearSessionBtn');

  // Stored Data Inspection Console
  const storedDataDisplay = document.getElementById('storedDataDisplay');
  const storedDataTitle = document.getElementById('storedDataTitle');

  // Populate session input if session storage already has value
  try {
    const currentSessionRaw = sessionStorage.getItem(SESSION_STORAGE_PROD_KEY);
    if (currentSessionRaw && sessionProductionInput) {
      const sessionObj = JSON.parse(currentSessionRaw);
      sessionProductionInput.value = sessionObj.productionName || '';
    }
  } catch (e) {}

  // Update initial storage indicators
  updateStorageDemoStatus();

  /**
   * 1. LocalStorage Actions
   */
  if (storageSaveBoardBtn) {
    storageSaveBoardBtn.addEventListener('click', () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_BOARD_KEY, JSON.stringify(productionBoardItems));
        updateStorageDemoStatus();
        showToast('Production board saved.', 'fa-solid fa-floppy-disk');
      } catch (e) {
        console.error('Save error:', e);
      }
    });
  }

  if (storageRetrieveBoardBtn) {
    storageRetrieveBoardBtn.addEventListener('click', () => {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_BOARD_KEY);
        if (storedDataTitle) storedDataTitle.textContent = 'LOCAL STORAGE // PRODUCTION BOARD';
        if (!raw || raw === '[]') {
          if (storedDataDisplay) {
            storedDataDisplay.textContent = 'No saved data found.';
            storedDataDisplay.classList.add('empty');
          }
        } else {
          const parsed = JSON.parse(raw);
          if (storedDataDisplay) {
            storedDataDisplay.textContent = JSON.stringify(parsed, null, 2);
            storedDataDisplay.classList.remove('empty');
          }
        }
        showToast('Retrieved production board data.', 'fa-solid fa-database');
      } catch (e) {
        console.error('Retrieve error:', e);
      }
    });
  }

  if (storageClearBoardBtn) {
    storageClearBoardBtn.addEventListener('click', () => {
      const clearBtn = document.getElementById('clearBoardBtn');
      if (clearBtn) {
        clearBtn.click();
      }
    });
  }

  /**
   * 2. SessionStorage Actions (Requirement 9)
   */
  if (saveSessionBtn) {
    saveSessionBtn.addEventListener('click', () => {
      const prodName = sessionProductionInput ? sessionProductionInput.value.trim() : '';
      if (!prodName) {
        showToast('Please enter a production title.', 'fa-solid fa-triangle-exclamation');
        return;
      }

      const sessionPayload = {
        productionName: prodName,
        sessionType: 'Active Workspace Session',
        savedTimestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleTimeString(),
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_PROD_KEY, JSON.stringify(sessionPayload));
        updateStorageDemoStatus();
        showToast(`Saved session production: "${prodName}".`, 'fa-solid fa-clock-rotate-left');
      } catch (e) {
        console.error('Session save error:', e);
      }
    });
  }

  if (retrieveSessionBtn) {
    retrieveSessionBtn.addEventListener('click', () => {
      try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_PROD_KEY);
        if (storedDataTitle) storedDataTitle.textContent = 'SESSION STORAGE // CURRENT PRODUCTION';

        if (!raw) {
          if (storedDataDisplay) {
            storedDataDisplay.textContent = 'No saved data found.';
            storedDataDisplay.classList.add('empty');
          }
        } else {
          const parsed = JSON.parse(raw);
          if (storedDataDisplay) {
            storedDataDisplay.textContent = JSON.stringify(parsed, null, 2);
            storedDataDisplay.classList.remove('empty');
          }
        }
        showToast('Retrieved current session data.', 'fa-solid fa-server');
      } catch (e) {
        console.error('Session retrieve error:', e);
      }
    });
  }

  if (clearSessionBtn) {
    clearSessionBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_STORAGE_PROD_KEY);
      if (sessionProductionInput) sessionProductionInput.value = '';
      updateStorageDemoStatus();

      if (storedDataDisplay && storedDataTitle && storedDataTitle.textContent.includes('CURRENT PRODUCTION')) {
        storedDataDisplay.textContent = 'No saved data found.';
        storedDataDisplay.classList.add('empty');
      }

      showToast('Current session cleared.', 'fa-solid fa-trash-can');
    });
  }
}

/**
 * Update UI status pills in Storage Demo Section
 */
function updateStorageDemoStatus() {
  const localStatusVal = document.getElementById('localStorageStatus');
  const sessionStatusVal = document.getElementById('sessionStorageStatus');

  // Check LocalStorage
  if (localStatusVal) {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_BOARD_KEY);
      if (data && data !== '[]') {
        const items = JSON.parse(data);
        localStatusVal.textContent = `Saved (${items.length} element${items.length > 1 ? 's' : ''})`;
        localStatusVal.style.color = '#10b981';
      } else {
        localStatusVal.textContent = 'Empty';
        localStatusVal.style.color = 'var(--text-muted)';
      }
    } catch (e) {
      localStatusVal.textContent = 'Empty';
    }
  }

  // Check SessionStorage
  if (sessionStatusVal) {
    try {
      const sess = sessionStorage.getItem(SESSION_STORAGE_PROD_KEY);
      if (sess) {
        const parsed = JSON.parse(sess);
        sessionStatusVal.textContent = `Saved (${parsed.productionName || 'Active'})`;
        sessionStatusVal.style.color = '#3b82f6';
      } else {
        sessionStatusVal.textContent = 'Empty';
        sessionStatusVal.style.color = 'var(--text-muted)';
      }
    } catch (e) {
      sessionStatusVal.textContent = 'Empty';
    }
  }
}

/**
 * ------------------------------------------------------------------------------
 * 5. GLOBAL COMPONENTS INTEGRATION
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
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Notifications Flyout Panel
  const notifBtn = document.getElementById('notifBtn');
  const notificationPanel = document.getElementById('notificationPanel');

  if (notifBtn && notificationPanel) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = notificationPanel.classList.contains('show');
      notificationPanel.classList.toggle('show', !isVisible);
      notifBtn.setAttribute('aria-expanded', String(!isVisible));
    });

    document.addEventListener('click', (e) => {
      if (!notificationPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notificationPanel.classList.remove('show');
        notifBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Dark / Light Mode Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('rookwall_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rookwall_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }

  // Live Studio Status Clock
  const liveDateEl = document.getElementById('liveDate');
  const liveTimeEl = document.getElementById('liveTime');

  function updateLiveClock() {
    const now = new Date();
    if (liveDateEl) {
      const day = String(now.getDate()).padStart(2, '0');
      const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = now.getFullYear();
      liveDateEl.textContent = `${day} ${month} ${year}`;
    }
    if (liveTimeEl) {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      liveTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Floating Scroll-to-Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
