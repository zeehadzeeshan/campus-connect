import { useAuth } from "@/contexts/AuthContext";
import { getTeachers, routines, attendanceRecords, batches, subjects, sections } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle } from "lucide-react";

const TeacherDashboard = () => {
    const { user } = useAuth();

    // Find full teacher record to get assigned subjects
    // For prototype, if user is not found or not a teacher, fallback or show empty
    // In real app, we'd fetch from API
    const teacher = getTeachers().find(t => t.email === user?.email);

    // Stats calculation
    const assignedBatchesCount = teacher?.assignedSubjects?.length || 0;

    // Get unique batch count just in case
    // const uniqueBatches = new Set(teacher?.assignedSubjects?.map(a => a.batchId)).size;

    // Today's classes
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    const todayClasses = routines.filter(r => r.day === today && r.teacherId === teacher?.id);

    // Attendance taken today
    const todayDateStr = new Date().toISOString().split('T')[0];
    const sessionsToday = new Set(
        attendanceRecords
            .filter(a => a.timestamp.startsWith(todayDateStr) &&
                teacher?.assignedSubjects?.some(as => as.subjectId === a.subjectId)) // approximate check for "my sessions"
            .map(a => `${a.subjectId}-${a.date}`) // Grouping by subject+date as a "session" proxy
    ).size;

    // Helper to get names
    const getBatchName = (id: string) => batches.find(b => b.id === id)?.name || id;
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;
    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || id;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Assigned Classes
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assignedBatchesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Total subject-batches assigned
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Routine
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayClasses.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Classes scheduled for {today}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Attendance Taken
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessionsToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Sessions recorded today
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Schedule List */}
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Today's Schedule ({today})</CardTitle>
                </CardHeader>
                <CardContent>
                    {todayClasses.length > 0 ? (
                        <div className="space-y-4">
                            {todayClasses.map((routine) => (
                                <div key={routine.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium leading-none">
                                            {getSubjectName(routine.subjectId)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {getBatchName(routine.batchId)} • {getSectionName(routine.sectionId)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-secondary px-2.5 py-0.5 rounded-md text-sm font-medium">
                                            {routine.startTime} - {routine.endTime}
                                        </div>
                                        {routine.roomId && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Room: {routine.roomId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            No classes scheduled for today.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherDashboard;
