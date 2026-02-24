import { useState } from 'react'
import useStore from '../../store/useStore'

export default function TaskForm({ task, onClose }) {
  const { children, addTask, updateTask } = useStore()
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    points: task?.points || 10,
    assignedTo: task?.assignedTo || (children[0]?.id || ''),
    dueDate: task?.dueDate || '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim() || !form.assignedTo) return
    if (task) updateTask(task.id, form)
    else addTask(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">{task ? '编辑任务' : '新建任务'}</h3>

        <label className="block text-gray-600 font-semibold mb-1">标题</label>
        <input
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none"
          placeholder="任务标题"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />

        <label className="block text-gray-600 font-semibold mb-1">描述（可选）</label>
        <textarea
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg mb-4 focus:border-indigo-400 outline-none resize-none"
          rows={3}
          placeholder="详情..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />

        <label className="block text-gray-600 font-semibold mb-1">积分</label>
        <input
          type="number"
          min={1}
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none"
          value={form.points}
          onChange={(e) => set('points', Number(e.target.value))}
        />

        <label className="block text-gray-600 font-semibold mb-1">分配给</label>
        <select
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none bg-white"
          value={form.assignedTo}
          onChange={(e) => set('assignedTo', e.target.value)}
        >
          <option value="">选择孩子...</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>{c.avatar} {c.name}</option>
          ))}
        </select>

        <label className="block text-gray-600 font-semibold mb-1">截止日期（可选）</label>
        <input
          type="date"
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-8 focus:border-indigo-400 outline-none"
          value={form.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
        />

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold">取消</button>
          <button onClick={handleSave} className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold active:bg-indigo-700">保存</button>
        </div>
      </div>
    </div>
  )
}
