import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserRole, Student, Teacher, Admin, AuthState } from '@/types';
import { students, teachers, admins, updateStudent, addStudent, addTeacher, getStudents, getTeachers } from '@/data/mockData';

interface AuthContextType extends AuthState {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: StudentSignupData | TeacherSignupData) => Promise<{ success: boolean; error?: string; userId?: string }>;
  logout: () => void;
  completeFaceRegistration: (userId: string) => void;
  pendingStudentId: string | null;
  setPendingStudentId: (id: string | null) => void;
}

interface StudentSignupData {
  role: 'student';
  name: string;
  studentId: string;
  email: string;
  batchId: string;
  sectionId: string;
  password: string;
}

interface TeacherSignupData {
  role: 'teacher';
  name: string;
  teacherId: string;
  email: string;
  departmentId: string;
  password: string;
  assignments: { batchId: string; sectionId: string; subjectId: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | Teacher | Admin | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pendingStudentId, setPendingStudentId] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check based on selected role
    if (selectedRole === 'student') {
      const currentStudents = getStudents();
      const student = currentStudents.find(s => s.email === email && s.password === password);
      if (student) {
        if (!student.faceRegistered) {
          return { success: false, error: 'Face registration not completed. Please complete face registration first.' };
        }
        if (!student.isActive) {
          return { success: false, error: 'Account is inactive. Please contact administrator.' };
        }
        setUser(student);
        setRole('student');
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    }

    if (selectedRole === 'teacher') {
      const currentTeachers = getTeachers();
      const teacher = currentTeachers.find(t => t.email === email && t.password === password);
      if (teacher) {
        if (!teacher.isActive) {
          return { success: false, error: 'Account is inactive. Please contact administrator.' };
        }
        setUser(teacher);
        setRole('teacher');
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    }

    if (selectedRole === 'admin') {
      const admin = admins.find(a => a.email === email && a.password === password);
      if (admin) {
        setUser(admin);
        setRole('admin');
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }

    return { success: false, error: 'Please select a role first' };
  }, [selectedRole]);

  const signup = useCallback(async (data: StudentSignupData | TeacherSignupData): Promise<{ success: boolean; error?: string; userId?: string }> => {
    if (data.role === 'student') {
      const currentStudents = getStudents();
      // Check if email or student ID already exists
      if (currentStudents.some(s => s.email === data.email)) {
        return { success: false, error: 'Email already registered' };
      }
      if (currentStudents.some(s => s.studentId === data.studentId)) {
        return { success: false, error: 'Student ID already exists' };
      }

      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        name: data.name,
        studentId: data.studentId,
        email: data.email,
        batchId: data.batchId,
        sectionId: data.sectionId,
        password: data.password,
        faceRegistered: false,
        isActive: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      addStudent(newStudent);
      setPendingStudentId(newStudent.id);
      return { success: true, userId: newStudent.id };
    }

    if (data.role === 'teacher') {
      const currentTeachers = getTeachers();
      // Check if email or teacher ID already exists
      if (currentTeachers.some(t => t.email === data.email)) {
        return { success: false, error: 'Email already registered' };
      }
      if (currentTeachers.some(t => t.teacherId === data.teacherId)) {
        return { success: false, error: 'Teacher ID already exists' };
      }

      const newTeacher: Teacher = {
        id: `tea-${Date.now()}`,
        name: data.name,
        teacherId: data.teacherId,
        email: data.email,
        departmentId: data.departmentId,
        password: data.password,
        assignments: data.assignments.map((a, idx) => ({
          id: `assign-${Date.now()}-${idx}`,
          ...a,
        })),
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      addTeacher(newTeacher);
      setUser(newTeacher);
      setRole('teacher');
      setIsAuthenticated(true);
      return { success: true, userId: newTeacher.id };
    }

    return { success: false, error: 'Invalid signup data' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    setSelectedRole(null);
    setPendingStudentId(null);
  }, []);

  const completeFaceRegistration = useCallback((userId: string) => {
    updateStudent(userId, { faceRegistered: true, isActive: true });
    const currentStudents = getStudents();
    const student = currentStudents.find(s => s.id === userId);
    if (student) {
      setUser(student);
      setRole('student');
      setIsAuthenticated(true);
    }
    setPendingStudentId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        selectedRole,
        setSelectedRole,
        login,
        signup,
        logout,
        completeFaceRegistration,
        pendingStudentId,
        setPendingStudentId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
