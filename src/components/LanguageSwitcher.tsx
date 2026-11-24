import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_OPTIONS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const active = LOCALE_OPTIONS.find((item) => item.code === locale) || LOCALE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Idioma: ${active.label}`}
          className={
            compact
              ? "pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/14 bg-[#0B111E]/85 hover:border-[#EAB344]/45 text-[#F8FAFC] text-[10px] font-sans font-semibold tracking-[0.1em] uppercase transition-all backdrop-blur-xl active:scale-95"
              : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/14 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#EAB344]/45 text-[#F8FAFC]/90 hover:text-white text-xs font-sans font-semibold tracking-[0.08em] uppercase transition-all"
          }
        >
          <Globe className="w-3.5 h-3.5 text-[#EAB344]" />
          <span>{active.short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 bg-[#0B111E]/98 backdrop-blur-2xl border border-white/14 text-[#F8FAFC] shadow-2xl rounded-2xl p-1.5 z-[80]"
      >
        {LOCALE_OPTIONS.map((opt) => {
          const isSelected = opt.code === locale;
          return (
            <DropdownMenuItem
              key={opt.code}
              onClick={() => setLocale(opt.code)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans cursor-pointer transition-colors ${
                isSelected
                  ? "bg-[#EAB344]/15 text-[#F3DC9B] font-semibold"
                  : "text-[#F8FAFC]/85 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span>{opt.label}</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase opacity-75">
                {opt.short}
                {isSelected && <Check className="w-3.5 h-3.5 text-[#EAB344]" />}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
