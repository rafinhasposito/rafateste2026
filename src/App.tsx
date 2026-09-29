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
import AppleResultPrototype from "./pages/AppleResultPrototype";
import AppleResultPreview from "./pages/AppleResultPreview";
import AppleResultPreviewV3 from "./pages/AppleResultPreviewV3";
import AppleResultPreviewV4 from "./pages/AppleResultPreviewV4";
import HouseTrailer from "./pages/HouseTrailer";
import HouseTrailerApp from "./pages/HouseTrailerApp";
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
import Block3Sandbox from "./pages/Block3Sandbox";
import Block4Sandbox from "./pages/Block4Sandbox";
import RitualSandbox from "./pages/RitualSandbox";
import CityStorytellingSandbox from "./pages/CityStorytellingSandbox";
import CitySandboxParallax from "./pages/CitySandboxParallax";
import Option3Refinements from "./pages/Option3Refinements";
import TheRealFlowSandbox from "./pages/TheRealFlowSandbox";
import MantraSandbox from "./pages/MantraSandbox";
import AlertSandbox from "./pages/AlertSandbox";
import ConceptsShowcase from "./pages/ConceptsShowcase";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Technology from "./pages/Technology";

// OrbitalOnboarding removido para unificação visual
import MobileOnboarding from "./components/mobile/onboarding/MobileOnboarding";
import { AdminLayout } from "./components/admin/AdminLayout";
import { UsersTable } from "./components/admin/UsersTable";

const AdminShowcase = () => (
  <AdminLayout title="User management" description="Manage your team members and their account permissions here.">
    <UsersTable />
  </AdminLayout>
);

const queryClient = new QueryClient();

import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/concepts" element={<ConceptsShowcase />} />
            
            {/* 1. Consumer Shell (Main App - Preserves state across resize) */}
            <Route element={<ConsumerShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/tecnologia" element={<Technology />} />
              <Route path="/app/trailer" element={<HouseTrailerApp />} />
            </Route>

            {/* 2. Focused Shell (Immersive Flows) */}
            <Route element={<FocusedShell />}>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/app/onboarding" element={<MobileOnboarding />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/privacidade" element={<Privacy />} />
            </Route>

            {/* 3. Intact Routes (Admin & Legacy/Prototypes - Outside Consumer Shell) */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/showcase-admin" element={<AdminShowcase />} />
            
            {/* Outros legados e protótipos intocados */}
            <Route path="/v2/game" element={<SolarGameV2 />} />
            <Route path="/northstar" element={<NorthStarFlow />} />
            <Route path="/apple-3d" element={<AppleScrollExplosion />} />
            <Route path="/showcase-onboarding" element={<MobileOnboarding />} />

            <Route path="/v2-apple" element={<AppleResultPrototype />} />
            <Route path="/v2-preview" element={<AppleResultPreview />} />
            <Route path="/v4-preview" element={<AppleResultPreviewV4 />} />
        <Route path="/v3-preview" element={<AppleResultPreviewV3 />} />
            <Route path="/bloco3" element={<Block3Sandbox />} />
            <Route path="/bloco4" element={<Block4Sandbox />} />
            <Route path="/ritual" element={<RitualSandbox />} />
            <Route path="/city" element={<CityStorytellingSandbox />} />
            <Route path="/parallax" element={<CitySandboxParallax />} />
            <Route path="/split" element={<Option3Refinements />} />
            <Route path="/flow" element={<TheRealFlowSandbox />} />
            <Route path="/mantras" element={<MantraSandbox />} />
            <Route path="/alerts" element={<AlertSandbox />} />
            <Route path="/trailer" element={<HouseTrailer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

