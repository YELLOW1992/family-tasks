import { useState } from 'react'
import useStore from '../../store/useStore'
import ConfirmModal from '../common/ConfirmModal'
import TaskForm from './TaskForm'

export default function TaskManager() {
  const { tasks, children, deleteTask, executePenalty } = useStore()
  const [editing, setEditing] = useState(null) // null | 'new' | task obj
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmPenalty, setConfirmPenalty] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)

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

      <div className="grid grid-cols-2 gap-4">
        {tasks.map((t) => {
          const child = getChild(t.assignedTo)
          return (
            <div
              key={t.id}
              onClick={() => setViewingTask(t)}
              className={`bg-white rounded-3xl shadow p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform aspect-square ${
                t.isPenalty ? 'border-2 border-red-300' : t.repeat === 'daily' ? 'border-2 border-orange-300' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-1 mb-2 flex-wrap">
                  {t.isPenalty && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">⚠️</span>}
                  {t.repeat === 'daily' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">🔁</span>}
                  {t.requirePhoto && !t.isPenalty && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">📷</span>}
                </div>
                <p className="text-lg font-bold text-gray-800 line-clamp-3 mb-2">{t.title}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold self-start ${t.isPenalty ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-700'}`}>
                  {t.isPenalty ? `-${t.points}` : `+${t.points}`}
                </span>
                {child && <span className="text-xs text-gray-500">{child.avatar} {child.name}</span>}
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

      {viewingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setViewingTask(null)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {viewingTask.isPenalty && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">⚠️ 扣分任务</span>}
                  {viewingTask.repeat === 'daily' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">🔁 每日</span>}
                  {viewingTask.requirePhoto && !viewingTask.isPenalty && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">📷 需要拍照</span>}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{viewingTask.title}</h3>
                {viewingTask.description && <p className="text-gray-600 mb-3">{viewingTask.description}</p>}
              </div>
              <button onClick={() => setViewingTask(null)} className="text-gray-400 text-2xl ml-2">✕</button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${viewingTask.isPenalty ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-700'}`}>
                {viewingTask.isPenalty ? `⚠️ 每次 -${viewingTask.points} 分` : `⭐ ${viewingTask.points} 积分`}
              </span>
              {getChild(viewingTask.assignedTo) && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {getChild(viewingTask.assignedTo).avatar} {getChild(viewingTask.assignedTo).name}
                </span>
              )}
              {!viewingTask.isPenalty && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[viewingTask.status]}`}>
                  {statusLabel[viewingTask.status]}
                </span>
              )}
              {viewingTask.dueDate && !viewingTask.isPenalty && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">📅 {viewingTask.dueDate}</span>
              )}
              {viewingTask.isPenalty && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">可重复执行</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {viewingTask.isPenalty && (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmPenalty(viewingTask.id); setViewingTask(null) }}
                  className="w-full py-3 rounded-2xl bg-red-500 text-white font-semibold text-lg active:bg-red-600"
                >
                  执行扣分
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setEditing(viewingTask); setViewingTask(null) }}
                className="w-full py-3 rounded-2xl bg-indigo-100 text-indigo-700 font-semibold text-lg active:bg-indigo-200"
              >
                编辑
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(viewingTask.id); setViewingTask(null) }}
                className="w-full py-3 rounded-2xl bg-red-100 text-red-600 font-semibold text-lg active:bg-red-200"
              >
                {viewingTask.isPenalty ? '取消' : '删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
