<?php
/**
 * ============================================================================
 * ROOK WALL STUDIO — ASSIGNMENT VII EDIT RECORD
 * File: edit.php
 * Allows admin to edit user details and optionally replace profile image.
 * Uses prepared SELECT and UPDATE statements with secure file replacement.
 * ============================================================================
 */

require_once 'db_connect.php';

// 1. Validate ID from GET request
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    header('Location: view_records.php?error=' . urlencode('Invalid record ID specified.'));
    exit();
}

// 2. Fetch existing record via prepared statement
$fetch_stmt = $conn->prepare("SELECT id, name, email, phone, dob, gender, address, course, profile_pic FROM users WHERE id = ? LIMIT 1");
$fetch_stmt->bind_param("i", $id);
$fetch_stmt->execute();
$result = $fetch_stmt->get_result();

if (!$result || $result->num_rows === 0) {
    $fetch_stmt->close();
    header('Location: view_records.php?error=' . urlencode('User record not found.'));
    exit();
}

$user = $result->fetch_assoc();
$fetch_stmt->close();

// 3. Handle Form Submission (POST)
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $dob     = isset($_POST['dob']) ? trim($_POST['dob']) : '';
    $gender  = isset($_POST['gender']) ? trim($_POST['gender']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    $course  = isset($_POST['course']) ? trim($_POST['course']) : '';

    // Validations
    if (empty($name) || strlen($name) < 3) {
        $errors[] = 'Name is required and must be at least 3 characters.';
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid email address is required.';
    }

    $phone_cleaned = preg_replace('/[\s\-\(\)]/', '', $phone);
    if (empty($phone) || !preg_match('/^\+?[0-9]{10,15}$/', $phone_cleaned)) {
        $errors[] = 'A valid phone number (10 to 15 digits) is required.';
    }

    if (empty($dob)) {
        $errors[] = 'Date of birth is required.';
    } else {
        $dob_timestamp = strtotime($dob);
        if (!$dob_timestamp || $dob_timestamp >= time()) {
            $errors[] = 'Date of birth must be a valid past date.';
        }
    }

    $valid_genders = ['Male', 'Female', 'Other'];
    if (empty($gender) || !in_array($gender, $valid_genders, true)) {
        $errors[] = 'Please select a valid gender option.';
    }

    $valid_courses = ['Information Technology', 'Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other'];
    if (empty($course) || !in_array($course, $valid_courses, true)) {
        $errors[] = 'Please select a valid course or department.';
    }

    if (empty($address) || strlen($address) < 8) {
        $errors[] = 'Address is required and must be at least 8 characters.';
    }

    // Check duplicate email against other records
    if (empty($errors)) {
        $email_check = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1");
        $email_check->bind_param("si", $email, $id);
        $email_check->execute();
        $email_check->store_result();
        if ($email_check->num_rows > 0) {
            $errors[] = 'This email address is already assigned to another user.';
        }
        $email_check->close();
    }

    // Profile Picture Replacement (optional in edit mode)
    $final_profile_pic = $user['profile_pic'];
    $new_pic_uploaded = false;

    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['profile_pic'];
        $max_size = 2 * 1024 * 1024; // 2MB

        if ($file['size'] > $max_size) {
            $errors[] = 'New profile picture exceeds the 2MB limit.';
        } else {
            $allowed_exts = ['jpg', 'jpeg', 'png', 'webp'];
            $allowed_mimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime_type = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);

            if (!in_array($file_ext, $allowed_exts, true) || !in_array($mime_type, $allowed_mimes, true)) {
                $errors[] = 'Only JPG, JPEG, PNG, or WEBP image files are allowed.';
            } else {
                $unique_name = 'user_' . bin2hex(random_bytes(8)) . '_' . time() . '.' . $file_ext;
                $target_dir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
                $target_file = $target_dir . $unique_name;

                if (move_uploaded_file($file['tmp_name'], $target_file)) {
                    $final_profile_pic = $unique_name;
                    $new_pic_uploaded = true;
                } else {
                    $errors[] = 'Failed to save the new profile picture.';
                }
            }
        }
    }

    // Execute UPDATE statement if no errors
    if (empty($errors)) {
        $update_sql = "UPDATE users SET name = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?, course = ?, profile_pic = ? WHERE id = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ssssssssi", $name, $email, $phone, $dob, $gender, $address, $course, $final_profile_pic, $id);

        if ($update_stmt->execute()) {
            // Remove old image file if replaced and not default
            if ($new_pic_uploaded && !empty($user['profile_pic']) && $user['profile_pic'] !== 'default_avatar.png') {
                $old_file = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $user['profile_pic'];
                if (file_exists($old_file)) {
                    @unlink($old_file);
                }
            }

            $update_stmt->close();
            $conn->close();
            header("Location: view_records.php?success=updated");
            exit();
        } else {
            $errors[] = 'Failed to update record in database: ' . $update_stmt->error;
            $update_stmt->close();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Record #<?= htmlspecialchars($user['id'], ENT_QUOTES, 'UTF-8'); ?> | ROOK WALL STUDIO</title>
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
          <span class="brand-sub">STUDIO ADMIN</span>
        </div>
      </a>
      <ul class="nav-links">
        <li><a href="index.php" class="nav-link"><i class="fa-solid fa-user-plus"></i> Register</a></li>
        <li><a href="view_records.php" class="nav-link active"><i class="fa-solid fa-table-list"></i> View Records</a></li>
        <li><a href="../index.html" class="nav-link"><i class="fa-solid fa-house"></i> Main Site</a></li>
      </ul>
    </nav>
  </header>

  <!-- MAIN CONTENT -->
  <main class="main-content">

    <section class="hero-banner">
      <div class="badge-tag"><i class="fa-solid fa-pen-to-square"></i> Admin Edit Mode</div>
      <h1 class="hero-title">EDIT <span>PERSONNEL</span> RECORD</h1>
      <p class="hero-subtitle">Updating studio credentials for <strong><?= htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8'); ?></strong> (Record #<?= htmlspecialchars($user['id'], ENT_QUOTES, 'UTF-8'); ?>).</p>
    </section>

    <?php if (!empty($errors)): ?>
      <aside class="alert-banner alert-error" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div>
          <?php foreach ($errors as $error): ?>
            <div><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
          <?php endforeach; ?>
        </div>
      </aside>
    <?php endif; ?>

    <article class="form-card">
      <form id="registrationForm" method="POST" action="edit.php?id=<?= urlencode($user['id']); ?>" enctype="multipart/form-data" novalidate>

        <!-- Flag for JS to indicate edit mode (photo is optional) -->
        <input type="hidden" id="isEditMode" value="1">

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
              value="<?= htmlspecialchars($user['name'], ENT_QUOTES, 'UTF-8'); ?>"
              required 
              minlength="3" 
              maxlength="100"
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
              value="<?= htmlspecialchars($user['email'], ENT_QUOTES, 'UTF-8'); ?>"
              required
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
              value="<?= htmlspecialchars($user['phone'], ENT_QUOTES, 'UTF-8'); ?>"
              required 
              pattern="^\+?[0-9\s\-]{10,15}$"
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
              value="<?= htmlspecialchars($user['dob'], ENT_QUOTES, 'UTF-8'); ?>"
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
              <?php
                $courses = ['Information Technology', 'Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other'];
                foreach ($courses as $c) {
                  $selected = ($user['course'] === $c) ? 'selected' : '';
                  echo "<option value=\"" . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . "\" {$selected}>" . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . "</option>";
                }
              ?>
            </select>
            <span class="field-error" id="courseError"></span>
          </div>

          <!-- 6. Gender -->
          <div class="form-group full-width">
            <label class="form-label">
              <span>Gender</span>
              <span class="required-indicator">*</span>
            </label>
            <div class="radio-group" role="radiogroup">
              <label class="radio-label">
                <input type="radio" name="gender" value="Male" <?= ($user['gender'] === 'Male') ? 'checked' : ''; ?>> Male
              </label>
              <label class="radio-label">
                <input type="radio" name="gender" value="Female" <?= ($user['gender'] === 'Female') ? 'checked' : ''; ?>> Female
              </label>
              <label class="radio-label">
                <input type="radio" name="gender" value="Other" <?= ($user['gender'] === 'Other') ? 'checked' : ''; ?>> Other
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
              required 
              maxlength="500"
            ><?= htmlspecialchars($user['address'], ENT_QUOTES, 'UTF-8'); ?></textarea>
            <span class="field-error" id="addressError"></span>
          </div>

          <!-- 8. Profile Picture (Optional in Edit) -->
          <div class="form-group full-width">
            <label class="form-label">
              <span>Profile Picture</span>
              <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(Leave empty to keep existing photo)</span>
            </label>
            
            <!-- Current Photo Display -->
            <div style="display:flex; align-items:center; gap:1rem; margin-bottom:0.75rem;">
              <?php
                $pic = $user['profile_pic'];
                $img_path = 'uploads/' . $pic;
                $has_pic = !empty($pic) && file_exists(__DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $pic);
              ?>
              <?php if ($has_pic): ?>
                <img src="<?= htmlspecialchars($img_path, ENT_QUOTES, 'UTF-8'); ?>" alt="Current Photo" style="width:55px; height:55px; border-radius:var(--radius-sm); object-fit:cover; border:1px solid var(--border);">
              <?php else: ?>
                <div style="width:55px; height:55px; border-radius:var(--radius-sm); background:var(--bg-card-solid); display:flex; align-items:center; justify-content:center; color:var(--text-muted); border:1px solid var(--border);">
                  <i class="fa-solid fa-user"></i>
                </div>
              <?php endif; ?>
              <span style="font-size:0.82rem; color:var(--text-secondary);">Current file: <code><?= htmlspecialchars($user['profile_pic'], ENT_QUOTES, 'UTF-8'); ?></code></span>
            </div>

            <div class="file-upload-wrapper">
              <input 
                type="file" 
                id="profile_pic" 
                name="profile_pic" 
                accept="image/jpeg,image/png,image/webp" 
                style="display: none;"
              >
              <div class="file-dropzone" id="fileDropzone" tabindex="0" role="button" aria-label="Upload new profile image">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <div>
                  <strong>Click to select new image</strong> or drag and drop here
                </div>
                <div class="file-hint">Leave blank to retain current image. Max 2MB (JPG, PNG, WEBP).</div>
              </div>

              <div class="file-preview" id="filePreview" style="display: none;">
                <img id="previewImg" src="" alt="New Profile Preview">
                <div class="file-preview-info" id="fileNameDisplay"></div>
              </div>
            </div>
            <span class="field-error" id="profilePicError"></span>
          </div>

        </div><!-- /.form-grid -->

        <div class="form-actions">
          <a href="view_records.php" class="btn btn-outline">
            <i class="fa-solid fa-arrow-left"></i> Cancel
          </a>
          <button type="submit" class="btn btn-primary">
            <i class="fa-solid fa-floppy-disk"></i> Save Changes
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
<?php
$conn->close();
?>
