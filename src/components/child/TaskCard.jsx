import useStore from '../../store/useStore'

export default function TaskCard({ task, childId }) {
  const markTaskDone = useStore((s) => s.markTaskDone)

  const statusConfig = {
    pending: { label: '待完成', color: 'bg-gray-100 text-gray-600' },
    done: { label: '等待审批', color: 'bg-yellow-100 text-yellow-700' },
    approved: { label: '已通过 ✓', color: 'bg-green-100 text-green-700' },
    rejected: { label: '已拒绝', color: 'bg-red-100 text-red-600' },
  }

  const cfg = statusConfig[task.status]
  const isDaily = task.repeat === 'daily'

  return (
    <div className={`bg-white rounded-3xl shadow p-5 ${isDaily ? 'border-l-4 border-orange-400' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-gray-800">{task.title}</p>
            {isDaily && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">🔁 每日</span>}
          </div>
          {task.description && <p className="text-gray-500 mt-1">{task.description}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">⭐ {task.points} 积分</span>
            {task.dueDate && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">📅 {task.dueDate}</span>}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
          </div>
        </div>
      </div>
      {task.status === 'pending' && (
        <button
          onClick={() => markTaskDone(task.id)}
          className="mt-4 w-full py-4 rounded-2xl bg-green-500 text-white text-lg font-bold active:bg-green-600 transition-colors"
        >
          标记完成 ✓
        </button>
      )}
      {task.status === 'rejected' && !isDaily && (
        <button
          onClick={() => markTaskDone(task.id)}
          className="mt-4 w-full py-4 rounded-2xl bg-yellow-500 text-white text-lg font-bold active:bg-yellow-600 transition-colors"
        >
          重新提交 ↺
        </button>
      )}
    </div>
  )
}
