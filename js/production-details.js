/**
 * ==============================================================================
 * ROOK WALL STUDIO - PRODUCTION DETAILS JAVASCRIPT
 * js/production-details.js
 * Pure Vanilla JavaScript: addEventListener, Event Delegation, No inline onclick
 * ==============================================================================
 */

// Production Data Dictionary
const PRODUCTIONS_DATA = {
  'phoenix': {
    id: 'phoenix',
    title: 'PROJECT PHOENIX',
    category: 'FEATURE FILM',
    year: '2026',
    genre: 'Drama / Thriller',
    shortDesc: 'A story of ambition, sacrifice and the people who rise when everything seems lost.',
    synopsis: 'Set against the neon-lit spires and industrial underbelly of a fractured metropolis, Project Phoenix follows an ambitious investigative architect who uncovers a systemic conspiracy threatening to erase the city\'s history. As corporate factions close in, she must choose between personal survival and exposing a truth that could either ignite a revolution or bury the city in ashes forever.',
    vision: 'To craft an uncompromising cinematic reflection on architectural power, human ambition, and the fragile line between progress and exploitation.',
    mission: 'To merge high-concept practical cinematography with grounded psychological drama, demonstrating how individual choices ripple through complex urban ecosystems.',
    director: 'Arjun Varma',
    producer: 'ROOK WALL STUDIO',
    runtime: '2h 08m',
    language: 'English',
    rating: '4.8 / 5',
    status: 'Released',
    backdrop: '../assets/images/prod-phoenix.jpg',
    videoSrc: '../assets/videos/trailer.mp4',
    relatedIds: ['horizon', 'echoes', 'midnight-stories']
  },
  'horizon': {
    id: 'horizon',
    title: 'THE HORIZON',
    category: 'FEATURE FILM',
    year: '2025',
    genre: 'Adventure / Drama',
    shortDesc: 'An intimate, visually poetic journey of two estranged travelers crossing desolate coastal terrain at dusk.',
    synopsis: 'Spanning the wind-scoured coastlines and forgotten sea towers of the Atlantic fringe, The Horizon captures two distant siblings fulfilling their late father\'s esoteric maritime journal. As nature tests their endurance and long-buried grievances surface, the ocean becomes both an adversary and a sanctuary of profound spiritual reconciliation.',
    vision: 'To capture the raw silence of unblemished horizons and explore how isolation strips away societal masks to reveal human empathy.',
    mission: 'To utilize 65mm natural-light cinematography to immerse audiences in the sublime majesty of untamed coastal environments.',
    director: 'Elena Rostova',
    producer: 'ROOK WALL STUDIO',
    runtime: '1h 54m',
    language: 'English',
    rating: '4.6 / 5',
    status: 'Released',
    backdrop: '../assets/images/prod-horizon.jpg',
    videoSrc: '../assets/videos/trailer.mp4',
    relatedIds: ['phoenix', 'echoes', 'last-frame']
  },
  'echoes': {
    id: 'echoes',
    title: 'ECHOES',
    category: 'SHORT FILM',
    year: '2025',
    genre: 'Mystery / Drama',
    shortDesc: 'A landmark exploration into forgotten indigenous melodies and their profound connection to disappearing forests.',
    synopsis: 'When an ethnomusicologist visits a remote temperate rainforest, she records acoustic frequencies that defy scientific explanation. The forest itself seems to echo vocal refrains recorded a century earlier. Guided by a local elder, she uncovers an ancient symbiotic dialogue between human ritual song and living flora.',
    vision: 'To re-sensitize the audience to the acoustic tapestry of the natural world and the sacred lineage of oral traditions.',
    mission: 'To fuse Dolby Atmos spatial sound design with intimate 35mm visuals, proving that sound can tell stories as powerfully as light.',
    director: 'Devika Sundaram',
    producer: 'ROOK WALL STUDIO',
    runtime: '28m',
    language: 'English / Native',
    rating: '4.7 / 5',
    status: 'Released',
    backdrop: '../assets/images/prod-echoes.jpg',
    videoSrc: '../assets/videos/trailer.mp4',
    relatedIds: ['beyond-silence', 'phoenix', 'horizon']
  },
  'last-frame': {
    id: 'last-frame',
    title: 'LAST FRAME',
    category: 'SHORT FILM',
    year: '2024',
    genre: 'Psychological Thriller',
    shortDesc: 'An obsessive projectionist discovers disturbing anomalies hidden inside old celluloid film reels.',
    synopsis: 'Working the twilight shift inside a historic art-deco cinema slated for demolition, veteran projectionist Julian inspects an unlabeled 35mm canister. As the sprockets spin, the projected frames reveal footage of his own booth captured earlier that night. Reality fractures between celluloid illusion and psychological terror.',
    vision: 'An ode to the tactile grain of celluloid and an inquiry into how mechanical reproduction can trap human obsession.',
    mission: 'To celebrate the physical craftsmanship of film projection while delivering an escalating masterclass in claustrophobic suspense.',
    director: 'Marcus Thorne',
    producer: 'ROOK WALL STUDIO',
    runtime: '34m',
    language: 'English',
    rating: '4.5 / 5',
    status: 'Released',
    backdrop: '../assets/images/prod-lastframe.jpg',
    videoSrc: '../assets/videos/trailer.mp4',
    relatedIds: ['midnight-stories', 'phoenix', 'echoes']
  },
  'beyond-silence': {
    id: 'beyond-silence',
    title: 'BEYOND THE SILENCE',
    category: 'DOCUMENTARY',
    year: '2024',
    genre: 'Documentary',
    shortDesc: 'An immersive investigation uncovering the untold stories and resilience of sound designers across war zones.',
    synopsis: 'Filmed over three years across four continents, Beyond The Silence documents the perilous work of audio journalists and field sound recordists who risk their lives to preserve auditory evidence of cultural survival amid global conflict. Through their specialized microphones, audiences witness how acoustic memory endures when physical structures fall.',
    vision: 'To illuminate the invisible heroes of auditory journalism and demonstrate that listening is an act of humanitarian resistance.',
    mission: 'To push documentary storytelling beyond standard visual journalism into a deeply moving sensory and geopolitical experience.',
    director: 'Sarah Chen',
    producer: 'ROOK WALL STUDIO',
    runtime: '1h 42m',
    language: 'English / Multi',
    rating: '4.9 / 5',
    status: 'Released',
    backdrop: '../assets/images/prod-beyondsilence.jpg',
    videoSrc: '../assets/videos/trailer.mp4',
    relatedIds: ['echoes', 'phoenix', 'midnight-stories']
  },
  'midnight-stories': {
    id: 'midnight-stories',
    title: 'MIDNIGHT STORIES',
    category: 'SERIES',
    year: '2026',
    genre: 'Crime / Mystery',
    shortDesc: 'An atmospheric anthology tracing interconnected secrets veiled under the shadows of a nocturnal metropolis.',
    synopsis: 'Between the hours of midnight and 4:00 AM, the city breathes an entirely different life. Each episode of this noir anthology chronicles a distinct nocturnal encounter—a late-night radio host receiving an enigmatic caller, a forensic photographer documenting an impossible scene, and an underground courier racing against dawn. Their destinies converge in a chilling finale.',
    vision: 'To modernize the classic film-noir aesthetic for episodic prestige television with moody color palettes and moral ambiguity.',
    mission: 'To weave disparate character journeys into a rich urban tapestry that celebrates the mysterious poetry of the night.',
    director: 'Vikramaditya Bose',
    producer: 'ROOK WALL STUDIO',
    runtime: '8 Episodes (48m)',
    language: 'English',
    rating: '4.8 / 5',
    status: 'Season 1 Released',
    backdrop: '../assets/images/prod-midnight.jpg',
    videoSrc: '../assets/videos/trailer.mp4',
    relatedIds: ['phoenix', 'last-frame', 'horizon']
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Read URL parameter & load current production data
  const currentProd = loadCurrentProduction();

  // 2. Setup Global Navigation & Components (theme, notifs, clock, auth, scroll-to-top)
  initGlobalComponents();

  // 3. Setup Custom HTML5 Video Player
  initCustomVideoPlayer();

  // 4. Setup Wishlist Button & Storage
  initWishlist(currentProd.id);

  // 5. Setup Discussion & Comments with Event Delegation and dblclick editing
  initDiscussionSystem(currentProd.id);

  // 6. Setup Crew Card Mouseover/Mouseout Interactive Listeners
  initCrewCardHoverEffects();

  // 7. Setup Watch Trailer button scroll trigger
  initWatchTrailerScroll();

  // 8. Setup Scroll Animations
  initScrollAnimations();
});

