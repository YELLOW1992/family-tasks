import { useState } from 'react'
import useStore from '../../store/useStore'
import PetShop from './PetShop'

const CARE_ACTIONS = [
  { id: 'feed',  label: '喂食',   icon: '🍖', cost: 2,  stat: 'hunger',      color: 'bg-orange-100 text-orange-700 active:bg-orange-200' },
  { id: 'water', label: '喝水',   icon: '💧', cost: 1,  stat: 'thirst',      color: 'bg-blue-100 text-blue-700 active:bg-blue-200' },
  { id: 'bath',  label: '洗澡',   icon: '🛁', cost: 3,  stat: 'cleanliness', color: 'bg-cyan-100 text-cyan-700 active:bg-cyan-200' },
  { id: 'play',  label: '陪玩',   icon: '🎾', cost: 2,  stat: 'happiness',   color: 'bg-pink-100 text-pink-700 active:bg-pink-200' },
]

const STAT_LABELS = {
  hunger:      { label: '饱腹', icon: '🍖', color: 'bg-orange-400' },
  thirst:      { label: '水分', icon: '💧', color: 'bg-blue-400' },
  cleanliness: { label: '清洁', icon: '✨', color: 'bg-cyan-400' },
  happiness:   { label: '心情', icon: '😊', color: 'bg-pink-400' },
  health:      { label: '健康', icon: '❤️', color: 'bg-red-400' },
}

function StatBar({ value, colorClass }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  const barColor = pct > 60 ? colorClass : pct > 30 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function PetCard({ pet, species, childId, points }) {
  const { petCare, petRedemptions, usePetItem } = useStore()
  const [acting, setActing] = useState(null)

  // compute degraded stats based on time elapsed
  const degrade = (val, lastTime, ratePerHour) => {
    if (!lastTime) return val
    const hours = (Date.now() - new Date(lastTime).getTime()) / 3600000
    return Math.max(0, Math.round((val || 80) - hours * ratePerHour))
  }

  const hunger      = degrade(pet.hunger,      pet.last_fed,     4)
  const thirst      = degrade(pet.thirst,      pet.last_watered, 6)
  const cleanliness = degrade(pet.cleanliness, pet.last_bathed,  2)
  const happiness   = degrade(pet.happiness,   pet.last_played,  3)
  const health      = Math.round((hunger + thirst + cleanliness + happiness) / 4)

  const stats = { hunger, thirst, cleanliness, happiness, health }

  // unused items for this child
  const unusedItems = petRedemptions.filter(
    (r) => r.child_id === childId && !r.used
  )

  const handleCare = async (action) => {
    if (acting) return
    setActing(action.id)
    await petCare(pet.id, action.id, childId, action.cost)
    setActing(null)
  }

  const expForNext = 100
  const expPct = ((pet.exp || 0) % 100)
  const mood = health > 70 ? '😄' : health > 40 ? '😐' : '😢'

  return (
    <div className="bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-4">
      {/* 宠物头部 */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="text-7xl">{species?.icon || '🐾'}</div>
          <span className="absolute -bottom-1 -right-1 text-2xl">{mood}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">Lv.{pet.level}</span>
          </div>
          <p className="text-gray-500 text-sm">{species?.name}</p>
          {/* 经验条 */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>经验</span>
              <span>{expPct}/{expForNext}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-400 h-full rounded-full transition-all" style={{ width: `${expPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 状态条 */}
      <div className="flex flex-col gap-2">
        {Object.entries(STAT_LABELS).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-base w-5">{cfg.icon}</span>
            <span className="text-xs text-gray-500 w-8">{cfg.label}</span>
            <StatBar value={stats[key]} colorClass={cfg.color} />
            <span className="text-xs text-gray-400 w-8 text-right">{stats[key]}</span>
          </div>
        ))}
      </div>

      {/* 护理按钮 */}
      <div className="grid grid-cols-2 gap-2">
        {CARE_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleCare(action)}
            disabled={!!acting || points < action.cost}
            className={`py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 ${action.color}`}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
            <span className="text-xs opacity-70">-{action.cost}分</span>
          </button>
        ))}
      </div>

      {/* 使用宠物用品 */}
      {unusedItems.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">🎁 背包用品</p>
          <div className="flex flex-wrap gap-2">
            {unusedItems.map((item) => {
              const itemData = useStore.getState().petItems.find((i) => i.id === item.item_id)
              return (
                <button
                  key={item.id}
                  onClick={() => usePetItem(pet.id, item.id, childId)}
                  className="px-3 py-2 rounded-xl bg-purple-100 text-purple-700 font-semibold text-sm active:bg-purple-200"
                >
                  {itemData?.icon || '🎁'} {itemData?.name || '用品'}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PetHome({ childId }) {
  const { ownedPets, petSpecies, children, loadPetData } = useStore()
  const child = children.find((c) => c.id === childId)
  const myPets = ownedPets.filter((p) => p.child_id === childId)
  const [showShop, setShowShop] = useState(false)

  return (
    <div>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏡</span>
          <h2 className="text-xl font-bold text-gray-800">我的宠物</h2>
        </div>
        <button
          onClick={() => setShowShop(true)}
          className="px-4 py-2 rounded-2xl bg-pink-500 text-white font-bold text-sm active:bg-pink-600"
        >
          🏪 领养宠物
        </button>
      </div>

      {myPets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🐾</div>
          <p className="text-xl font-bold text-gray-600 mb-2">还没有宠物</p>
          <p className="text-gray-400 mb-6">去领养中心领养一只吧！</p>
          <button
            onClick={() => setShowShop(true)}
            className="px-8 py-3 rounded-2xl bg-pink-500 text-white font-bold text-lg active:bg-pink-600"
          >
            🏪 去领养
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {myPets.map((pet) => {
            const species = petSpecies.find((s) => s.id === pet.species_id)
            return (
              <PetCard
                key={pet.id}
                pet={pet}
                species={species}
                childId={childId}
                points={child?.points || 0}
              />
            )
          })}
        </div>
      )}

      {/* 领养商店弹窗 */}
      {showShop && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowShop(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">🏪 宠物领养中心</h3>
              <button onClick={() => setShowShop(false)} className="text-gray-400 text-2xl">✕</button>
            </div>
            <PetShop childId={childId} onBought={() => setShowShop(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
