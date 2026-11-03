const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL="(.*?)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);
const supabase = createClient(urlMatch[1], keyMatch[1]);
async function run() {
  const { data, error } = await supabase.from('consultations').select('*').eq('id', '551710e2-429e-4cba-b1f5-ffd16d1370de').single();
  console.log("Data:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}
run();
