import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
async function run() {
  const { data, error } = await supabase.rpc('unlock_consultation_houses', { p_consultation_id: '123', p_target_house: 0 });
  console.log(error);
}
run();
