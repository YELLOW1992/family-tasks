import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdorkyywnldqisvskzjc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_4unN4vo4g_Wkxf2sUZlsGg_7qM343lL'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 皮卡丘进化链数据
const PIKACHU_FAMILY = [
  {
    name: '皮丘',
    icon: '⚡',
    description: '电气鼠宝可梦，皮卡丘的幼年形态',
    cost: 50,
    type1: 'electric',
    type2: null,
    evolves_from_species_id: null,
    evolution_level: null,
    evolution_item_id: null,
    evolution_method: null,
    pokedex_number: 172,
  },
  {
    name: '皮卡丘',
    icon: '⚡',
    description: '电气鼠宝可梦，最受欢迎的宝可梦之一',
    cost: 100,
    type1: 'electric',
    type2: null,
    evolves_from_species_id: 'pichu', // 将在插入后更新
    evolution_level: 10,
    evolution_item_id: null,
    evolution_method: 'level',
    pokedex_number: 25,
  },
  {
    name: '雷丘',
    icon: '⚡',
    description: '电气鼠宝可梦，皮卡丘的最终进化形态',
    cost: 200,
    type1: 'electric',
    type2: null,
    evolves_from_species_id: 'pikachu', // 将在插入后更新
    evolution_level: null,
    evolution_item_id: 'thunder_stone', // 将在插入后更新
    evolution_method: 'stone',
    pokedex_number: 26,
  },
]

// 进化石数据
const EVOLUTION_STONES = [
  {
    name: '雷之石',
    icon: '⚡',
    description: '能让某些宝可梦进化的神奇石头',
    cost: 50,
    effect: 'evolution',
    effect_value: 0,
  },
  {
    name: '火之石',
    icon: '🔥',
    description: '能让某些宝可梦进化的神奇石头',
    cost: 50,
    effect: 'evolution',
    effect_value: 0,
  },
  {
    name: '水之石',
    icon: '💧',
    description: '能让某些宝可梦进化的神奇石头',
    cost: 50,
    effect: 'evolution',
    effect_value: 0,
  },
  {
    name: '叶之石',
    icon: '🌿',
    description: '能让某些宝可梦进化的神奇石头',
    cost: 50,
    effect: 'evolution',
    effect_value: 0,
  },
  {
    name: '月之石',
    icon: '🌙',
    description: '能让某些宝可梦进化的神奇石头',
    cost: 50,
    effect: 'evolution',
    effect_value: 0,
  },
]

// 其他宠物用品
const PET_ITEMS = [
  {
    name: '高级食物',
    icon: '🍖',
    description: '美味的高级食物，宝可梦超爱吃',
    cost: 10,
    effect: 'hunger',
    effect_value: 30,
  },
  {
    name: '能量饮料',
    icon: '🥤',
    description: '补充水分和能量',
    cost: 8,
    effect: 'thirst',
    effect_value: 30,
  },
  {
    name: '清洁套装',
    icon: '🧼',
    description: '让宝可梦变得干净整洁',
    cost: 12,
    effect: 'cleanliness',
    effect_value: 30,
  },
  {
    name: '玩具球',
    icon: '⚽',
    description: '有趣的玩具，让宝可梦开心',
    cost: 15,
    effect: 'happiness',
    effect_value: 30,
  },
  {
    name: '经验糖果',
    icon: '🍬',
    description: '神奇的糖果，能增加经验值',
    cost: 20,
    effect: 'exp',
    effect_value: 50,
  },
]

async function initPikachuData() {
  console.log('🚀 开始初始化皮卡丘数据...')

  try {
    // 1. 清空现有数据（可选）
    console.log('📦 清空现有宝可梦数据...')
    await supabase.from('pet_species').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('pet_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // 2. 插入进化石
    console.log('💎 插入进化石...')
    const { data: stonesData, error: stonesError } = await supabase
      .from('pet_items')
      .insert(EVOLUTION_STONES)
      .select()

    if (stonesError) throw stonesError
    console.log(`✅ 成功插入 ${stonesData.length} 个进化石`)

    // 找到雷之石的ID
    const thunderStone = stonesData.find(s => s.name === '雷之石')

    // 3. 插入其他宠物用品
    console.log('🎁 插入宠物用品...')
    const { data: itemsData, error: itemsError } = await supabase
      .from('pet_items')
      .insert(PET_ITEMS)
      .select()

    if (itemsError) throw itemsError
    console.log(`✅ 成功插入 ${itemsData.length} 个宠物用品`)

    // 4. 插入皮丘（第一阶段）
    console.log('⚡ 插入皮丘...')
    const { data: pichuData, error: pichuError } = await supabase
      .from('pet_species')
      .insert([PIKACHU_FAMILY[0]])
      .select()
      .single()

    if (pichuError) throw pichuError
    console.log(`✅ 成功插入皮丘，ID: ${pichuData.id}`)

    // 5. 插入皮卡丘（第二阶段）
    console.log('⚡ 插入皮卡丘...')
    const pikachuData = { ...PIKACHU_FAMILY[1], evolves_from_species_id: pichuData.id }
    const { data: pikachuResult, error: pikachuError } = await supabase
      .from('pet_species')
      .insert([pikachuData])
      .select()
      .single()

    if (pikachuError) throw pikachuError
    console.log(`✅ 成功插入皮卡丘，ID: ${pikachuResult.id}`)

    // 6. 插入雷丘（第三阶段）
    console.log('⚡ 插入雷丘...')
    const raichuData = {
      ...PIKACHU_FAMILY[2],
      evolves_from_species_id: pikachuResult.id,
      evolution_item_id: thunderStone?.id || null,
    }
    const { data: raichuResult, error: raichuError } = await supabase
      .from('pet_species')
      .insert([raichuData])
      .select()
      .single()

    if (raichuError) throw raichuError
    console.log(`✅ 成功插入雷丘，ID: ${raichuResult.id}`)

    console.log('\n🎉 皮卡丘进化链初始化完成！')
    console.log('\n📊 数据摘要：')
    console.log(`  - 宝可梦种类: 3 (皮丘 → 皮卡丘 → 雷丘)`)
    console.log(`  - 进化石: ${stonesData.length}`)
    console.log(`  - 宠物用品: ${itemsData.length}`)
    console.log('\n✨ 现在可以在应用中领养皮卡丘了！')

  } catch (error) {
    console.error('❌ 初始化失败:', error)
    throw error
  }
}

// 运行初始化
initPikachuData()
  .then(() => {
    console.log('\n✅ 脚本执行完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 脚本执行失败:', error)
    process.exit(1)
  })
