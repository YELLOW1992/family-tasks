import { create } from 'zustand'
import { supabase } from '../supabase'

const today = () => new Date().toISOString().slice(0, 10)

function mapTask(t) {
  return {
    ...t,
    assignedTo: t.assigned_to,
    dueDate: t.due_date,
    createdAt: t.created_at,
    repeat: t.repeat || 'none',
    last_submitted_date: t.last_submitted_date || null,
    requirePhoto: t.require_photo || false,
    photo: t.photo || null,
    isPenalty: t.is_penalty || false,
  }
}

function mapRedemption(r) {
  return {
    ...r,
    rewardId: r.reward_id,
    childId: r.child_id,
    redeemedAt: r.redeemed_at,
  }
}

async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*')
  return (data || []).map(mapTask)
}

async function fetchChildren() {
  const { data } = await supabase.from('children').select('*')
  return data || []
}

async function fetchRewards() {
  const { data } = await supabase.from('rewards').select('*')
  return data || []
}

async function fetchRedemptions() {
  const { data } = await supabase.from('redemptions').select('*')
  return (data || []).map(mapRedemption)
}

async function fetchPointHistory() {
  const { data } = await supabase.from('point_history').select('*').order('created_at', { ascending: false })
  return data || []
}

async function fetchPetItems() {
  const { data } = await supabase.from('pet_items').select('*')
  return data || []
}

async function fetchPetRedemptions() {
  const { data } = await supabase.from('pet_redemptions').select('*')
  return data || []
}

async function fetchPetSchedule() {
  const { data } = await supabase.from('config').select('*').eq('key', 'pet_schedule')
  if (data && data.length > 0) return JSON.parse(data[0].value)
  return null
}

async function fetchPetSpecies() {
  const { data } = await supabase.from('pet_species').select('*')
  return data || []
}

async function fetchOwnedPets() {
  const { data } = await supabase.from('owned_pets').select('*')
  return data || []
}

