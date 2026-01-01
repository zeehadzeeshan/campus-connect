import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
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
    const [routines, setRoutines] = useState<any[]>([]);
    const [assignedClasses, setAssignedClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
    const [day, setDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [roomId, setRoomId] = useState("");

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const fetchData = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const [assignments, allRoutines] = await Promise.all([
                api.getTeacherAssignments(user.id),
                api.getRoutines()
            ]);
            setAssignedClasses(assignments || []);
            // Filter routines for this teacher manually if getRoutines doesn't support it or just keep it simple
            setRoutines(allRoutines?.filter((r: any) => r.teacher_id === user.id) || []);
        } catch (e) {
            toast.error("Failed to load routines");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const handleSave = async () => {
        if (!selectedAssignmentId || !day || !startTime || !endTime) {
            toast.error("Please fill in all required fields");
            return;
        }

        const assignment = assignedClasses.find(c => c.id === selectedAssignmentId);
        if (!assignment) return;

        try {
            const newRoutine = {
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
                subject_id: assignment.subject_id,
                teacher_id: user.id,
                room_id: roomId || 'TBD'
            };

            await api.createRoutine(newRoutine);
            setIsDialogOpen(false);
            resetForm();
            toast.success("Routine added successfully");
            fetchData();
        } catch (e) {
            toast.error("Failed to add routine. Check for conflicts.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteResource('routines', id);
            toast.success("Routine removed");
            fetchData();
        } catch (e) {
            toast.error("Failed to delete routine");
        }
    };

    const resetForm = () => {
        setSelectedAssignmentId("");
        setDay("");
        setStartTime("");
        setEndTime("");
        setRoomId("");
    };

    const sortedRoutines = [...routines].sort((a, b) => {
        const dayDiff = days.indexOf(a.day_of_week) - days.indexOf(b.day_of_week);
        if (dayDiff !== 0) return dayDiff;
        return a.start_time.localeCompare(b.start_time);
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
                                <Select value={selectedAssignmentId} onValueChange={setSelectedAssignmentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignedClasses.map((ac) => (
                                            <SelectItem key={ac.id} value={ac.id}>
                                                {ac.subject?.name} - {ac.subject?.section?.batch?.name} ({ac.subject?.section?.name})
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
                    {!isLoading ? (
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
                                            <TableCell className="font-medium">{routine.day_of_week}</TableCell>
                                            <TableCell>{routine.start_time?.slice(0, 5)} - {routine.end_time?.slice(0, 5)}</TableCell>
                                            <TableCell>{routine.subject?.name}</TableCell>
                                            <TableCell>
                                                {routine.subject?.section?.batch?.name} - {routine.subject?.section?.name}
                                            </TableCell>
                                            <TableCell>{routine.room_id}</TableCell>
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
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">Loading routine...</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Routine;
