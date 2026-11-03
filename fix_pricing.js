import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('pricing_config')
    .upsert([
      { key: 'cost_full_map', category: 'cost', label: 'Desbloquear Visão 360', description: 'Desbloqueia as 11 casas restantes', credits: 7, sort_order: 4 },
      { key: 'cost_focus', category: 'cost', label: 'Desbloquear Intenção', description: 'Aprofunda um foco específico', credits: 1, sort_order: 3 },
      { key: 'cost_all_focuses', category: 'cost', label: 'Desbloquear Todas as Intenções', description: 'Todos os focos de uma casa', credits: 3, sort_order: 5 }
    ], { onConflict: 'key' });
    
  if (error) console.error("Error:", error);
  else console.log("Success:", data);
}
run();
