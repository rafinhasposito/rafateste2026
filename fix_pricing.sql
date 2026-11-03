INSERT INTO pricing_config (key, category, label, description, credits, sort_order)
VALUES 
  ('cost_full_map', 'cost', 'Desbloquear Visão 360', 'Desbloqueia as 11 casas restantes', 7, 4),
  ('cost_focus', 'cost', 'Desbloquear Intenção', 'Aprofunda um foco específico', 1, 3),
  ('cost_all_focuses', 'cost', 'Desbloquear Todas as Intenções', 'Todos os focos de uma casa', 3, 5)
ON CONFLICT (key) DO UPDATE SET
  category = EXCLUDED.category,
  label = EXCLUDED.label,
  credits = EXCLUDED.credits;