/**
 * ------------------------------------------------------------------------------
 * 1. DYNAMIC PRODUCTION LOADER
 * Reads ?id=... and updates DOM with current production's data
 * ------------------------------------------------------------------------------
 */
function loadCurrentProduction() {
  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id') || 'phoenix';
  const prod = PRODUCTIONS_DATA[prodId] || PRODUCTIONS_DATA['phoenix'];

  // Update Page Title
  document.title = `${prod.title} | ROOK WALL STUDIO`;

  // Breadcrumb
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = prod.title;

  // Hero Backdrop
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.style.backgroundImage = `url('${prod.backdrop}')`;
  }

  // Hero Text
  const heroCategory = document.getElementById('heroCategory');
  const heroYear = document.getElementById('heroYear');
  const heroTitle = document.getElementById('heroTitle');
  const heroGenre = document.getElementById('heroGenre');
  const heroDesc = document.getElementById('heroDesc');

  if (heroCategory) heroCategory.textContent = prod.category;
  if (heroYear) heroYear.textContent = prod.year;
  if (heroTitle) heroTitle.textContent = prod.title;
  if (heroGenre) heroGenre.textContent = prod.genre;
  if (heroDesc) heroDesc.textContent = `"${prod.shortDesc}"`;

  // Specs Grid
  const specTitle = document.getElementById('specTitle');
  const specDirector = document.getElementById('specDirector');
  const specProducer = document.getElementById('specProducer');
  const specGenre = document.getElementById('specGenre');
  const specYear = document.getElementById('specYear');
  const specRuntime = document.getElementById('specRuntime');
  const specLanguage = document.getElementById('specLanguage');
  const specRating = document.getElementById('specRating');
  const specStatus = document.getElementById('specStatus');

  if (specTitle) specTitle.textContent = prod.title;
  if (specDirector) specDirector.textContent = prod.director;
  if (specProducer) specProducer.textContent = prod.producer;
  if (specGenre) specGenre.textContent = prod.genre;
  if (specYear) specYear.textContent = prod.year;
  if (specRuntime) specRuntime.textContent = prod.runtime;
  if (specLanguage) specLanguage.textContent = prod.language;
  if (specRating) specRating.innerHTML = `<i class="fa-solid fa-star"></i> ${prod.rating}`;
  if (specStatus) specStatus.textContent = prod.status;

  // Synopsis, Vision, Mission
  const synopsisText = document.getElementById('synopsisText');
  const visionText = document.getElementById('visionText');
  const missionText = document.getElementById('missionText');

  if (synopsisText) synopsisText.textContent = prod.synopsis;
  if (visionText) visionText.textContent = `"${prod.vision}"`;
  if (missionText) missionText.textContent = `"${prod.mission}"`;

  // Update Video Element source
  const videoElem = document.getElementById('trailerVideo');
  if (videoElem && prod.videoSrc) {
    videoElem.src = prod.videoSrc;
  }

  // Related Productions Grid
  renderRelatedProductions(prod.relatedIds);

  return prod;
}

