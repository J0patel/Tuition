import React, { createContext, useContext, useState, useCallback } from 'react';
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
import { ApiService } from '../services/apiService';

interface TuitionContextType {
  settings: AppSettings;
  courses: Course[];
  subjects: Subject[];
  students: Student[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  payments: FeePayment[];
  installments: FeeInstallment[];
  tests: Test[];
  testResults: TestResult[];
  studyMaterials: StudyMaterial[];
  notifications: AppNotification[];
  refreshData: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  saveStudent: (student: Omit<Student, 'id' | 'netFees' | 'pendingFees'> & { id?: number }) => ReturnType<typeof ApiService.saveStudent>;
  deleteStudent: (id: number) => void;
  saveBatch: (batch: Partial<Batch>) => ReturnType<typeof ApiService.saveBatch>;
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  addPayment: (payment: Omit<FeePayment, 'id' | 'receiptNumber'>) => ReturnType<typeof ApiService.addPayment>;
  saveTest: (test: Partial<Test>) => ReturnType<typeof ApiService.saveTest>;
  saveTestMarks: (testId: number, results: Omit<TestResult, 'id' | 'testId' | 'percentage' | 'grade' | 'resultStatus' | 'performanceStatus'>[]) => ReturnType<typeof ApiService.saveTestMarks>;
  uploadMaterial: (mat: Omit<StudyMaterial, 'id' | 'uploadDate'>) => ReturnType<typeof ApiService.saveStudyMaterial>;
  sendNotification: (notif: Omit<AppNotification, 'id' | 'sentAt' | 'readByStudentIds' | 'status'>) => ReturnType<typeof ApiService.sendNotification>;
  markNotificationRead: (notifId: number, studentId: number) => void;
}

const TuitionContext = createContext<TuitionContextType | undefined>(undefined);

export const TuitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AppSettings>(() => ApiService.getSettings());
  const [courses] = useState<Course[]>(() => ApiService.getCourses());
  const [subjects] = useState<Subject[]>(() => ApiService.getSubjects());
  const [students, setStudents] = useState<Student[]>(() => ApiService.getStudents());
  const [batches, setBatches] = useState<Batch[]>(() => ApiService.getBatches());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => ApiService.getAttendance());
  const [payments, setPayments] = useState<FeePayment[]>(() => ApiService.getPayments());
  const [installments] = useState<FeeInstallment[]>(() => ApiService.getInstallments());
  const [tests, setTests] = useState<Test[]>(() => ApiService.getTests());
  const [testResults, setTestResults] = useState<TestResult[]>(() => ApiService.getTestResults());
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => ApiService.getStudyMaterials());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => ApiService.getNotifications());

  const refreshData = useCallback(() => {
    setSettingsState(ApiService.getSettings());
    setStudents(ApiService.getStudents());
    setBatches(ApiService.getBatches());
    setAttendance(ApiService.getAttendance());
    setPayments(ApiService.getPayments());
    setTests(ApiService.getTests());
    setTestResults(ApiService.getTestResults());
    setStudyMaterials(ApiService.getStudyMaterials());
    setNotifications(ApiService.getNotifications());
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    ApiService.updateSettings(newSettings);
    refreshData();
  };

  const saveStudent = (studentData: Omit<Student, 'id' | 'netFees' | 'pendingFees'> & { id?: number }) => {
    const res = ApiService.saveStudent(studentData);
    if (res.success) refreshData();
    return res;
  };

  const deleteStudent = (id: number) => {
    ApiService.deleteStudent(id);
    refreshData();
  };

  const saveBatch = (batchData: Partial<Batch>) => {
    const res = ApiService.saveBatch(batchData);
    if (res.success) refreshData();
    return res;
  };

  const markAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    ApiService.markAttendance(records);
    refreshData();
  };

  const addPayment = (paymentData: Omit<FeePayment, 'id' | 'receiptNumber'>) => {
    const res = ApiService.addPayment(paymentData);
    if (res.success) refreshData();
    return res;
  };

  const saveTest = (testData: Partial<Test>) => {
    const res = ApiService.saveTest(testData);
    if (res.success) refreshData();
    return res;
  };

  const saveTestMarks = (testId: number, results: Omit<TestResult, 'id' | 'testId' | 'percentage' | 'grade' | 'resultStatus' | 'performanceStatus'>[]) => {
    const res = ApiService.saveTestMarks(testId, results);
    if (res.success) refreshData();
    return res;
  };

  const uploadMaterial = (mat: Omit<StudyMaterial, 'id' | 'uploadDate'>) => {
    const res = ApiService.saveStudyMaterial(mat);
    if (res.success) refreshData();
    return res;
  };

  const sendNotification = (notif: Omit<AppNotification, 'id' | 'sentAt' | 'readByStudentIds' | 'status'>) => {
    const res = ApiService.sendNotification(notif);
    if (res.success) refreshData();
    return res;
  };

  const markNotificationRead = (notifId: number, studentId: number) => {
    ApiService.markNotificationRead(notifId, studentId);
    refreshData();
  };

  return (
    <TuitionContext.Provider
      value={{
        settings,
        courses,
        subjects,
        students,
        batches,
        attendance,
        payments,
        installments,
        tests,
        testResults,
        studyMaterials,
        notifications,
        refreshData,
        updateSettings,
        saveStudent,
        deleteStudent,
        saveBatch,
        markAttendance,
        addPayment,
        saveTest,
        saveTestMarks,
        uploadMaterial,
        sendNotification,
        markNotificationRead
      }}
    >
      {children}
    </TuitionContext.Provider>
  );
};

export const useTuition = () => {
  const context = useContext(TuitionContext);
  if (!context) throw new Error('useTuition must be used within a TuitionProvider');
  return context;
};
