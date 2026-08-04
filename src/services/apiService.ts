import {
  Student,
  Batch,
  AttendanceRecord,
  FeePayment,
  FeeInstallment,
  Test,
  TestResult,
  StudyMaterial,
  AppNotification,
  AppSettings,
  Course,
  Subject
} from '../types';
import {
  initialStudents,
  initialBatches,
  initialCourses,
  initialSubjects,
  initialAppSettings,
  initialFeePayments,
  initialFeeInstallments,
  initialTests,
  initialTestResults,
  initialStudyMaterials,
  initialNotifications,
  generateInitialAttendance
} from './mockData';

const STORAGE_KEYS = {
  STUDENTS: 'tuition_students_v1',
  BATCHES: 'tuition_batches_v1',
  COURSES: 'tuition_courses_v1',
  SUBJECTS: 'tuition_subjects_v1',
  ATTENDANCE: 'tuition_attendance_v1',
  FEE_PAYMENTS: 'tuition_fee_payments_v1',
  FEE_INSTALLMENTS: 'tuition_fee_installments_v1',
  TESTS: 'tuition_tests_v1',
  TEST_RESULTS: 'tuition_test_results_v1',
  STUDY_MATERIALS: 'tuition_study_materials_v1',
  NOTIFICATIONS: 'tuition_notifications_v1',
  SETTINGS: 'tuition_settings_v1'
};

