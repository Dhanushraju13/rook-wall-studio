# ROOK WALL STUDIO — ASSIGNMENT VII
## PHP + MySQL Registration & Feedback Form System

This module is an independent laboratory submission for **Assignment VII: PHP + MySQL Database Connectivity, Validation & Record Management**.

---

### Project Architecture

```
rook-wall-registration/
│
├── index.php         # Registration form (HTML5 + CSS + Client Validation)
├── style.css         # Pure cinematic studio theme & responsive styles
├── script.js         # Pure JS validation with addEventListener (0 inline handlers)
├── db_connect.php    # mysqli database connection handler with safe error handling
├── submit.php        # Form processing, MIME/size validation, prepared INSERT
├── view_records.php  # Directory of registered users with thumbnails & actions
├── edit.php          # Admin edit/update with prepared UPDATE & image replacement
├── delete.php        # Admin delete with prepared DELETE & disk cleanup
├── database.sql      # MySQL schema (registration_db & users table with UNIQUE email)
├── README.md         # Deployment and usage instructions
└── uploads/          # Physical directory for uploaded profile pictures
```

---

### Setup Instructions (XAMPP on Windows)

#### Step 1: Install & Launch XAMPP
1. Download and install **XAMPP** (PHP 8.x + MySQL).
2. Open the **XAMPP Control Panel**.
3. Click **Start** next to **Apache**.
4. Click **Start** next to **MySQL**.

#### Step 2: Database Creation & Setup
1. In your web browser, navigate to:  
   `http://localhost/phpmyadmin/`
2. Click on the **Import** tab at the top.
3. Click **Browse** and select `database.sql` located inside `rook-wall-registration/`.
4. Click **Go** / **Import**.  
   *This creates the `registration_db` database and the `users` table with proper constraints (including unique email index).*

#### Step 3: Module Placement in XAMPP `htdocs`
Copy or place the project inside your XAMPP web root:
- If entire repository is in `htdocs/RW/`:
  The URL is:  
  `http://localhost/RW/rook-wall-registration/`
- Or if the module is placed directly inside `htdocs/`:
  The URL is:  
  `http://localhost/rook-wall-registration/`

---

### Key Features & Requirements Satisfied

1. **Frontend**:
   - Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
   - ROOK WALL STUDIO dark cinematic styling (black, charcoal, red accent, glassmorphism, responsive grid).
   - Form with `method="POST"`, `action="submit.php"`, and `enctype="multipart/form-data"`.

2. **Form Fields Implemented**:
   - **Name**: `type="text"` (required, 3-100 characters).
   - **Email**: `type="email"` (required, regex validated client-side and `filter_var` server-side).
   - **Phone**: `type="tel"` (required, regex 10-15 digits).
   - **Date of Birth**: `type="date"` (required, past date verification).
   - **Gender**: `radio` buttons (Male, Female, Other).
   - **Address**: `textarea` (required, 8-500 characters).
   - **Course / Department**: `<select>` dropdown with 7 departments.
   - **Profile Picture**: `type="file"` with drag-and-drop zone and image preview.

3. **Client-Side Validation (`script.js`)**:
   - Intercepted via `form.addEventListener('submit', ...)` and `event.preventDefault()`.
   - Real-time `input`, `blur`, and `change` validation.
   - Highlights invalid inputs with red borders and displays descriptive feedback.
   - **Zero inline JavaScript handlers** (`onclick`, `onchange`, etc.).

4. **Secure Server-Side Processing (`submit.php` & `db_connect.php`)**:
   - Independent verification of all fields using `trim()`, `filter_var()`, and regular expressions.
   - Safe file upload handling using `finfo_open(FILEINFO_MIME_TYPE)`, extension whitelisting (JPG, JPEG, PNG, WEBP), 2MB file size constraint, and randomized unique names via `bin2hex(random_bytes(8))`.
   - **Prepared Statements**: Prevents SQL injection across `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
   - **Duplicate Email Prevention**: Queries database prior to insertion and handles MySQL error 1062 gracefully with descriptive alerts.
   - **Success Redirection**: PRG (Post/Redirect/Get) pattern to `view_records.php?success=1` to avoid form resubmission on page refresh.

5. **Records & Administration (`view_records.php`, `edit.php`, `delete.php`)**:
   - Responsive table with photo thumbnail, formatted timestamps, and badge tags.
   - Admin **Edit** feature allows updating all attributes and selectively replacing the profile picture.
   - Admin **Delete** feature features a cinematic modal confirmation, executes a prepared `DELETE`, and automatically removes the associated picture file from `uploads/`.

---

### Student Submission Note
Before final submission, insert your name and register number into the footer of `index.php`, `view_records.php`, and `edit.php` where indicated:
`[STUDENT NAME] • [REGISTER NUMBER]`
