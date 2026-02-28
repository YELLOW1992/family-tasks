import { useState, useRef } from 'react'
import useStore from '../../store/useStore'

export default function TaskCard({ task, childId }) {
  const markTaskDone = useStore((s) => s.markTaskDone)
  const [photo, setPhoto] = useState(null)
  const [previewing, setPreviewing] = useState(false)
  const fileRef = useRef()

  const statusConfig = {
    pending: { label: '待完成', color: 'bg-gray-100 text-gray-600' },
    done: { label: '等待审批', color: 'bg-yellow-100 text-yellow-700' },
    approved: { label: '已通过 ✓', color: 'bg-green-100 text-green-700' },
    rejected: { label: '已拒绝', color: 'bg-red-100 text-red-600' },
  }

  const cfg = statusConfig[task.status]
  const isDaily = task.repeat === 'daily'
  const isPenalty = task.isPenalty

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxW = 800
        const scale = Math.min(1, maxW / img.width)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        setPhoto(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (task.requirePhoto && !photo) return
    markTaskDone(task.id, photo)
    setPhoto(null)
  }

  return (
    <div className={`bg-white rounded-3xl shadow p-4 flex flex-col gap-2 ${isDaily ? 'border-t-4 border-orange-400' : isPenalty ? 'border-t-4 border-red-400' : ''}`}>
      <div className="flex items-center gap-1 flex-wrap">
        {isDaily && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">🔁</span>}
        {isPenalty && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">⚠️ 警告</span>}
        {task.requirePhoto && !isPenalty && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">📷</span>}
      </div>
      <p className="text-base font-bold text-gray-800 leading-tight">{task.title}</p>
      {task.description && <p className="text-gray-400 text-xs leading-tight line-clamp-2">{task.description}</p>}
      <div className="flex flex-wrap gap-1 mt-1">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isPenalty ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-700'}`}>
          {isPenalty ? `⚠️ 每次 -${task.points}` : `⭐ +${task.points}`}
        </span>
        {!isPenalty && <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.color}`}>{cfg.label}</span>}
        {isPenalty && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">仅供警示</span>}
      </div>

      {task.status === 'pending' && !isPenalty && (
        <div className="mt-4">
          {task.requirePhoto && (
            <div className="mb-3">
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="preview" className="w-full rounded-2xl max-h-48 object-cover" />
                  <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">✕</button>
                </div>
              ) : (
                <button onClick={() => fileRef.current.click()} className="w-full py-3 rounded-2xl bg-blue-100 text-blue-700 font-semibold text-lg active:bg-blue-200">
                  📷 拍照上传
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={task.requirePhoto && !photo}
            className="w-full py-2 rounded-2xl bg-green-500 text-white text-sm font-bold active:bg-green-600 disabled:opacity-40 transition-colors"
          >
            完成 ✓
          </button>
        </div>
      )}

      {task.status === 'rejected' && !isDaily && (
        <button
          onClick={() => markTaskDone(task.id)}
          className="mt-2 w-full py-2 rounded-2xl bg-yellow-500 text-white text-sm font-bold active:bg-yellow-600 transition-colors"
        >
          重新提交 ↺
        </button>
      )}

      {task.status === 'done' && task.photo && (
        <div className="mt-3">
          <p className="text-sm text-gray-500 mb-1">已提交照片：</p>
          <img src={task.photo} alt="submitted" className="w-full rounded-2xl max-h-48 object-cover cursor-pointer" onClick={() => setPreviewing(true)} />
        </div>
      )}

      {previewing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewing(false)}>
          <img src={task.photo} alt="full" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </div>
  )
}
