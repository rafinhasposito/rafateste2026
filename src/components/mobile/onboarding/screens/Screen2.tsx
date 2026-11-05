import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const destinationExamples = [
  {
    id: 'tokyo',
    city: "Tóquio",
    house: "Ativação da Casa 10",
    tag: "Carreira, Destaque & Autoridade",
    subtitle: "A escolha ideal para sair dos bastidores e assumir o topo.",
    details: {
      paraQuem: "Influenciadores, artistas e empreendedores que buscam fama, viralização e sucesso.",
      beneficios: "Construção de autoridade, projeção de imagem e prestígio absoluto.",
      vidaReal: "Você para de ser um segredo bem guardado. O mercado te vê como referência, atraindo grandes contratos."
    },
    poster: "/images/abertura/tokyo.jpg",
    video: "/assets/tokyo.mp4"
  },
  {
    id: 'zurich',
    city: "Zurique",
    house: "Ativação da Casa 6",
    tag: "Mundo Fit, Rotina & Saúde",
    subtitle: "A escolha ideal para disciplina de ferro sem sofrimento.",
    details: {
      paraQuem: "Quem briga com a balança, fura a dieta ou sente que a rotina está uma bagunça.",
      beneficios: "Eficiência no trabalho, rotina blindada e foco extremo na saúde.",
      vidaReal: "Seu dia vira um relógio suíço: consistência para treinar, comer limpo e organizar a agenda."
    },
    poster: "/images/abertura/zurich.jpg",
    video: "/assets/zurich.mp4"
  },
  {
    id: 'ny',
    city: "Nova York",
    house: "Ativação da Casa 3",
    tag: "Vendas, Comunicação & Negócios",
    subtitle: "A escolha ideal para fechar acordos e fazer o produto circular.",
    details: {
      paraQuem: "Vendedores, corretores e autônomos que precisam destravar a fala e bater metas.",
      beneficios: "Poder de convencimento, clareza nas negociações e networking rápido.",
      vidaReal: "Sua comunicação vira uma máquina de vendas. Feche negócios e faça seu produto circular."
    },
    poster: "/images/abertura/ny.jpg",
    video: "/assets/ny.mp4"
  }
];

export const Screen2 = () => {
  const [openCity, setOpenCity] = useState<string | null>(null);

  return (
    <section className="min-h-[100svh] bg-[#030306] px-4 sm:px-8 pt-20 md:pt-28 pb-28 md:pb-36 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-5 md:mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#C9A227] mb-2">A geografia recalcula o seu destino</p>
          <h2 className="font-ps-display text-3xl md:text-5xl leading-tight text-white">Mesmo dia. Mesma pessoa.</h2>
          <p className="mt-2 text-sm md:text-base text-white/70">O lugar do seu aniversário define qual área da vida ganha destaque nos próximos 12 meses.</p>
        </header>
        <div className="grid gap-3 md:gap-5 md:grid-cols-3 items-start">
          {destinationExamples.map(dest => {
            const expanded = openCity === dest.id;
            return (
              <article key={dest.id} className="overflow-hidden rounded-2xl border border-white/15 bg-[#101117]">
                <button type="button" aria-expanded={expanded} aria-controls={`details-${dest.id}`}
                  onClick={() => setOpenCity(expanded ? null : dest.id)}
                  className="group w-full text-left focus-visible:outline-offset-[-3px]">
                  <div className="relative h-24 sm:h-32 md:h-auto md:aspect-[16/10] overflow-hidden">
                    <video autoPlay muted loop playsInline preload="metadata" poster={dest.poster}
                      className="absolute inset-0 w-full h-full object-cover" src={dest.video} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 font-ps-display text-2xl md:text-3xl text-white">{dest.city}</span>
                  </div>
                  <div className="p-4 md:p-5 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-ps-display text-xl md:text-2xl text-[#F5DE98]">{dest.house}</h3>
                      <p className="mt-1 text-sm text-white/75">{dest.tag}</p>
                    </div>
                    <ChevronDown aria-hidden="true" className={`w-5 h-5 shrink-0 text-[#F5DE98] transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div hidden={!expanded} id={`details-${dest.id}`} className="border-t border-white/10 p-4 md:p-5 text-sm leading-relaxed text-white/80">
                  <p className="mb-4 text-white">{dest.subtitle}</p>
                  <dl className="space-y-3">
                    {Object.entries({ 'Para quem é': dest.details.paraQuem, 'Benefícios': dest.details.beneficios, 'Na vida real': dest.details.vidaReal }).map(([label, value]) => (
                      <div key={label}><dt className="font-semibold text-[#F5DE98]">{label}</dt><dd>{value}</dd></div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
