
import { useState } from 'react';
import { CalendarDays, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockData, Routine } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const RoutineManagement = () => {
    const { toast } = useToast();
    const [routines, setRoutines] = useState<Routine[]>(mockData.getRoutines());

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this routine?')) {
            mockData.deleteRoutine(id);
            setRoutines(mockData.getRoutines());
            toast({ title: 'Routine deleted' });
        }
    };

    const getSubjectName = (id: string) => mockData.getSubjects().find(s => s.id === id)?.name || id;
    const getTeacherName = (id: string) => mockData.getUsers().find(u => u.id === id)?.name || id;
    const getBatchName = (id: string) => mockData.getBatches().find(b => b.id === id)?.name || id;
    const getSectionName = (id: string) => mockData.getSections().find(s => s.id === id)?.name || id;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Routine Management</h2>
                <p className="text-muted-foreground">
                    View and manage class schedules.
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Batch/Section</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routines.map((routine) => (
                            <TableRow key={routine.id}>
                                <TableCell className="font-medium">{routine.day}</TableCell>
                                <TableCell>{routine.startTime} - {routine.endTime}</TableCell>
                                <TableCell>{getSubjectName(routine.subjectId)}</TableCell>
                                <TableCell>{getTeacherName(routine.teacherId)}</TableCell>
                                <TableCell>{getBatchName(routine.batchId)} - {getSectionName(routine.sectionId)}</TableCell>
                                <TableCell>{routine.roomId || 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(routine.id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {routines.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No routines found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RoutineManagement;
