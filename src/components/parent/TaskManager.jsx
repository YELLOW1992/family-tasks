import { useState, useRef } from 'react'
import useStore from '../../store/useStore'
import ConfirmModal from '../common/ConfirmModal'
import TaskForm from './TaskForm'

export default function TaskManager() {
  const { tasks, children, deleteTask, executePenalty, addChild, removeChild } = useStore()
  const [editing, setEditing] = useState(null) // null | 'new' | task obj
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmPenalty, setConfirmPenalty] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)
  const [addingChild, setAddingChild] = useState(false)
  const [confirmRemoveChild, setConfirmRemoveChild] = useState(null)
  const [childForm, setChildForm] = useState({ name: '', avatar: '👦' })
  const [selectedChildId, setSelectedChildId] = useState(null)
  const longPressTimer = useRef(null)

  const startLongPress = (child) => {
    longPressTimer.current = setTimeout(() => setConfirmRemoveChild(child), 700)
  }
  const cancelLongPress = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null }
  }

  const getChild = (id) => children.find((c) => c.id === id)

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    done: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
  }
  const statusLabel = {
    pending: '待完成',
    done: '待审批',
    approved: '已完成',
  }

  const handleAddChild = async () => {
    if (!childForm.name.trim()) return
    await addChild(childForm)
    setChildForm({ name: '', avatar: '👦' })
    setAddingChild(false)
  }

  const avatarOptions = ['👦', '👧', '🧒', '👶', '🧑', '👨', '👩', '🐶', '🐱', '🐻', '🦁', '🐼']

  // 自动选择第一个孩子
  const currentChildId = selectedChildId || children[0]?.id
  const currentChild = children.find(c => c.id === currentChildId)

  // 任务排序：惩罚任务置顶，每日任务第二优先，其他任务在后面
  const currentTasks = tasks
    .filter(t => t.assignedTo === currentChildId)
    .sort((a, b) => {
      // 惩罚任务优先级最高
      if (a.isPenalty && !b.isPenalty) return -1
      if (!a.isPenalty && b.isPenalty) return 1

      // 如果都是惩罚任务或都不是，则比较是否为每日任务
      if (a.repeat === 'daily' && b.repeat !== 'daily') return -1
      if (a.repeat !== 'daily' && b.repeat === 'daily') return 1

      // 其他情况保持原顺序
      return 0
    })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">任务</h2>
        <button onClick={() => setEditing('new')} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-lg active:bg-indigo-700">
          + 添加任务
        </button>
      </div>

      {/* 孩子分组任务 */}
      {children.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg mb-3">还没有孩子账户</p>
        </div>
      )}

      {/* 横向头像选择栏 */}
      {children.length > 0 && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              onTouchStart={() => startLongPress(child)}
              onTouchEnd={cancelLongPress}
              onTouchMove={cancelLongPress}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-3xl transition-all ${
                currentChildId === child.id ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-4xl">
                {child.avatar}
              </div>
              <p className="text-sm font-bold text-gray-800">{child.name}</p>
              <p className="text-xs text-gray-400">⭐ {child.points ?? 0}</p>
            </button>
          ))}
          <button
            onClick={() => setAddingChild(true)}
            className="flex-shrink-0 w-24 h-24 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-3xl"
          >
            +
          </button>
        </div>
      )}

      {/* 当前选中孩子的任务 */}
      {currentChild && (
        <div>
          {currentTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">还没有任务</p>
          ) : (
            <>
              {/* 扣分任务区 */}
              {(() => {
                const penaltyTasks = currentTasks.filter(t => t.isPenalty)
                if (penaltyTasks.length === 0) return null
                return (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                      <span>⚠️ 扣分任务</span>
                      <span className="text-sm text-gray-400">({penaltyTasks.length})</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {penaltyTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setViewingTask(t)}
                          className="bg-white rounded-3xl shadow p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform aspect-square border-2 border-red-300"
                        >
                          <div>
                            <div className="flex items-center gap-1 mb-2 flex-wrap">
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">⚠️</span>
                            </div>
                            <p className="text-lg font-bold text-gray-800 line-clamp-3 mb-2">{t.title}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-semibold self-start bg-red-100 text-red-600">
                            -{t.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* 加分任务区 */}
              {(() => {
                const rewardTasks = currentTasks.filter(t => !t.isPenalty)
                if (rewardTasks.length === 0) return null
                return (
                  <div>
                    <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                      <span>⭐ 加分任务</span>
                      <span className="text-sm text-gray-400">({rewardTasks.length})</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {rewardTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setViewingTask(t)}
                          className={`bg-white rounded-3xl shadow p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform aspect-square ${
                            t.repeat === 'daily' ? 'border-2 border-orange-300' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1 mb-2 flex-wrap">
                              {t.repeat === 'daily' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">🔁</span>}
                              {t.requirePhoto && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">📷</span>}
                            </div>
                            <p className="text-lg font-bold text-gray-800 line-clamp-3 mb-2">{t.title}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-semibold self-start bg-indigo-100 text-indigo-700">
                            +{t.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </>
          )}
        </div>
      )}

      {/* 孤立任务（分配的孩子已被删除） */}
      {(() => {
        const childIds = new Set(children.map(c => c.id))
        const orphaned = tasks.filter(t => !childIds.has(t.assignedTo))
        if (orphaned.length === 0) return null
        return (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">❓</div>
              <div>
                <p className="text-lg font-bold text-gray-500">未分配任务</p>
                <p className="text-xs text-gray-400">孩子已删除，任务仍保留</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {orphaned.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setViewingTask(t)}
                  className={`bg-white rounded-3xl shadow p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform aspect-square ${
                    t.isPenalty ? 'border-2 border-red-300' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      {t.isPenalty && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">⚠️</span>}
                    </div>
                    <p className="text-lg font-bold text-gray-800 line-clamp-3 mb-2">{t.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold self-start ${t.isPenalty ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-700'}`}>
                    {t.isPenalty ? `-${t.points}` : `+${t.points}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* 添加孩子按钮 */}
      <button
        onClick={() => setAddingChild(true)}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 font-semibold text-lg active:bg-gray-50 flex items-center justify-center gap-2"
      >
        + 添加孩子
      </button>

      {editing !== null && (
        <TaskForm
          task={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={tasks.find(t => t.id === confirmDelete)?.isPenalty ? "确定取消这个扣分任务？" : "确定删除这个任务？"}
          confirmLabel={tasks.find(t => t.id === confirmDelete)?.isPenalty ? '取消任务' : '删除'}
          onConfirm={() => { deleteTask(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {confirmPenalty && (
        <ConfirmModal
          message={`确定执行扣分吗？将扣除 ${tasks.find(t => t.id === confirmPenalty)?.points} 分`}
          confirmLabel="执行扣分"
          onConfirm={() => { executePenalty(confirmPenalty); setConfirmPenalty(null); setViewingTask(null) }}
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
                  onClick={(e) => { e.stopPropagation(); setConfirmPenalty(viewingTask.id) }}
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

      {confirmRemoveChild && (
        <ConfirmModal
          message={`确定删除 ${confirmRemoveChild.avatar} ${confirmRemoveChild.name}？`}
          confirmLabel="删除"
          onConfirm={() => { removeChild(confirmRemoveChild.id); setConfirmRemoveChild(null) }}
          onCancel={() => setConfirmRemoveChild(null)}
        />
      )}

      {addingChild && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setAddingChild(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4">添加孩子</h3>

            <label className="block text-gray-600 font-semibold mb-2">选择头像</label>
            <div className="grid grid-cols-6 gap-3 mb-4">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setChildForm(f => ({ ...f, avatar: emoji }))}
                  className={`w-full aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all ${
                    childForm.avatar === emoji ? 'bg-purple-200 ring-4 ring-purple-300' : 'bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <label className="block text-gray-600 font-semibold mb-2">孩子名字</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none"
              placeholder="输入名字"
              value={childForm.name}
              onChange={(e) => setChildForm(f => ({ ...f, name: e.target.value }))}
            />

            <div className="flex gap-3">
              <button onClick={() => setAddingChild(false)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-lg">
                取消
              </button>
              <button onClick={handleAddChild} className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:bg-indigo-700">
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
