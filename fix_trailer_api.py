import re

file_path = "src/pages/HouseTrailerApp.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add imports
imports = """import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/lib/astro";
import { chargeConsultation } from "@/lib/credits";
import { saveConsultation } from "@/lib/consultations";
import { cityDatabase } from "@/data/houses";
import { toast } from "sonner";"""

content = re.sub(r'import \{ useSearchParams, useNavigate \} from "react-router-dom";', imports, content)

# Add loading state inside component
loading_state = """  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, profile, refreshProfile, isAdmin } = useAuth();"""

content = re.sub(r'const \[searchParams\] = useSearchParams\(\);', loading_state, content)

# Add the API handler function
handler = """  const handleRevelarCidades = async () => {
    const id = searchParams.get('id');
    if (id) {
      navigate(`/dashboard?id=${id}`);
      return;
    }

    // Fluxo Real de Geração de Mapa a partir do Trailer
    const target = currentHouse;
    const name = sessionStorage.getItem('ps_natal_name');
    const birthdate = sessionStorage.getItem('ps_natal_date');
    const birthtime = sessionStorage.getItem('ps_natal_time');
    const birthPlace = sessionStorage.getItem('ps_natal_place');
    const yearStr = sessionStorage.getItem('ps_natal_year');
    const mode = sessionStorage.getItem('ps_natal_mode') || searchParams.get('mode') || 'futuro';

    if (!target) return;

    if (!name || !birthdate || !birthtime || !birthPlace) {
      // Fallback para caso não tenha dados (sandbox/direto)
      navigate('/dashboard');
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado para gerar o mapa.");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      const houseData0 = cityDatabase[target];
      const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();
      const description = `Consulta por Intenção — Casa ${target} (${houseData0?.label ?? ""}) em ${year}`;

      const charge = await chargeConsultation({
        userId: user.id,
        currentCredits: profile?.credits ?? 0,
        isAdmin,
        description,
      });

      if (!charge.ok) {
        if (charge.reason === "no_credits") {
          toast.error("Você não possui créditos suficientes. Adquira mais na loja.");
          navigate("/credits");
        } else {
          toast.error("Erro ao debitar créditos.");
        }
        setIsProcessing(false);
        return;
      }
      
      await refreshProfile();
      if (!isAdmin) toast.success("Consulta iniciada. Calculando astrologia...");

      const [ano, mes, dia] = birthdate.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const response = await fetch(`${API_URL}/find_all_cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          place_of_birth: birthPlace.trim(),
          dob: dataFormatada,
          time: birthtime,
          target_year: year,
          alvoId: target,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na consulta astronômica.");

      const allResults: Record<string, any> = {};
      if (data.results) {
        for (const [key, val] of Object.entries(data.results)) {
          allResults[key] = val;
        }
      }

      // O DEVER DO SISTEMA É ENTREGAR O QUE O USUÁRIO PEDIU:
      // O Intuito (Foco) será o Foco natural da casa escolhida
      const houseIntent = houseData0?.intent || "";

      const consultationId = await saveConsultation({
        userId: user.id,
        name: name.trim(),
        birthdate,
        birthtime,
        birth_place: birthPlace.trim(),
        year,
        mode,
        goal: target,
        intent: houseIntent,
        result: { results: allResults, house: target },
      });

      if (consultationId) {
        navigate("/dashboard?id=" + consultationId);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error("Falha na consulta: " + err.message);
      setIsProcessing(false);
    }
  };"""

# Insert handler before return
content = content.replace('  return (', handler + '\n  return (')

# Replace button
old_button = """                  <button 
                    onClick={() => { const id = searchParams.get('id'); if (id) { navigate(`/dashboard?id=${id}`); } else { navigate('/dashboard'); } }}
                    className="w-full md:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-white"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 40px ${color}60`,
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Revelar Cidades
                  </button>"""
                  
new_button = """                  <button 
                    onClick={handleRevelarCidades}
                    disabled={isProcessing}
                    className="w-full md:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-white"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 40px ${color}60`,
                    }}
                  >
                    <Globe className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    {isProcessing ? 'Calculando...' : 'Revelar Cidades'}
                  </button>"""

content = content.replace(old_button, new_button)

with open(file_path, "w") as f:
    f.write(content)

print("Trailer patched")