/**
 * Render 3 related productions dynamically
 */
function renderRelatedProductions(relatedIds) {
  const container = document.getElementById('relatedGrid');
  if (!container || !relatedIds) return;

  container.innerHTML = '';
  relatedIds.slice(0, 3).forEach((id) => {
    const item = PRODUCTIONS_DATA[id];
    if (!item) return;

    const card = document.createElement('article');
    card.className = 'prod-card';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <img src="${item.backdrop}" alt="${item.title} poster" class="prod-card-poster" loading="lazy">
      <div class="prod-card-base-overlay"></div>
      
      <div class="prod-card-resting-info">
        <div class="card-category-year">${item.category} &bull; ${item.year}</div>
        <h3 class="card-prod-title">${item.title}</h3>
      </div>

      <div class="prod-card-hover-overlay">
        <div class="hover-tags-row">
          <span class="hover-category-tag">${item.category} &bull; ${item.year}</span>
          <span class="hover-rating-tag"><i class="fa-solid fa-star"></i> ${item.rating.split(' ')[0]}</span>
        </div>
        <h4 class="hover-title">${item.title}</h4>
        <div class="hover-genre">${item.genre}</div>
        <p class="hover-desc">${item.shortDesc}</p>
        <div class="hover-buttons-row">
          <a href="production-details.html?id=${item.id}" class="btn btn-primary btn-hover-sweep hover-details-btn">
            <span>VIEW DETAILS</span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * ------------------------------------------------------------------------------
 * 2. CUSTOM HTML5 VIDEO PLAYER (click, change, timeupdate, dblclick)
 * Full custom controls: play/pause, volume slider, scrub seeking, time, fullscreen
 * ------------------------------------------------------------------------------
 */
function initCustomVideoPlayer() {
  const container = document.getElementById('videoContainer');
  const video = document.getElementById('trailerVideo');
  const bigPlayBtn = document.getElementById('videoBigPlayBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressWrap = document.getElementById('videoProgressWrap');
  const progressBar = document.getElementById('videoProgressBar');
  const timeDisplay = document.getElementById('videoTimeDisplay');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (!video || !container) return;

  // Format seconds to mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Update play/pause UI state
  function updatePlayState() {
    if (video.paused || video.ended) {
      container.classList.remove('is-playing');
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      if (playPauseBtn) playPauseBtn.setAttribute('aria-label', 'Play video');
    } else {
      container.classList.add('is-playing');
      if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      if (playPauseBtn) playPauseBtn.setAttribute('aria-label', 'Pause video');
    }
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().catch((err) => console.log('Video play error:', err));
    } else {
      video.pause();
    }
    // Note: updatePlayState is fired by video's 'play' and 'pause' events below
  }

  // Event: click on big center play button
  if (bigPlayBtn) {
    bigPlayBtn.addEventListener('click', togglePlay);
  }

  // Event: click on play/pause control button
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  // Event: click on video element directly to play/pause
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);
  video.addEventListener('ended', updatePlayState);

  // Event: timeupdate on video to update progress bar and time display
  video.addEventListener('timeupdate', () => {
    if (!isNaN(video.duration) && video.duration > 0) {
      const percentage = (video.currentTime / video.duration) * 100;
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }
      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    }
  });

  // Event: loadedmetadata to display total duration initially
  video.addEventListener('loadedmetadata', () => {
    if (timeDisplay) {
      timeDisplay.textContent = `00:00 / ${formatTime(video.duration)}`;
    }
  });

  // Event: click on progress bar to seek
  if (progressWrap) {
    progressWrap.addEventListener('click', (e) => {
      const rect = progressWrap.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (!isNaN(video.duration)) {
        video.currentTime = clickPos * video.duration;
      }
    });
  }

  // Event: change and input on volume slider
  if (volumeSlider) {
    const updateVolume = () => {
      const val = parseFloat(volumeSlider.value);
      video.volume = val;
      video.muted = (val === 0);
      updateVolumeIcon(val);
    };

    volumeSlider.addEventListener('change', updateVolume);
    volumeSlider.addEventListener('input', updateVolume);
  }

  function updateVolumeIcon(vol) {
    if (!volumeBtn) return;
    if (vol === 0 || video.muted) {
      volumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else if (vol < 0.5) {
      volumeBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  }

  // Volume button click (Mute/Unmute toggle)
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        updateVolumeIcon(0);
        if (volumeSlider) volumeSlider.value = 0;
      } else {
        video.volume = 0.8;
        if (volumeSlider) volumeSlider.value = 0.8;
        updateVolumeIcon(0.8);
      }
    });
  }

  // Fullscreen toggle logic
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      if (fullscreenBtn) fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      if (fullscreenBtn) fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  }

  // Event: click on fullscreen button
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Event: dblclick on video element to toggle fullscreen (Requirement 5 & 6)
  video.addEventListener('dblclick', toggleFullscreen);

  // Sync fullscreen change state
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && fullscreenBtn) {
      fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  });

  // Keyboard accessibility
  container.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'KeyM') {
      if (volumeBtn) volumeBtn.click();
    } else if (e.code === 'KeyF') {
      toggleFullscreen();
    } else if (e.code === 'ArrowRight') {
      video.currentTime = Math.min(video.currentTime + 5, video.duration);
    } else if (e.code === 'ArrowLeft') {
      video.currentTime = Math.max(video.currentTime - 5, 0);
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 3. WATCH TRAILER SCROLL
 * Smoothly scrolls to the custom trailer section and triggers playback
 * ------------------------------------------------------------------------------
 */
function initWatchTrailerScroll() {
  const watchBtn = document.getElementById('heroWatchTrailerBtn');
  const trailerSection = document.getElementById('trailerSection');
  const video = document.getElementById('trailerVideo');

  if (watchBtn && trailerSection) {
    watchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      trailerSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (video) {
          video.play().catch(() => {});
        }
      }, 700);
    });
  }
}

