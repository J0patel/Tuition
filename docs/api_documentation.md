# REST API Documentation - English & Computer Tuition Management System

Base URL: `/api/v1`  
Content-Type: `application/json`  
Authentication: `Bearer <JWT_TOKEN>`  

---

## Response Format Specifications

### Success Response (200 OK / 201 Created)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response (400 Bad Request / 401 Unauthorized / 404 Not Found / 500 Error)
```json
{
  "success": false,
  "message": "Validation failed or resource not found.",
  "errors": {
    "field_name": ["Specific error detail"]
  }
}
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

- `POST /auth/student/login`: Authenticate student via Student ID & Password or Mobile & OTP.
- `POST /auth/admin/login`: Authenticate admin/teacher via Username & Password.
- `POST /auth/otp/request`: Send OTP to registered mobile number.
- `POST /auth/otp/verify`: Verify mobile OTP and issue JWT token.
- `POST /auth/forgot-password`: Request password reset token.
- `POST /auth/reset-password`: Reset password using token.
- `POST /auth/refresh-token`: Refresh expired JWT access token.
- `POST /auth/logout`: Invalidate user session and refresh token.

---

## 2. Students API (`/api/v1/students`)

- `GET /students`: Fetch all active/inactive students with search, course, batch, fee status, and pagination.
- `GET /students/{id}`: Get detailed student profile including personal info, fee summary, and batch timing.
- `POST /students`: Create new student enrollment (Validates unique Student ID & Mobile number).
- `PUT /students/{id}`: Update student information (Admin: All fields, Student: Address/Phone/Photo).
- `DELETE /students/{id}`: Soft delete student (Preserves attendance and financial history).
- `PATCH /students/{id}/status`: Toggle active/inactive status.
- `POST /students/{id}/reset-password`: Admin reset of student password.

---

## 3. Batches API (`/api/v1/batches`)

- `GET /batches`: List batches with enrolled count, capacity, timings, and assigned teacher.
- `POST /batches`: Create new batch (Validates start_time < end_time and capacity).
- `PUT /batches/{id}`: Update batch schedule, room, or capacity.
- `DELETE /batches/{id}`: Soft delete/archive batch.
- `POST /batches/{id}/assign-student`: Assign student to batch.

---

## 4. Attendance API (`/api/v1/attendance`)

- `POST /attendance`: Mark or update daily attendance for batch or student.
- `POST /attendance/bulk`: Bulk mark batch attendance (e.g., Mark All Present).
- `GET /attendance/student/{studentId}`: Get student's monthly attendance details and percentage.
- `GET /attendance/batch/{batchId}`: Get matrix attendance for selected date/month.
- `GET /attendance/summary`: Get overall tuition attendance KPI summary.

---

## 5. Fees & Payments API (`/api/v1/fees`)

- `POST /fees/payments`: Register fee payment, auto-generate unique receipt number, update pending balance.
- `PUT /fees/payments/{id}`: Void or edit incorrect payment record.
- `GET /fees/student/{studentId}`: Get student fee breakdown, installments, and payment history.
- `GET /fees/pending`: Get list of students with overdue or pending fees.
- `GET /fees/receipt/{receiptNumber}`: Generate official fee receipt data for printing/PDF download.
- `GET /fees/reports/collection`: Get daily/monthly collection breakdown filtered by payment mode.

---

## 6. Tests & Results API (`/api/v1/tests`)

- `POST /tests`: Schedule new test for batch/subject.
- `PUT /tests/{id}`: Update test details or marks scale.
- `POST /tests/{id}/marks`: Enter student marks in bulk with auto grade and performance status.
- `POST /tests/{id}/publish`: Publish results to students and trigger notifications.
- `GET /tests/student/{studentId}`: Fetch student test history, subject-wise analytics, and rank.

---

## 7. Study Materials API (`/api/v1/materials`)

- `GET /materials`: List study materials filtered by course, subject, and material type.
- `POST /materials`: Upload or link study material (PDF, Video, Assignment, External link).
- `DELETE /materials/{id}`: Delete study material resource.

---

## 8. Notifications API (`/api/v1/notifications`)

- `POST /notifications/send`: Send immediate notification to target audience (FCM Push + In-app).
- `GET /notifications/student/{studentId}`: Get student notification inbox.
- `PATCH /notifications/{id}/read`: Mark notification as read.

---

## 9. Reports API (`/api/v1/reports`)

- `GET /reports/attendance`: Attendance summary report (PDF/CSV exportable).
- `GET /reports/fees`: Detailed fee collection & pending dues report.
- `GET /reports/performance`: Test performance and subject matrix report.
