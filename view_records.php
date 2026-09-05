<?php
/**
 * ============================================================================
 * ROOK WALL STUDIO — ASSIGNMENT VII VIEW RECORDS
 * File: view_records.php
 * Displays all registered studio users in a responsive table.
 * Includes thumbnail display, edit/delete actions, and status alerts.
 * ============================================================================
 */

require_once 'db_connect.php';

// Fetch all registered records sorted chronologically descending
$sql = "SELECT id, name, email, phone, dob, gender, address, course, profile_pic, created_at FROM users ORDER BY id DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registered Personnel Directory | ROOK WALL STUDIO</title>
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
          <span class="brand-sub">PERSONNEL DIRECTORY</span>
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
      <div class="badge-tag"><i class="fa-solid fa-database"></i> Database Records</div>
      <h1 class="hero-title">REGISTERED <span>STUDIO</span> PERSONNEL</h1>
      <p class="hero-subtitle">Complete registry of personnel, department allocations, and submitted credentials stored in the <code>registration_db</code> database.</p>
    </section>

    <!-- Success & Feedback Banners -->
    <?php if (isset($_GET['success'])): ?>
      <aside class="alert-banner alert-success" role="status">
        <i class="fa-solid fa-circle-check"></i>
        <span>
          <?php
            $success = $_GET['success'];
            if ($success === '1') {
              echo 'Registration submitted and saved to MySQL successfully.';
            } elseif ($success === 'updated') {
              echo 'User record and credentials updated successfully.';
            } elseif ($success === 'deleted') {
              echo 'User record deleted from the database.';
            } else {
              echo 'Operation completed successfully.';
            }
          ?>
        </span>
      </aside>
    <?php endif; ?>

    <?php if (isset($_GET['error'])): ?>
      <aside class="alert-banner alert-error" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span><?= htmlspecialchars($_GET['error'], ENT_QUOTES, 'UTF-8'); ?></span>
      </aside>
    <?php endif; ?>

    <!-- Records Table Container -->
    <section class="records-container">
      <div class="records-header">
        <h2 class="records-title"><i class="fa-solid fa-users-gear" style="color: var(--accent-bright); margin-right: 0.5rem;"></i> Active Submissions</h2>
        <a href="index.php" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-plus"></i> New Registration
        </a>
      </div>

      <div class="table-responsive">
        <table class="studio-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Department / Course</th>
              <th>Address</th>
              <th>Registered At</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php if ($result && $result->num_rows > 0): ?>
              <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                  <td><strong>#<?= htmlspecialchars($row['id'], ENT_QUOTES, 'UTF-8'); ?></strong></td>
                  <td>
                    <?php
                      $pic = $row['profile_pic'];
                      $img_path = 'uploads/' . $pic;
                      $show_default = empty($pic) || !file_exists(__DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $pic);
                    ?>
                    <?php if (!$show_default): ?>
                      <img src="<?= htmlspecialchars($img_path, ENT_QUOTES, 'UTF-8'); ?>" alt="<?= htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); ?> photo" class="avatar-cell">
                    <?php else: ?>
                      <div class="avatar-cell" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:1.2rem;">
                        <i class="fa-solid fa-user"></i>
                      </div>
                    <?php endif; ?>
                  </td>
                  <td style="font-weight: 600; color: #fff;"><?= htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><a href="mailto:<?= htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8'); ?>" style="color: var(--accent-bright);"><?= htmlspecialchars($row['email'], ENT_QUOTES, 'UTF-8'); ?></a></td>
                  <td><?= htmlspecialchars($row['phone'], ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><?= htmlspecialchars($row['dob'], ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><?= htmlspecialchars($row['gender'], ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><span class="badge-course"><?= htmlspecialchars($row['course'], ENT_QUOTES, 'UTF-8'); ?></span></td>
                  <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis;" title="<?= htmlspecialchars($row['address'], ENT_QUOTES, 'UTF-8'); ?>">
                    <?= htmlspecialchars($row['address'], ENT_QUOTES, 'UTF-8'); ?>
                  </td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;"><?= htmlspecialchars(date('M d, Y H:i', strtotime($row['created_at'])), ENT_QUOTES, 'UTF-8'); ?></td>
                  <td>
                    <div class="actions-cell">
                      <a href="edit.php?id=<?= urlencode($row['id']); ?>" class="btn btn-outline btn-sm" title="Edit record" aria-label="Edit <?= htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); ?>">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                      </a>
                      <button type="button" class="btn btn-danger btn-sm btn-delete-trigger" data-id="<?= htmlspecialchars($row['id'], ENT_QUOTES, 'UTF-8'); ?>" data-name="<?= htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); ?>" aria-label="Delete <?= htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); ?>">
                        <i class="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              <?php endwhile; ?>
            <?php else: ?>
              <tr>
                <td colspan="11">
                  <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <h3>No Records Found</h3>
                    <p>No user registrations have been stored in the database yet.</p>
                    <a href="index.php" class="btn btn-primary btn-sm" style="margin-top: 1rem;">
                      <i class="fa-solid fa-user-plus"></i> Submit First Registration
                    </a>
                  </div>
                </td>
              </tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>

  </main>

  <!-- DELETE CONFIRMATION MODAL -->
  <div class="modal-backdrop" id="deleteModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-card">
      <div class="modal-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 id="modalTitle" style="font-family: var(--font-cinematic); margin-bottom: 0.5rem;">Delete Registration</h3>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">Are you sure you want to delete the record for <strong id="deleteUserName" style="color: #fff;">this user</strong>? This action cannot be undone.</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="cancelDeleteBtn">Cancel</button>
        <a href="#" class="btn btn-danger" id="confirmDeleteBtn">Delete Record</a>
      </div>
    </div>
  </div>

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
