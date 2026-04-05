-- 宝可梦模块完整数据库初始化脚本
-- 创建所有必要的表和列

-- 1. 创建 pet_species 表（宝可梦种类）
CREATE TABLE IF NOT EXISTS pet_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  cost INTEGER NOT NULL DEFAULT 100,
  type1 TEXT,
  type2 TEXT,
  evolves_from_species_id UUID REFERENCES pet_species(id),
  evolution_level INTEGER,
  evolution_item_id UUID,
  evolution_method TEXT,
  pokedex_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 owned_pets 表（玩家拥有的宝可梦）
CREATE TABLE IF NOT EXISTS owned_pets (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id),
  species_id UUID NOT NULL REFERENCES pet_species(id),
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  hunger INTEGER NOT NULL DEFAULT 100,
  thirst INTEGER NOT NULL DEFAULT 100,
  cleanliness INTEGER NOT NULL DEFAULT 100,
  happiness INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 pet_items 表（宠物物品）
CREATE TABLE IF NOT EXISTS pet_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  cost INTEGER NOT NULL DEFAULT 10,
  effect TEXT,
  effect_value INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建 pet_redemptions 表（物品购买记录）
CREATE TABLE IF NOT EXISTS pet_redemptions (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id),
  item_id UUID NOT NULL REFERENCES pet_items(id),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 添加 active_pet_id 到 children 表
ALTER TABLE children
ADD COLUMN IF NOT EXISTS active_pet_id INTEGER REFERENCES owned_pets(id);

-- 6. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_owned_pets_child_id ON owned_pets(child_id);
CREATE INDEX IF NOT EXISTS idx_owned_pets_species_id ON owned_pets(species_id);
CREATE INDEX IF NOT EXISTS idx_pet_redemptions_child_id ON pet_redemptions(child_id);
CREATE INDEX IF NOT EXISTS idx_pet_redemptions_item_id ON pet_redemptions(item_id);
CREATE INDEX IF NOT EXISTS idx_pet_species_evolves_from ON pet_species(evolves_from_species_id);

-- 7. 添加注释
COMMENT ON TABLE pet_species IS '宝可梦种类表';
COMMENT ON TABLE owned_pets IS '玩家拥有的宝可梦表';
COMMENT ON TABLE pet_items IS '宠物物品表';
COMMENT ON TABLE pet_redemptions IS '物品购买记录表';

COMMENT ON COLUMN pet_items.effect IS '物品效果类型: hunger(饱腹), thirst(口渴), cleanliness(清洁), happiness(心情), exp(经验), evolution(进化)';
COMMENT ON COLUMN pet_items.effect_value IS '物品效果数值';
COMMENT ON COLUMN pet_redemptions.used IS '物品是否已使用';
COMMENT ON COLUMN children.active_pet_id IS '当前激活的宝可梦ID';
