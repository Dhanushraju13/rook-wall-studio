<?php
/**
 * ============================================================================
 * ROOK WALL STUDIO — ASSIGNMENT VII FORM PROCESSOR
 * File: submit.php
 * Handles input sanitization, multi-layer server validation, image upload,
 * duplicate email detection, and prepared statements.
 * ============================================================================
 */

require_once 'db_connect.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit();
}

// 1. Capture and trim inputs
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$dob     = isset($_POST['dob']) ? trim($_POST['dob']) : '';
$gender  = isset($_POST['gender']) ? trim($_POST['gender']) : '';
$address = isset($_POST['address']) ? trim($_POST['address']) : '';
$course  = isset($_POST['course']) ? trim($_POST['course']) : '';

// 2. Server-side validation
$errors = [];

// Name validation
if (empty($name) || strlen($name) < 3) {
    $errors[] = 'Name is required and must be at least 3 characters.';
}

// Email validation with filter_var
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

// Phone validation (10 to 15 digits)
$phone_cleaned = preg_replace('/[\s\-\(\)]/', '', $phone);
if (empty($phone) || !preg_match('/^\+?[0-9]{10,15}$/', $phone_cleaned)) {
    $errors[] = 'A valid phone number (10 to 15 digits) is required.';
}

// Date of Birth validation
if (empty($dob)) {
    $errors[] = 'Date of birth is required.';
} else {
    $dob_timestamp = strtotime($dob);
    if (!$dob_timestamp || $dob_timestamp >= time()) {
        $errors[] = 'Date of birth must be a valid past date.';
    }
}

// Gender validation
$valid_genders = ['Male', 'Female', 'Other'];
if (empty($gender) || !in_array($gender, $valid_genders, true)) {
    $errors[] = 'Please select a valid gender option.';
}

// Course validation
$valid_courses = ['Information Technology', 'Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other'];
if (empty($course) || !in_array($course, $valid_courses, true)) {
    $errors[] = 'Please select a valid course or department.';
}

// Address validation
if (empty($address) || strlen($address) < 8) {
    $errors[] = 'Address is required and must be at least 8 characters.';
}

// 3. Profile picture upload validation
$uploaded_filename = '';
if (!isset($_FILES['profile_pic']) || $_FILES['profile_pic']['error'] === UPLOAD_ERR_NO_FILE) {
    $errors[] = 'Profile picture upload is required.';
} else {
    $file = $_FILES['profile_pic'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Error occurred during file upload. Error code: ' . $file['error'];
    } else {
        // Max 2MB file size check
        $max_size = 2 * 1024 * 1024;
        if ($file['size'] > $max_size) {
            $errors[] = 'Profile picture exceeds the maximum allowed size of 2MB.';
        }

        // Extension & MIME verification
        $allowed_exts = ['jpg', 'jpeg', 'png', 'webp'];
        $allowed_mimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($file_ext, $allowed_exts, true) || !in_array($mime_type, $allowed_mimes, true)) {
            $errors[] = 'Only JPG, JPEG, PNG, or WEBP image files are allowed.';
        }

        // Generate unique cryptographically safe filename
        if (empty($errors)) {
            $unique_name = 'user_' . bin2hex(random_bytes(8)) . '_' . time() . '.' . $file_ext;
            $target_dir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;

            if (!is_dir($target_dir)) {
                mkdir($target_dir, 0755, true);
            }

            $target_file = $target_dir . $unique_name;

            if (!move_uploaded_file($file['tmp_name'], $target_file)) {
                $errors[] = 'Failed to save the uploaded profile picture to disk.';
            } else {
                $uploaded_filename = $unique_name;
            }
        }
    }
}

// If validation errors exist, redirect back with error notice
if (!empty($errors)) {
    // If an image was saved before other errors caught, clean it up
    if (!empty($uploaded_filename)) {
        $cleanup = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $uploaded_filename;
        if (file_exists($cleanup)) @unlink($cleanup);
    }

    $first_error = urlencode($errors[0]);
    header("Location: index.php?error={$first_error}");
    exit();
}

// 4. Check for duplicate email using prepared statement
$check_sql = "SELECT id FROM users WHERE email = ? LIMIT 1";
$check_stmt = $conn->prepare($check_sql);

if (!$check_stmt) {
    header("Location: index.php?error=" . urlencode("Database preparation failed."));
    exit();
}

$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    $check_stmt->close();
    // Clean up uploaded file since duplicate registration was rejected
    if (!empty($uploaded_filename)) {
        $cleanup = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $uploaded_filename;
        if (file_exists($cleanup)) @unlink($cleanup);
    }
    header("Location: index.php?error=duplicate_email");
    exit();
}
$check_stmt->close();

// 5. Insert new user record using prepared statement
$insert_sql = "INSERT INTO users (name, email, phone, dob, gender, address, course, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($insert_sql);

if (!$stmt) {
    header("Location: index.php?error=" . urlencode("Failed to prepare database insertion."));
    exit();
}

$stmt->bind_param("ssssssss", $name, $email, $phone, $dob, $gender, $address, $course, $uploaded_filename);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    // Success redirect with prevention of form re-submission
    header("Location: view_records.php?success=1");
    exit();
} else {
    // Handle potential duplicate key race condition gracefully
    if ($conn->errno === 1062) {
        $stmt->close();
        $conn->close();
        if (!empty($uploaded_filename)) {
            $cleanup = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $uploaded_filename;
            if (file_exists($cleanup)) @unlink($cleanup);
        }
        header("Location: index.php?error=duplicate_email");
        exit();
    }

    $error_msg = urlencode("Database insert failed: " . $stmt->error);
    $stmt->close();
    $conn->close();
    header("Location: index.php?error={$error_msg}");
    exit();
}
?>
