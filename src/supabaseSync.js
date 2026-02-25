import { supabase } from './supabase'
import useStore from './store/useStore'

export async function startSupabaseSync() {
  const set = useStore.setState

  // 初始加载所有数据
  const [config, children, tasks, rewards, redemptions] = await Promise.all([
    supabase.from('config').select('*'),
    supabase.from('children').select('*'),
    supabase.from('tasks').select('*'),
    supabase.from('rewards').select('*'),
    supabase.from('redemptions').select('*'),
  ])

  const pin = config.data?.find((r) => r.key === 'pin')?.value ?? null
  set({
    pin,
    children: children.data || [],
    tasks: (tasks.data || []).map((t) => ({
      ...t,
      assignedTo: t.assigned_to,
      dueDate: t.due_date,
      createdAt: t.created_at,
    })),
    rewards: rewards.data || [],
    redemptions: (redemptions.data || []).map((r) => ({
      ...r,
      rewardId: r.reward_id,
      childId: r.child_id,
      redeemedAt: r.redeemed_at,
    })),
  })

  // 实时监听
  supabase.channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'config' }, async () => {
      const { data } = await supabase.from('config').select('*')
      const pin = data?.find((r) => r.key === 'pin')?.value ?? null
      set({ pin })
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'children' }, async () => {
      const { data } = await supabase.from('children').select('*')
      set({ children: data || [] })
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, async () => {
      const { data } = await supabase.from('tasks').select('*')
      set({ tasks: (data || []).map((t) => ({ ...t, assignedTo: t.assigned_to, dueDate: t.due_date, createdAt: t.created_at })) })
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rewards' }, async () => {
      const { data } = await supabase.from('rewards').select('*')
      set({ rewards: data || [] })
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'redemptions' }, async () => {
      const { data } = await supabase.from('redemptions').select('*')
      set({ redemptions: (data || []).map((r) => ({ ...r, rewardId: r.reward_id, childId: r.child_id, redeemedAt: r.redeemed_at })) })
    })
    .subscribe()
}
