import { useState } from 'react'
import useStore from '../../store/useStore'

const ICONS = ['🎁','🍕','🎮','🎬','🍦','🚲','📚','🎨','🏖️','🎠','🧸','🎯','🏆','🎤','🎧']

export default function RewardForm({ reward, onClose }) {
  const { addReward, updateReward } = useStore()
  const [form, setForm] = useState({
    title: reward?.title || '',
    description: reward?.description || '',
    cost: reward?.cost || 50,
    icon: reward?.icon || '🎁',
    maxRedemptions: reward?.max_redemptions || null,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) return
    const data = {
      title: form.title,
      description: form.description,
      cost: form.cost,
      icon: form.icon,
      max_redemptions: form.maxRedemptions,
    }
    if (reward) updateReward(reward.id, data)
    else addReward(data)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">{reward ? '编辑奖励' : '新建奖励'}</h3>

        <label className="block text-gray-600 font-semibold mb-1">标题</label>
        <input
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none"
          placeholder="奖励名称"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />

        <label className="block text-gray-600 font-semibold mb-1">描述（可选）</label>
        <textarea
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-lg mb-4 focus:border-indigo-400 outline-none resize-none"
          rows={2}
          placeholder="详情..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />

        <label className="block text-gray-600 font-semibold mb-1">所需积分</label>
        <input
          type="number"
          min={1}
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-indigo-400 outline-none"
          value={form.cost}
          onChange={(e) => set('cost', Number(e.target.value))}
        />

        <label className="block text-gray-600 font-semibold mb-1">兑换次数限制</label>
        <div className="mb-4">
          <input
            type="number"
            min={1}
            className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl focus:border-indigo-400 outline-none"
            placeholder="不限制（留空表示无限次）"
            value={form.maxRedemptions || ''}
            onChange={(e) => set('maxRedemptions', e.target.value ? Number(e.target.value) : null)}
          />
          <p className="text-sm text-gray-500 mt-2">留空表示可以无限次兑换</p>
        </div>

        <label className="block text-gray-600 font-semibold mb-3">图标</label>
        <div className="flex flex-wrap gap-3 mb-8">
          {ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => set('icon', ic)}
              className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${form.icon === ic ? 'bg-indigo-200 ring-2 ring-indigo-500' : 'bg-gray-100'}`}
            >
              {ic}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold">取消</button>
          <button onClick={handleSave} className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold active:bg-indigo-700">保存</button>
        </div>
      </div>
    </div>
  )
}
