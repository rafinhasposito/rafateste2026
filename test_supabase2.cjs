const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/VITE_SUPABASE_URL="(.*?)"/);
const keyMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);
const supabase = createClient(urlMatch[1], keyMatch[1]);
async function run() {
  const { data, error } = await supabase.from('consultations').insert({
    user_id: 'd9f9c0dc-02d1-6a04-961e-7bd655e80fe1',
    name: 'Test',
    birthdate: '1990-01-01',
    birthtime: '12:00',
    birth_place: 'Test',
    year: 2026, // Number!
    mode: 'futuro',
    goal: 5,
    intent: 'amor',
    result: { test: true },
    houses_unlocked: 1
  }).select('id').single();
  console.log("Error:", error);
}
run();