const getItem = <T>(key: string, defaultData: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

const setItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to LocalStorage:`, err);
  }
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export class ApiService {
  // --- SETTINGS ---
  static getSettings(): AppSettings {
    return getItem(STORAGE_KEYS.SETTINGS, initialAppSettings);
  }

  static updateSettings(newSettings: Partial<AppSettings>): ApiResponse<AppSettings> {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    return { success: true, message: 'Tuition settings updated successfully.', data: updated };
  }

  // --- COURSES ---
  static getCourses(): Course[] {
    return getItem(STORAGE_KEYS.COURSES, initialCourses);
  }

  // --- SUBJECTS ---
  static getSubjects(): Subject[] {
    return getItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }

  // --- STUDENTS ---
  static getStudents(includeDeleted = false): Student[] {
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
    return includeDeleted ? students : students.filter(s => !s.isDeleted);
  }

  static getStudentById(id: number): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  static getStudentByCode(code: string): Student | undefined {
    return this.getStudents().find(s => s.studentId.toLowerCase() === code.toLowerCase());
  }

  static saveStudent(studentData: Omit<Student, 'id' | 'netFees' | 'pendingFees'> & { id?: number }): ApiResponse<Student> {
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);

    // Validate duplicate Student ID
    const duplicateId = students.find(s => s.studentId === studentData.studentId && s.id !== studentData.id);
    if (duplicateId) {
      return { success: false, message: 'Student ID already exists.', errors: { studentId: ['Duplicate Student ID'] } };
    }

    // Validate duplicate mobile
    const duplicateMobile = students.find(s => s.mobileNumber === studentData.mobileNumber && s.id !== studentData.id);
    if (duplicateMobile) {
      return { success: false, message: 'Mobile number already registered to another student.', errors: { mobileNumber: ['Duplicate Mobile Number'] } };
    }

    const netFees = Math.max(0, studentData.totalFees - studentData.discountAmount);
    const paidFees = studentData.paidFees || 0;
    const pendingFees = Math.max(0, netFees - paidFees);

    let savedStudent: Student;

    if (studentData.id) {
      // Edit existing
      students.forEach((s, idx) => {
        if (s.id === studentData.id) {
          savedStudent = {
            ...s,
            ...studentData,
            netFees,
            paidFees,
            pendingFees,
            id: studentData.id
          };
          students[idx] = savedStudent;
        }
      });
    } else {
      // Create new
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      savedStudent = {
        ...studentData,
        id: newId,
        userId: 100 + newId,
        netFees,
        paidFees,
        pendingFees,
        status: studentData.status || 'Active'
      } as Student;
      students.push(savedStudent);

      // Update enrolled count in batch
      this.incrementBatchEnrollment(savedStudent.batchId, 1);
    }

    setItem(STORAGE_KEYS.STUDENTS, students);
    return { success: true, message: studentData.id ? 'Student updated successfully.' : 'Student enrolled successfully.', data: savedStudent! };
  }

  static deleteStudent(id: number): ApiResponse<void> {
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
    const updated = students.map(s => s.id === id ? { ...s, isDeleted: true, status: 'Inactive' as const } : s);
    setItem(STORAGE_KEYS.STUDENTS, updated);
    return { success: true, message: 'Student record soft deleted.' };
  }

  // --- BATCHES ---
  static getBatches(): Batch[] {
    return getItem(STORAGE_KEYS.BATCHES, initialBatches);
  }

  static saveBatch(batchData: Partial<Batch>): ApiResponse<Batch> {
    const batches = getItem<Batch[]>(STORAGE_KEYS.BATCHES, initialBatches);
    
    if (batchData.startTime && batchData.endTime && batchData.startTime >= batchData.endTime) {
      return { success: false, message: 'Batch start time must be earlier than end time.' };
    }

    let saved: Batch;
    if (batchData.id) {
      const idx = batches.findIndex(b => b.id === batchData.id);
      saved = { ...batches[idx], ...batchData } as Batch;
      batches[idx] = saved;
    } else {
      const newId = Math.max(...batches.map(b => b.id), 0) + 1;
      saved = {
        ...batchData,
        id: newId,
        enrolledCount: 0,
        status: 'Active'
      } as Batch;
      batches.push(saved);
    }

    setItem(STORAGE_KEYS.BATCHES, batches);
    return { success: true, message: 'Batch details saved successfully.', data: saved };
  }

  static incrementBatchEnrollment(batchId: number, delta: number): void {
    const batches = this.getBatches();
    const b = batches.find(x => x.id === batchId);
    if (b) {
      b.enrolledCount = Math.max(0, b.enrolledCount + delta);
      setItem(STORAGE_KEYS.BATCHES, batches);
    }
  }

  // --- ATTENDANCE ---
  static getAttendance(): AttendanceRecord[] {
    return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, generateInitialAttendance());
  }

  static markAttendance(records: Omit<AttendanceRecord, 'id'>[]): ApiResponse<AttendanceRecord[]> {
    const allAttendance = this.getAttendance();
    const updatedRecords: AttendanceRecord[] = [];

    records.forEach(req => {
      const existingIdx = allAttendance.findIndex(
        a => a.studentId === req.studentId && a.attendanceDate === req.attendanceDate
      );

      if (existingIdx >= 0) {
        allAttendance[existingIdx] = { ...allAttendance[existingIdx], ...req };
        updatedRecords.push(allAttendance[existingIdx]);
      } else {
        const newId = Math.max(...allAttendance.map(a => a.id), 0) + 1;
        const newRecord = { ...req, id: newId };
        allAttendance.push(newRecord);
        updatedRecords.push(newRecord);
      }
    });

    setItem(STORAGE_KEYS.ATTENDANCE, allAttendance);
    return { success: true, message: 'Attendance recorded successfully.', data: updatedRecords };
  }

  // --- FEES & PAYMENTS ---
  static getPayments(): FeePayment[] {
    return getItem(STORAGE_KEYS.FEE_PAYMENTS, initialFeePayments);
  }

  static getInstallments(): FeeInstallment[] {
    return getItem(STORAGE_KEYS.FEE_INSTALLMENTS, initialFeeInstallments);
  }

  static addPayment(paymentReq: Omit<FeePayment, 'id' | 'receiptNumber'>): ApiResponse<FeePayment> {
    if (paymentReq.amount <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }

    const students = this.getStudents();
    const student = students.find(s => s.id === paymentReq.studentId);

    if (!student) {
      return { success: false, message: 'Student not found.' };
    }

    const payments = this.getPayments();
    const receiptNum = `REC-2026-${String(payments.length + 101).padStart(4, '0')}`;
    const newId = Math.max(...payments.map(p => p.id), 0) + 1;

    const newPayment: FeePayment = {
      ...paymentReq,
      id: newId,
      receiptNumber: receiptNum
    };

    payments.unshift(newPayment);
    setItem(STORAGE_KEYS.FEE_PAYMENTS, payments);

    // Auto-update student paid and pending fees
    student.paidFees += paymentReq.amount;
    student.pendingFees = Math.max(0, student.netFees - student.paidFees);
    if (student.pendingFees === 0) {
      student.nextDueDate = 'Completed';
    }
    setItem(STORAGE_KEYS.STUDENTS, students);

    return { success: true, message: `Payment of ₹${paymentReq.amount} recorded! Receipt: ${receiptNum}`, data: newPayment };
  }

  // --- TESTS & RESULTS ---
  static getTests(): Test[] {
    return getItem(STORAGE_KEYS.TESTS, initialTests);
  }

  static saveTest(testData: Partial<Test>): ApiResponse<Test> {
    const tests = this.getTests();
    let saved: Test;
    if (testData.id) {
      const idx = tests.findIndex(t => t.id === testData.id);
      saved = { ...tests[idx], ...testData } as Test;
      tests[idx] = saved;
    } else {
      const newId = Math.max(...tests.map(t => t.id), 0) + 1;
      saved = {
        ...testData,
        id: newId,
        status: 'Scheduled'
      } as Test;
      tests.push(saved);
    }
    setItem(STORAGE_KEYS.TESTS, tests);
    return { success: true, message: 'Test scheduled successfully.', data: saved };
  }

  static getTestResults(): TestResult[] {
    return getItem(STORAGE_KEYS.TEST_RESULTS, initialTestResults);
  }

  static saveTestMarks(testId: number, results: Omit<TestResult, 'id' | 'testId' | 'percentage' | 'grade' | 'resultStatus' | 'performanceStatus'>[]): ApiResponse<TestResult[]> {
    const tests = this.getTests();
    const test = tests.find(t => t.id === testId);
    if (!test) return { success: false, message: 'Test not found.' };

    const allResults = this.getTestResults();
    const updatedResults: TestResult[] = [];

    results.forEach(res => {
      const percentage = test.totalMarks > 0 ? Number(((res.obtainedMarks / test.totalMarks) * 100).toFixed(2)) : 0;
      let grade: TestResult['grade'] = 'Needs Improvement';
      let performanceStatus: TestResult['performanceStatus'] = 'Needs Improvement';

      if (percentage >= 90) { grade = 'A+'; performanceStatus = 'Excellent'; }
      else if (percentage >= 80) { grade = 'A'; performanceStatus = 'Excellent'; }
      else if (percentage >= 70) { grade = 'B'; performanceStatus = 'Good'; }
      else if (percentage >= 60) { grade = 'C'; performanceStatus = 'Average'; }
      else if (percentage >= 50) { grade = 'D'; performanceStatus = 'Average'; }

      const resultStatus = res.obtainedMarks >= test.passingMarks && !res.isAbsent ? 'Pass' : 'Fail';

      const existingIdx = allResults.findIndex(r => r.testId === testId && r.studentId === res.studentId);
      const itemData: TestResult = {
        id: existingIdx >= 0 ? allResults[existingIdx].id : Math.max(...allResults.map(r => r.id), 0) + 1,
        testId,
        testName: test.testName,
        subjectName: test.subjectName,
        studentId: res.studentId,
        studentName: res.studentName,
        obtainedMarks: res.isAbsent ? 0 : res.obtainedMarks,
        totalMarks: test.totalMarks,
        percentage: res.isAbsent ? 0 : percentage,
        grade: res.isAbsent ? 'Needs Improvement' : grade,
        resultStatus,
        performanceStatus: res.isAbsent ? 'Needs Improvement' : performanceStatus,
        isAbsent: res.isAbsent,
        teacherRemarks: res.teacherRemarks
      };

      if (existingIdx >= 0) allResults[existingIdx] = itemData;
      else allResults.push(itemData);

      updatedResults.push(itemData);
    });

    setItem(STORAGE_KEYS.TEST_RESULTS, allResults);

    // Update test status to published
    test.status = 'Published';
    setItem(STORAGE_KEYS.TESTS, tests);

    return { success: true, message: 'Test marks submitted & published!', data: updatedResults };
  }

  // --- STUDY MATERIALS ---
  static getStudyMaterials(): StudyMaterial[] {
    return getItem(STORAGE_KEYS.STUDY_MATERIALS, initialStudyMaterials);
  }

  static saveStudyMaterial(mat: Omit<StudyMaterial, 'id' | 'uploadDate'>): ApiResponse<StudyMaterial> {
    const materials = this.getStudyMaterials();
    const newId = Math.max(...materials.map(m => m.id), 0) + 1;
    const newMat: StudyMaterial = {
      ...mat,
      id: newId,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    materials.unshift(newMat);
    setItem(STORAGE_KEYS.STUDY_MATERIALS, materials);
    return { success: true, message: 'Study material uploaded successfully.', data: newMat };
  }

  // --- NOTIFICATIONS ---
  static getNotifications(): AppNotification[] {
    return getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  static sendNotification(notif: Omit<AppNotification, 'id' | 'sentAt' | 'readByStudentIds' | 'status'>): ApiResponse<AppNotification> {
    const notifications = this.getNotifications();
    const newId = Math.max(...notifications.map(n => n.id), 0) + 1;
    const newNotif: AppNotification = {
      ...notif,
      id: newId,
      sentAt: new Date().toLocaleString(),
      status: 'Sent',
      readByStudentIds: []
    };
    notifications.unshift(newNotif);
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return { success: true, message: 'Notification dispatched to student devices.', data: newNotif };
  }

  static markNotificationRead(notifId: number, studentId: number): void {
    const notifications = this.getNotifications();
    const notif = notifications.find(n => n.id === notifId);
    if (notif && !notif.readByStudentIds.includes(studentId)) {
      notif.readByStudentIds.push(studentId);
      setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }
}
