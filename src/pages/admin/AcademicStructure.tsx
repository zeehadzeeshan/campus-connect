
import { useState, useMemo } from 'react';
import {
    Building2,
    Layers,
    Puzzle,
    BookOpen,
    Plus,
    Trash2,
    Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockData, Department, Batch, Section, Subject } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const AcademicStructure = () => {
    const { toast } = useToast();
    // State for data
    const [departments, setDepartments] = useState<Department[]>(mockData.getDepartments());
    const [batches, setBatches] = useState<Batch[]>(mockData.getBatches());
    const [sections, setSections] = useState<Section[]>(mockData.getSections());
    const [subjects, setSubjects] = useState<Subject[]>(mockData.getSubjects());

    // State for modals
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('departments');
    const [newItemName, setNewItemName] = useState('');
    const [newCode, setNewCode] = useState(''); // For subjects
    const [selectedParentId, setSelectedParentId] = useState('');
    const [dialogDeptId, setDialogDeptId] = useState('');

    // Refresh helper
    const refreshData = () => {
        setDepartments(mockData.getDepartments());
        setBatches(mockData.getBatches());
        setSections(mockData.getSections());
        setSubjects(mockData.getSubjects());
    };

    // State for filters
    const [filterDept, setFilterDept] = useState('all');
    const [filterBatch, setFilterBatch] = useState('all');

    // Reset filters on tab change
    const handleTabChange = (val: string) => {
        setActiveTab(val);
        setFilterDept('all');
        setFilterBatch('all');
        setSelectedParentId('');
    };

    // Generic Handle Search/Filter could go here, for now relying on raw lists

    const handleAdd = () => {
        if (!newItemName) return;

        try {
            if (activeTab === 'departments') {
                mockData.addDepartment({ name: newItemName });
            } else if (activeTab === 'batches') {
                if (!selectedParentId) throw new Error('Department is required');
                mockData.addBatch({ name: newItemName, departmentId: selectedParentId });
            } else if (activeTab === 'sections') {
                if (!selectedParentId) throw new Error('Batch is required');
                mockData.addSection({ name: newItemName, batchId: selectedParentId });
            } else if (activeTab === 'subjects') {
                if (!selectedParentId) throw new Error('Department is required');
                if (!newCode) throw new Error('Subject code is required');
                mockData.addSubject({ name: newItemName, code: newCode, departmentId: selectedParentId });
            }

            toast({ title: 'Success', description: 'Item added successfully' });
            refreshData();
            setIsDialogOpen(false);
            setNewItemName('');
            setNewCode('');
            setSelectedParentId('');
            setDialogDeptId('');
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const handleDelete = (type: string, id: string) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;

        if (type === 'dept') mockData.deleteDepartment(id);
        if (type === 'batch') mockData.deleteBatch(id);
        if (type === 'section') mockData.deleteSection(id);
        if (type === 'subject') mockData.deleteSubject(id);

        refreshData();
        toast({ title: 'Deleted', description: 'Item deleted successfully' });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Academic Structure</h2>
                <p className="text-muted-foreground">
                    Manage departments, batches, sections, and subjects.
                </p>
            </div>

            <Tabs defaultValue="departments" onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="batches">Batches</TabsTrigger>
                    <TabsTrigger value="sections">Sections</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                </TabsList>

                <div className="mt-6 flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="capitalize">Add New {activeTab.slice(0, -1)}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {activeTab === 'subjects' && (
                                    <div className="grid gap-2">
                                        <Label>Subject Code</Label>
                                        <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. CSE-101" />
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Enter name" />
                                </div>

                                {activeTab === 'batches' && (
                                    <div className="grid gap-2">
                                        <Label>Department</Label>
                                        <Select onValueChange={setSelectedParentId}>
                                            <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {activeTab === 'sections' && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Department</Label>
                                            <Select onValueChange={(val) => { setDialogDeptId(val); setSelectedParentId(''); }}>
                                                <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                                <SelectContent>
                                                    {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Batch</Label>
                                            <Select onValueChange={setSelectedParentId} disabled={!dialogDeptId}>
                                                <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
                                                <SelectContent>
                                                    {batches
                                                        .filter(b => b.departmentId === dialogDeptId)
                                                        .map(b => (
                                                            <SelectItem key={b.id} value={b.id}>
                                                                {b.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'subjects' && (
                                    <div className="grid gap-2">
                                        <Label>Department</Label>
                                        <Select onValueChange={setSelectedParentId}>
                                            <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                            <SelectContent>
                                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAdd}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Departments Content */}
                <TabsContent value="departments">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell className="font-medium">{dept.name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete('dept', dept.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Batches Content */}
                <TabsContent value="batches" className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Label>Filter by Department:</Label>
                        <Select onValueChange={setFilterDept} value={filterDept}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches
                                    .filter(b => filterDept && filterDept !== 'all' ? b.departmentId === filterDept : true)
                                    .map((batch) => (
                                        <TableRow key={batch.id}>
                                            <TableCell className="font-medium">{batch.name}</TableCell>
                                            <TableCell>{departments.find(d => d.id === batch.departmentId)?.name || 'Unknown'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete('batch', batch.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Sections Content */}
                <TabsContent value="sections" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center space-x-2">
                            <Label>Department:</Label>
                            <Select onValueChange={(val) => { setFilterDept(val); setFilterBatch('all'); }} value={filterDept}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Label>Batch:</Label>
                            <Select onValueChange={setFilterBatch} value={filterBatch}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="All Batches" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Batches</SelectItem>
                                    {batches
                                        .filter(b => filterDept && filterDept !== 'all' ? b.departmentId === filterDept : true)
                                        .map(b => (
                                            <SelectItem key={b.id} value={b.id}>
                                                {b.name} ({departments.find(d => d.id === b.departmentId)?.name})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Batch</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sections
                                    .filter(s => {
                                        // First strict filter by batch if selected
                                        if (filterBatch && filterBatch !== 'all') return s.batchId === filterBatch;
                                        // If no batch selected but dept is, filter by all batches in that dept
                                        if (filterDept && filterDept !== 'all') {
                                            const batch = batches.find(b => b.id === s.batchId);
                                            return batch?.departmentId === filterDept;
                                        }
                                        return true;
                                    })
                                    .map((section) => {
                                        const batch = batches.find(b => b.id === section.batchId);
                                        return (
                                            <TableRow key={section.id}>
                                                <TableCell className="font-medium">{section.name}</TableCell>
                                                <TableCell>{batch ? `${batch.name} (${departments.find(d => d.id === batch.departmentId)?.name || 'Unknown'})` : 'Unknown'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete('section', section.id)}>
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Subjects Content */}
                <TabsContent value="subjects">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjects.map((subject) => (
                                    <TableRow key={subject.id}>
                                        <TableCell className="font-mono">{subject.code}</TableCell>
                                        <TableCell className="font-medium">{subject.name}</TableCell>
                                        <TableCell>{departments.find(d => d.id === subject.departmentId)?.name || 'Unknown'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete('subject', subject.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

            </Tabs>

            {/* Import Card just in case we used it, though TabsContent wraps it */}
            <div className="hidden">
                {/* Helper to ensure imports are used if I missed one */}
            </div>
        </div>
    );
};

export default AcademicStructure;
