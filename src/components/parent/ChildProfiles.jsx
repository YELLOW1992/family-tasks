import { useState, useRef } from 'react'
import useStore from '../../store/useStore'
import Avatar from '../common/Avatar'
import ConfirmModal from '../common/ConfirmModal'

const AVATARS = ['🧒','👦','👧','🧑','👩','👨','🧔','👴','👵','🧕','👲','🎅','🐶','🐱','🐼','🦊','🐸','🐯','🦁','🐨','🐻','🐰','🐧','🦄']

export default function ChildProfiles() {
  const { children, addChild, updateChild, removeChild, deductPoints } = useStore()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', avatar: '🧒' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deducting, setDeducting] = useState(null) // child id
  const [deductForm, setDeductForm] = useState({ amount: 1, reason: '' })
  const fileRef = useRef()

  const openNew = () => { setForm({ name: '', avatar: '🧒' }); setEditing('new') }
  const openEdit = (c) => { setForm({ name: c.name, avatar: c.avatar }); setEditing(c.id) }
  const close = () => setEditing(null)

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing === 'new') addChild(form)
    else updateChild(editing, form)
    close()
  }

  const handleDeduct = async () => {
    if (!deductForm.amount || deductForm.amount < 1) return
    await deductPoints(deducting, Number(deductForm.amount), deductForm.reason)
    setDeducting(null)
    setDeductForm({ amount: 1, reason: '' })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 200
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
        setForm((f) => ({ ...f, avatar: canvas.toDataURL('image/jpeg', 0.7) }))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">孩子</h2>
        <button onClick={openNew} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-lg active:bg-indigo-700">
          + 添加
        </button>
      </div>

      {children.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">👨‍👩‍👧</div>
          <p className="text-xl">还没有孩子，点击添加开始吧</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {children.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl shadow p-5 flex flex-col items-center gap-3">
            <Avatar emoji={c.avatar} size="md" />
            <p className="text-xl font-bold text-gray-800">{c.name}</p>
            <p className="text-indigo-600 font-semibold">{c.points} 积分</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => openEdit(c)} className="flex-1 py-2 rounded-xl bg-indigo-100 text-indigo-700 font-semibold active:bg-indigo-200">编辑</button>
              <button onClick={() => { setDeducting(c.id); setDeductForm({ amount: 1, reason: '' }) }} className="flex-1 py-2 rounded-xl bg-orange-100 text-orange-600 font-semibold active:bg-orange-200">扣分</button>
              <button onClick={() => setConfirmDelete(c.id)} className="flex-1 py-2 rounded-xl bg-red-100 text-red-600 font-semibold active:bg-red-200">删除</button>
            </div>
          </div>
        ))}
      </div>

      {deducting && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-2">扣除积分</h3>
            <p className="text-gray-500 mb-6">{children.find(c => c.id === deducting)?.name} 当前 {children.find(c => c.id === deducting)?.points} 分</p>
            <label className="block text-gray-600 font-semibold mb-1">扣除分数</label>
            <input
              type="number" min={1}
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-4 focus:border-orange-400 outline-none"
              value={deductForm.amount}
              onChange={(e) => setDeductForm(f => ({ ...f, amount: e.target.value }))}
            />
            <label className="block text-gray-600 font-semibold mb-1">原因（可选）</label>
            <input
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-6 focus:border-orange-400 outline-none"
              placeholder="例：没有完成作业"
              value={deductForm.reason}
              onChange={(e) => setDeductForm(f => ({ ...f, reason: e.target.value }))}
            />
            <div className="flex gap-4">
              <button onClick={() => setDeducting(null)} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold">取消</button>
              <button onClick={handleDeduct} className="flex-1 py-4 rounded-2xl bg-orange-500 text-white text-lg font-semibold active:bg-orange-600">确认扣分</button>
            </div>
          </div>
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">{editing === 'new' ? '添加孩子' : '编辑孩子'}</h3>
            <input
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-6 focus:border-indigo-400 outline-none"
              placeholder="孩子的名字"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            <p className="font-semibold text-gray-600 mb-3">当前头像</p>
            <div className="flex items-center gap-4 mb-6">
              <Avatar emoji={form.avatar} size="md" />
              <button
                onClick={() => fileRef.current.click()}
                className="px-5 py-3 rounded-2xl bg-indigo-100 text-indigo-700 font-semibold active:bg-indigo-200"
              >
                📷 上传照片
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <p className="font-semibold text-gray-600 mb-3">或选择 Emoji</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setForm((f) => ({ ...f, avatar: a }))}
                  className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${form.avatar === a ? 'bg-indigo-200 ring-2 ring-indigo-500' : 'bg-gray-100'}`}>
                  {a}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={close} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 text-lg font-semibold">取消</button>
              <button onClick={handleSave} className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold active:bg-indigo-700">保存</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          message="确定删除这个孩子？任务和积分记录将保留"
          onConfirm={() => { removeChild(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
