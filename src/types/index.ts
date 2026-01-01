export type UserRole = 'student' | 'teacher' | 'admin';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Batch {
  id: string;
  name: string;
  year: number;
}

export interface Section {
  id: string;
  name: string;
  batchId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
}

export interface TeachingAssignment {
  id: string;
  batchId: string;
  sectionId: string;
  subjectId: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  batchId: string;
  sectionId: string;
  password: string;
  faceRegistered: boolean;
  faceEmbedding?: number[];
  isActive: boolean;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  teacherId: string;
  email: string;
  departmentId: string;
  password: string;
  assignments: TeachingAssignment[];
  isActive: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Routine {
  id: string;
  batchId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  routineId: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
  markedAt: string;
}

export interface AuthState {
  user: Student | Teacher | Admin | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}
