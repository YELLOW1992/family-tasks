import { useState } from 'react'
import useStore from '../../store/useStore'
import ConfirmModal from '../common/ConfirmModal'
import RewardForm from './RewardForm'

export default function RewardManager() {
  const { rewards, deleteReward, updateReward } = useStore()
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">奖励</h2>
        <button onClick={() => setEditing('new')} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-lg active:bg-indigo-700">
          + 添加
        </button>
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-xl">还没有奖励，添加一些有趣的吧</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {rewards.map((r) => (
          <div key={r.id} className="bg-white rounded-3xl shadow p-5 flex items-center gap-4">
            <div className="text-5xl">{r.icon}</div>
            <div className="flex-1">
              <p className="text-xl font-bold text-gray-800">{r.title}</p>
              {r.description && <p className="text-gray-500">{r.description}</p>}
              <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">⭐ {r.cost} 积分</span>
              <span className={`inline-block mt-2 ml-2 px-3 py-1 rounded-full text-sm font-semibold ${r.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {r.available ? '可用' : '不可用'}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setEditing(r)} className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold active:bg-indigo-200">编辑</button>
              <button onClick={() => updateReward(r.id, { available: !r.available })} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold active:bg-gray-200">
                {r.available ? '隐藏' : '显示'}
              </button>
              <button onClick={() => setConfirmDelete(r.id)} className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-semibold active:bg-red-200">删除</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <RewardForm reward={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      )}

      {confirmDelete && (
        <ConfirmModal
          message="确定删除这个奖励？"
          onConfirm={() => { deleteReward(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
