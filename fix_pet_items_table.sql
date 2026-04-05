-- 修复 pet_items 表结构
-- 添加缺失的 effect 和 effect_value 列

-- 添加 effect 列（物品效果类型）
ALTER TABLE pet_items
ADD COLUMN IF NOT EXISTS effect TEXT;

-- 添加 effect_value 列（物品效果数值）
ALTER TABLE pet_items
ADD COLUMN IF NOT EXISTS effect_value INTEGER DEFAULT 0;

-- 添加注释
COMMENT ON COLUMN pet_items.effect IS '物品效果类型: hunger(饱腹), thirst(口渴), cleanliness(清洁), happiness(心情), exp(经验), evolution(进化)';
COMMENT ON COLUMN pet_items.effect_value IS '物品效果数值';
