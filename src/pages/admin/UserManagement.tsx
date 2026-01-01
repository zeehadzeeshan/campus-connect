
import { useState } from 'react';
import {
    Users,
    GraduationCap,
    Search,
    CheckCircle,
    XCircle,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockData, User } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(mockData.getUsers());
    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = (id: string) => {
        mockData.toggleUserStatus(id);
        setUsers(mockData.getUsers());
        toast({ title: "Updated", description: "User status updated successfully." });
    };

    // Helper to get names
    const getBatchName = (id?: string) => {
        if (!id) return '-';
        return mockData.getBatches().find(b => b.id === id)?.name || id;
    };

    const getSectionName = (id?: string) => {
        if (!id) return '-';
        return mockData.getSections().find(s => s.id === id)?.name || id;
    };

    const students = users.filter(u => u.role === 'student' && u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const teachers = users.filter(u => u.role === 'teacher' && u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage students and teachers access.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="students" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="students" className="gap-2">
                        <Users className="w-4 h-4" /> Students
                    </TabsTrigger>
                    <TabsTrigger value="teachers" className="gap-2">
                        <GraduationCap className="w-4 h-4" /> Teachers
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="mt-6">
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Batch</TableHead>
                                    <TableHead className="hidden md:table-cell">Section</TableHead>
                                    <TableHead>Face Reg</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono">{student.studentId}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{student.name}</span>
                                                <span className="text-xs text-muted-foreground">{student.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{getBatchName(student.batchId)}</TableCell>
                                        <TableCell className="hidden md:table-cell">{getSectionName(student.sectionId)}</TableCell>
                                        <TableCell>
                                            {student.faceRegistered ? (
                                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Registered</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {student.status === 'active' ? (
                                                <Badge variant="default" className="bg-green-600">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Disabled</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => toggleStatus(student.id)}>
                                                        {student.status === 'active' ? 'Disable Account' : 'Enable Account'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="teachers" className="mt-6">
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teacher ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Subjects</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-mono">{teacher.teacherId}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{teacher.name}</span>
                                                <span className="text-xs text-muted-foreground">{teacher.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {teacher.assignedSubjects?.length || 0} Subjects
                                        </TableCell>
                                        <TableCell>
                                            {teacher.status === 'active' ? (
                                                <Badge variant="default" className="bg-green-600">Active</Badge>
                                            ) : (
                                                <Badge variant="destructive">Disabled</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => toggleStatus(teacher.id)}>
                                                        {teacher.status === 'active' ? 'Disable Account' : 'Enable Account'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserManagement;
