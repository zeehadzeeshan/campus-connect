import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserRole, AuthState } from '@/types';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';

interface AuthContextType extends AuthState {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: any) => Promise<{ success: boolean; error?: string; userId?: string }>;
  logout: () => void;
  pendingStudentId: string | null;
  setPendingStudentId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pendingStudentId, setPendingStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setInitError("Auth initialization timed out after 10 seconds. Check console and network tab.");
        setLoading(false);
      }
    }, 10000);

    const initAuth = async () => {
      try {
        setDebugInfo("Checking Supabase session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session fetch error:", sessionError);
          setInitError(`Session error: ${sessionError.message}`);
        }

        if (session?.user) {
          setDebugInfo(`Fetching profile for ${session.user.email}...`);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setInitError(`Profile error: ${profileError.message}`);
          }

          if (profile) {
            setUser({ ...session.user, ...profile });
            setRole(profile.role as UserRole);
            setIsAuthenticated(true);
          }
        } else {
          setDebugInfo("No active session found.");
        }
      } catch (error: any) {
        console.error("Auth initialization fatal error:", error);
        setInitError(`Fatal error: ${error.message || JSON.stringify(error)}`);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({ ...session.user, ...profile });
          setRole(profile.role as UserRole);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await api.signIn(email, password);
      if (error) throw error;

      // After successful auth, verify role if selectedRole was set
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (selectedRole && profile.role !== selectedRole) {
        await api.signOut();
        return { success: false, error: `This account is not registered as a ${selectedRole}.` };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, [selectedRole]);

  const signup = useCallback(async (data: any): Promise<{ success: boolean; error?: string; userId?: string }> => {
    try {
      // 1. Auth Signup
      const { data: authData, error: authError } = await api.signUp(data.email, data.password, {
        name: data.name,
        role: data.role
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("User creation failed");

      // 2. Create Profile
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: userId,
        email: data.email,
        name: data.name,
        role: data.role
      }]);
      if (profileError) throw profileError;

      // 3. Role specific tables
      if (data.role === 'student') {
        const { error: studentError } = await supabase.from('students').insert([{
          profile_id: userId,
          student_id: data.studentId,
          section_id: data.sectionId,
          face_registered: false,
          is_active: false
        }]);
        if (studentError) throw studentError;
        setPendingStudentId(userId);
      } else if (data.role === 'teacher') {
        // Teacher assignments
        if (data.assignments && data.assignments.length > 0) {
          const assignments = data.assignments.map((a: any) => ({
            teacher_id: userId,
            subject_id: a.subjectId
          }));
          const { error: assignError } = await supabase.from('teacher_assignments').insert(assignments);
          if (assignError) throw assignError;
        }
      }

      return { success: true, userId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    await api.signOut();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    setSelectedRole(null);
    setPendingStudentId(null);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="font-medium">Loading Attendance System...</p>
        </div>
        <div className="mt-4 p-4 rounded bg-muted max-w-md text-xs font-mono">
          <p className="text-muted-foreground">Status: {debugInfo}</p>
          {initError && (
            <p className="text-destructive mt-2">Error: {initError}</p>
          )}
        </div>
        {initError && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

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