/**
 * ------------------------------------------------------------------------------
 * 4. WISHLIST SYSTEM (localStorage: rookWallWishlist)
 * ------------------------------------------------------------------------------
 */
const WISHLIST_KEY = 'rookWallWishlist';

function initWishlist(currentProdId) {
  const wishlistBtn = document.getElementById('heroWishlistBtn');
  const toast = document.getElementById('detailsToast');
  const toastText = document.getElementById('detailsToastText');
  let toastTimer = null;

  function showToast(msg, isAdded) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    const icon = toast.querySelector('i');
    if (icon) {
      icon.className = isAdded ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function getWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function updateBtnUI(isSaved) {
    if (!wishlistBtn) return;
    const icon = wishlistBtn.querySelector('i');
    const label = wishlistBtn.querySelector('.wishlist-text');
    wishlistBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    if (isSaved) {
      wishlistBtn.classList.add('active');
      if (icon) icon.className = 'fa-solid fa-heart';
      if (label) label.textContent = 'IN WISHLIST';
    } else {
      wishlistBtn.classList.remove('active');
      if (icon) icon.className = 'fa-regular fa-heart';
      if (label) label.textContent = 'ADD TO WISHLIST';
    }
  }

  const list = getWishlist();
  updateBtnUI(list.includes(currentProdId));

  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const currentList = getWishlist();
      const idx = currentList.indexOf(currentProdId);
      if (idx >= 0) {
        currentList.splice(idx, 1);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(currentList));
        updateBtnUI(false);
        showToast('Removed from wishlist', false);
      } else {
        currentList.push(currentProdId);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(currentList));
        updateBtnUI(true);
        showToast('Added to wishlist', true);
      }
    });
  }
}

