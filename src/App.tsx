import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

// Shells
import { ConsumerShell } from "./layouts/ConsumerShell";
import { FocusedShell } from "./layouts/FocusedShell";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Credits from "./pages/Credits";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SolarGameV2 from "./pages/SolarGameV2";
import NorthStarFlow from "./pages/NorthStarFlow";
import AppleScrollExplosion from "./pages/AppleScrollExplosion";
import { OrbitalOnboarding } from "./components/onboarding/OrbitalOnboarding";
import { MobileOnboarding } from "./components/mobile/onboarding/MobileOnboarding";
import { AdminLayout } from "./components/admin/AdminLayout";
import { UsersTable } from "./components/admin/UsersTable";

const AdminShowcase = () => (
  <AdminLayout title="User management" description="Manage your team members and their account permissions here.">
    <UsersTable />
  </AdminLayout>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 1. Consumer Shell (Main App - Preserves state across resize) */}
            <Route element={<ConsumerShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/perfil" element={<Profile />} />
            </Route>

            {/* 2. Focused Shell (Immersive Flows) */}
            <Route element={<FocusedShell />}>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/app/onboarding" element={<MobileOnboarding />} />
            </Route>

            {/* 3. Intact Routes (Admin & Legacy/Prototypes - Outside Consumer Shell) */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/showcase-admin" element={<AdminShowcase />} />
            
            {/* Outros legados e protótipos intocados */}
            <Route path="/v2/game" element={<SolarGameV2 />} />
            <Route path="/northstar" element={<NorthStarFlow />} />
            <Route path="/apple-3d" element={<AppleScrollExplosion />} />
            <Route path="/showcase-onboarding" element={<OrbitalOnboarding />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

