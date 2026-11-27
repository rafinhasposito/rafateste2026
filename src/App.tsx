import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/lib/i18n";
import { captureAffiliateRefCode, captureAffiliateRefFromUrl } from "@/lib/affiliates";

// Shells
import { ConsumerShell } from "./layouts/ConsumerShell";
import { FocusedShell } from "./layouts/FocusedShell";

// Pages
import Index from "./pages/Index";
import AppleResultPreview from "./pages/AppleResultPreview";
import AppleResultPreviewV3 from "./pages/AppleResultPreviewV3";
import HouseResult from "./pages/HouseResult";
import HouseTrailer from "./pages/HouseTrailer";
import HouseTrailerApp from "./pages/HouseTrailerApp";
import HousesGuide from "./pages/HousesGuide";
import HouseDetailGuide from "./pages/HouseDetailGuide";
import LandingV3 from "./pages/LandingV3";
import FreePastResult from "./pages/FreePastResult";
import DossierSandbox from "./pages/DossierSandbox";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Credits from "./pages/Credits";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Admin from "./pages/Admin";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import PartnersLanding from "./pages/PartnersLanding";
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

const OnboardingV2 = lazy(() => import("./components/onboarding-v2/OnboardingV2"));
const HomeV2 = lazy(() => import("./v2/pages/HomeV2"));
const HouseV2 = lazy(() => import("./v2/pages/HouseV2"));
const FreeAuditV2 = lazy(() => import("./v2/pages/FreeAuditV2"));
const ConsultV2 = lazy(() => import("./v2/pages/ConsultV2"));
const ResultV2 = lazy(() => import("./v2/pages/ResultV2"));
const CreditsV2 = lazy(() => import("./v2/pages/CreditsV2"));
const AuthV2 = lazy(() => import("./v2/pages/AuthV2"));
const AccountV2 = lazy(() => import("./v2/pages/AccountV2"));
const HowItWorksV2 = lazy(() => import("./v2/pages/HowItWorksV2"));
const PartnersV2 = lazy(() => import("./v2/pages/PartnersV2"));
const LegalV2 = lazy(() => import("./v2/pages/LegalV2"));

const AdminShowcase = () => (
  <AdminLayout title="User management" description="Manage your team members and their account permissions here.">
    <UsersTable />
  </AdminLayout>
);

const queryClient = new QueryClient();

const AffiliateRefTracker = () => {
  const location = useLocation();
  useEffect(() => {
    captureAffiliateRefFromUrl();
  }, [location.pathname, location.search]);
  return null;
};

const AffiliateShortLink = () => {
  const { code } = useParams<{ code: string }>();
  useEffect(() => {
    if (code) {
      void captureAffiliateRefCode(code);
    }
  }, [code]);
  return <Navigate to="/" replace />;
};

// Entrada inteligente em /: se vier com ?mode= (fluxo de consulta/retorno de checkout/auth),
// abre o calculador Index sem forçar onboarding; caso contrário, renderiza a nova Home Editorial Visual integrada ao Shell.
const HomeEntry = () => {
  const [searchParams] = useSearchParams();
  if (searchParams.get("mode") || searchParams.get("resetOnboarding")) {
    return <Index skipAutoOnboarding />;
  }
  return <LandingV3 embeddedInShell />;
};

const V3Redirect = () => {
  const location = useLocation();
  return <Navigate to={{ pathname: "/", search: location.search }} replace />;
};

import { ErrorBoundary } from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <I18nProvider>
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
          <AffiliateRefTracker />
          <Routes>
            <Route path="/concepts" element={<ConceptsShowcase />} />
            <Route path="/i/:code" element={<AffiliateShortLink />} />
            <Route path="/r/:code" element={<AffiliateShortLink />} />
            
            {/* 1. Consumer Shell (Main App - Preserves state across resize) */}
            <Route element={<ConsumerShell />}>
              <Route path="/" element={<HomeEntry />} />
              <Route path="/meu-passado" element={<FreePastResult />} />
              <Route path="/consultar" element={<Index skipAutoOnboarding />} />
              <Route path="/v1-arquivo" element={<Index skipAutoOnboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/afiliado" element={<AffiliateDashboard />} />
              <Route path="/parceiros" element={<PartnersLanding />} />
              <Route path="/seja-afiliado" element={<PartnersLanding />} />
              <Route path="/tecnologia" element={<Technology />} />
              <Route path="/casas" element={<HousesGuide />} />
              <Route path="/casas/:houseId" element={<HouseDetailGuide />} />
              <Route path="/app/trailer" element={<HouseTrailerApp />} />
            </Route>

            {/* 2. Focused Shell (Immersive Flows) */}
            <Route element={<FocusedShell />}>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/resgatar" element={<Credits />} />
              <Route path="/app/onboarding" element={<MobileOnboarding />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/privacidade" element={<Privacy />} />
            </Route>

            {/* 3. Intact Routes (Admin & Legacy/Prototypes - Outside Consumer Shell) */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/showcase-admin" element={<AdminShowcase />} />
            
            {/* Prévia Isolada V2 — Completa (Ondas 1 a 4 — V1 intacta em /) */}
            <Route path="/v2" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><HomeV2 /></Suspense>} />
            <Route path="/v2/casas/:houseId" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><HouseV2 /></Suspense>} />
            <Route path="/v2/consulta-gratis" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><FreeAuditV2 /></Suspense>} />
            <Route path="/v2/consultar" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><ConsultV2 /></Suspense>} />
            <Route path="/v2/resultado/:houseId" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><ResultV2 /></Suspense>} />
            <Route path="/v2/creditos" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><CreditsV2 /></Suspense>} />
            <Route path="/v2/resgatar" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><CreditsV2 /></Suspense>} />
            <Route path="/v2/entrar" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><AuthV2 /></Suspense>} />
            <Route path="/v2/perfil" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><AccountV2 /></Suspense>} />
            <Route path="/v2/minha-conta" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><AccountV2 /></Suspense>} />
            <Route path="/v2/dashboard" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><AccountV2 /></Suspense>} />
            <Route path="/v2/historico" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><AccountV2 /></Suspense>} />
            <Route path="/v2/como-funciona" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><HowItWorksV2 /></Suspense>} />
            <Route path="/v2/guia-rapido" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><HowItWorksV2 /></Suspense>} />
            <Route path="/v2/parceiros" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><PartnersV2 /></Suspense>} />
            <Route path="/v2/termos" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><LegalV2 doc="terms" /></Suspense>} />
            <Route path="/v2/privacidade" element={<Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4EAE0" }} />}><LegalV2 doc="privacy" /></Suspense>} />

            {/* Outros legados e protótipos intocados */}
            <Route path="/v2/game" element={<SolarGameV2 />} />
            <Route path="/northstar" element={<NorthStarFlow />} />
            <Route path="/apple-3d" element={<AppleScrollExplosion />} />
            <Route path="/app/onboarding-v2" element={<Suspense fallback={<div className="min-h-screen bg-black" />}><OnboardingV2 /></Suspense>} />
            <Route path="/v3" element={<V3Redirect />} />
            <Route path="/showcase-onboarding" element={<MobileOnboarding />} />

            <Route path="/v2-preview" element={<AppleResultPreview />} />
            <Route path="/v3-preview" element={<AppleResultPreviewV3 />} />
            <Route path="/v3-preview/:houseId" element={<AppleResultPreviewV3 />} />
        <Route path="/resultado/:houseId" element={<HouseResult />} />
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
            <Route path="/sandbox" element={<DossierSandbox />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
    </I18nProvider>
  </ErrorBoundary>
);

export default App;

