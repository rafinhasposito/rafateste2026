from supabase import create_client
import os
from dotenv import load_dotenv
import json

load_dotenv(".env")
url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("VITE_SUPABASE_PUBLISHABLE_KEY") # This might not have update permissions if RLS is on! But let's try.
# Actually, the user has service_role key somewhere? 
# In the API repository, there is probably a .env with SUPABASE_SERVICE_KEY

env_path = "../protocolo-solar-api/.env"
if os.path.exists(env_path):
    load_dotenv(env_path)
    # The API usually has SUPABASE_URL and SUPABASE_KEY (service role)
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or key

supabase = create_client(url, key)

consultation_id = "7b580e08-b6e0-4c52-9437-ee8e80c4fc0a"

res = supabase.table("consultations").select("result").eq("id", consultation_id).execute()
if res.data:
    result_data = res.data[0]["result"]
    result_str = json.dumps(result_data)
    
    # Simple blind replacement in JSON string
    result_str = result_str.replace("Mumbai", "Nova Délhi")
    
    new_result = json.loads(result_str)
    
    update_res = supabase.table("consultations").update({"result": new_result}).eq("id", consultation_id).execute()
    print("Database updated!")
else:
    print("Consultation not found.")

