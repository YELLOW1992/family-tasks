import { useState } from 'react'
import TaskManager from './TaskManager'
import ApprovalQueue from './ApprovalQueue'
import RewardManager from './RewardManager'
import ChildProfiles from './ChildProfiles'
import useStore from '../../store/useStore'
import { refreshData } from '../../supabaseSync'

const TABS = [
  { id: 'tasks', label: '任务', icon: '📋' },
  { id: 'approvals', label: '待审批', icon: '✅' },
  { id: 'rewards', label: '奖励', icon: '🎁' },
  { id: 'children', label: '孩子', icon: '👧' },
]

function ChangePinModal({ onClose }) {
  const { verifyPin, setPin } = useStore()
  const [step, setStep] = useState('old') // 'old' | 'new' | 'confirm'
  const [input, setInput] = useState('')
  const [newPin, setNewPin] = useState('')
  const [error, setError] = useState('')

  const handleDigit = (d) => { if (input.length < 4) setInput((p) => p + d) }
  const handleDelete = () => setInput((p) => p.slice(0, -1))

  const handleSubmit = () => {
    if (input.length < 4) return
    if (step === 'old') {
      if (verifyPin(input)) { setStep('new'); setInput(''); setError('') }
      else { setError('旧PIN码错误'); setInput('') }
    } else if (step === 'new') {
      setNewPin(input); setStep('confirm'); setInput(''); setError('')
    } else {
      if (input === newPin) { setPin(input); onClose() }
      else { setError('两次输入不一致'); setInput(''); setStep('new'); setNewPin('') }
    }
  }

  const titles = { old: '输入旧PIN码', new: '输入新PIN码', confirm: '确认新PIN码' }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
        <h3 className="text-2xl font-bold text-center text-indigo-700 mb-6">{titles[step]}</h3>
        <div className="flex justify-center gap-4 mb-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 transition-all ${i < input.length ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`} />
          ))}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1,2,3,4,5,6,7,8,9].map((d) => (
            <button key={d} onClick={() => handleDigit(String(d))} className="bg-indigo-100 text-indigo-800 text-2xl font-bold py-4 rounded-2xl active:bg-indigo-200">{d}</button>
          ))}
          <button onClick={onClose} className="bg-gray-100 text-gray-500 text-lg font-semibold py-4 rounded-2xl active:bg-gray-200">取消</button>
          <button onClick={() => handleDigit('0')} className="bg-indigo-100 text-indigo-800 text-2xl font-bold py-4 rounded-2xl active:bg-indigo-200">0</button>
          <button onClick={handleDelete} className="bg-gray-100 text-gray-600 text-2xl py-4 rounded-2xl active:bg-gray-200">⌫</button>
        </div>
        <button onClick={handleSubmit} disabled={input.length < 4} className="w-full bg-indigo-600 text-white text-xl font-bold py-4 rounded-2xl disabled:opacity-40 active:bg-indigo-700">
          {step === 'confirm' ? '确认修改' : '下一步'}
        </button>
      </div>
    </div>
  )
}

export default function ParentDashboard({ onExit }) {
  const [tab, setTab] = useState('tasks')
  const [refreshing, setRefreshing] = useState(false)
  const [showChangePin, setShowChangePin] = useState(false)
  const tasks = useStore((s) => s.tasks)
  const pendingCount = tasks.filter((t) => t.status === 'done').length

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-indigo-600 text-white px-6 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">家长控制台</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowChangePin(true)} className="bg-white/20 px-4 py-2 rounded-xl font-semibold active:bg-white/30">
            🔑 改PIN
          </button>
          <button onClick={handleRefresh} disabled={refreshing} className="bg-white/20 px-4 py-2 rounded-xl font-semibold active:bg-white/30 disabled:opacity-50">
            {refreshing ? '刷新中...' : '🔄 刷新'}
          </button>
          <button onClick={onExit} className="bg-white/20 px-4 py-2 rounded-xl font-semibold active:bg-white/30">
            退出
          </button>
        </div>
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

      {showChangePin && <ChangePinModal onClose={() => setShowChangePin(false)} />}
    </div>
  )
}
