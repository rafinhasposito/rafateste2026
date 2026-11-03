const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL="(.*?)"/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY="(.*?)"/) || env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);
const supabase = createClient(urlMatch[1], keyMatch[1]);
async function run() {
  const { data, error } = await supabase.from('pricing_config').insert({
    key: 'cost_focus',
    category: 'cost',
    label: 'Desbloquear Foco',
    description: 'Aprofunda a leitura em um dos focos',
    credits: 1,
    sort_order: 5
  });
  console.log("Error:", error);
}
run();
