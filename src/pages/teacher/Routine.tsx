import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTeachers, routines as mockRoutines, batches, sections, subjects } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Routine = () => {
    const { user } = useAuth();
    const teacher = getTeachers().find(t => t.email === user?.email);
    const assignedClasses = teacher?.assignedSubjects || [];

    // Local state for routines to simulate adding/deleting
    const [routines, setRoutines] = useState(
        mockRoutines.filter(r => r.teacherId === teacher?.id)
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [selectedClassId, setSelectedClassId] = useState("");
    const [day, setDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [roomId, setRoomId] = useState("");

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getBatchName = (id: string) => batches.find(b => b.id === id)?.name || id;
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;
    const getSectionName = (id: string) => sections.find(s => s.id === id)?.name || id;

    const handleSave = () => {
        if (!selectedClassId || !day || !startTime || !endTime) {
            toast.error("Please fill in all required fields");
            return;
        }

        const selectedClass = assignedClasses.find(c => c.id === selectedClassId);
        if (!selectedClass) return;

        const newRoutine = {
            id: Math.random().toString(36).substr(2, 9),
            day,
            startTime,
            endTime,
            subjectId: selectedClass.subjectId,
            teacherId: teacher?.id || '',
            batchId: selectedClass.batchId,
            sectionId: selectedClass.sectionId,
            roomId: roomId || 'TBD'
        };

        setRoutines([...routines, newRoutine]);
        setIsDialogOpen(false);
        resetForm();
        toast.success("Routine added successfully");
    };

    const handleDelete = (id: string) => {
        setRoutines(routines.filter(r => r.id !== id));
        toast.success("Routine removed");
    };

    const resetForm = () => {
        setSelectedClassId("");
        setDay("");
        setStartTime("");
        setEndTime("");
        setRoomId("");
    };

    // Sort routines by Day then Time
    const sortedRoutines = [...routines].sort((a, b) => {
        const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Class Routine</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your weekly class schedule.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Set Routine
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Routine</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Class (Subject - Batch)</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignedClasses.map((ac) => (
                                            <SelectItem key={ac.id} value={ac.id}>
                                                {getSubjectName(ac.subjectId)} - {getBatchName(ac.batchId)} ({getSectionName(ac.sectionId)})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Day</Label>
                                <Select value={day} onValueChange={setDay}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {days.map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Start Time</Label>
                                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>End Time</Label>
                                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Room Number</Label>
                                <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="e.g. 301" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Routine</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>Your current class timings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Day</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Batch & Section</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedRoutines.length > 0 ? (
                                sortedRoutines.map((routine) => (
                                    <TableRow key={routine.id}>
                                        <TableCell className="font-medium">{routine.day}</TableCell>
                                        <TableCell>{routine.startTime} - {routine.endTime}</TableCell>
                                        <TableCell>{getSubjectName(routine.subjectId)}</TableCell>
                                        <TableCell>{getBatchName(routine.batchId)} - {getSectionName(routine.sectionId)}</TableCell>
                                        <TableCell>{routine.roomId}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(routine.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No routines set. Click "Set Routine" to start.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Routine;
