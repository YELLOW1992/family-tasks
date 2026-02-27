import { create } from 'zustand'
import { supabase } from '../supabase'

const today = () => new Date().toISOString().slice(0, 10)

const useStore = create((set, get) => ({
  pin: null,
  children: [],
  tasks: [],
  rewards: [],
  redemptions: [],

  // PIN
  setPin: async (pin) => {
    await supabase.from('config').upsert({ key: 'pin', value: pin })
  },
  verifyPin: (input) => get().pin === input,

  // Children
  addChild: async (child) => {
    await supabase.from('children').insert({ ...child, points: 0 })
  },
  updateChild: async (id, data) => {
    await supabase.from('children').update(data).eq('id', id)
  },
  removeChild: async (id) => {
    await supabase.from('children').delete().eq('id', id)
  },

  // Tasks
  addTask: async (task) => {
    await supabase.from('tasks').insert({
      title: task.title,
      description: task.description,
      points: task.points,
      assigned_to: task.assignedTo,
      due_date: task.dueDate,
      status: 'pending',
      repeat: task.repeat || 'none',
      last_submitted_date: null,
    })
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
    await supabase.from('tasks').update(mapped).eq('id', id)
  },
  deleteTask: async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
  },
  markTaskDone: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const updates = { status: 'done' }
    if (task.repeat === 'daily') updates.last_submitted_date = today()
    await supabase.from('tasks').update(updates).eq('id', id)
  },
  approveTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const child = get().children.find((c) => c.id === task.assignedTo)
    if (!child) return
    const newStatus = task.repeat === 'daily' ? 'pending' : 'approved'
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
    await supabase.from('children').update({ points: (child.points || 0) + task.points }).eq('id', child.id)
  },
  rejectTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.repeat === 'daily' ? 'pending' : 'rejected'
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
  },
  checkDailyTasks: async () => {
    const tasks = get().tasks
    const t = today()
    const expired = tasks.filter(
      (task) => task.repeat === 'daily' && task.status === 'done' && task.last_submitted_date !== t
    )
    for (const task of expired) {
      await supabase.from('tasks').update({ status: 'pending', last_submitted_date: null }).eq('id', task.id)
    }
  },

  // Rewards
  addReward: async (reward) => {
    await supabase.from('rewards').insert({ ...reward, available: true })
  },
  updateReward: async (id, data) => {
    await supabase.from('rewards').update(data).eq('id', id)
  },
  deleteReward: async (id) => {
    await supabase.from('rewards').delete().eq('id', id)
  },

  // Redemptions
  redeemReward: async (rewardId, childId) => {
    const reward = get().rewards.find((r) => r.id === rewardId)
    const child = get().children.find((c) => c.id === childId)
    if (!reward || !child) return
    if (!reward.available || child.points < reward.cost) return
    await supabase.from('redemptions').insert({
      reward_id: rewardId,
      child_id: childId,
      status: 'pending',
    })
    await supabase.from('children').update({ points: child.points - reward.cost }).eq('id', childId)
  },
  fulfillRedemption: async (id) => {
    await supabase.from('redemptions').update({ status: 'fulfilled' }).eq('id', id)
  },
}))

export default useStore
