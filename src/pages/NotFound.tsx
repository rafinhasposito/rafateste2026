import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#02050A] px-6 text-white">
      <div className="max-w-md w-full text-center rounded-3xl border border-[#C9A227]/30 bg-[#08111F]/90 backdrop-blur-xl p-8 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.75)]">
        <div className="w-14 h-14 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center mx-auto mb-5">
          <Compass className="w-7 h-7 text-[#F5DE98]" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#C9A227] font-bold mb-2">
          Coordenada 404
        </p>
        <h1 className="font-ps-display text-3xl sm:text-4xl font-bold text-white mb-3">
          Página não encontrada
        </h1>
        <p className="font-ps-ui text-sm text-white/60 leading-relaxed mb-7">
          Este endereço não existe ou foi movido. Volte para o início do Protocolo Solar para continuar sua jornada.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] font-ps-ui text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-[0_10px_28px_rgba(201,162,39,0.28)]"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
