import { useState, useRef } from 'react'
import useStore from '../../store/useStore'
import Avatar from '../common/Avatar'
import TaskList from './TaskList'
import RewardShop from './RewardShop'
import TaskCalendar from './TaskCalendar'
import PointLedger from './PointLedger'
import { refreshData } from '../../supabaseSync'

const AVATARS = ['🧒','👦','👧','🧑','👩','👨','🧔','👴','👵','🧕','👲','🎅','🐶','🐱','🐼','🦊','🐸','🐯','🦁','🐨','🐻','🐰','🐧','🦄']

const TABS = [
  { id: 'tasks', label: '任务', icon: '📋' },
  { id: 'rewards', label: '奖励', icon: '🎁' },
  { id: 'ledger', label: '账本', icon: '📊' },
  { id: 'calendar', label: '日历', icon: '📅' },
]

export default function ChildDashboard({ child, onExit }) {
  const [tab, setTab] = useState('tasks')
  const [refreshing, setRefreshing] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const fileRef = useRef()
  const { updateChild } = useStore()
  const currentChild = useStore((s) => s.children.find((c) => c.id === child.id))
  const points = currentChild?.points ?? child.points

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }

  const handleSelectEmoji = (emoji) => {
    updateChild(child.id, { avatar: emoji })
    setShowAvatarPicker(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 200
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
        updateChild(child.id, { avatar: canvas.toDataURL('image/jpeg', 0.7) })
        setShowAvatarPicker(false)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
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
          <button onClick={() => setShowAvatarPicker(true)} className="relative">
            <Avatar emoji={currentChild?.avatar || child.avatar} size="md" />
            <span className="absolute bottom-0 right-0 bg-white rounded-full text-sm w-6 h-6 flex items-center justify-center shadow">✏️</span>
          </button>
          <div>
            <p className="text-2xl font-bold text-white">{currentChild?.name || child.name}</p>
            <p className="text-white/90 text-3xl font-bold">⭐ {points} 积分</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {tab === 'tasks' && <TaskList childId={child.id} />}
        {tab === 'rewards' && <RewardShop childId={child.id} />}
        {tab === 'ledger' && <PointLedger childId={child.id} />}
        {tab === 'calendar' && <TaskCalendar childId={child.id} />}
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

      {showAvatarPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">更换头像</h3>
            <button
              onClick={() => fileRef.current.click()}
              className="w-full py-4 rounded-2xl bg-indigo-100 text-indigo-700 font-semibold text-lg mb-6 active:bg-indigo-200"
            >
              📷 上传照片
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <p className="font-semibold text-gray-600 mb-3">或选择 Emoji</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => handleSelectEmoji(a)}
                  className="text-3xl w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-100 active:bg-indigo-200">
                  {a}
                </button>
              ))}
            </div>
            <button onClick={() => setShowAvatarPicker(false)} className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold">
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
