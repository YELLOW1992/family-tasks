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
  }
}

const useStore = create((set, get) => ({
  pin: null,
  children: [],
  tasks: [],
  rewards: [],
  redemptions: [],

  setPin: async (pin) => {
    await supabase.from('config').upsert({ key: 'pin', value: pin })
    set({ pin })
  },
  verifyPin: (input) => get().pin === input,

  addChild: async (child) => {
    const { data } = await supabase.from('children').insert({ ...child, points: 0 }).select()
    if (data?.[0]) set((s) => ({ children: [...s.children, data[0]] }))
  },
  updateChild: async (id, updates) => {
    await supabase.from('children').update(updates).eq('id', id)
    set((s) => ({ children: s.children.map((c) => (c.id === id ? { ...c, ...updates } : c)) }))
  },
  removeChild: async (id) => {
    await supabase.from('children').delete().eq('id', id)
    set((s) => ({ children: s.children.filter((c) => c.id !== id) }))
  },

  addTask: async (task) => {
    const { data } = await supabase.from('tasks').insert({
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
    }).select()
    if (data?.[0]) set((s) => ({ tasks: [...s.tasks, mapTask(data[0])] }))
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
    await supabase.from('tasks').update(mapped).eq('id', id)
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) }))
  },
  deleteTask: async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },
  markTaskDone: async (id, photo = null) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const updates = { status: 'done', photo }
    if (task.repeat === 'daily') updates.last_submitted_date = today()
    await supabase.from('tasks').update(updates).eq('id', id)
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) }))
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
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: newStatus, photo: null } : t)),
      children: s.children.map((c) => (c.id === child.id ? { ...c, points: newPoints } : c)),
    }))
  },
  rejectTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.repeat === 'daily' ? 'pending' : 'rejected'
    await supabase.from('tasks').update({ status: newStatus, photo: null }).eq('id', id)
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: newStatus, photo: null } : t)) }))
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
      set((s) => ({
        tasks: s.tasks.map((t) =>
          expired.find((e) => e.id === t.id)
            ? { ...t, status: 'pending', last_submitted_date: null, photo: null }
            : t
        ),
      }))
    }
  },

  addReward: async (reward) => {
    const { data } = await supabase.from('rewards').insert({ ...reward, available: true }).select()
    if (data?.[0]) set((s) => ({ rewards: [...s.rewards, data[0]] }))
  },
  updateReward: async (id, data) => {
    await supabase.from('rewards').update(data).eq('id', id)
    set((s) => ({ rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...data } : r)) }))
  },
  deleteReward: async (id) => {
    await supabase.from('rewards').delete().eq('id', id)
    set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) }))
  },

  redeemReward: async (rewardId, childId) => {
    const reward = get().rewards.find((r) => r.id === rewardId)
    const child = get().children.find((c) => c.id === childId)
    if (!reward || !child) return
    if (!reward.available || child.points < reward.cost) return
    const { data } = await supabase.from('redemptions').insert({ reward_id: rewardId, child_id: childId, status: 'pending' }).select()
    const newPoints = child.points - reward.cost
    await supabase.from('children').update({ points: newPoints }).eq('id', childId)
    set((s) => ({
      children: s.children.map((c) => (c.id === childId ? { ...c, points: newPoints } : c)),
      redemptions: data?.[0]
        ? [...s.redemptions, { ...data[0], rewardId: data[0].reward_id, childId: data[0].child_id, redeemedAt: data[0].redeemed_at }]
        : s.redemptions,
    }))
  },
  fulfillRedemption: async (id) => {
    await supabase.from('redemptions').update({ status: 'fulfilled' }).eq('id', id)
    set((s) => ({ redemptions: s.redemptions.map((r) => (r.id === id ? { ...r, status: 'fulfilled' } : r)) }))
  },
}))

export default useStore
