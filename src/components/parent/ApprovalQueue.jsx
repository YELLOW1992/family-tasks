import { useState } from 'react'
import useStore from '../../store/useStore'

export default function ApprovalQueue() {
  const { tasks, children, approveTask, rejectTask } = useStore()
  const pending = tasks.filter((t) => t.status === 'done')
  const getChild = (id) => children.find((c) => c.id === id)
  const [previewing, setPreviewing] = useState(null)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">待审批</h2>

      {pending.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-xl">暂无待审批的任务</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {pending.map((t) => {
          const child = getChild(t.assignedTo)
          return (
            <div key={t.id} className="bg-white rounded-3xl shadow p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{child?.avatar || '🧒'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xl font-bold text-gray-800">{t.title}</p>
                    {t.repeat === 'daily' && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">🔁 每日</span>}
                  </div>
                  {t.description && <p className="text-gray-500 mt-1">{t.description}</p>}
                  <p className="text-indigo-600 font-semibold mt-1">{child?.name} · ⭐ {t.points} 积分</p>
                </div>
              </div>

              {t.photo && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">提交的照片：</p>
                  <img
                    src={t.photo}
                    alt="proof"
                    className="w-full rounded-2xl max-h-56 object-cover cursor-pointer active:opacity-80"
                    onClick={() => setPreviewing(t.photo)}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => rejectTask(t.id)}
                  className="flex-1 py-3 rounded-2xl bg-red-100 text-red-600 text-lg font-semibold active:bg-red-200"
                >
                  ✗ 拒绝
                </button>
                <button
                  onClick={() => approveTask(t.id)}
                  className="flex-1 py-3 rounded-2xl bg-green-500 text-white text-lg font-semibold active:bg-green-600"
                >
                  ✓ 审批通过
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {previewing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewing(null)}>
          <img src={previewing} alt="full" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </div>
  )
}
