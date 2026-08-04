import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Student } from '../types';
import { ApiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  activeStudent: Student | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsStudent: (studentIdOrMobile: string, passOrOtp: string) => boolean;
  loginAsAdmin: (username: string, pass: string) => boolean;
  switchRole: (newRole: UserRole, studentId?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tuition_active_role') as UserRole) || 'Admin';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tuition_current_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'admin',
      mobileNumber: '9876543210',
      email: 'admin@exceltuition.com',
      role: 'Admin',
      isActive: true
    };
  });

  const [activeStudent, setActiveStudent] = useState<Student | null>(() => {
    const students = ApiService.getStudents();
    const savedId = localStorage.getItem('tuition_active_student_id');
    if (savedId) {
      const found = students.find(s => s.id === Number(savedId));
      if (found) return found;
    }
    return students[0] || null; // Default to Aarav Patel STU2026-001
  });

  useEffect(() => {
    localStorage.setItem('tuition_active_role', role);
    if (currentUser) {
      localStorage.setItem('tuition_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tuition_current_user');
    }
  }, [role, currentUser]);

  useEffect(() => {
    if (activeStudent) {
      localStorage.setItem('tuition_active_student_id', String(activeStudent.id));
    }
  }, [activeStudent]);

  const loginAsStudent = (identifier: string, _pass: string): boolean => {
    const students = ApiService.getStudents();
    const found = students.find(
      s => s.studentId.toLowerCase() === identifier.toLowerCase() || s.mobileNumber === identifier
    );
    if (found) {
      setActiveStudent(found);
      setRole('Student');
      setCurrentUser({
        id: found.userId,
        username: found.studentId,
        mobileNumber: found.mobileNumber,
        email: found.email,
        role: 'Student',
        isActive: true,
        studentId: found.studentId
      });
      return true;
    }
    return false;
  };

  const loginAsAdmin = (username: string, _pass: string): boolean => {
    setRole('Admin');
    setCurrentUser({
      id: 1,
      username: username || 'admin',
      mobileNumber: '9876543210',
      email: 'admin@exceltuition.com',
      role: 'Admin',
      isActive: true
    });
    return true;
  };

  const switchRole = (newRole: UserRole, studentIdTarget?: number) => {
    setRole(newRole);
    const students = ApiService.getStudents();
    if (newRole === 'Student') {
      const target = studentIdTarget ? students.find(s => s.id === studentIdTarget) : students[0];
      if (target) {
        setActiveStudent(target);
        setCurrentUser({
          id: target.userId,
          username: target.studentId,
          mobileNumber: target.mobileNumber,
          email: target.email,
          role: 'Student',
          isActive: true,
          studentId: target.studentId
        });
      }
    } else {
      setCurrentUser({
        id: 1,
        username: newRole === 'Admin' ? 'admin' : 'teacher_rajesh',
        mobileNumber: '9876543210',
        email: `${newRole.toLowerCase()}@exceltuition.com`,
        role: newRole,
        isActive: true
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('Student');
    localStorage.removeItem('tuition_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeStudent,
        role,
        isAuthenticated: !!currentUser,
        loginAsStudent,
        loginAsAdmin,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
