-- ============================================================================
-- ENGLISH & COMPUTER TUITION MANAGEMENT SYSTEM - DATABASE SCHEMA (DDL)
-- Database Engine: SQL Server / MySQL Compatible
-- ============================================================================

CREATE DATABASE IF NOT EXISTS TuitionManagementDB;
USE TuitionManagementDB;

-- 1. USERS TABLE (Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(150) NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Teacher', 'Student') NOT NULL DEFAULT 'Student',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. ACADEMIC YEARS TABLE
CREATE TABLE IF NOT EXISTS academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academic_year_name VARCHAR(50) NOT NULL UNIQUE, -- e.g., '2026-2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('Active', 'Inactive', 'Archived') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL UNIQUE, -- 'English', 'Computer', 'English & Computer'
    description TEXT NULL,
    default_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. BATCHES TABLE
CREATE TABLE IF NOT EXISTS batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_name VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    teacher_id INT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week VARCHAR(100) NOT NULL, -- e.g., 'Mon,Wed,Fri'
    maximum_capacity INT NOT NULL DEFAULT 30,
    academic_year_id INT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- 5. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'STU2026-001'
    user_id INT NOT NULL UNIQUE,
    student_name VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NULL,
    father_name VARCHAR(150) NULL,
    mother_name VARCHAR(150) NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    parent_mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(150) NULL,
    address TEXT NULL,
    date_of_birth DATE NULL,
    joining_date DATE NOT NULL,
    course_id INT NOT NULL,
    batch_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    total_fees DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL, -- Soft Delete
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

-- 6. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    batch_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave', 'Holiday') NOT NULL DEFAULT 'Present',
    remarks VARCHAR(255) NULL,
    marked_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id),
    CONSTRAINT unique_student_date UNIQUE (student_id, attendance_date)
);

-- 7. FEE PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS fee_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'REC-2026-0101'
    student_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode ENUM('Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Online Payment') NOT NULL DEFAULT 'Cash',
    transaction_reference VARCHAR(100) NULL,
    notes TEXT NULL,
    collected_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (collected_by) REFERENCES users(id)
);

-- 8. FEE INSTALLMENTS TABLE
CREATE TABLE IF NOT EXISTS fee_installments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    installment_name VARCHAR(100) NOT NULL, -- e.g., 'Installment 1', 'Term Fee 1'
    installment_amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('Pending', 'Partially Paid', 'Paid', 'Overdue') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 9. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL, -- e.g., 'Grammar', 'Spoken English', 'MS Office', 'Web Development'
    course_id INT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 10. TESTS TABLE
CREATE TABLE IF NOT EXISTS tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(150) NOT NULL,
    subject_id INT NOT NULL,
    course_id INT NOT NULL,
    batch_id INT NOT NULL,
    test_date DATE NOT NULL,
    start_time TIME NOT NULL,
    total_marks DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    passing_marks DECIMAL(5, 2) NOT NULL DEFAULT 40.00,
    description TEXT NULL,
    status ENUM('Scheduled', 'Completed', 'Published', 'Cancelled') DEFAULT 'Scheduled',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 11. TEST RESULTS TABLE
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    obtained_marks DECIMAL(5, 2) DEFAULT 0.00,
    percentage DECIMAL(5, 2) DEFAULT 0.00,
    grade VARCHAR(10) DEFAULT 'F',
    result_status ENUM('Pass', 'Fail') DEFAULT 'Pass',
    is_absent TINYINT(1) DEFAULT 0,
    teacher_remarks VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT unique_test_student UNIQUE (test_id, student_id)
);

-- 12. STUDY MATERIALS TABLE
CREATE TABLE IF NOT EXISTS study_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    subject_id INT NOT NULL,
    course_id INT NOT NULL,
    batch_id INT NULL,
    academic_year_id INT NOT NULL,
    material_type ENUM('PDF', 'Image', 'Video', 'Assignment', 'Worksheet', 'External Link') NOT NULL,
    file_url VARCHAR(500) NULL,
    external_url VARCHAR(500) NULL,
    published_status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Published',
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('Holiday', 'Test Schedule', 'Fee Reminder', 'Assignment', 'General', 'Batch Change', 'Result') NOT NULL,
    recipient_type ENUM('All', 'Selected Students', 'Course', 'Batch', 'Pending Fees', 'Upcoming Test') NOT NULL,
    scheduled_at DATETIME NULL,
    sent_at DATETIME NULL,
    status ENUM('Draft', 'Scheduled', 'Sent', 'Failed') DEFAULT 'Sent',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 14. NOTIFICATION RECIPIENTS TABLE
CREATE TABLE IF NOT EXISTS notification_recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id INT NOT NULL,
    student_id INT NOT NULL,
    delivery_status ENUM('Pending', 'Delivered', 'Failed') DEFAULT 'Delivered',
    read_status TINYINT(1) DEFAULT 0,
    read_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 15. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS app_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_group VARCHAR(50) NOT NULL DEFAULT 'General',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
