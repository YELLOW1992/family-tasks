import { useState } from 'react'
import useStore from '../../store/useStore'
import Avatar from '../common/Avatar'
import TaskList from './TaskList'
import RewardShop from './RewardShop'
import { refreshData } from '../../supabaseSync'

const TABS = [
  { id: 'tasks', label: '任务', icon: '📋' },
  { id: 'rewards', label: '奖励', icon: '🎁' },
]

export default function ChildDashboard({ child, onExit }) {
  const [tab, setTab] = useState('tasks')
  const [refreshing, setRefreshing] = useState(false)
  const currentChild = useStore((s) => s.children.find((c) => c.id === child.id))
  const points = currentChild?.points ?? child.points

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="bg-white/30 text-white px-4 py-2 rounded-xl font-semibold active:bg-white/40">
            ← 切换
          </button>
          <button onClick={handleRefresh} disabled={refreshing} className="bg-white/30 text-white px-4 py-2 rounded-xl font-semibold active:bg-white/40 disabled:opacity-50">
            {refreshing ? '刷新中...' : '🔄 刷新'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Avatar emoji={currentChild?.avatar || child.avatar} size="md" />
          <div>
            <p className="text-2xl font-bold text-white">{currentChild?.name || child.name}</p>
            <p className="text-white/90 text-3xl font-bold">⭐ {points} 积分</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {tab === 'tasks' && <TaskList childId={child.id} />}
        {tab === 'rewards' && <RewardShop childId={child.id} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
              tab === t.id ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">{t.icon}</span>
            <span className="text-xs font-semibold">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
