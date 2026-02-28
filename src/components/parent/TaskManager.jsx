import { useState } from 'react'
import useStore from '../../store/useStore'
import ConfirmModal from '../common/ConfirmModal'
import TaskForm from './TaskForm'

export default function TaskManager() {
  const { tasks, children, deleteTask, executePenalty } = useStore()
  const [editing, setEditing] = useState(null) // null | 'new' | task obj
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmPenalty, setConfirmPenalty] = useState(null)

  const getChild = (id) => children.find((c) => c.id === id)

  const statusColor = {
    pending: 'bg-gray-100 text-gray-600',
    done: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  }

  const statusLabel = {
    pending: '待完成',
    done: '已完成',
    approved: '已通过',
    rejected: '已拒绝',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">任务</h2>
        <button onClick={() => setEditing('new')} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-lg active:bg-indigo-700">
          + 添加
        </button>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl">还没有任务，为孩子创建一个吧</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {tasks.map((t) => {
          const child = getChild(t.assignedTo)
          return (
            <div key={t.id} className="bg-white rounded-3xl shadow p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xl font-bold text-gray-800">{t.title}</p>
                    {t.isPenalty && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">⚠️ 扣分任务</span>}
                    {t.repeat === 'daily' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">🔁 每日</span>}
                  </div>
                  {t.description && <p className="text-gray-500 mt-1">{t.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${t.isPenalty ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-700'}`}>
                      {t.isPenalty ? `⚠️ 每次 -${t.points} 分` : `⭐ ${t.points} 积分`}
                    </span>
                    {child && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">{child.avatar} {child.name}</span>}
                    {!t.isPenalty && <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[t.status]}`}>{statusLabel[t.status]}</span>}
                    {t.dueDate && !t.isPenalty && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">📅 {t.dueDate}</span>}
                    {t.isPenalty && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">可重复执行</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {t.isPenalty && (
                    <button onClick={() => setConfirmPenalty(t.id)} className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold active:bg-red-600">执行扣分</button>
                  )}
                  <button onClick={() => setEditing(t)} className="px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold active:bg-indigo-200">编辑</button>
                  <button onClick={() => setConfirmDelete(t.id)} className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-semibold active:bg-red-200">{t.isPenalty ? '取消' : '删除'}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editing !== null && (
        <TaskForm
          task={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={tasks.find(t => t.id === confirmDelete)?.isPenalty ? "确定取消这个扣分任务？" : "确定删除这个任务？"}
          onConfirm={() => { deleteTask(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmPenalty && (
        <ConfirmModal
          message={`确定执行扣分吗？将扣除 ${tasks.find(t => t.id === confirmPenalty)?.points} 分`}
          onConfirm={() => { executePenalty(confirmPenalty); setConfirmPenalty(null) }}
          onCancel={() => setConfirmPenalty(null)}
        />
      )}
    </div>
  )
}
