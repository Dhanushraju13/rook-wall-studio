<?php
/**
 * ============================================================================
 * ROOK WALL STUDIO — ASSIGNMENT VII DATABASE CONNECTION
 * File: db_connect.php
 * Module: rook-wall-registration
 * Database: registration_db
 * Standard XAMPP defaults: localhost / root / (no password)
 * ============================================================================
 */

// Strict error reporting for developers, clean handler for production/users
mysqli_report(MYSQLI_REPORT_OFF);

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'registration_db';
$db_port = 3306;

// Create mysqli connection
$conn = @new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);

// Check connection failure without exposing raw system credentials
if ($conn->connect_error) {
    // Log internal error for debugging
    error_log("Database connection failed: " . $conn->connect_error);
    
    // User-friendly response
    http_response_code(500);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Connection Error | ROOK WALL STUDIO</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="db-error-wrapper">
            <div class="db-error-card">
                <div class="error-badge">SYSTEM NOTICE</div>
                <h2>Database Connection Required</h2>
                <p>Could not connect to the database <code>registration_db</code> on <code>localhost</code>.</p>
                <div class="error-steps">
                    <p><strong>To resolve this in XAMPP:</strong></p>
                    <ol>
                        <li>Open the <strong>XAMPP Control Panel</strong> and ensure <strong>Apache</strong> and <strong>MySQL</strong> are running.</li>
                        <li>Open <code>http://localhost/phpmyadmin/</code>.</li>
                        <li>Import the file <code>database.sql</code> from this directory to create <code>registration_db</code> and the <code>users</code> table.</li>
                        <li>Refresh this page.</li>
                    </ol>
                </div>
                <a href="index.php" class="btn btn-outline">Retry Connection</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit();
}

// Set standard charset
$conn->set_charset('utf8mb4');
?>
