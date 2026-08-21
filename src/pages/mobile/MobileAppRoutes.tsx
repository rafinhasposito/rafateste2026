import { Routes, Route, Navigate } from "react-router-dom";
import { MobileOnboarding } from "@/components/mobile/onboarding/MobileOnboarding";

/**
 * [SAFE_TO_DEPRECATE]
 * Este arquivo foi preservado conforme regras de governança, mas sua rota
 * de onboarding foi extraída nativamente para o App.tsx (ConsumerShell/FocusedShell).
 * Rotas do fluxo mobile.
 * - /app/onboarding → Splash de primeira visita (opcional)
 * - /app → Redireciona para o Index principal (que agora é responsivo)
 */
export const MobileAppRoutes = () => {
  return (
    <Routes>
      <Route path="/onboarding" element={<MobileOnboarding />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
