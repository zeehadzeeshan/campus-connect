import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTeachers, batches, sections, subjects, getStudents, attendanceRecords, routines } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TakeAttendance = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const teacher = getTeachers().find(t => t.email === user?.email);
    const assignedClasses = teacher?.assignedSubjects || [];

    // ENFORCE ROUTINE: Filter classes to only those scheduled for TODAY
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    // Find routines for this teacher for today
    const todayRoutines = routines.filter(r => r.teacherId === teacher?.id && r.day === today);

    // Filter assigned classes to only those in today's routine
    const availableClasses = assignedClasses.filter(ac =>
        todayRoutines.some(r => r.subjectId === ac.subjectId && r.batchId === ac.batchId && r.sectionId === ac.sectionId)
    );

    // Steps: 'select' -> 'camera' -> 'verify' -> 'success'
    const [step, setStep] = useState<'select' | 'camera' | 'verify' | 'success'>('select');
    const [selectedClassId, setSelectedClassId] = useState("");
    const [attendanceData, setAttendanceData] = useState<{ studentId: string; status: 'present' | 'absent' }[]>([]);

    const getBatchName = (id: string) => batches.find(b => b.id === id)?.name || id;
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;
    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || id;

    const handleStartCamera = () => {
        if (!selectedClassId) {
            toast.error("Please select a class first");
            return;
        }
        setStep('camera');

        // Simulate scanning process
        setTimeout(() => {
            const selectedClass = assignedClasses.find(c => c.id === selectedClassId);
            if (!selectedClass) return;

            const students = getStudents().filter(
                s => s.batchId === selectedClass.batchId && s.sectionId === selectedClass.sectionId && s.status === 'active'
            );

            // Randomly mark some as present for the demo
            const initialAttendance = students.map(s => ({
                studentId: s.id,
                status: (Math.random() > 0.2 ? 'present' : 'absent') as 'present' | 'absent'
            }));

            setAttendanceData(initialAttendance);
            setStep('verify');
        }, 3000);
    };

    const toggleAttendance = (studentId: string) => {
        setAttendanceData(prev => prev.map(record =>
            record.studentId === studentId
                ? { ...record, status: record.status === 'present' ? 'absent' : 'present' }
                : record
        ));
    };

    const handleSubmit = () => {
        // In a real app, we would save to backend here
        // For prototype, we just show success
        setStep('success');
        toast.success("Attendance submitted successfully");
    };

    const getStudentName = (id: string) => getStudents().find(s => s.id === id)?.name || id;
    const getStudentId = (id: string) => getStudents().find(s => s.id === id)?.studentId || id;

    const reset = () => {
        setStep('select');
        setSelectedClassId("");
        setAttendanceData([]);
    };

    if (step === 'select') {
        return (
            <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Take Attendance</h1>
                    <p className="text-muted-foreground">Select a class to start the attendance process.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Class Selection</CardTitle>
                        <CardDescription>
                            Only classes scheduled for <strong>{today}</strong> are shown.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {availableClasses.length > 0 ? (
                            <div className="space-y-2">
                                <Label>Choose Class</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableClasses.map((ac) => (
                                            <SelectItem key={ac.id} value={ac.id}>
                                                {getSubjectName(ac.subjectId)} - {getBatchName(ac.batchId)} ({getSectionName(ac.sectionId)})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                <p>No classes scheduled for today.</p>
                                <Button variant="link" onClick={() => navigate('/teacher/routine')}>
                                    Check or Set Routine
                                </Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleStartCamera} disabled={!selectedClassId}>
                            <Camera className="mr-2 h-4 w-4" />
                            Start Camera
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (step === 'camera') {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <h1 className="text-2xl font-bold">Scanning Class...</h1>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="animate-pulse flex flex-col items-center gap-4 z-10">
                        <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                        <span className="text-white font-medium">Detecting faces...</span>
                    </div>
                    {/* Mock camera overlay */}
                    <div className="absolute inset-0 border-2 border-primary/30 m-8 rounded-lg" />
                </div>
                <p className="text-muted-foreground">Please keep the camera steady.</p>
            </div>
        );
    }

    if (step === 'verify') {
        const stats = {
            present: attendanceData.filter(d => d.status === 'present').length,
            absent: attendanceData.filter(d => d.status === 'absent').length,
            total: attendanceData.length
        };

        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Verify Attendance</h1>
                        <p className="text-muted-foreground">Review and modify the detected attendance.</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Present: {stats.present}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-destructive" />
                            <span>Absent: {stats.absent}</span>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="border rounded-md">
                            <div className="grid grid-cols-4 p-4 font-medium border-b bg-muted/50">
                                <div>Student ID</div>
                                <div className="col-span-2">Name</div>
                                <div className="text-right">Status</div>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto divide-y">
                                {attendanceData.map((record) => (
                                    <div key={record.studentId} className="grid grid-cols-4 p-4 items-center hover:bg-muted/50">
                                        <div className="font-mono text-sm">{getStudentId(record.studentId)}</div>
                                        <div className="col-span-2">{getStudentName(record.studentId)}</div>
                                        <div className="flex justify-end items-center gap-2">
                                            <span className={`text-xs font-medium ${record.status === 'present' ? 'text-green-600' : 'text-destructive'}`}>
                                                {record.status.toUpperCase()}
                                            </span>
                                            <Switch
                                                checked={record.status === 'present'}
                                                onCheckedChange={() => toggleAttendance(record.studentId)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-6">
                        <Button variant="outline" onClick={() => setStep('select')}>Cancel</Button>
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                            Confirm & Save
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Success Step
    return (
        <div className="max-w-md mx-auto text-center space-y-6 pt-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">Attendance Saved!</h1>
                <p className="text-muted-foreground">
                    The attendance session has been successfully recorded.
                </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
                <Button onClick={reset}>Take Another Class</Button>
                <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default TakeAttendance;
