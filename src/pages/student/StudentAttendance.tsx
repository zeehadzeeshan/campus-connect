import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getStudents, attendanceRecords, subjects, AttendanceRecord } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, CheckCircle, XCircle } from "lucide-react";

const StudentAttendance = () => {
    const { user } = useAuth();
    const student = getStudents().find(s => s.email === user?.email);

    // Derived state: Get all records for this student
    const myRecords = attendanceRecords.filter(r => r.studentId === student?.id);

    // Group by Subject
    // We need to know which subjects the student is enrolled in.
    // Ideally, `student` object would have `enrolledSubjects` or similar.
    // For now, based on mock data schema, we mock this by assuming all subjects are relevant 
    // OR we infer from the records found + maybe all subjects in their department?
    // Let's list ALL subjects for now, or filter by what has records if we want to be safe.
    // Better: let's show all subjects that exist, as a student usually takes all in their semester.

    const subjectStats = subjects.map(subject => {
        const subjectRecords = myRecords.filter(r => r.subjectId === subject.id);
        const total = subjectRecords.length;
        const present = subjectRecords.filter(r => r.status === 'present').length;
        const absent = total - present;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0; // Default to 0 if no classes yet

        return {
            subject,
            total,
            present,
            absent,
            percentage,
            history: subjectRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        };
    });

    const [selectedSubject, setSelectedSubject] = useState<typeof subjectStats[0] | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
                <p className="text-muted-foreground mt-2">
                    View your attendance performance subject-wise.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjectStats.map((stat) => (
                    <Card
                        key={stat.subject.id}
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-primary"
                        onClick={() => setSelectedSubject(stat)}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-muted-foreground" />
                                {stat.subject.name}
                            </CardTitle>
                            <CardDescription className="font-mono text-xs">{stat.subject.code}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Attendance</span>
                                        <span className={`font-bold ${stat.percentage < 75 ? 'text-destructive' : 'text-green-600'}`}>
                                            {stat.percentage}%
                                        </span>
                                    </div>
                                    <Progress value={stat.percentage} className={`h-2 ${stat.percentage < 75 ? 'bg-destructive/20 [&>div]:bg-destructive' : 'bg-green-100 [&>div]:bg-green-600'}`} />
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                    <div className="bg-muted/50 p-2 rounded">
                                        <div className="font-bold">{stat.total}</div>
                                        <div className="text-xs text-muted-foreground">Classes</div>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded border border-green-100">
                                        <div className="font-bold text-green-700">{stat.present}</div>
                                        <div className="text-xs text-green-600">Present</div>
                                    </div>
                                    <div className="bg-red-50 p-2 rounded border border-red-100">
                                        <div className="font-bold text-red-700">{stat.absent}</div>
                                        <div className="text-xs text-red-600">Absent</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedSubject} onOpenChange={(open) => !open && setSelectedSubject(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedSubject?.subject.name} - History</DialogTitle>
                        <DialogDescription>
                            Detailed attendance log for this subject.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="border rounded-md mt-4 max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Day</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedSubject?.history.length ? (
                                    selectedSubject.history.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">
                                                {new Date(record.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {record.status === 'present' ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Present
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3">
                                                        <XCircle className="w-3 h-3 mr-1" /> Absent
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                            No attendance records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StudentAttendance;
