
import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { mockData, AttendanceRecord } from '@/data/mockData';

const AttendanceManagement = () => {
    const [records] = useState<AttendanceRecord[]>(mockData.getAttendance());

    const getStudentName = (id: string) => mockData.getUsers().find(u => u.id === id)?.name || id;
    const getSubjectName = (id: string) => mockData.getSubjects().find(s => s.id === id)?.name || id;

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Attendance Records</h2>
                <p className="text-muted-foreground">
                    View all student attendance logs.
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{formatDate(record.date)}</TableCell>
                                <TableCell className="font-medium">{getStudentName(record.studentId)}</TableCell>
                                <TableCell>{getSubjectName(record.subjectId)}</TableCell>
                                <TableCell>
                                    {record.status === 'present' ? (
                                        <Badge className="bg-green-600 hover:bg-green-700">Present</Badge>
                                    ) : (
                                        <Badge variant="destructive">Absent</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(record.timestamp).toLocaleTimeString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AttendanceManagement;
