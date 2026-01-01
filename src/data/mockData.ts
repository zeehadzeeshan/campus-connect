
// Types
export interface Department {
  id: string;
  name: string;
}

export interface Batch {
  id: string;
  name: string;
  departmentId: string;
}

export interface Section {
  id: string;
  name: string;
  batchId: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  departmentId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'disabled';
  password?: string; // Added for AuthContext
  isActive?: boolean;
  createdAt?: string;
  // Student specific
  studentId?: string;
  batchId?: string;
  sectionId?: string;
  faceRegistered?: boolean;
  // Teacher specific
  teacherId?: string;
  departmentId?: string; // Added for AuthContext
  assignedSubjects?: { id: string; batchId: string; sectionId: string; subjectId: string }[]; // Updated structure
}

export interface Routine {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  batchId: string;
  sectionId: string;
  roomId?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  subjectId: string;
  status: 'present' | 'absent';
  timestamp: string;
}

// Initial Mock Data
export let departments: Department[] = [
  { id: '1', name: 'Computer Science & Engineering' },
  { id: '2', name: 'Electrical Engineering' },
  { id: '3', name: 'Business Administration' },
];

export let batches: Batch[] = [
  { id: '1', name: 'Batch 2023', departmentId: '1' },
  { id: '2', name: 'Batch 2024', departmentId: '1' },
  { id: '3', name: 'Batch 2023', departmentId: '3' },
];

export let sections: Section[] = [
  { id: '1', name: 'Section A', batchId: '1' },
  { id: '2', name: 'Section B', batchId: '1' },
];

export let subjects: Subject[] = [
  { id: '1', code: 'CSE-101', name: 'Introduction to Programming', departmentId: '1' },
  { id: '2', code: 'CSE-201', name: 'Data Structures', departmentId: '1' },
  { id: '3', code: 'EEE-101', name: 'Basic Electronics', departmentId: '2' },
];

// Split users for easier export matches
export let students: User[] = [
  { id: '1', name: 'John Doe', email: 'john@uni.edu', role: 'student', status: 'active', studentId: '230101', batchId: '1', sectionId: '1', faceRegistered: true, password: 'password', isActive: true },
  { id: '2', name: 'Jane Smith', email: 'jane@uni.edu', role: 'student', status: 'active', studentId: '230102', batchId: '1', sectionId: '1', faceRegistered: false, password: 'password', isActive: true },
  { id: '3', name: 'Alice Johnson', email: 'alice@uni.edu', role: 'student', status: 'disabled', studentId: '230103', batchId: '1', sectionId: '2', faceRegistered: true, password: 'password', isActive: false },
];

export let teachers: User[] = [
  { id: '101', name: 'Prof. Alan Turing', email: 'alan@uni.edu', role: 'teacher', status: 'active', teacherId: 'T-001', password: 'password', isActive: true, assignedSubjects: [{ id: 'ass1', batchId: '1', sectionId: '1', subjectId: '1' }] },
  { id: '102', name: 'Dr. Grace Hopper', email: 'grace@uni.edu', role: 'teacher', status: 'active', teacherId: 'T-002', password: 'password', isActive: true, assignedSubjects: [{ id: 'ass2', batchId: '1', sectionId: '1', subjectId: '1' }] },
];

export let admins: User[] = [
  { id: '999', name: 'Super Admin', email: 'admin@university.edu', role: 'admin', status: 'active', password: 'admin123' },
];

// Combined users getter for Admin Panel compatibility
export const getUsers = () => [...students, ...teachers, ...admins];
export const getStudents = () => [...students];
export const getTeachers = () => [...teachers];

export let routines: Routine[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '10:30', subjectId: '1', teacherId: '101', batchId: '1', sectionId: '1', roomId: '301' },
  { id: '2', day: 'Monday', startTime: '10:30', endTime: '12:00', subjectId: '2', teacherId: '101', batchId: '1', sectionId: '1', roomId: 'Lab-2' },
];

export let attendanceRecords: AttendanceRecord[] = [
  { id: '1', date: '2023-10-25', studentId: '1', subjectId: '1', status: 'present', timestamp: '2023-10-25T09:05:00' },
  { id: '2', date: '2023-10-25', studentId: '2', subjectId: '1', status: 'absent', timestamp: '2023-10-25T09:00:00' },
];


// Individual Exports to satisfy AuthContext
export const addStudent = (student: User) => {
  students.push(student);
  return student;
};

export const addTeacher = (teacher: User) => {
  teachers.push(teacher);
  return teacher;
};

export const updateStudent = (id: string, data: Partial<User>) => {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...data };
  }
};

// Data Access Layer (Simulation) - Keeping this for Admin Panel usage
export const mockData = {
  // Stats
  getStats: () => ({
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalBatches: batches.length,
    totalSubjects: subjects.length,
    todaySessions: routines.filter(r => r.day === 'Monday').length,
  }),

  // Departments
  getDepartments: () => [...departments],
  addDepartment: (dept: Omit<Department, 'id'>) => {
    const newDept = { ...dept, id: Math.random().toString(36).substr(2, 9) };
    departments = [...departments, newDept];
    return newDept;
  },
  updateDepartment: (id: string, name: string) => {
    departments = departments.map(d => d.id === id ? { ...d, name } : d);
  },
  deleteDepartment: (id: string) => {
    departments = departments.filter(d => d.id !== id);
  },

  // Batches
  getBatches: () => [...batches],
  addBatch: (batch: Omit<Batch, 'id'>) => {
    const newBatch = { ...batch, id: Math.random().toString(36).substr(2, 9) };
    batches = [...batches, newBatch];
    return newBatch;
  },
  updateBatch: (id: string, name: string) => {
    batches = batches.map(b => b.id === id ? { ...b, name } : b);
  },
  deleteBatch: (id: string) => {
    batches = batches.filter(b => b.id !== id);
  },

  // Sections
  getSections: () => [...sections],
  addSection: (section: Omit<Section, 'id'>) => {
    const newSection = { ...section, id: Math.random().toString(36).substr(2, 9) };
    sections = [...sections, newSection];
    return newSection;
  },
  updateSection: (id: string, name: string) => {
    sections = sections.map(s => s.id === id ? { ...s, name } : s);
  },
  deleteSection: (id: string) => {
    sections = sections.filter(s => s.id !== id);
  },

  // Subjects
  getSubjects: () => [...subjects],
  addSubject: (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: Math.random().toString(36).substr(2, 9) };
    subjects = [...subjects, newSubject];
    return newSubject;
  },
  updateSubject: (id: string, updates: Partial<Subject>) => {
    subjects = subjects.map(s => s.id === id ? { ...s, ...updates } : s);
  },
  deleteSubject: (id: string) => {
    subjects = subjects.filter(s => s.id !== id);
  },

  // Users - Modified to key off the simplified arrays
  getUsers: () => getUsers(),
  toggleUserStatus: (id: string) => {
    // Check students
    let sIndex = students.findIndex(u => u.id === id);
    if (sIndex !== -1) {
      students[sIndex].status = students[sIndex].status === 'active' ? 'disabled' : 'active';
      return;
    }
    // Check teachers
    let tIndex = teachers.findIndex(u => u.id === id);
    if (tIndex !== -1) {
      teachers[tIndex].status = teachers[tIndex].status === 'active' ? 'disabled' : 'active';
      return;
    }
  },

  // Routines
  getRoutines: () => [...routines],
  deleteRoutine: (id: string) => {
    routines = routines.filter(r => r.id !== id);
  },

  // Attendance
  getAttendance: () => [...attendanceRecords],
};
