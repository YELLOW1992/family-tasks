import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'

export default function TaskForm({ task, onClose }) {
  const { children, addTask, updateTask } = useStore()
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    points: task?.points || 10,
    assignedTo: task?.assignedTo || (children[0]?.id || ''),
    dueDate: task?.dueDate || '',
    repeat: task?.repeat || 'none',
    requirePhoto: task?.requirePhoto || false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!form.assignedTo && children[0]?.id) {
      setForm((f) => ({ ...f, assignedTo: children[0].id }))
    }
  }, [children])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title.trim()) { setError('请填写任务标题'); return }
    if (!form.assignedTo) { setError('请选择分配给哪个孩子'); return }
    setSaving(true)
    setError('')
    try {
      if (task) await updateTask(task.id, form)
      else await addTask(form)
      onClose()
    } catch (e) {
      setError('保存失败，请重试')
      setSaving(false)
    }
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

        <label className="block text-gray-600 font-semibold mb-2">任务类型</label>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => set('repeat', 'none')}
            className={`flex-1 py-3 rounded-2xl font-semibold text-lg transition-all ${form.repeat === 'none' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            普通任务
          </button>
          <button
            onClick={() => set('repeat', 'daily')}
            className={`flex-1 py-3 rounded-2xl font-semibold text-lg transition-all ${form.repeat === 'daily' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            🔁 每日任务
          </button>
        </div>

        {form.repeat === 'daily' && (
          <p className="text-sm text-orange-600 bg-orange-50 rounded-xl px-4 py-3 mb-4">每天可提交一次，审批通过后自动重置；当天未提交则失效等待次日</p>
        )}

        <button
          onClick={() => set('requirePhoto', !form.requirePhoto)}
          className={`w-full py-3 rounded-2xl font-semibold text-lg mb-4 transition-all flex items-center justify-center gap-2 ${form.requirePhoto ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          📷 {form.requirePhoto ? '需要拍照提交（已开启）' : '需要拍照提交（未开启）'}
        </button>

        {form.repeat === 'none' && (
          <>
            <label className="block text-gray-600 font-semibold mb-1">截止日期（可选）</label>
            <input
              type="date"
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </>
        )}

        <div className="flex gap-4 mt-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold">取消</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold active:bg-indigo-700 disabled:opacity-60">{saving ? '保存中...' : '保存'}</button>
        </div>
        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </div>
    </div>
  )
}
