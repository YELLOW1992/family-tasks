import { supabase } from './supabase'
import useStore from './store/useStore'

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

async function loadAll() {
  const set = useStore.setState
  const [config, children, tasks, rewards, redemptions, pointHistory] = await Promise.all([
    supabase.from('config').select('*'),
    supabase.from('children').select('*'),
    supabase.from('tasks').select('*'),
    supabase.from('rewards').select('*'),
    supabase.from('redemptions').select('*'),
    supabase.from('point_history').select('*').order('created_at', { ascending: false }),
  ])
  const pin = config.data?.find((r) => r.key === 'pin')?.value ?? null
  set({
    pin,
    children: children.data || [],
    tasks: (tasks.data || []).map(mapTask),
    rewards: rewards.data || [],
    redemptions: (redemptions.data || []).map(mapRedemption),
    pointHistory: pointHistory.data || [],
  })
}

export async function refreshData() {
  await loadAll()
  await useStore.getState().checkDailyTasks()
}

export async function startSupabaseSync() {
  await loadAll()
  await useStore.getState().checkDailyTasks()

  const set = useStore.setState

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
      set({ tasks: (data || []).map(mapTask) })
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rewards' }, async () => {
      const { data } = await supabase.from('rewards').select('*')
      set({ rewards: data || [] })
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'redemptions' }, async () => {
      const { data } = await supabase.from('redemptions').select('*')
      set({ redemptions: (data || []).map(mapRedemption) })
    })
    .subscribe()
}
