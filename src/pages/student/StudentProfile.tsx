import { useAuth } from "@/contexts/AuthContext";
import { getStudents, batches, sections } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Hash, Book, Layers, CheckCircle, XCircle, ScanFace } from "lucide-react";

const StudentProfile = () => {
    const { user } = useAuth();
    const student = getStudents().find(s => s.email === user?.email);

    const getBatchName = (id?: string) => batches.find(b => b.id === id)?.name || "N/A";
    const getSectionName = (id?: string) => sections.find(s => s.id === id)?.name || "N/A";

    if (!student) return <div>Student not found</div>;

    const ProfileItem = ({ icon: Icon, label, value, subValue }: any) => (
        <div className="flex items-center p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="font-semibold text-lg">{value}</p>
                {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground mt-2">
                    View your academic identity and registration status.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <ProfileItem
                            icon={User}
                            label="Full Name"
                            value={student.name}
                        />
                        <ProfileItem
                            icon={Hash}
                            label="Student ID"
                            value={student.studentId}
                        />
                        <ProfileItem
                            icon={Mail}
                            label="Email Address"
                            value={student.email}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-primary" />
                            Academic Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ProfileItem
                            icon={Book}
                            label="Batch"
                            value={getBatchName(student.batchId)}
                        />
                        <ProfileItem
                            icon={Layers}
                            label="Section"
                            value={getSectionName(student.sectionId)}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ScanFace className="w-5 h-5 text-primary" />
                            Face Registration
                        </CardTitle>
                        <CardDescription>Status of your biometric registration.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        {student.faceRegistered ? (
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-green-700">Registration Complete</h3>
                                    <p className="text-sm text-green-600">Your face data is active for attendance.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-red-700">Not Registered</h3>
                                    <p className="text-sm text-red-600">Please contact admin to register your face.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentProfile;
