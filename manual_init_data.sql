-- 手动插入宝可梦数据（在 Supabase SQL Editor 中执行）
-- 如果 init-pikachu.js 失败，可以使用这个脚本

-- 1. 先确保表结构正确
ALTER TABLE pet_items ADD COLUMN IF NOT EXISTS effect TEXT;
ALTER TABLE pet_items ADD COLUMN IF NOT EXISTS effect_value INTEGER DEFAULT 0;
ALTER TABLE pet_items ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;
ALTER TABLE pet_species ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;

-- 2. 清空现有数据（可选）
-- DELETE FROM pet_redemptions;
-- DELETE FROM owned_pets;
-- DELETE FROM pet_items;
-- DELETE FROM pet_species;

-- 3. 插入进化石
INSERT INTO pet_items (name, icon, description, cost, effect, effect_value, available)
VALUES
  ('雷之石', '⚡', '能让某些宝可梦进化的神奇石头', 50, 'evolution', 0, true),
  ('火之石', '🔥', '能让某些宝可梦进化的神奇石头', 50, 'evolution', 0, true),
  ('水之石', '💧', '能让某些宝可梦进化的神奇石头', 50, 'evolution', 0, true),
  ('叶之石', '🌿', '能让某些宝可梦进化的神奇石头', 50, 'evolution', 0, true),
  ('月之石', '🌙', '能让某些宝可梦进化的神奇石头', 50, 'evolution', 0, true)
ON CONFLICT DO NOTHING;

-- 4. 插入宠物用品
INSERT INTO pet_items (name, icon, description, cost, effect, effect_value, available)
VALUES
  ('高级食物', '🍖', '美味的高级食物，宝可梦超爱吃', 10, 'hunger', 30, true),
  ('能量饮料', '🥤', '补充水分和能量', 8, 'thirst', 30, true),
  ('清洁套装', '🧼', '让宝可梦变得干净整洁', 12, 'cleanliness', 30, true),
  ('玩具球', '⚽', '有趣的玩具，让宝可梦开心', 15, 'happiness', 30, true),
  ('经验糖果', '🍬', '神奇的糖果，能增加经验值', 20, 'exp', 50, true)
ON CONFLICT DO NOTHING;

-- 5. 插入皮丘（第一阶段）
INSERT INTO pet_species (name, icon, description, cost, type1, type2, evolves_from_species_id, evolution_level, evolution_item_id, evolution_method, pokedex_number, available)
VALUES ('皮丘', '⚡', '电气鼠宝可梦，皮卡丘的幼年形态', 50, 'electric', NULL, NULL, NULL, NULL, NULL, 172, true)
ON CONFLICT DO NOTHING;

-- 6. 获取皮丘的ID并插入皮卡丘
DO $$
DECLARE
  pichu_id UUID;
  pikachu_id UUID;
  thunder_stone_id UUID;
BEGIN
  -- 获取皮丘ID
  SELECT id INTO pichu_id FROM pet_species WHERE name = '皮丘' LIMIT 1;

  -- 插入皮卡丘
  INSERT INTO pet_species (name, icon, description, cost, type1, type2, evolves_from_species_id, evolution_level, evolution_item_id, evolution_method, pokedex_number, available)
  VALUES ('皮卡丘', '⚡', '电气鼠宝可梦，最受欢迎的宝可梦之一', 100, 'electric', NULL, pichu_id, 10, NULL, 'level', 25, true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO pikachu_id;

  -- 获取雷之石ID
  SELECT id INTO thunder_stone_id FROM pet_items WHERE name = '雷之石' LIMIT 1;

  -- 插入雷丘
  INSERT INTO pet_species (name, icon, description, cost, type1, type2, evolves_from_species_id, evolution_level, evolution_item_id, evolution_method, pokedex_number, available)
  VALUES ('雷丘', '⚡', '电气鼠宝可梦，皮卡丘的最终进化形态', 200, 'electric', NULL, pikachu_id, NULL, thunder_stone_id, 'stone', 26, true)
  ON CONFLICT DO NOTHING;
END $$;

-- 7. 验证数据
SELECT '宝可梦种类:' as type, COUNT(*) as count FROM pet_species
UNION ALL
SELECT '物品数量:', COUNT(*) FROM pet_items;

-- 完成！
SELECT '✅ 数据初始化完成！' as status;
