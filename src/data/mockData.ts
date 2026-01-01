import { Department, Batch, Section, Subject, Student, Teacher, Admin, Routine, AttendanceRecord } from '@/types';

export const departments: Department[] = [
  { id: 'dept-1', name: 'Computer Science', code: 'CSE' },
  { id: 'dept-2', name: 'Electrical Engineering', code: 'EEE' },
  { id: 'dept-3', name: 'Mechanical Engineering', code: 'ME' },
  { id: 'dept-4', name: 'Civil Engineering', code: 'CE' },
  { id: 'dept-5', name: 'Business Administration', code: 'BBA' },
  { id: 'dept-6', name: 'Mathematics', code: 'MATH' },
  { id: 'dept-7', name: 'Physics', code: 'PHY' },
  { id: 'dept-8', name: 'Chemistry', code: 'CHEM' },
];

export const batches: Batch[] = [
  { id: 'batch-1', name: 'Batch 2021', year: 2021 },
  { id: 'batch-2', name: 'Batch 2022', year: 2022 },
  { id: 'batch-3', name: 'Batch 2023', year: 2023 },
  { id: 'batch-4', name: 'Batch 2024', year: 2024 },
  { id: 'batch-5', name: 'Batch 2025', year: 2025 },
  { id: 'batch-6', name: 'Batch 2020', year: 2020 },
  { id: 'batch-7', name: 'Batch 2019', year: 2019 },
  { id: 'batch-8', name: 'Batch 2018', year: 2018 },
];

export const sections: Section[] = [
  { id: 'sec-1', name: 'Section A', batchId: 'batch-1' },
  { id: 'sec-2', name: 'Section B', batchId: 'batch-1' },
  { id: 'sec-3', name: 'Section A', batchId: 'batch-2' },
  { id: 'sec-4', name: 'Section B', batchId: 'batch-2' },
  { id: 'sec-5', name: 'Section C', batchId: 'batch-2' },
  { id: 'sec-6', name: 'Section A', batchId: 'batch-3' },
  { id: 'sec-7', name: 'Section B', batchId: 'batch-3' },
  { id: 'sec-8', name: 'Section A', batchId: 'batch-4' },
  { id: 'sec-9', name: 'Section B', batchId: 'batch-4' },
  { id: 'sec-10', name: 'Section A', batchId: 'batch-5' },
];

export const subjects: Subject[] = [
  { id: 'sub-1', name: 'Data Structures', code: 'CSE201', departmentId: 'dept-1' },
  { id: 'sub-2', name: 'Algorithms', code: 'CSE301', departmentId: 'dept-1' },
  { id: 'sub-3', name: 'Database Systems', code: 'CSE302', departmentId: 'dept-1' },
  { id: 'sub-4', name: 'Circuit Theory', code: 'EEE101', departmentId: 'dept-2' },
  { id: 'sub-5', name: 'Digital Electronics', code: 'EEE201', departmentId: 'dept-2' },
  { id: 'sub-6', name: 'Thermodynamics', code: 'ME101', departmentId: 'dept-3' },
  { id: 'sub-7', name: 'Fluid Mechanics', code: 'ME201', departmentId: 'dept-3' },
  { id: 'sub-8', name: 'Structural Analysis', code: 'CE201', departmentId: 'dept-4' },
  { id: 'sub-9', name: 'Financial Management', code: 'BBA301', departmentId: 'dept-5' },
  { id: 'sub-10', name: 'Calculus', code: 'MATH101', departmentId: 'dept-6' },
];

