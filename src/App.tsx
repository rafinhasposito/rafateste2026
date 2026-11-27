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

// Entrada oficial em /: Home 3D (se vier com ?mode=, encaminha direto para /consultar)
const v2Fallback = <div style={{ minHeight: "100vh", background: "#F4EAE0" }} />;

const HomeEntry = () => {
  const [searchParams] = useSearchParams();
  if (searchParams.get("mode")) {
    return <Navigate to={{ pathname: "/consultar", search: `?${searchParams.toString()}` }} replace />;
  }
  return <Suspense fallback={v2Fallback}><HomeV2 /></Suspense>;
};

const V2HouseRedirect = () => {
  const { houseId } = useParams<{ houseId: string }>();
  return <Navigate to={`/casas/${houseId || 1}`} replace />;
};

const V2ResultRedirect = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const location = useLocation();
  return <Navigate to={{ pathname: `/resultado/${houseId || 1}`, search: location.search }} replace />;
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
            
            {/* 1. SITE OFICIAL PROTOCOLO SOLAR (Rotas limpas direto em www.protocolosolar.com.br) */}
            <Route path="/" element={<HomeEntry />} />
            <Route path="/casas" element={<Navigate to="/#colecao" replace />} />
            <Route path="/casas/:houseId" element={<Suspense fallback={v2Fallback}><HouseV2 /></Suspense>} />
            <Route path="/consulta-gratis" element={<Suspense fallback={v2Fallback}><FreeAuditV2 /></Suspense>} />
            <Route path="/meu-passado" element={<Suspense fallback={v2Fallback}><FreeAuditV2 /></Suspense>} />
            <Route path="/consultar" element={<Suspense fallback={v2Fallback}><ConsultV2 /></Suspense>} />
            <Route path="/resultado/:houseId" element={<Suspense fallback={v2Fallback}><ResultV2 /></Suspense>} />
            <Route path="/creditos" element={<Suspense fallback={v2Fallback}><CreditsV2 /></Suspense>} />
            <Route path="/credits" element={<Suspense fallback={v2Fallback}><CreditsV2 /></Suspense>} />
            <Route path="/resgatar" element={<Suspense fallback={v2Fallback}><CreditsV2 /></Suspense>} />
            <Route path="/entrar" element={<Suspense fallback={v2Fallback}><AuthV2 /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={v2Fallback}><AuthV2 /></Suspense>} />
            <Route path="/perfil" element={<Suspense fallback={v2Fallback}><AccountV2 /></Suspense>} />
            <Route path="/minha-conta" element={<Suspense fallback={v2Fallback}><AccountV2 /></Suspense>} />
            <Route path="/dashboard" element={<Suspense fallback={v2Fallback}><AccountV2 /></Suspense>} />
            <Route path="/history" element={<Suspense fallback={v2Fallback}><AccountV2 /></Suspense>} />
            <Route path="/historico" element={<Suspense fallback={v2Fallback}><AccountV2 /></Suspense>} />
            <Route path="/como-funciona" element={<Suspense fallback={v2Fallback}><HowItWorksV2 /></Suspense>} />
            <Route path="/guia-rapido" element={<Suspense fallback={v2Fallback}><HowItWorksV2 /></Suspense>} />
            <Route path="/tecnologia" element={<Suspense fallback={v2Fallback}><HowItWorksV2 /></Suspense>} />
            <Route path="/parceiros" element={<Suspense fallback={v2Fallback}><PartnersV2 /></Suspense>} />
            <Route path="/seja-afiliado" element={<Suspense fallback={v2Fallback}><PartnersV2 /></Suspense>} />
            <Route path="/termos" element={<Suspense fallback={v2Fallback}><LegalV2 doc="terms" /></Suspense>} />
            <Route path="/privacidade" element={<Suspense fallback={v2Fallback}><LegalV2 doc="privacy" /></Suspense>} />

            {/* 2. Redirecionamentos limpos de /v2/* para as rotas oficiais (zero link quebrado) */}
            <Route path="/v2" element={<Navigate to="/" replace />} />
            <Route path="/v2/casas/:houseId" element={<V2HouseRedirect />} />
            <Route path="/v2/consulta-gratis" element={<Navigate to="/consulta-gratis" replace />} />
            <Route path="/v2/consultar" element={<Navigate to="/consultar" replace />} />
            <Route path="/v2/resultado/:houseId" element={<V2ResultRedirect />} />
            <Route path="/v2/creditos" element={<Navigate to="/creditos" replace />} />
            <Route path="/v2/resgatar" element={<Navigate to="/resgatar" replace />} />
            <Route path="/v2/entrar" element={<Navigate to="/entrar" replace />} />
            <Route path="/v2/perfil" element={<Navigate to="/perfil" replace />} />
            <Route path="/v2/minha-conta" element={<Navigate to="/perfil" replace />} />
            <Route path="/v2/dashboard" element={<Navigate to="/perfil" replace />} />
            <Route path="/v2/historico" element={<Navigate to="/perfil" replace />} />
            <Route path="/v2/como-funciona" element={<Navigate to="/como-funciona" replace />} />
            <Route path="/v2/guia-rapido" element={<Navigate to="/como-funciona" replace />} />
            <Route path="/v2/parceiros" element={<Navigate to="/parceiros" replace />} />
            <Route path="/v2/termos" element={<Navigate to="/termos" replace />} />
            <Route path="/v2/privacidade" element={<Navigate to="/privacidade" replace />} />

            {/* 3. Fluxos dedicados & Backup completo da V1 (/v1-arquivo/*) */}
            <Route element={<ConsumerShell />}>
              <Route path="/afiliado" element={<AffiliateDashboard />} />
              <Route path="/app/trailer" element={<HouseTrailerApp />} />
              <Route path="/v1-arquivo" element={<LandingV3 embeddedInShell />} />
              <Route path="/v1-arquivo/consultar" element={<Index skipAutoOnboarding />} />
              <Route path="/v1-arquivo/meu-passado" element={<FreePastResult />} />
              <Route path="/v1-arquivo/dashboard" element={<Dashboard />} />
              <Route path="/v1-arquivo/history" element={<History />} />
              <Route path="/v1-arquivo/perfil" element={<Profile />} />
              <Route path="/v1-arquivo/parceiros" element={<PartnersLanding />} />
              <Route path="/v1-arquivo/tecnologia" element={<Technology />} />
              <Route path="/v1-arquivo/casas" element={<HousesGuide />} />
              <Route path="/v1-arquivo/casas/:houseId" element={<HouseDetailGuide />} />
            </Route>

            <Route element={<FocusedShell />}>
              <Route path="/checkout-cartao" element={<Credits />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/app/onboarding" element={<MobileOnboarding />} />
              <Route path="/v1-arquivo/auth" element={<Auth />} />
              <Route path="/v1-arquivo/termos" element={<Terms />} />
              <Route path="/v1-arquivo/privacidade" element={<Privacy />} />
            </Route>

            {/* 4. Admin & Sandboxes preservados */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/showcase-admin" element={<AdminShowcase />} />

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
            <Route path="/v1-arquivo/resultado/:houseId" element={<HouseResult />} />
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

