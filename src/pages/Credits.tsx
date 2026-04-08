import { motion } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock, Map } from "lucide-react";

const PACKAGES = [
  {
    id: "basic",
    name: "Descoberta",
    credits: 1,
    price: "29,90",
    houses: "1 Casa",
    description: "Veja a casa mais importante para o seu objetivo",
    highlight: false,
  },
  {
    id: "plus",
    name: "Expansão",
    credits: 2,
    price: "49,90",
    houses: "3 Casas",
    description: "Desbloqueie 3 casas e descubra rotas alternativas",
    highlight: true,
  },
  {
    id: "premium",
    name: "Mapa Completo",
    credits: 3,
    price: "79,90",
    houses: "12 Casas",
    description: "Acesso total a todas as 12 casas do seu mapa estelar",
    highlight: false,
  },
];

const UNLOCK_TABLE = [
  { label: "+1 Casa", credits: 1, desc: "Desbloqueia 1 casa adicional no seu mapa", icon: Lock },
  { label: "+3 Casas", credits: 2, desc: "Desbloqueia 3 casas adicionais", icon: Unlock },
  { label: "Mapa Completo", credits: 3, desc: "Todas as 12 casas reveladas de uma vez", icon: Map },
];

const Credits = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = (pkg: typeof PACKAGES[0]) => {
    alert(`Pagamento de R$${pkg.price} para ${pkg.credits} crédito(s) será integrado com Stripe em breve.`);
  };

  return (
    <>
      <StarryBackground />
      <div className="min-h-screen px-4 py-16 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors mb-8 inline-block"
          >
            ← Voltar
          </button>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-foreground mb-3 uppercase tracking-wider">
            Créditos Estelares
          </h1>
          <p className="text-muted-foreground text-sm font-light max-w-lg mx-auto">
            Cada crédito desbloqueia casas no seu mapa de Revolução Solar. Quanto mais casas, mais rotas de prosperidade você descobre.
          </p>
          {profile && (
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="text-primary font-cinzel text-xl font-bold">{profile.credits}</span>
              <span className="text-muted-foreground text-xs uppercase tracking-widest">créditos disponíveis</span>
            </div>
          )}
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-8 text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                pkg.highlight
                  ? "border-primary/40 shadow-[0_0_40px_hsl(var(--gold)/0.15)]"
                  : ""
              }`}
            >
              {pkg.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-dark via-primary to-gold-light" />
              )}

              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-space">{pkg.houses}</span>
              </div>

              <h3 className="font-cinzel text-xl font-bold text-foreground mb-2 uppercase tracking-wider">
                {pkg.name}
              </h3>

              <p className="text-muted-foreground text-xs font-light mb-6 min-h-[2.5rem]">
                {pkg.description}
              </p>

              <div className="mb-6">
                <span className="text-muted-foreground text-xs">R$</span>
                <span className="text-foreground font-cinzel text-4xl font-bold mx-1">{pkg.price.split(",")[0]}</span>
                <span className="text-muted-foreground text-sm">,{pkg.price.split(",")[1]}</span>
              </div>

              <div className="mb-6 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                {pkg.credits} crédito{pkg.credits > 1 ? "s" : ""}
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${
                  pkg.highlight
                    ? "bg-primary text-background hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)]"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Comprar
              </button>
            </motion.div>
          ))}
        </div>

        {/* Unlock Pricing Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-6 text-center">
            Quanto Custa Cada Desbloqueio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {UNLOCK_TABLE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-5 rounded-xl border border-primary/15 bg-card/40 backdrop-blur-sm text-center">
                  <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-cinzel text-sm font-bold text-foreground mb-1">{item.label}</p>
                  <p className="text-primary font-bold text-lg">{item.credits} crédito{item.credits > 1 ? "s" : ""}</p>
                  <p className="text-muted-foreground text-[10px] mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* How credits work */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-6">
            Como Funcionam os Créditos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Compre Créditos", desc: "Escolha o pacote ideal para sua jornada" },
              { step: "2", title: "Calcule a Rota", desc: "Preencha seus dados e receba o mapa estelar" },
              { step: "3", title: "Desbloqueie Casas", desc: "Use créditos para ver mais destinos e rotas" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-cinzel font-bold">{item.step}</span>
                </div>
                <p className="text-foreground text-sm font-medium mb-1">{item.title}</p>
                <p className="text-muted-foreground text-xs font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Credits;
