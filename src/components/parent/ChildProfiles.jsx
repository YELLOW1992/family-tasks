import { useState } from 'react'
import useStore from '../../store/useStore'
import Avatar from '../common/Avatar'
import ConfirmModal from '../common/ConfirmModal'

const AVATARS = ['🧒','👦','👧','🧑','👩','👨','🧔','👴','👵','🧕','👲','🎅']

export default function ChildProfiles() {
  const { children, addChild, updateChild, removeChild } = useStore()
  const [editing, setEditing] = useState(null) // null | 'new' | child id
  const [form, setForm] = useState({ name: '', avatar: '🧒' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const openNew = () => { setForm({ name: '', avatar: '🧒' }); setEditing('new') }
  const openEdit = (c) => { setForm({ name: c.name, avatar: c.avatar }); setEditing(c.id) }
  const close = () => setEditing(null)

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing === 'new') addChild(form)
    else updateChild(editing, form)
    close()
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
              <button onClick={() => setConfirmDelete(c.id)} className="flex-1 py-2 rounded-xl bg-red-100 text-red-600 font-semibold active:bg-red-200">删除</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-6">{editing === 'new' ? '添加孩子' : '编辑孩子'}</h3>
            <input
              className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-xl mb-6 focus:border-indigo-400 outline-none"
              placeholder="孩子的名字"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <p className="font-semibold text-gray-600 mb-3">选择头像</p>
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
