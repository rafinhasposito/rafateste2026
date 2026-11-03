import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const consultation_id = "7b580e08-b6e0-4c52-9437-ee8e80c4fc0a";
  const { data, error } = await supabase.from('consultations').select('result').eq('id', consultation_id).single();
  
  if (error) {
    console.error(error);
    return;
  }
  
  let result_str = JSON.stringify(data.result);
  result_str = result_str.replace(/Mumbai/g, "Nova Délhi");
  
  const { error: updateErr } = await supabase.from('consultations').update({ result: JSON.parse(result_str) }).eq('id', consultation_id);
  if (updateErr) {
    console.error("Update failed (RLS probably blocked it):", updateErr);
  } else {
    console.log("Database updated via Node!");
  }
}
run();
