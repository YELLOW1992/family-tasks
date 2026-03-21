import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'

const DAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const PET_ICONS = ['🐶','🐱','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐧','🦜','🐢','🐠','🐇','🦋','🐝','🦔','🐾']
const ITEM_ICONS = ['🍖','🦴','🐟','🥩','🍗','🥕','🍎','🎾','🧸','🪀','🛁','💊','🎀','🌿','🏠']

function SpeciesForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [icon, setIcon] = useState(initial?.icon || '🐱')
  const [cost, setCost] = useState(initial?.cost ?? 50)
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
          className="text-4xl w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center"
        >
          {icon}
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="宠物种类名称（如：小猫）"
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
        <label className="text-sm text-gray-600 font-semibold">领养积分：</label>
        <input
          type="number" min="1" value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-base"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold">保存</button>
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold">取消</button>
      </div>
    </div>
  )
}

function ItemForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [icon, setIcon] = useState(initial?.icon || '🍖')
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
          className="text-4xl w-14 h-14 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center"
        >
          {icon}
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="用品名称（如：猫粮）"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-base"
        />
      </div>
      {showIcons && (
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-3 border border-gray-200">
          {ITEM_ICONS.map((ic) => (
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
          type="number" min="1" value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-base"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold">保存</button>
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold">取消</button>
      </div>
    </div>
  )
}

export default function PetManager() {
  const {
    petSpecies, petItems, petSchedule,
    addPetSpecies, updatePetSpecies, removePetSpecies,
    addPetItem, updatePetItem, removePetItem,
    setPetSchedule, loadPetData,
  } = useStore()

  const [tab, setTab] = useState('species') // 'species' | 'items' | 'schedule'
  const [addingSpecies, setAddingSpecies] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState(null)
  const [addingItem, setAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Schedule state
  const [days, setDays] = useState(petSchedule?.days ?? [])
  const [startTime, setStartTime] = useState(petSchedule?.startTime ?? '15:00')
  const [endTime, setEndTime] = useState(petSchedule?.endTime ?? '20:00')
  const [scheduleEnabled, setScheduleEnabled] = useState(!!petSchedule)

  useEffect(() => { loadPetData() }, [])

  useEffect(() => {
    if (petSchedule) {
      setDays(petSchedule.days ?? [])
      setStartTime(petSchedule.startTime ?? '15:00')
      setEndTime(petSchedule.endTime ?? '20:00')
      setScheduleEnabled(true)
    }
  }, [petSchedule])

  const toggleDay = (d) => setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])

  const handleSaveSchedule = () => {
    setPetSchedule(scheduleEnabled ? { days, startTime, endTime } : null)
  }

  const TABS = [
    { id: 'species', label: '宠物种类', icon: '🐾' },
    { id: 'items',   label: '宠物用品', icon: '🎁' },
    { id: 'schedule',label: '开放时间', icon: '⏰' },
  ]

  return (
    <div className="p-4">
      {/* 子标签 */}
      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
              tab === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 宠物种类管理 */}
      {tab === 'species' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-700">可领养宠物</h3>
            <button onClick={() => setAddingSpecies(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm">+ 添加</button>
          </div>
          {addingSpecies && (
            <div className="mb-4">
              <SpeciesForm
                onSave={async (data) => { await addPetSpecies(data); setAddingSpecies(false) }}
                onCancel={() => setAddingSpecies(false)}
              />
            </div>
          )}
          {petSpecies.length === 0 && !addingSpecies && (
            <div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">🐾</div><p>暂无宠物种类</p></div>
          )}
          <div className="flex flex-col gap-3">
            {petSpecies.map((s) => (
              <div key={s.id}>
                {editingSpecies === s.id ? (
                  <SpeciesForm
                    initial={s}
                    onSave={async (data) => { await updatePetSpecies(s.id, data); setEditingSpecies(null) }}
                    onCancel={() => setEditingSpecies(null)}
                  />
                ) : (
                  <div className="bg-white rounded-2xl shadow px-4 py-3 flex items-center gap-3">
                    <div className="text-4xl">{s.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{s.name}</p>
                      {s.description && <p className="text-gray-500 text-sm">{s.description}</p>}
                      <span className="text-xs text-indigo-600 font-semibold">⭐ {s.cost} 积分领养</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updatePetSpecies(s.id, { available: !s.available })}
                        className={`px-3 py-1 rounded-xl text-sm font-bold ${s.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.available ? '上架' : '下架'}
                      </button>
                      <button onClick={() => setEditingSpecies(s.id)} className="px-3 py-1 rounded-xl bg-blue-100 text-blue-700 text-sm font-bold">编辑</button>
                      <button onClick={() => removePetSpecies(s.id)} className="px-3 py-1 rounded-xl bg-red-100 text-red-600 text-sm font-bold">删除</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 宠物用品管理 */}
      {tab === 'items' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-700">宠物用品商店</h3>
            <button onClick={() => setAddingItem(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm">+ 添加</button>
          </div>
          {addingItem && (
            <div className="mb-4">
              <ItemForm
                onSave={async (data) => { await addPetItem(data); setAddingItem(false) }}
                onCancel={() => setAddingItem(false)}
              />
            </div>
          )}
          {petItems.length === 0 && !addingItem && (
            <div className="text-center py-12 text-gray-400"><div className="text-5xl mb-3">🎁</div><p>暂无宠物用品</p></div>
          )}
          <div className="flex flex-col gap-3">
            {petItems.map((item) => (
              <div key={item.id}>
                {editingItem === item.id ? (
                  <ItemForm
                    initial={item}
                    onSave={async (data) => { await updatePetItem(item.id, data); setEditingItem(null) }}
                    onCancel={() => setEditingItem(null)}
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
                      <button onClick={() => updatePetItem(item.id, { available: !item.available })}
                        className={`px-3 py-1 rounded-xl text-sm font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.available ? '上架' : '下架'}
                      </button>
                      <button onClick={() => setEditingItem(item.id)} className="px-3 py-1 rounded-xl bg-blue-100 text-blue-700 text-sm font-bold">编辑</button>
                      <button onClick={() => removePetItem(item.id)} className="px-3 py-1 rounded-xl bg-red-100 text-red-600 text-sm font-bold">删除</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 开放时间设置 */}
      {tab === 'schedule' && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">宠物区限时开放</h3>
          <div className="flex items-center justify-between mb-4 bg-white rounded-2xl px-4 py-3 shadow">
            <span className="font-semibold text-gray-700">启用限时开放</span>
            <button
              onClick={() => setScheduleEnabled(!scheduleEnabled)}
              className={`w-14 h-8 rounded-full transition-colors relative ${scheduleEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${scheduleEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          {scheduleEnabled && (
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">开放日期</p>
                <div className="flex gap-2 flex-wrap">
                  {DAY_LABELS.map((label, i) => (
                    <button key={i} onClick={() => toggleDay(i)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold ${days.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">开放时间段</p>
                <div className="flex items-center gap-3">
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-base flex-1" />
                  <span className="text-gray-500">至</span>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-base flex-1" />
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleSaveSchedule}
            className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-lg active:bg-indigo-700"
          >
            保存设置
          </button>
        </div>
      )}
    </div>
  )
}
