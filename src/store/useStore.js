import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      pin: null,
      children: [],
      tasks: [],
      rewards: [],
      redemptions: [],

      // PIN
      setPin: (pin) => set({ pin }),
      verifyPin: (pin) => get().pin === pin,

      // Children
      addChild: (child) =>
        set((s) => ({ children: [...s.children, { ...child, id: crypto.randomUUID(), points: 0 }] })),
      updateChild: (id, data) =>
        set((s) => ({ children: s.children.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      removeChild: (id) =>
        set((s) => ({ children: s.children.filter((c) => c.id !== id) })),

      // Tasks
      addTask: (task) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { ...task, id: crypto.randomUUID(), status: 'pending', createdAt: new Date().toISOString() },
          ],
        })),
      updateTask: (id, data) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      markTaskDone: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: 'done' } : t)) })),
      approveTask: (id) =>
        set((s) => {
          const task = s.tasks.find((t) => t.id === id)
          if (!task) return {}
          return {
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: 'approved' } : t)),
            children: s.children.map((c) =>
              c.id === task.assignedTo ? { ...c, points: c.points + task.points } : c
            ),
          }
        }),
      rejectTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: 'rejected' } : t)) })),

      // Rewards
      addReward: (reward) =>
        set((s) => ({
          rewards: [...s.rewards, { ...reward, id: crypto.randomUUID(), available: true }],
        })),
      updateReward: (id, data) =>
        set((s) => ({ rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...data } : r)) })),
      deleteReward: (id) =>
        set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),

      // Redemptions
      redeemReward: (rewardId, childId) =>
        set((s) => {
          const reward = s.rewards.find((r) => r.id === rewardId)
          const child = s.children.find((c) => c.id === childId)
          if (!reward || !child || child.points < reward.cost) return {}
          return {
            redemptions: [
              ...s.redemptions,
              { id: crypto.randomUUID(), rewardId, childId, redeemedAt: new Date().toISOString(), status: 'pending' },
            ],
            children: s.children.map((c) =>
              c.id === childId ? { ...c, points: c.points - reward.cost } : c
            ),
          }
        }),
      fulfillRedemption: (id) =>
        set((s) => ({
          redemptions: s.redemptions.map((r) => (r.id === id ? { ...r, status: 'fulfilled' } : r)),
        })),
    }),
    { name: 'family-tasks-store' }
  )
)

export default useStore
