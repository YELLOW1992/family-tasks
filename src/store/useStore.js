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

const useStore = create((set, get) => ({
  pin: null,
  children: [],
  tasks: [],
  rewards: [],
  redemptions: [],
  pointHistory: [],

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
    await supabase.from('children').delete().eq('id', id)
    set({ children: await fetchChildren() })
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
    await supabase.from('redemptions').insert({ reward_id: rewardId, child_id: childId, status: 'pending' })
    await supabase.from('children').update({ points: child.points - reward.cost }).eq('id', childId)
    set({ children: await fetchChildren(), redemptions: await fetchRedemptions() })
  },
  fulfillRedemption: async (id) => {
    await supabase.from('redemptions').update({ status: 'fulfilled' }).eq('id', id)
    set({ redemptions: await fetchRedemptions() })
  },
}))

export default useStore
