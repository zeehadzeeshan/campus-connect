import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';

// Types (Mirroring DB Schema)
export interface Faculty { id: string; name: string; }
export interface Batch { id: string; faculty_id: string; name: string; }
export interface Section { id: string; batch_id: string; name: string; }
export interface Subject { id: string; section_id: string; name: string; code: string; }
export interface Profile { id: string; email: string; name: string; role: UserRole; }

export const api = {
  // Auth
  signUp: async (email: string, password: string, data: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Academic Structure
  getFaculties: async () => {
    const { data, error } = await supabase.from('faculties').select('*').order('name');
    if (error) throw error;
    return data as Faculty[];
  },

  createFaculty: async (name: string) => {
    const { data, error } = await supabase.from('faculties').insert([{ name }]).select().single();
    if (error) throw error;
    return data as Faculty;
  },

  getBatches: async (facultyId?: string) => {
    let query = supabase.from('batches').select('*').order('name');
    if (facultyId) query = query.eq('faculty_id', facultyId);
    const { data, error } = await query;
    if (error) throw error;
    return data as Batch[];
  },

  createBatch: async (facultyId: string, name: string) => {
    const { data, error } = await supabase.from('batches').insert([{ faculty_id: facultyId, name }]).select().single();
    if (error) throw error;
    return data as Batch;
  },

  getSections: async (batchId?: string) => {
    let query = supabase.from('sections').select('*').order('name');
    if (batchId) query = query.eq('batch_id', batchId);
    const { data, error } = await query;
    if (error) throw error;
    return data as Section[];
  },

  createSection: async (batchId: string, name: string) => {
    const { data, error } = await supabase.from('sections').insert([{ batch_id: batchId, name }]).select().single();
    if (error) throw error;
    return data as Section;
  },

  getSubjects: async (sectionId?: string) => {
    let query = supabase.from('subjects').select('*').order('name');
    if (sectionId) query = query.eq('section_id', sectionId);
    const { data, error } = await query;
    if (error) throw error;
    return data as Subject[];
  },

  createSubject: async (sectionId: string, name: string, code: string) => {
    const { data, error } = await supabase.from('subjects').insert([{ section_id: sectionId, name, code }]).select().single();
    if (error) throw error;
    return data as Subject;
  },

  // Users
  getProfiles: async (role?: UserRole) => {
    let query = supabase.from('profiles').select('*');
    if (role) query = query.eq('role', role);
    const { data, error } = await query;
    if (error) throw error;
    return data as Profile[];
  },

  getStudents: async () => {
    const { data, error } = await supabase.from('students').select(`
      *,
      profile:profiles!profile_id(email, name, role),
      section:sections(name,
        batch:batches(name, faculty_id)
      )
    `);
    if (error) throw error;
    return data;
  },

  getTeachers: async () => {
    // Get profiles with role 'teacher'
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*, teacher_assignments(*)')
      .eq('role', 'teacher');

    if (error) throw error;
    return profiles;
  },

  getStudentByProfileId: async (profileId: string) => {
    const { data, error } = await supabase
      .from('students')
      .select('*, section:sections(*, batch:batches(*))')
      .eq('profile_id', profileId)
      .single();
    if (error) throw error;
    return data;
  },

  getTeacherAssignments: async (teacherId: string) => {
    const { data, error } = await supabase
      .from('teacher_assignments')
      .select(`
        *,
        subject:subjects(
          *,
          section:sections(
            *,
            batch:batches(*)
          )
        )
      `)
      .eq('teacher_id', teacherId);
    if (error) throw error;
    return data;
  },

  getStudentsBySection: async (sectionId: string) => {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profile:profiles!profile_id(email, name)
      `)
      .eq('section_id', sectionId);
    if (error) throw error;
    return data;
  },

  completeFaceRegistration: async (userId: string, embedding?: number[]) => {
    const { error } = await supabase
      .from('students')
      .update({
        face_registered: true,
        is_active: true,
        face_embedding: embedding ? JSON.stringify(embedding) : null
      })
      .eq('profile_id', userId);
    if (error) throw error;
  },

  // Routines
  getRoutines: async (filters?: { teacher_id?: string; day?: string }) => {
    let query = supabase.from('routines').select(`
      *,
      subject:subjects(
        name, 
        code,
        section:sections(
          name,
          batch:batches(name, faculty_id)
        )
      ),
      teacher:profiles!teacher_id(name) 
    `);

    if (filters?.teacher_id) query = query.eq('teacher_id', filters.teacher_id);
    if (filters?.day) query = query.eq('day_of_week', filters.day);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  createRoutine: async (routine: any) => {
    const { data, error } = await supabase.from('routines').insert([routine]).select().single();
    if (error) throw error;
    return data;
  },

  // Attendance
  markAttendance: async (logs: any[]) => {
    const { data, error } = await supabase.from('attendance_logs').insert(logs).select();
    if (error) throw error;
    return data;
  },

  logAttendance: async (logs: any[]) => {
    const { error } = await supabase.from('attendance_logs').insert(logs);
    if (error) throw error;
  },

  getAttendance: async (filters?: { student_id?: string; subject_id?: string; date?: string }) => {
    let query = supabase.from('attendance_logs').select('*').order('timestamp', { ascending: false });

    if (filters?.student_id) query = query.eq('student_id', filters.student_id);
    if (filters?.subject_id) query = query.eq('subject_id', filters.subject_id);
    if (filters?.date) query = query.eq('date', filters.date);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getAttendanceHistory: async (filters?: { teacher_id?: string; student_id?: string; section_id?: string }) => {
    let query = supabase.from('attendance_logs').select(`
      *,
      student:students(
        student_id,
        profile:profiles(name)
      ),
      routine:routines(
        day_of_week,
        start_time,
        end_time,
        teacher_id
      ),
      subject:subjects(name, code, section_id)
    `).order('date', { ascending: false });

    if (filters.teacher_id) {
      query = query.eq('routine.teacher_id', filters.teacher_id);
    }
    if (filters.student_id) {
      query = query.eq('student_id', filters.student_id);
    }
    if (filters.section_id) {
      query = query.eq('subject.section_id', filters.section_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Delete & Update Helpers
  deleteResource: async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },

  updateResource: async (table: string, id: string, updates: any) => {
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) throw error;
  },

  getStats: async () => {
    const [students, teachers, batches, subjects, routines] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
      supabase.from('batches').select('*', { count: 'exact', head: true }),
      supabase.from('subjects').select('*', { count: 'exact', head: true }),
      supabase.from('routines').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalStudents: students.count || 0,
      totalTeachers: teachers.count || 0,
      totalBatches: batches.count || 0,
      totalSubjects: subjects.count || 0,
      todaySessions: routines.count || 0,
    };
  }
};
