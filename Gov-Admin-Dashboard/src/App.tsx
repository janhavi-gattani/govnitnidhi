import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { GramPanchayatDashboard } from "./pages/gram-panchayat/Dashboard";
import { ZillaParishadDashboard } from "./pages/zilla-parishad/Dashboard";
import { ComplaintsPage } from "./pages/complaints/ComplaintsPage";
import { DocumentsPage } from "./pages/documents/DocumentsPage";
import  VacanciesPage  from "./pages/vacancies/VacanciesPage";
import { NewsPage } from "./pages/news/NewsPage";
import SchemesPage  from "./pages/schemes/SchemesPage";
import { BulkCallingPage } from "./pages/bulk-calling/BulkCallingPage";
import { RegionalOverview } from "./pages/zilla-parishad/RegionalOverview";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/auth/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: JSX.Element;
  allowedRole: "gram_panchayat_admin" | "zilla_parishad_admin";
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role doesn't match, redirect to their appropriate portal
  if (user.role !== allowedRole) {
    if (user.role === "gram_panchayat_admin") {
      return <Navigate to="/gram-panchayat" replace />;
    } else if (user.role === "zilla_parishad_admin") {
      return <Navigate to="/zilla-parishad" replace />;
    } else {
      // For citizens or other roles, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Gram Panchayat Routes */}
            <Route
              path="/gram-panchayat"
              element={
                <ProtectedRoute allowedRole="gram_panchayat_admin">
                  <DashboardLayout type="gram_panchayat" />
                </ProtectedRoute>
              }
            >
              <Route index element={<GramPanchayatDashboard />} />
              <Route path="complaints" element={<ComplaintsPage type="gram_panchayat" />} />
              <Route path="documents" element={<DocumentsPage type="gram_panchayat" />} />
              <Route path="vacancies" element={<VacanciesPage type="gram_panchayat" />} />
              <Route path="news" element={<NewsPage type="gram_panchayat" />} />
              <Route path="schemes" element={<SchemesPage type="gram_panchayat" />} />
              <Route path="bulk-calling" element={<BulkCallingPage />} />
            </Route>

            {/* Zilla Parishad Routes */}
            <Route
              path="/zilla-parishad"
              element={
                <ProtectedRoute allowedRole="zilla_parishad_admin">
                  <DashboardLayout type="zilla_parishad" />
                </ProtectedRoute>
              }
            >
              <Route index element={<ZillaParishadDashboard />} />
              <Route path="complaints" element={<ComplaintsPage type="zilla_parishad" />} />
              <Route path="documents" element={<DocumentsPage type="zilla_parishad" />} />
              <Route path="vacancies" element={<VacanciesPage type="zilla_parishad" />} />
              <Route path="news" element={<NewsPage type="zilla_parishad" />} />
              <Route path="schemes" element={<SchemesPage type="zilla_parishad" />} />
              <Route path="regional" element={<RegionalOverview />} />
              <Route
                path="settings"
                element={
                  <div className="dashboard-section">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <p className="text-muted-foreground">System configuration coming soon...</p>
                  </div>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
