import re

file_path = "src/pages/Dashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

pattern = r"    try \{\n      if \(isUnlockAll\).*?      const \{ data: refreshedConsultation, error: fetchError \} = await supabase"

new_try = '''    try {
      // The RPC 'unlock_consultation_houses' handles both single house and '0' (Visao 360) natively, 
      // AND it deducts credits automatically if the user is not an admin.
      const { error: rpcError } = await supabase.rpc("unlock_consultation_houses", {
        p_consultation_id: consultation.id,
        p_target_house: targetHouse
      });

      if (rpcError) throw rpcError;

      const { data: refreshedConsultation, error: fetchError } = await supabase'''

content = re.sub(pattern, new_try, content, flags=re.DOTALL)

with open(file_path, "w") as f:
    f.write(content)

