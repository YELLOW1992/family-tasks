import { useShallow } from 'zustand/react/shallow'
import useStore from '../../store/useStore'
import TaskCard from './TaskCard'

export default function TaskList({ childId }) {
  const tasks = useStore(useShallow((s) => s.tasks.filter((t) => t.assignedTo === childId)))

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-xl">暂无分配的任务</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} childId={childId} />
      ))}
    </div>
  )
}
