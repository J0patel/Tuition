# English & Computer Tuition Management App 🎓💻

A complete, modern, and mobile-responsive **Tuition Management Application** designed specifically for **English and Computer** tuition classes.

---

## 🌟 Key Features

### 1. Dual User Experience
- **Student Mobile & Desktop Web App**:
  - Dashboard with attendance gauge, fee due reminders, upcoming tests, and notifications.
  - Interactive Monthly Attendance Calendar (Green = Present, Red = Absent, Orange = Leave, Blue = Holiday).
  - Fees & Installments tracker with printable official PDF receipt generator.
  - Test Scorecard & Performance Analytics (Grades A+, A, B, C, D, rank, teacher remarks).
  - Study Material Hub (PDF notes, Video streams, Assignments, Practice worksheets).
  - Digital Student ID Card generator with QR preview.
- **Admin & Teacher Management Panel**:
  - Live Dashboard with Fee Collection, Attendance %, Student Distribution, and Quick Action buttons.
  - Student Directory with Search, Filters, Add/Edit Modal, Soft Delete, Password Reset, and Full Profile Dossier.
  - Batch Management with Enrolled Capacity meters, assigned teachers, and schedule validation.
  - Bulk & Individual Attendance Marking for date & batch selection.
  - Fee Management with unique receipt generator (`REC-2026-XXXX`), overdue filter, and automated reminders.
  - Test & Results Management with Marks Entry table, auto grade & percentage calculation, and publishing.
  - Study Material Manager & Push Notification Dispatcher.
  - Reports Module with PDF and CSV export for Attendance, Fee Collection, and Test Performance.
  - Application & Academic Settings for Tuition Logo, Name, Receipt Footers, and Grading Thresholds.

### 2. Role-Based Access & Instant Switcher
- Roles: `Admin`, `Teacher`, `Student`.
- Instant Role Switcher floating toolbar to test the application from any perspective in real-time.

---

## 🗄️ Database & REST API Documentation
- **Database Schema**: Located at `docs/schema.sql` (15 tables: `users`, `students`, `courses`, `batches`, `attendance`, `fee_payments`, `fee_installments`, `tests`, `test_results`, `subjects`, `study_materials`, `notifications`, `notification_recipients`, `academic_years`, `app_settings`).
- **REST API Docs**: Located at `docs/api_documentation.md` specifying all request parameters and standardized JSON response objects.

---

## 🚀 Running Locally

### Option A: Open directly in Browser (Zero Setup)
Simply open `index.html` in any web browser! It runs as a self-contained, lightning-fast single-page web app with full LocalStorage state persistence.

### Option B: Running with Node.js & Vite
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🎨 Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React / FontAwesome Icons, Chart.js.
- **State Management**: React Context API (`AuthContext`, `TuitionContext`, `ThemeContext`).
- **Persistence**: LocalStorage RESTful API service simulation (`src/services/apiService.ts`).
- **Database**: SQL Server / MySQL compatible DDL.