const useStore = create((set, get) => ({
  pin: null,
  children: [],
  tasks: [],
  rewards: [],
  redemptions: [],
  pointHistory: [],
  petItems: [],
  petRedemptions: [],
  petSchedule: null,
  petSpecies: [],
  ownedPets: [],

  setPin: async (pin) => {
    await supabase.from('config').upsert({ key: 'pin', value: pin })
    set({ pin })
  },
  verifyPin: (input) => get().pin === input,

  addChild: async (child) => {
    await supabase.from('children').insert({ ...child, points: 0 })
    set({ children: await fetchChildren() })
  },
  updateChild: async (id, updates) => {
    await supabase.from('children').update(updates).eq('id', id)
    set({ children: await fetchChildren() })
  },
  removeChild: async (id) => {
    // 删除孩子的所有任务
    await supabase.from('tasks').delete().eq('assigned_to', id)
    // 删除孩子
    await supabase.from('children').delete().eq('id', id)
    set({ children: await fetchChildren(), tasks: await fetchTasks() })
  },

  addTask: async (task) => {
    const { error } = await supabase.from('tasks').insert({
      title: task.title,
      description: task.description,
      points: task.points,
      assigned_to: task.assignedTo,
      due_date: task.dueDate,
      status: 'pending',
      repeat: task.repeat || 'none',
      last_submitted_date: null,
      require_photo: task.requirePhoto || false,
      photo: null,
      is_penalty: task.isPenalty || false,
    })
    if (error) throw new Error(error.message)
    set({ tasks: await fetchTasks() })
  },
  updateTask: async (id, data) => {
    const mapped = {}
    if (data.title !== undefined) mapped.title = data.title
    if (data.description !== undefined) mapped.description = data.description
    if (data.points !== undefined) mapped.points = data.points
    if (data.assignedTo !== undefined) mapped.assigned_to = data.assignedTo
    if (data.dueDate !== undefined) mapped.due_date = data.dueDate
    if (data.status !== undefined) mapped.status = data.status
    if (data.repeat !== undefined) mapped.repeat = data.repeat
    if (data.last_submitted_date !== undefined) mapped.last_submitted_date = data.last_submitted_date
    if (data.requirePhoto !== undefined) mapped.require_photo = data.requirePhoto
    if (data.photo !== undefined) mapped.photo = data.photo
    if (data.isPenalty !== undefined) mapped.is_penalty = data.isPenalty
    await supabase.from('tasks').update(mapped).eq('id', id)
    set({ tasks: await fetchTasks() })
  },
  deleteTask: async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    set({ tasks: await fetchTasks() })
  },
  markTaskDone: async (id, photo = null) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const updates = { status: 'done', photo }
    if (task.repeat === 'daily') updates.last_submitted_date = today()
    await supabase.from('tasks').update(updates).eq('id', id)
    set({ tasks: await fetchTasks() })
  },
  approveTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const child = get().children.find((c) => c.id === task.assignedTo)
    if (!child) return
    const newStatus = task.repeat === 'daily' ? 'pending' : 'approved'
    const newPoints = (child.points || 0) + task.points
    await supabase.from('tasks').update({ status: newStatus, photo: null }).eq('id', id)
    await supabase.from('children').update({ points: newPoints }).eq('id', child.id)
    await supabase.from('point_history').insert({
      child_id: child.id,
      date: today(),
      points: task.points,
      reason: task.title,
      type: 'task',
    })
    set({ tasks: await fetchTasks(), children: await fetchChildren(), pointHistory: await fetchPointHistory() })
  },
  rejectTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.repeat === 'daily' ? 'pending' : 'rejected'
    await supabase.from('tasks').update({ status: newStatus, photo: null }).eq('id', id)
    set({ tasks: await fetchTasks() })
  },
  checkDailyTasks: async () => {
    const tasks = get().tasks
    const t = today()
    const expired = tasks.filter(
      (task) => task.repeat === 'daily' && task.status === 'done' && task.last_submitted_date !== t
    )
    for (const task of expired) {
      await supabase.from('tasks').update({ status: 'pending', last_submitted_date: null, photo: null }).eq('id', task.id)
    }
    if (expired.length > 0) {
      set({ tasks: await fetchTasks() })
    }
  },

  addReward: async (reward) => {
    await supabase.from('rewards').insert({ ...reward, available: true })
    set({ rewards: await fetchRewards() })
  },
  updateReward: async (id, data) => {
    await supabase.from('rewards').update(data).eq('id', id)
    set({ rewards: await fetchRewards() })
  },
  deleteReward: async (id) => {
    await supabase.from('rewards').delete().eq('id', id)
    set({ rewards: await fetchRewards() })
  },

  deductPoints: async (childId, amount, reason = '') => {
    const child = get().children.find((c) => c.id === childId)
    if (!child) return
    const newPoints = Math.max(0, (child.points || 0) - amount)
    await supabase.from('children').update({ points: newPoints }).eq('id', childId)
    await supabase.from('point_history').insert({
      child_id: childId,
      date: today(),
      points: -amount,
      reason: reason || '家长扣分',
      type: 'deduct',
    })
    set({ children: await fetchChildren(), pointHistory: await fetchPointHistory() })
  },

  executePenalty: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId)
    if (!task || !task.isPenalty) return
    const child = get().children.find((c) => c.id === task.assignedTo)
    if (!child) return
    const newPoints = Math.max(0, (child.points || 0) - task.points)
    await supabase.from('children').update({ points: newPoints }).eq('id', child.id)
    await supabase.from('point_history').insert({
      child_id: child.id,
      date: today(),
      points: -task.points,
      reason: task.title,
      type: 'penalty',
    })
    set({ children: await fetchChildren(), pointHistory: await fetchPointHistory() })
  },

  redeemReward: async (rewardId, childId) => {
    const reward = get().rewards.find((r) => r.id === rewardId)
    const child = get().children.find((c) => c.id === childId)
    if (!reward || !child) return
    if (!reward.available || child.points < reward.cost) return

    // Check redemption limit
    if (reward.max_redemptions !== null && reward.max_redemptions !== undefined) {
      const redemptionCount = get().redemptions.filter((rd) => rd.rewardId === rewardId).length
      if (redemptionCount >= reward.max_redemptions) return
    }

    await supabase.from('redemptions').insert({ reward_id: rewardId, child_id: childId, status: 'pending' })
    await supabase.from('children').update({ points: child.points - reward.cost }).eq('id', childId)
    await supabase.from('point_history').insert({
      child_id: childId,
      date: today(),
      points: -reward.cost,
      reason: reward.name,
      type: 'reward',
    })
    set({ children: await fetchChildren(), redemptions: await fetchRedemptions(), pointHistory: await fetchPointHistory() })
  },
  fulfillRedemption: async (id) => {
    await supabase.from('redemptions').update({ status: 'fulfilled' }).eq('id', id)
    set({ redemptions: await fetchRedemptions() })
  },

  // 宠物商店
  addPetItem: async (item) => {
    await supabase.from('pet_items').insert({
      name: item.name,
      description: item.description || '',
      icon: item.icon || '🎁',
      cost: item.cost,
      available: true,
    })
    set({ petItems: await fetchPetItems() })
  },
  updatePetItem: async (id, updates) => {
    await supabase.from('pet_items').update(updates).eq('id', id)
    set({ petItems: await fetchPetItems() })
  },
  removePetItem: async (id) => {
    await supabase.from('pet_items').delete().eq('id', id)
    set({ petItems: await fetchPetItems() })
  },
  redeemPetItem: async (itemId, childId) => {
    const item = get().petItems.find((i) => i.id === itemId)
    const child = get().children.find((c) => c.id === childId)
    if (!item || !child || child.points < item.cost) return
    await supabase.from('pet_redemptions').insert({ item_id: itemId, child_id: childId })
    await supabase.from('children').update({ points: child.points - item.cost }).eq('id', childId)
    await supabase.from('point_history').insert({
      child_id: childId,
      date: today(),
      points: -item.cost,
      reason: '宠物用品：' + item.name,
      type: 'reward',
    })
    set({ children: await fetchChildren(), petRedemptions: await fetchPetRedemptions(), pointHistory: await fetchPointHistory() })
  },
  setPetSchedule: async (schedule) => {
    const value = JSON.stringify(schedule)
    await supabase.from('config').upsert({ key: 'pet_schedule', value })
    set({ petSchedule: schedule })
  },
  loadPetData: async () => {
    const [petItems, petRedemptions, petSchedule, petSpecies, ownedPets] = await Promise.all([
      fetchPetItems(),
      fetchPetRedemptions(),
      fetchPetSchedule(),
      fetchPetSpecies(),
      fetchOwnedPets(),
    ])
    set({ petItems, petRedemptions, petSchedule, petSpecies, ownedPets })
  },

  // 宠物种类管理（家长）
  addPetSpecies: async (species) => {
    await supabase.from('pet_species').insert({
      name: species.name,
      icon: species.icon || '🐱',
      description: species.description || '',
      cost: species.cost,
      available: true,
    })
    set({ petSpecies: await fetchPetSpecies() })
  },
  updatePetSpecies: async (id, updates) => {
    await supabase.from('pet_species').update(updates).eq('id', id)
    set({ petSpecies: await fetchPetSpecies() })
  },
  removePetSpecies: async (id) => {
    await supabase.from('pet_species').delete().eq('id', id)
    set({ petSpecies: await fetchPetSpecies() })
  },

  // 购买宠物（孩子）
  buyPet: async (speciesId, childId, petName) => {
    const species = get().petSpecies.find((s) => s.id === speciesId)
    const child = get().children.find((c) => c.id === childId)
    if (!species || !child || child.points < species.cost) return
    const now = new Date().toISOString()
    await supabase.from('owned_pets').insert({
      species_id: speciesId,
      child_id: childId,
      name: petName,
      level: 1,
      exp: 0,
      hunger: 80,
      thirst: 80,
      cleanliness: 80,
      happiness: 80,
      health: 100,
      last_fed: now,
      last_watered: now,
      last_bathed: now,
      last_played: now,
    })
    await supabase.from('children').update({ points: child.points - species.cost }).eq('id', childId)
    await supabase.from('point_history').insert({
      child_id: childId,
      date: today(),
      points: -species.cost,
      reason: '购买宠物：' + petName,
      type: 'reward',
    })
    set({ children: await fetchChildren(), ownedPets: await fetchOwnedPets(), pointHistory: await fetchPointHistory() })
  },

  // 宠物护理操作（孩子）
  petCare: async (petId, action, childId, cost) => {
    const child = get().children.find((c) => c.id === childId)
    if (!child || child.points < cost) return
    const now = new Date().toISOString()
    const statMap = {
      feed:  { hunger: 95, last_fed: now },
      water: { thirst: 95, last_watered: now },
      bath:  { cleanliness: 95, last_bathed: now },
      play:  { happiness: 95, last_played: now },
    }
    const updates = statMap[action]
    if (!updates) return
    // add exp
    const pet = get().ownedPets.find((p) => p.id === petId)
    if (!pet) return
    const newExp = (pet.exp || 0) + 10
    const newLevel = Math.floor(newExp / 100) + 1
    await supabase.from('owned_pets').update({ ...updates, exp: newExp, level: newLevel }).eq('id', petId)
    if (cost > 0) {
      await supabase.from('children').update({ points: child.points - cost }).eq('id', childId)
      await supabase.from('point_history').insert({
        child_id: childId,
        date: today(),
        points: -cost,
        reason: { feed: '喂食宠物', water: '给宠物喝水', bath: '给宠物洗澡', play: '陪宠物玩耍' }[action],
        type: 'reward',
      })
    }
    set({ ownedPets: await fetchOwnedPets(), children: await fetchChildren(), pointHistory: await fetchPointHistory() })
  },

  // 使用宠物用品
  usePetItem: async (petId, itemRedemptionId, childId) => {
    const pet = get().ownedPets.find((p) => p.id === petId)
    const item = get().petRedemptions.find((r) => r.id === itemRedemptionId)
    if (!pet || !item || item.used) return
    await supabase.from('owned_pets').update({
      hunger: Math.min(100, (pet.hunger || 0) + 20),
      happiness: Math.min(100, (pet.happiness || 0) + 20),
      exp: (pet.exp || 0) + 20,
    }).eq('id', petId)
    await supabase.from('pet_redemptions').update({ used: true }).eq('id', itemRedemptionId)
    set({ ownedPets: await fetchOwnedPets(), petRedemptions: await fetchPetRedemptions() })
  },
}))

export default useStore
