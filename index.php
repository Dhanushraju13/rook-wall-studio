<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio Registration & Feedback | ROOK WALL STUDIO</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- FontAwesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Module Stylesheet -->
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- SITE HEADER -->
  <header class="site-header">
    <nav class="nav-container" aria-label="Main Navigation">
      <a href="index.php" class="nav-brand">
        <div class="brand-icon" aria-hidden="true"><i class="fa-solid fa-chess-rook"></i></div>
        <div>
          ROOK WALL
          <span class="brand-sub">STUDIO REGISTRATION</span>
        </div>
      </a>
      <ul class="nav-links">
        <li><a href="index.php" class="nav-link active"><i class="fa-solid fa-user-plus"></i> Register</a></li>
        <li><a href="view_records.php" class="nav-link"><i class="fa-solid fa-table-list"></i> View Records</a></li>
        <li><a href="../index.html" class="nav-link"><i class="fa-solid fa-house"></i> Main Site</a></li>
      </ul>
    </nav>
  </header>

  <!-- MAIN CONTENT -->
  <main class="main-content">

    <section class="hero-banner">
      <div class="badge-tag"><i class="fa-solid fa-film"></i> Assignment VII &bull; PHP + MySQL</div>
      <h1 class="hero-title">STUDIO <span>REGISTRATION</span> & FEEDBACK</h1>
      <p class="hero-subtitle">Enter your official studio personnel details and department preferences. All records are validated and securely registered in the studio database.</p>
    </section>

    <?php if (isset($_GET['error'])): ?>
      <aside class="alert-banner alert-error" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>
          <?php
            $err = $_GET['error'];
            if ($err === 'duplicate_email') {
              echo 'This email address is already registered in the studio database. Please use a unique email or edit your existing profile.';
            } elseif ($err === 'invalid_file') {
              echo 'Invalid profile image format or file size exceeded (Max 2MB: JPG, PNG, WEBP).';
            } elseif ($err === 'upload_failed') {
              echo 'Failed to store uploaded profile picture. Check upload folder permissions.';
            } elseif ($err === 'empty_fields') {
              echo 'Please fill in all mandatory fields with valid values.';
            } else {
              echo 'An error occurred during submission: ' . htmlspecialchars($err, ENT_QUOTES, 'UTF-8');
            }
          ?>
        </span>
      </aside>
    <?php endif; ?>

    <article class="form-card">
      <form id="registrationForm" method="POST" action="submit.php" enctype="multipart/form-data" novalidate>

        <div class="form-grid">

          <!-- 1. Full Name -->
          <div class="form-group full-width">
            <label for="name" class="form-label">
              <span>Full Name</span>
              <span class="required-indicator">*</span>
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              class="form-control" 
              placeholder="e.g. Marcus Vance" 
              required 
              minlength="3" 
              maxlength="100"
              autocomplete="name"
            >
            <span class="field-error" id="nameError"></span>
          </div>

          <!-- 2. Email Address -->
          <div class="form-group">
            <label for="email" class="form-label">
              <span>Email Address</span>
              <span class="required-indicator">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="form-control" 
              placeholder="e.g. marcus@rookwallstudio.com" 
              required
              autocomplete="email"
            >
            <span class="field-error" id="emailError"></span>
          </div>

          <!-- 3. Phone Number -->
          <div class="form-group">
            <label for="phone" class="form-label">
              <span>Phone Number</span>
              <span class="required-indicator">*</span>
            </label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              class="form-control" 
              placeholder="e.g. +91 98765 43210" 
              required 
              pattern="^\+?[0-9\s\-]{10,15}$"
              autocomplete="tel"
            >
            <span class="field-error" id="phoneError"></span>
          </div>

          <!-- 4. Date of Birth -->
          <div class="form-group">
            <label for="dob" class="form-label">
              <span>Date of Birth</span>
              <span class="required-indicator">*</span>
            </label>
            <input 
              type="date" 
              id="dob" 
              name="dob" 
              class="form-control" 
              required
            >
            <span class="field-error" id="dobError"></span>
          </div>

          <!-- 5. Course / Department -->
          <div class="form-group">
            <label for="course" class="form-label">
              <span>Course / Department</span>
              <span class="required-indicator">*</span>
            </label>
            <select id="course" name="course" class="form-control" required>
              <option value="" disabled selected>-- Select Course / Department --</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Other">Other</option>
            </select>
            <span class="field-error" id="courseError"></span>
          </div>

          <!-- 6. Gender -->
          <div class="form-group full-width">
            <label class="form-label">
              <span>Gender</span>
              <span class="required-indicator">*</span>
            </label>
            <div class="radio-group" role="radiogroup" aria-labelledby="gender-group">
              <label class="radio-label">
                <input type="radio" name="gender" value="Male"> Male
              </label>
              <label class="radio-label">
                <input type="radio" name="gender" value="Female"> Female
              </label>
              <label class="radio-label">
                <input type="radio" name="gender" value="Other"> Other
              </label>
            </div>
            <span class="field-error" id="genderError"></span>
          </div>

          <!-- 7. Address -->
          <div class="form-group full-width">
            <label for="address" class="form-label">
              <span>Studio / Residential Address</span>
              <span class="required-indicator">*</span>
            </label>
            <textarea 
              id="address" 
              name="address" 
              class="form-control" 
              placeholder="Enter complete postal or studio address..." 
              required 
              maxlength="500"
            ></textarea>
            <span class="field-error" id="addressError"></span>
          </div>

          <!-- 8. Profile Picture -->
          <div class="form-group full-width">
            <label class="form-label">
              <span>Profile Picture</span>
              <span class="required-indicator">*</span>
            </label>
            <div class="file-upload-wrapper">
              <input 
                type="file" 
                id="profile_pic" 
                name="profile_pic" 
                accept="image/jpeg,image/png,image/webp" 
                required 
                style="display: none;"
              >
              <div class="file-dropzone" id="fileDropzone" tabindex="0" role="button" aria-label="Upload profile image">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <div>
                  <strong>Click to browse</strong> or drag and drop image here
                </div>
                <div class="file-hint">Supported formats: JPG, JPEG, PNG, WEBP &bull; Max size: 2MB</div>
              </div>

              <div class="file-preview" id="filePreview" style="display: none;">
                <img id="previewImg" src="" alt="Profile Preview">
                <div class="file-preview-info" id="fileNameDisplay"></div>
              </div>
            </div>
            <span class="field-error" id="profilePicError"></span>
          </div>

        </div><!-- /.form-grid -->

        <div class="form-actions">
          <button type="reset" class="btn btn-outline">
            <i class="fa-solid fa-rotate-left"></i> Reset
          </button>
          <button type="submit" class="btn btn-primary" id="submitBtn">
            <i class="fa-solid fa-paper-plane"></i> Submit Registration
          </button>
        </div>

      </form>
    </article>

  </main>

  <!-- SITE FOOTER -->
  <footer class="site-footer">
    <div class="footer-brand">ROOK WALL STUDIO</div>
    <p>Full Stack Development Laboratory &bull; Assignment VII: PHP & MySQL Registration System</p>
    <p style="margin-top: 0.35rem; color: var(--accent-bright);">[STUDENT NAME] &bull; [REGISTER NUMBER]</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
