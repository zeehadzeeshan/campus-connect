import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleSelection from "./pages/RoleSelection";
import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";
import FaceRegistration from "./pages/FaceRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/face-registration" element={<FaceRegistration />} />
            {/* Placeholder routes - to be implemented */}
            <Route path="/student" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Student Dashboard - Coming Next</h1></div>} />
            <Route path="/teacher" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Teacher Dashboard - Coming Next</h1></div>} />
            <Route path="/admin/dashboard" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Admin Dashboard - Coming Next</h1></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
