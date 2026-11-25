import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOUSES_SHOWCASE, type HouseElement } from "@/data/housesShowcase";
import { HOUSE_PILLAR_SCORES } from "@/lib/solarQuizUtils";
import { useI18n } from "@/lib/i18n";

const ELEMENTS_FILTER: ("ALL" | HouseElement)[] = ["ALL", "Fogo", "Terra", "Ar", "Água"];

export default function HousesGuide() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedElement, setSelectedElement] = useState<"ALL" | HouseElement>("ALL");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const filteredHouses = useMemo(() => {
    if (selectedElement === "ALL") return HOUSES_SHOWCASE;
    return HOUSES_SHOWCASE.filter((item) => item.element === selectedElement);
  }, [selectedElement]);

  return (
    <div className="min-h-screen bg-[#02050A] text-[#F2F4F7] pt-20 pb-32 lg:pt-14 lg:pb-28 font-sans overflow-x-hidden">
      <div className="max-w-[1220px] mx-auto px-5 sm:px-8">
        {/* Editorial Header — Harmonious Marcellus + DM Sans, Zero Boxy Pills */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 mb-8 border-b border-[#C9A227]/18">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#E8D59B] mb-4">
              CATÁLOGO DAS 12 CASAS SOLARES
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-[#F2F4F7] leading-[1.08] mb-4">
              As 12 áreas que podem conduzir o seu próximo ciclo anual.
            </h1>
            <p className="text-sm sm:text-base text-[#AAB6C4] leading-relaxed">
              Nenhuma Casa pertence a uma cidade fixa. As cidades que ativam cada setor mudam todos os anos conforme sua data, horário e local de nascimento.
            </p>
          </div>

          {/* Clean Hairline Filter Tabs */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-5 border-b border-white/10 lg:border-b-0 pb-2 lg:pb-0 shrink-0">
            {ELEMENTS_FILTER.map((key) => {
              const active = selectedElement === key;
              const label =
                key === "ALL" ? t.housesSection.filterAll : t.housesSection.elements[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedElement(key)}
                  className={`pb-2 text-xs uppercase tracking-[0.14em] font-semibold whitespace-nowrap transition-colors relative ${
                    active ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-white"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A227]" />
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* Clean Editorial Hairline Index — Zero Heavy Boxes */}
        <section aria-label="Índice das 12 Casas Solares" className="divide-y divide-white/10">
          {filteredHouses.map((house) => {
            const copy = t.houses[house.id];
            const scores = HOUSE_PILLAR_SCORES[house.id];
            return (
              <button
                key={house.id}
                type="button"
                onClick={() => navigate(`/casas/${house.id}`)}
                className="group w-full py-7 sm:py-9 text-left grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start hover:bg-[#07101A]/75 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl transition-colors"
              >
                {/* Col 1–2: Roman Numeral + House Number */}
                <div className="lg:col-span-2 flex lg:flex-col items-baseline gap-3 lg:gap-1">
                  <span className="font-display text-3xl sm:text-4xl text-[#C9A227]">
                    {scores?.roman || house.numberLabel}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#AAB6C4]">
                    Casa {house.numberLabel} · {t.housesSection.elements[house.element]}
                  </span>
                </div>

                {/* Col 3–6: Title + Tag */}
                <div className="lg:col-span-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#E8D59B] mb-1">
                    {copy?.shortTag}
                  </p>
                  <h2 className="font-display text-2xl text-[#F2F4F7] group-hover:text-[#E8D59B] transition-colors leading-snug">
                    {copy?.title || house.title}
                  </h2>
                </div>

                {/* Col 7–11: Clean Editorial Description */}
                <div className="lg:col-span-5">
                  <p className="text-sm text-[#AAB6C4] leading-relaxed">
                    {copy?.focus || house.cycleFocus}
                  </p>
                </div>

                {/* Col 12: Arrow */}
                <div className="lg:col-span-1 flex lg:justify-end items-center pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[#E8D59B] group-hover:translate-x-1 transition-transform">
                    <span className="lg:hidden">Abrir Casa {house.numberLabel}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* Harmonious Warm Pearl Closing Band */}
        <div className="mt-16 rounded-[24px] bg-[#FAF7F2] text-[#07101A] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8D6914] mb-2">
              CÁLCULO PERSONALIZADO
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-[#07101A] leading-snug">
              Descubra qual Casa regeu seu último aniversário — ou planeje o próximo.
            </h3>
          </div>
          <Link
            to="/#consulta-gratuita"
            className="h-12 px-7 rounded-full bg-[#07101A] text-[#E8D59B] text-sm font-semibold inline-flex items-center gap-2.5 shrink-0 hover:bg-[#0C1826] transition-colors"
          >
            <span>Iniciar cálculo personalizado</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
