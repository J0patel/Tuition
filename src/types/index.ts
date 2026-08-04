export type UserRole = 'Student' | 'Admin' | 'Teacher';

export interface User {
  id: number;
  username: string;
  mobileNumber: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  studentId?: string;
}

export interface Student {
  id: number;
  studentId: string; // STU2026-001
  userId: number;
  studentName: string;
  photoUrl?: string;
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  parentMobileNumber: string;
  email: string;
  address: string;
  dateOfBirth: string;
  joiningDate: string;
  courseId: number;
  courseName: string;
  batchId: number;
  batchName: string;
  batchTiming: string;
  academicYearId: number;
  academicYear: string;
  totalFees: number;
  discountAmount: number;
  netFees: number;
  paidFees: number;
  pendingFees: number;
  nextDueDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  isDeleted?: boolean;
}

export interface Course {
  id: number;
  courseName: string;
  description: string;
  defaultFee: number;
  status: 'Active' | 'Inactive';
}

export interface Batch {
  id: number;
  batchName: string;
  courseId: number;
  courseName: string;
  teacherId?: number;
  teacherName: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string; // e.g. 'Mon,Wed,Fri'
  maximumCapacity: number;
  enrolledCount: number;
  academicYearId: number;
  status: 'Active' | 'Inactive';
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName?: string;
  batchId: number;
  attendanceDate: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy: number;
}

export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Cheque' | 'Online Payment';

export interface FeePayment {
  id: number;
  receiptNumber: string;
  studentId: number;
  studentName: string;
  studentCode: string;
  courseName: string;
  batchName: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  transactionReference?: string;
  notes?: string;
  collectedBy: string;
}

export interface FeeInstallment {
  id: number;
  studentId: number;
  installmentName: string;
  installmentAmount: number;
  dueDate: string;
  paidAmount: number;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
}

export interface Subject {
  id: number;
  subjectName: string;
  courseId: number;
}

export interface Test {
  id: number;
  testName: string;
  subjectId: number;
  subjectName: string;
  courseId: number;
  courseName: string;
  batchId: number;
  batchName: string;
  testDate: string;
  startTime: string;
  totalMarks: number;
  passingMarks: number;
  description: string;
  status: 'Scheduled' | 'Completed' | 'Published' | 'Cancelled';
}

export type PerformanceGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'Needs Improvement';
export type PerformanceStatus = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';

export interface TestResult {
  id: number;
  testId: number;
  testName?: string;
  subjectName?: string;
  studentId: number;
  studentName?: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: PerformanceGrade;
  resultStatus: 'Pass' | 'Fail';
  performanceStatus: PerformanceStatus;
  isAbsent: boolean;
  teacherRemarks?: string;
  rank?: number;
}

export type MaterialType = 'PDF' | 'Image' | 'Video' | 'Assignment' | 'Worksheet' | 'External Link';

export interface StudyMaterial {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subjectName: string;
  courseId: number;
  courseName: string;
  batchId?: number;
  batchName?: string;
  academicYearId: number;
  materialType: MaterialType;
  fileUrl?: string;
  externalUrl?: string;
  publishedStatus: 'Draft' | 'Published' | 'Archived';
  uploadDate: string;
  uploadedBy: string;
  fileSize?: string;
}

export type NotificationType = 'Holiday' | 'Test Schedule' | 'Fee Reminder' | 'Assignment' | 'General' | 'Batch Change' | 'Result';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  recipientType: 'All' | 'Selected Students' | 'Course' | 'Batch' | 'Pending Fees' | 'Upcoming Test';
  targetBatchId?: number;
  targetCourseId?: number;
  scheduledAt?: string;
  sentAt: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Failed';
  readByStudentIds: number[];
}

export interface AppSettings {
  tuitionName: string;
  tuitionLogo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  receiptFooter: string;
  reportFooter: string;
  currentAcademicYear: string;
  currencySymbol: string;
  gradingScale: {
    'A+': number;
    'A': number;
    'B': number;
    'C': number;
    'D': number;
    'Needs Improvement': number;
  };
}
