import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTuition } from './context/TuitionContext';
import { useTheme } from './context/ThemeContext';
import {
  Users,
  Shield,
  GraduationCap,
  Sun,
  Moon,
  Calendar,
  Receipt,
  FileSpreadsheet,
  BookOpen,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  DollarSign,
  Send,
  Printer,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  Lock,
  QrCode
} from 'lucide-react';

export default function App() {
  const { role, switchRole, activeStudent } = useAuth();
  const { settings, students, payments, tests, testResults, studyMaterials, notifications, addPayment, saveStudent } = useTuition();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={settings.tuitionLogo} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm ring-2 ring-sky-500/20" />
            <div>
              <h1 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                {settings.tuitionName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">English & Computer Learning App</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center justify-center"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Role Switcher */}
            <div className="bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => switchRole('Admin')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${role === 'Admin' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </button>
              <button
                onClick={() => switchRole('Teacher')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${role === 'Teacher' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <Users className="w-3.5 h-3.5" /> Teacher
              </button>
              <button
                onClick={() => switchRole('Student')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${role === 'Student' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Student
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row p-4 sm:p-6 gap-6">
        <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shrink-0 shadow-sm">
          <div className="mb-4 px-3 py-2 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800/50 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${
              role === 'Admin' ? 'bg-sky-600' : role === 'Teacher' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}>
              {role[0]}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{role === 'Student' ? activeStudent?.studentName : `${role} Panel`}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role} Account</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-medium ${activeTab === 'dashboard' ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Calendar className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-medium ${activeTab === 'students' ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Users className="w-4 h-4" /> Student Directory ({students.length})
            </button>
            <button onClick={() => setActiveTab('fees')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-medium ${activeTab === 'fees' ? 'bg-sky-600 text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Receipt className="w-4 h-4" /> Fees & Payments
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-xl mb-4">English & Computer Tuition Management Platform</h2>
          <p className="text-xs text-slate-500 mb-6">Active Role: <strong className="text-sky-600">{role}</strong>. Built for English & Computer Class Excellence.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
              <p className="text-xs text-slate-500">Active Students</p>
              <p className="text-2xl font-bold text-sky-600">{students.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-slate-500">Total Payments Recorded</p>
              <p className="text-2xl font-bold text-emerald-600">{payments.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs text-slate-500">Study Materials</p>
              <p className="text-2xl font-bold text-indigo-600">{studyMaterials.length}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