export let students: Student[] = [
  {
    id: 'stu-1',
    name: 'John Smith',
    studentId: 'STU2021001',
    email: 'john.smith@university.edu',
    batchId: 'batch-1',
    sectionId: 'sec-1',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2021-09-01',
  },
  {
    id: 'stu-2',
    name: 'Emily Johnson',
    studentId: 'STU2021002',
    email: 'emily.johnson@university.edu',
    batchId: 'batch-1',
    sectionId: 'sec-1',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2021-09-01',
  },
  {
    id: 'stu-3',
    name: 'Michael Brown',
    studentId: 'STU2021003',
    email: 'michael.brown@university.edu',
    batchId: 'batch-1',
    sectionId: 'sec-2',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2021-09-01',
  },
  {
    id: 'stu-4',
    name: 'Sarah Davis',
    studentId: 'STU2022001',
    email: 'sarah.davis@university.edu',
    batchId: 'batch-2',
    sectionId: 'sec-3',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2022-09-01',
  },
  {
    id: 'stu-5',
    name: 'David Wilson',
    studentId: 'STU2022002',
    email: 'david.wilson@university.edu',
    batchId: 'batch-2',
    sectionId: 'sec-3',
    password: 'password123',
    faceRegistered: false,
    isActive: false,
    createdAt: '2022-09-01',
  },
  {
    id: 'stu-6',
    name: 'Jessica Martinez',
    studentId: 'STU2022003',
    email: 'jessica.martinez@university.edu',
    batchId: 'batch-2',
    sectionId: 'sec-4',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2022-09-01',
  },
  {
    id: 'stu-7',
    name: 'Chris Anderson',
    studentId: 'STU2023001',
    email: 'chris.anderson@university.edu',
    batchId: 'batch-3',
    sectionId: 'sec-6',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2023-09-01',
  },
  {
    id: 'stu-8',
    name: 'Amanda Taylor',
    studentId: 'STU2023002',
    email: 'amanda.taylor@university.edu',
    batchId: 'batch-3',
    sectionId: 'sec-6',
    password: 'password123',
    faceRegistered: true,
    isActive: true,
    createdAt: '2023-09-01',
  },
];

export let teachers: Teacher[] = [
  {
    id: 'tea-1',
    name: 'Dr. Robert Miller',
    teacherId: 'TEA001',
    email: 'robert.miller@university.edu',
    departmentId: 'dept-1',
    password: 'password123',
    assignments: [
      { id: 'assign-1', batchId: 'batch-1', sectionId: 'sec-1', subjectId: 'sub-1' },
      { id: 'assign-2', batchId: 'batch-1', sectionId: 'sec-2', subjectId: 'sub-1' },
      { id: 'assign-3', batchId: 'batch-2', sectionId: 'sec-3', subjectId: 'sub-2' },
    ],
    isActive: true,
    createdAt: '2020-01-15',
  },
  {
    id: 'tea-2',
    name: 'Prof. Susan Lee',
    teacherId: 'TEA002',
    email: 'susan.lee@university.edu',
    departmentId: 'dept-1',
    password: 'password123',
    assignments: [
      { id: 'assign-4', batchId: 'batch-2', sectionId: 'sec-3', subjectId: 'sub-3' },
      { id: 'assign-5', batchId: 'batch-2', sectionId: 'sec-4', subjectId: 'sub-3' },
    ],
    isActive: true,
    createdAt: '2019-08-20',
  },
  {
    id: 'tea-3',
    name: 'Dr. James White',
    teacherId: 'TEA003',
    email: 'james.white@university.edu',
    departmentId: 'dept-2',
    password: 'password123',
    assignments: [
      { id: 'assign-6', batchId: 'batch-1', sectionId: 'sec-1', subjectId: 'sub-4' },
      { id: 'assign-7', batchId: 'batch-3', sectionId: 'sec-6', subjectId: 'sub-5' },
    ],
    isActive: true,
    createdAt: '2018-03-10',
  },
  {
    id: 'tea-4',
    name: 'Prof. Maria Garcia',
    teacherId: 'TEA004',
    email: 'maria.garcia@university.edu',
    departmentId: 'dept-3',
    password: 'password123',
    assignments: [
      { id: 'assign-8', batchId: 'batch-1', sectionId: 'sec-1', subjectId: 'sub-6' },
    ],
    isActive: true,
    createdAt: '2017-06-05',
  },
  {
    id: 'tea-5',
    name: 'Dr. William Chen',
    teacherId: 'TEA005',
    email: 'william.chen@university.edu',
    departmentId: 'dept-6',
    password: 'password123',
    assignments: [
      { id: 'assign-9', batchId: 'batch-2', sectionId: 'sec-3', subjectId: 'sub-10' },
      { id: 'assign-10', batchId: 'batch-3', sectionId: 'sec-6', subjectId: 'sub-10' },
    ],
    isActive: true,
    createdAt: '2016-09-12',
  },
  {
    id: 'tea-6',
    name: 'Prof. Linda Kim',
    teacherId: 'TEA006',
    email: 'linda.kim@university.edu',
    departmentId: 'dept-5',
    password: 'password123',
    assignments: [
      { id: 'assign-11', batchId: 'batch-1', sectionId: 'sec-2', subjectId: 'sub-9' },
    ],
    isActive: true,
    createdAt: '2020-02-28',
  },
  {
    id: 'tea-7',
    name: 'Dr. Thomas Brown',
    teacherId: 'TEA007',
    email: 'thomas.brown@university.edu',
    departmentId: 'dept-4',
    password: 'password123',
    assignments: [
      { id: 'assign-12', batchId: 'batch-2', sectionId: 'sec-4', subjectId: 'sub-8' },
    ],
    isActive: true,
    createdAt: '2019-11-15',
  },
  {
    id: 'tea-8',
    name: 'Prof. Jennifer Adams',
    teacherId: 'TEA008',
    email: 'jennifer.adams@university.edu',
    departmentId: 'dept-3',
    password: 'password123',
    assignments: [
      { id: 'assign-13', batchId: 'batch-3', sectionId: 'sec-7', subjectId: 'sub-7' },
    ],
    isActive: true,
    createdAt: '2021-04-20',
  },
];

