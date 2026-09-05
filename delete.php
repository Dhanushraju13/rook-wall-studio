<?php
/**
 * ============================================================================
 * ROOK WALL STUDIO — ASSIGNMENT VII DELETE RECORD
 * File: delete.php
 * Deletes a registered user record and cleans up their uploaded profile picture.
 * Uses prepared statement for SQL injection prevention.
 * ============================================================================
 */

require_once 'db_connect.php';

// Validate ID from GET request
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    header('Location: view_records.php?error=' . urlencode('Invalid record ID for deletion.'));
    exit();
}

// 1. Fetch record first to get profile picture filename for clean disk removal
$select_stmt = $conn->prepare("SELECT profile_pic FROM users WHERE id = ? LIMIT 1");
$select_stmt->bind_param("i", $id);
$select_stmt->execute();
$select_res = $select_stmt->get_result();

$profile_pic_to_remove = '';
if ($select_res && $select_res->num_rows > 0) {
    $row = $select_res->fetch_assoc();
    $profile_pic_to_remove = $row['profile_pic'];
}
$select_stmt->close();

// 2. Execute DELETE statement
$delete_stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$delete_stmt->bind_param("i", $id);

if ($delete_stmt->execute()) {
    $delete_stmt->close();

    // 3. Clean up physical image file if not a shared default
    if (!empty($profile_pic_to_remove) && $profile_pic_to_remove !== 'default_avatar.png') {
        $file_path = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $profile_pic_to_remove;
        if (file_exists($file_path)) {
            @unlink($file_path);
        }
    }

    $conn->close();
    header('Location: view_records.php?success=deleted');
    exit();
} else {
    $error_msg = urlencode('Failed to delete record: ' . $delete_stmt->error);
    $delete_stmt->close();
    $conn->close();
    header("Location: view_records.php?error={$error_msg}");
    exit();
}
?>
