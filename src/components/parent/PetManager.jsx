import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'

const DAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const PET_ICONS = ['🐶','🐱','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐧','🐦','🦄','🐾','🎀','🧸','🪀','🎮','🍖','🦴','🐟','🌿','🏠','🛁']

function ItemForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [icon, setIcon] = useState(initial?.icon || '🐾')
  const [cost, setCost] = useState(initial?.cost ?? 10)
  const [showIcons, setShowIcons] = useState(false)

  const handleSave = () => {
    if (!name.trim() || cost <= 0) return
    onSave({ name: name.trim(), description: description.trim(), icon, cost: Number(cost) })
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowIcons(!showIcons)}
          className="text-4xl w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center active:bg-gray-100"
        >
          {icon}
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="用品名称"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-base"
        />
      </div>
      {showIcons && (
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-3 border border-gray-200">
          {PET_ICONS.map((ic) => (
            <button key={ic} onClick={() => { setIcon(ic); setShowIcons(false) }}
              className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center active:bg-indigo-100">
              {ic}
            </button>
          ))}
        </div>
      )}
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="描述（可选）"
        className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 font-semibold">积分：</label>
        <input
          type="number"
          min="1"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-base"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold active:bg-indigo-700">
          保存
        </button>
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold active:bg-gray-300">
          取消
        </button>
      </div>
    </div>
  )
}

export default function PetManager() {
  const { petItems, petSchedule, addPetItem, updatePetItem, removePetItem, setPetSchedule, loadPetData } = useStore()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)

  // Schedule state
  const [days, setDays] = useState(petSchedule?.days ?? [])
  const [startTime, setStartTime] = useState(petSchedule?.startTime ?? '15:00')
  const [endTime, setEndTime] = useState(petSchedule?.endTime ?? '20:00')
  const [scheduleEnabled, setScheduleEnabled] = useState(!!petSchedule)

  useEffect(() => {
    loadPetData()
  }, [])

  useEffect(() => {
    if (petSchedule) {
      setDays(petSchedule.days ?? [])
      setStartTime(petSchedule.startTime ?? '15:00')
      setEndTime(petSchedule.endTime ?? '20:00')
      setScheduleEnabled(true)
    }
  }, [petSchedule])

  const toggleDay = (d) => {
    setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])
  }

  const handleSaveSchedule = () => {
    if (!scheduleEnabled) {
      setPetSchedule(null)
    } else {
      setPetSchedule({ days, startTime, endTime })
    }
    setShowSchedule(false)
  }

  return (
    <div>
      {/* 开放时间设置入口 */}
      <div className="mb-6">
        <button
          onClick={() => setShowSchedule(true)}
          className="w-full flex items-center justify-between bg-white rounded-2xl shadow px-5 py-4 active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-bold text-gray-800">限时开放设置</p>
              <p className="text-sm text-gray-400">
                {!petSchedule ? '全天开放' : `${(petSchedule.days ?? []).map((d) => DAY_LABELS[d]).join('、') || '每天'} ${petSchedule.startTime}–${petSchedule.endTime}`}
              </p>
            </div>
          </div>
          <span className="text-gray-400 text-xl">›</span>
        </button>
      </div>

      {/* 用品列表 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-700">宠物用品</h3>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm active:bg-indigo-700"
        >
          + 添加
        </button>
      </div>

      {adding && (
        <div className="mb-4">
          <ItemForm
            onSave={async (data) => { await addPetItem(data); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {petItems.length === 0 && !adding && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">🐾</div>
          <p>暂无宠物用品，点击添加</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {petItems.map((item) => (
          <div key={item.id}>
            {editing === item.id ? (
              <ItemForm
                initial={item}
                onSave={async (data) => { await updatePetItem(item.id, data); setEditing(null) }}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow px-4 py-3 flex items-center gap-3">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.name}</p>
                  {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                  <span className="text-xs text-indigo-600 font-semibold">⭐ {item.cost} 积分</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePetItem(item.id, { available: !item.available })}
                    className={`px-3 py-1 rounded-xl text-sm font-bold ${
                      item.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.available ? '上架' : '下架'}
                  </button>
                  <button
                    onClick={() => setEditing(item.id)}
                    className="px-3 py-1 rounded-xl bg-blue-100 text-blue-700 text-sm font-bold"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => removePetItem(item.id)}
                    className="px-3 py-1 rounded-xl bg-red-100 text-red-600 text-sm font-bold"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 开放时间弹窗 */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowSchedule(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">限时开放设置</h3>

            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-700">启用限时开放</span>
              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  scheduleEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                } relative`}
              >
                <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  scheduleEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {scheduleEnabled && (
              <>
                <p className="text-sm font-semibold text-gray-600 mb-2">开放日期</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {DAY_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold ${
                        days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <p className="text-sm font-semibold text-gray-600 mb-2">开放时间段</p>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-base flex-1"
                  />
                  <span className="text-gray-500">至</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-base flex-1"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSaveSchedule}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-lg active:bg-indigo-700"
              >
                保存
              </button>
              <button
                onClick={() => setShowSchedule(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-lg"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