export const admins: Admin[] = [
  {
    id: 'admin-1',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'System Administrator',
  },
];

export let routines: Routine[] = [
  {
    id: 'routine-1',
    batchId: 'batch-1',
    sectionId: 'sec-1',
    subjectId: 'sub-1',
    teacherId: 'tea-1',
    days: ['Monday', 'Wednesday', 'Friday'],
    startTime: '09:00',
    endTime: '10:30',
  },
  {
    id: 'routine-2',
    batchId: 'batch-1',
    sectionId: 'sec-1',
    subjectId: 'sub-4',
    teacherId: 'tea-3',
    days: ['Tuesday', 'Thursday'],
    startTime: '11:00',
    endTime: '12:30',
  },
  {
    id: 'routine-3',
    batchId: 'batch-2',
    sectionId: 'sec-3',
    subjectId: 'sub-2',
    teacherId: 'tea-1',
    days: ['Monday', 'Wednesday'],
    startTime: '14:00',
    endTime: '15:30',
  },
  {
    id: 'routine-4',
    batchId: 'batch-2',
    sectionId: 'sec-3',
    subjectId: 'sub-3',
    teacherId: 'tea-2',
    days: ['Tuesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '10:30',
  },
];

export let attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    studentId: 'stu-1',
    routineId: 'routine-1',
    date: '2025-12-30',
    status: 'present',
    markedBy: 'tea-1',
    markedAt: '2025-12-30T09:15:00',
  },
  {
    id: 'att-2',
    studentId: 'stu-2',
    routineId: 'routine-1',
    date: '2025-12-30',
    status: 'present',
    markedBy: 'tea-1',
    markedAt: '2025-12-30T09:15:00',
  },
  {
    id: 'att-3',
    studentId: 'stu-1',
    routineId: 'routine-1',
    date: '2025-12-28',
    status: 'present',
    markedBy: 'tea-1',
    markedAt: '2025-12-28T09:15:00',
  },
  {
    id: 'att-4',
    studentId: 'stu-2',
    routineId: 'routine-1',
    date: '2025-12-28',
    status: 'absent',
    markedBy: 'tea-1',
    markedAt: '2025-12-28T09:15:00',
  },
  {
    id: 'att-5',
    studentId: 'stu-4',
    routineId: 'routine-3',
    date: '2025-12-30',
    status: 'present',
    markedBy: 'tea-1',
    markedAt: '2025-12-30T14:15:00',
  },
  {
    id: 'att-6',
    studentId: 'stu-4',
    routineId: 'routine-4',
    date: '2025-12-31',
    status: 'present',
    markedBy: 'tea-2',
    markedAt: '2025-12-31T09:10:00',
  },
];

// Helper functions to add/update data
export const addStudent = (student: Student) => {
  students = [...students, student];
};

export const updateStudent = (id: string, updates: Partial<Student>) => {
  students = students.map(s => s.id === id ? { ...s, ...updates } : s);
};

export const addTeacher = (teacher: Teacher) => {
  teachers = [...teachers, teacher];
};

export const updateTeacher = (id: string, updates: Partial<Teacher>) => {
  teachers = teachers.map(t => t.id === id ? { ...t, ...updates } : t);
};

export const addRoutine = (routine: Routine) => {
  routines = [...routines, routine];
};

export const addAttendanceRecord = (record: AttendanceRecord) => {
  attendanceRecords = [...attendanceRecords, record];
};

export const updateAttendanceRecord = (id: string, updates: Partial<AttendanceRecord>) => {
  attendanceRecords = attendanceRecords.map(r => r.id === id ? { ...r, ...updates } : r);
};

// Getter functions for reactive updates
export const getStudents = () => students;
export const getTeachers = () => teachers;
export const getRoutines = () => routines;
export const getAttendanceRecords = () => attendanceRecords;
