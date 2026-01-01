import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTeachers, attendanceRecords as mockRecords, batches, subjects, sections, getStudents, AttendanceRecord } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface SessionGroup {
    id: string;
    date: string;
    subjectId: string;
    totalPresent: number;
    totalAbsent: number;
    records: AttendanceRecord[];
}

const PastAttendance = () => {
    const { user } = useAuth();
    const teacher = getTeachers().find(t => t.email === user?.email);
    const assignedClasses = teacher?.assignedSubjects || [];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedSession, setSelectedSession] = useState<SessionGroup | null>(null);
    const [records, setRecords] = useState<AttendanceRecord[]>(mockRecords); // Local state for edits

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;
    const getBatchName = (id: string) => batches.find(b => b.id === id)?.name || id;
    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || id;
    const getStudentName = (id: string) => getStudents().find(s => s.id === id)?.name || id;
    const getStudentId = (id: string) => getStudents().find(s => s.id === id)?.studentId || id;

    // Group records into sessions by (Subject + Date)
    // In a real DB we'd have a separate 'sessions' table, here we infer it
    const sessions = [];
    const grouped = new Map();

    records.forEach(record => {
        // Filter by teacher's subjects
        if (teacher?.assignedSubjects?.some(as => as.subjectId === record.subjectId)) {
            const key = `${record.subjectId}-${record.date.split('T')[0]}`;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    id: key,
                    date: record.date,
                    subjectId: record.subjectId,
                    totalPresent: 0,
                    totalAbsent: 0,
                    records: []
                });
            }
            const group = grouped.get(key);
            group.records.push(record);
            if (record.status === 'present') group.totalPresent++;
            else group.totalAbsent++;
        }
    });

    const sessionList = Array.from(grouped.values()).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const filteredSessions = sessionList.filter(session => {
        const matchesSubject = selectedSubject === 'all' || session.subjectId === selectedSubject;
        const matchesSearch = getSubjectName(session.subjectId).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    const toggleStatus = (recordId: string) => {
        setRecords(prev => prev.map(r =>
            r.id === recordId
                ? { ...r, status: r.status === 'present' ? 'absent' : 'present' }
                : r
        ));

        // Update the selected session view to reflect changes immediately
        if (selectedSession) {
            const updatedRecord = records.find(r => r.id === recordId);
            // This is a bit complex due to derived state, but sufficient for prototype
            toast.success("Attendance updated");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
                <p className="text-muted-foreground mt-2">
                    Review and update past class attendance records.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Session History
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search subjects..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {assignedClasses.map(ac => (
                                        <SelectItem key={ac.subjectId} value={ac.subjectId}>
                                            {getSubjectName(ac.subjectId)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="font-medium">
                                            {new Date(session.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{getSubjectName(session.subjectId)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 text-xs">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    P: {session.totalPresent}
                                                </Badge>
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                    A: {session.totalAbsent}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedSession(session)}>
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No filtered records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Session Details</DialogTitle>
                        <DialogDescription>
                            {selectedSession && (
                                <>
                                    {getSubjectName(selectedSession.subjectId)} - {new Date(selectedSession.date).toDateString()}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="border rounded-md mt-4 max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedSession && records
                                    .filter(r => r.subjectId === selectedSession.subjectId && r.date === selectedSession.date)
                                    .map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-mono text-sm">{getStudentId(record.studentId)}</TableCell>
                                            <TableCell>{getStudentName(record.studentId)}</TableCell>
                                            <TableCell className="flex justify-end items-center gap-2">
                                                <span className={`text-xs font-medium w-12 text-right ${record.status === 'present' ? 'text-green-600' : 'text-destructive'}`}>
                                                    {record.status.toUpperCase()}
                                                </span>
                                                <Switch
                                                    checked={record.status === 'present'}
                                                    onCheckedChange={() => toggleStatus(record.id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PastAttendance;
