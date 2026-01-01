import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setSelectedRole } = useAuth();

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            University Attendance System
          </h1>
          <p className="text-muted-foreground text-lg">
            Face recognition powered attendance tracking
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <Card 
            className="border-2 hover:border-primary transition-colors cursor-pointer group"
            onClick={() => handleRoleSelect('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Student</CardTitle>
              <CardDescription className="text-base">
                Access your attendance records, view class schedules, and manage your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  View attendance history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Subject-wise attendance tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Face recognition based check-in
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Continue as Student
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card 
            className="border-2 hover:border-secondary transition-colors cursor-pointer group"
            onClick={() => handleRoleSelect('teacher')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-xl">Teacher</CardTitle>
              <CardDescription className="text-base">
                Manage classes, take attendance, and view student records
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Take attendance via camera
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Manage class routines
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  View and edit attendance records
                </li>
              </ul>
              <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                Continue as Teacher
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Administrator? Access the{' '}
          <a href="/admin" className="text-primary hover:underline font-medium">
            Admin Panel
          </a>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