/**
 * ------------------------------------------------------------------------------
 * 5. DISCUSSION & COMMENTS SYSTEM WITH EVENT DELEGATION & dblclick EDIT
 * Key: rookWallComments
 * Uses Event Delegation on parent .comments-list for Reply, Edit, Delete, and dblclick
 * ------------------------------------------------------------------------------
 */
const COMMENTS_KEY = 'rookWallComments';

function initDiscussionSystem(prodId) {
  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');
  const commentsContainer = document.getElementById('commentsContainer');
  const authorBadge = document.getElementById('commentAuthorName');

  // Detect current session user or default to Cinephile Viewer
  let activeUsername = 'Viewer';
  try {
    const session = localStorage.getItem('rookwall_session');
    if (session) {
      const user = JSON.parse(session);
      if (user.name) activeUsername = user.name;
    }
  } catch (e) {}

  if (authorBadge) authorBadge.textContent = `Posting as: ${activeUsername}`;

  // Default seeded comments for prototype
  const defaultComments = [
    {
      id: 'c1',
      prodId: prodId,
      username: 'Viewer 01',
      text: 'The cinematography looks incredible.',
      timestamp: '2 hours ago',
      replies: []
    },
    {
      id: 'c2',
      prodId: prodId,
      username: 'Viewer 02',
      text: 'Really interesting story concept.',
      timestamp: '45 minutes ago',
      replies: []
    }
  ];

  // Retrieve comments from localStorage
  function getStoredComments() {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      if (data) {
        const allComments = JSON.parse(data);
        return allComments[prodId] || defaultComments;
      }
      return defaultComments;
    } catch (e) {
      return defaultComments;
    }
  }

  // Save comments to localStorage
  function saveComments(list) {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      const allComments = data ? JSON.parse(data) : {};
      allComments[prodId] = list;
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    } catch (e) {
      console.error('Error saving comments:', e);
    }
  }

  // Render all comments
  function renderComments() {
    const list = getStoredComments();
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';
    list.forEach((item) => {
      const commentEl = document.createElement('article');
      commentEl.className = 'comment-item';
      commentEl.setAttribute('data-comment-id', item.id);

      const avatarLetter = item.username.charAt(0).toUpperCase();

      let repliesHtml = '';
      if (item.replies && item.replies.length > 0) {
        repliesHtml = `
          <div class="replies-sublist">
            ${item.replies.map(r => `
              <div class="reply-item">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.8rem;">
                  <strong style="color:var(--text-primary); font-family:var(--font-cinematic);">${r.username}</strong>
                  <span style="color:var(--text-muted); font-size:0.75rem;">${r.timestamp}</span>
                </div>
                <div style="font-size:0.9rem; color:#d1d1de;">${r.text}</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      commentEl.innerHTML = `
        <div class="comment-header">
          <div class="comment-user-box">
            <div class="comment-avatar">${avatarLetter}</div>
            <div>
              <div class="comment-username">${item.username}</div>
              <span class="comment-timestamp">${item.timestamp}</span>
            </div>
          </div>
          <span style="font-size:0.72rem; color:var(--text-muted); font-style:italic;">Double-click to edit</span>
        </div>

        <div class="comment-text-content" data-action="editable-text" title="Double-click to edit">${item.text}</div>

        <div class="comment-actions-row">
          <button type="button" class="comment-action-btn btn-reply" data-action="reply">
            <i class="fa-solid fa-reply"></i> Reply
          </button>
          <button type="button" class="comment-action-btn btn-edit" data-action="edit">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button type="button" class="comment-action-btn btn-delete" data-action="delete">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </div>

        <!-- Inline Reply Input Form -->
        <div class="reply-input-wrap" data-reply-wrap="true">
          <div style="display:flex; gap:0.5rem;">
            <input type="text" class="form-input" style="flex:1; padding:0.6rem 0.9rem;" placeholder="Write a reply..." data-reply-input="true">
            <button type="button" class="btn btn-primary" style="padding:0.6rem 1.2rem; font-size:0.78rem;" data-action="submit-reply">Reply</button>
          </div>
        </div>

        ${repliesHtml}
      `;

      commentsContainer.appendChild(commentEl);
    });
  }

  // Live Character Counter & Validation Input Handler
  const charCounter = document.getElementById('commentCharCounter');
  const commentError = document.getElementById('commentInputError');
  const maxCommentLength = 1000;

  function updateCharCount() {
    if (!commentInput || !charCounter) return;
    const len = commentInput.value.length;
    charCounter.textContent = `${len} / ${maxCommentLength}`;

    if (len > 900) {
      charCounter.className = 'comment-char-counter limit';
    } else if (len > 750) {
      charCounter.className = 'comment-char-counter warning';
    } else {
      charCounter.className = 'comment-char-counter';
    }

    if (commentError && commentError.classList.contains('active') && commentInput.value.trim().length >= 3) {
      commentError.textContent = '';
      commentError.classList.remove('active');
      commentInput.classList.remove('has-error');
    }
  }

  if (commentInput) {
    commentInput.addEventListener('input', updateCharCount);
    updateCharCount();
  }

  // Form Submit: Add new comment with validation error feedback
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = commentInput ? commentInput.value.trim() : '';

      if (!text || text.length < 3) {
        if (commentError) {
          commentError.textContent = 'Please enter a comment of at least 3 characters.';
          commentError.classList.add('active');
        }
        if (commentInput) {
          commentInput.classList.add('has-error');
          commentInput.focus();
        }
        return;
      }

      // Clear any prior errors
      if (commentError) {
        commentError.textContent = '';
        commentError.classList.remove('active');
      }
      if (commentInput) {
        commentInput.classList.remove('has-error');
      }

      const newComment = {
        id: 'c_' + Date.now(),
        prodId: prodId,
        username: activeUsername,
        text: text,
        timestamp: 'Just now',
        replies: []
      };

      const list = getStoredComments();
      list.unshift(newComment);
      saveComments(list);

      if (commentInput) commentInput.value = '';
      updateCharCount();
      renderComments();

      // Show notification toast
      const toast = document.getElementById('detailsToast');
      const toastText = document.getElementById('detailsToastText');
      if (toast && toastText) {
        toastText.textContent = 'Comment posted successfully.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
      }
    });
  }

  /**
   * EVENT DELEGATION ON PARENT CONTAINER (.comments-list)
   * Handles: click (Reply, Edit, Delete, Submit-Reply) and dblclick (Edit text)
   */
  if (commentsContainer) {
    // CLICK EVENT DELEGATION
    commentsContainer.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('[data-action]');
      if (!targetBtn) return;

      const action = targetBtn.getAttribute('data-action');
      const commentItem = targetBtn.closest('.comment-item');
      if (!commentItem) return;

      const commentId = commentItem.getAttribute('data-comment-id');

      // 1. DELETE ACTION
      if (action === 'delete') {
        let list = getStoredComments();
        list = list.filter((c) => c.id !== commentId);
        saveComments(list);
        renderComments();
      }

      // 2. EDIT ACTION (Click on Edit Button)
      else if (action === 'edit') {
        const textEl = commentItem.querySelector('.comment-text-content');
        if (textEl) {
          makeCommentEditable(textEl, commentId);
        }
      }

      // 3. REPLY ACTION (Toggle Reply Form)
      else if (action === 'reply') {
        const replyWrap = commentItem.querySelector('[data-reply-wrap="true"]');
        if (replyWrap) {
          replyWrap.classList.toggle('active');
          const input = replyWrap.querySelector('[data-reply-input="true"]');
          if (replyWrap.classList.contains('active') && input) {
            input.focus();
          }
        }
      }

      // 4. SUBMIT REPLY ACTION
      else if (action === 'submit-reply') {
        const replyWrap = commentItem.querySelector('[data-reply-wrap="true"]');
        const replyInput = replyWrap ? replyWrap.querySelector('[data-reply-input="true"]') : null;
        const replyText = replyInput ? replyInput.value.trim() : '';

        if (replyText) {
          const list = getStoredComments();
          const targetComment = list.find((c) => c.id === commentId);
          if (targetComment) {
            if (!targetComment.replies) targetComment.replies = [];
            targetComment.replies.push({
              username: activeUsername,
              text: replyText,
              timestamp: 'Just now'
            });
            saveComments(list);
            renderComments();
          }
        }
      }
    });

    // DBLCLICK EVENT DELEGATION (Double-click to edit)
    commentsContainer.addEventListener('dblclick', (e) => {
      const textEl = e.target.closest('.comment-text-content');
      if (!textEl) return;

      const commentItem = textEl.closest('.comment-item');
      if (!commentItem) return;

      const commentId = commentItem.getAttribute('data-comment-id');
      makeCommentEditable(textEl, commentId);
    });
  }

  // Inline edit helper function
  function makeCommentEditable(textEl, commentId) {
    if (textEl.getAttribute('contenteditable') === 'true') return;

    textEl.setAttribute('contenteditable', 'true');
    textEl.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(textEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const finishEdit = () => {
      textEl.setAttribute('contenteditable', 'false');
      const updatedText = textEl.textContent.trim();
      if (updatedText) {
        const list = getStoredComments();
        const found = list.find((c) => c.id === commentId);
        if (found) {
          found.text = updatedText;
          saveComments(list);
        }
      } else {
        renderComments(); // restore original if empty
      }
    };

    // Save on blur or Enter
    textEl.addEventListener('blur', finishEdit, { once: true });
    textEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        textEl.blur();
      }
    });
  }

  // Initial render of comments
  renderComments();
}

/**
 * ------------------------------------------------------------------------------
 * 6. CREW CARD MOUSEOVER & MOUSEOUT JAVASCRIPT EVENT HANDLING
 * Attaches dynamic mouseover and mouseout listeners to each .crew-card
 * ------------------------------------------------------------------------------
 */
function initCrewCardHoverEffects() {
  const crewCards = document.querySelectorAll('.crew-card');
  crewCards.forEach((card) => {
    card.addEventListener('mouseover', () => {
      card.classList.add('is-hovered');
    });

    card.addEventListener('mouseout', () => {
      card.classList.remove('is-hovered');
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 6. GLOBAL COMPONENTS INTEGRATION
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

  // Live Studio Clock
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

  // Graceful fallback on broken images
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
 * 7. SCROLL REVEAL ANIMATIONS
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
