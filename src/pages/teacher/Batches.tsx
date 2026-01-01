import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTeachers, batches, sections, subjects, getStudents } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, BookOpen } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Batches = () => {
    const { user } = useAuth();

    interface AssignedSubject {
        id: string;
        batchId: string;
        sectionId: string;
        subjectId: string;
    }

    const [selectedClass, setSelectedClass] = useState<AssignedSubject | null>(null);

    const teacher = getTeachers().find(t => t.email === user?.email);
    const assignedClasses = teacher?.assignedSubjects || [];

    const getBatchName = (id: string) => batches.find(b => b.id === id)?.name || id;
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;
    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || id;

    // Get students for the selected class
    const classStudents = selectedClass
        ? getStudents().filter(s => s.batchId === selectedClass.batchId && s.sectionId === selectedClass.sectionId)
        : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Batches</h1>
                <p className="text-muted-foreground mt-2">
                    Select a class to view registered students.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignedClasses.map((assignment) => (
                    <Card
                        key={assignment.id}
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedClass(assignment)}
                    >
                        <CardHeader className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                {getSubjectName(assignment.subjectId)}
                            </CardTitle>
                            <CardDescription>
                                {batches.find(b => b.id === assignment.batchId)?.departmentId === '1' ? 'CSE' : 'EEE'} Dept
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>
                                        {getBatchName(assignment.batchId)} • {getSectionName(assignment.sectionId)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {assignedClasses.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        No classes assigned yet. Contact administrator.
                    </div>
                )}
            </div>

            <Dialog open={!!selectedClass} onOpenChange={(open) => !open && setSelectedClass(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Student List</DialogTitle>
                        <DialogDescription>
                            {selectedClass && (
                                <>
                                    {getSubjectName(selectedClass.subjectId)} - {getBatchName(selectedClass.batchId)} ({getSectionName(selectedClass.sectionId)})
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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classStudents.length > 0 ? (
                                    classStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.studentId}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No students found in this section.
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

export default Batches;
