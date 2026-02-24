import { useState } from 'react'
import TaskManager from './TaskManager'
import ApprovalQueue from './ApprovalQueue'
import RewardManager from './RewardManager'
import ChildProfiles from './ChildProfiles'
import useStore from '../../store/useStore'

const TABS = [
  { id: 'tasks', label: '任务', icon: '📋' },
  { id: 'approvals', label: '待审批', icon: '✅' },
  { id: 'rewards', label: '奖励', icon: '🎁' },
  { id: 'children', label: '孩子', icon: '👧' },
]

export default function ParentDashboard({ onExit }) {
  const [tab, setTab] = useState('tasks')
  const tasks = useStore((s) => s.tasks)
  const pendingCount = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-indigo-600 text-white px-6 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">家长控制台</h1>
        <button onClick={onExit} className="bg-white/20 px-4 py-2 rounded-xl font-semibold active:bg-white/30">
          退出
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {tab === 'tasks' && <TaskManager />}
        {tab === 'approvals' && <ApprovalQueue />}
        {tab === 'rewards' && <RewardManager />}
        {tab === 'children' && <ChildProfiles />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors relative ${
              tab === t.id ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">{t.icon}</span>
            <span className="text-xs font-semibold">{t.label}</span>
            {t.id === 'approvals' && pendingCount > 0 && (
              <span className="absolute top-2 right-1/4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
