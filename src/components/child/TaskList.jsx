import { useShallow } from 'zustand/react/shallow'
import useStore from '../../store/useStore'
import TaskCard from './TaskCard'

export default function TaskList({ childId }) {
  // 任务排序：惩罚任务置顶，每日任务第二优先，其他任务在后面
  const tasks = useStore(useShallow((s) =>
    s.tasks
      .filter((t) => t.assignedTo === childId)
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
  ))

  const penaltyTasks = tasks.filter(t => t.isPenalty)
  const rewardTasks = tasks.filter(t => !t.isPenalty)

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-xl">暂无分配的任务</p>
      </div>
    )
  }

  return (
    <>
      {/* 扣分任务区 */}
      {penaltyTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
            <span>⚠️ 扣分任务</span>
            <span className="text-sm text-gray-400">({penaltyTasks.length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {penaltyTasks.map((t) => (
              <TaskCard key={t.id} task={t} childId={childId} />
            ))}
          </div>
        </div>
      )}

      {/* 加分任务区 */}
      {rewardTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
            <span>⭐ 加分任务</span>
            <span className="text-sm text-gray-400">({rewardTasks.length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {rewardTasks.map((t) => (
              <TaskCard key={t.id} task={t} childId={childId} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
