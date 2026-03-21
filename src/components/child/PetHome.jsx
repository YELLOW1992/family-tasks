import { useState, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import PetShop from './PetShop'

const CARE_ACTIONS = [
  { id: 'feed',  label: '喂食',   icon: '🍖', cost: 2,  stat: 'hunger',      color: 'bg-orange-100 text-orange-700 active:bg-orange-200', emoji: '❤️' },
  { id: 'water', label: '喝水',   icon: '💧', cost: 1,  stat: 'thirst',      color: 'bg-blue-100 text-blue-700 active:bg-blue-200', emoji: '💦' },
  { id: 'bath',  label: '洗澡',   icon: '🛁', cost: 3,  stat: 'cleanliness', color: 'bg-cyan-100 text-cyan-700 active:bg-cyan-200', emoji: '✨' },
  { id: 'play',  label: '陪玩',   icon: '🎾', cost: 2,  stat: 'happiness',   color: 'bg-pink-100 text-pink-700 active:bg-pink-200', emoji: '🎉' },
]

const STAT_LABELS = {
  hunger:      { label: '饱腹', icon: '🍖', color: 'bg-orange-400' },
  thirst:      { label: '水分', icon: '💧', color: 'bg-blue-400' },
  cleanliness: { label: '清洁', icon: '✨', color: 'bg-cyan-400' },
  happiness:   { label: '心情', icon: '😊', color: 'bg-pink-400' },
  health:      { label: '健康', icon: '❤️', color: 'bg-red-400' },
}

function FloatingEmoji({ emoji, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1000)
    return () => clearTimeout(t)
  }, [])
  return (
    <div
      key={id}
      className="heart-pop absolute text-3xl"
      style={{ left: '50%', top: '10%', transform: 'translateX(-50%)' }}
    >
      {emoji}
    </div>
  )
}

function StatBar({ value, colorClass }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  const barColor = pct > 60 ? colorClass : pct > 30 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
        style={{ width: `${pct}%`, animation: 'stat-fill 0.7s ease-out' }}
      />
    </div>
  )
}

function PetCard({ pet, species, childId, points }) {
  const { petCare, petRedemptions, usePetItem, removePet } = useStore()
  const [acting, setActing] = useState(null)
  const [petAnim, setPetAnim] = useState('pet-float')
  const [floatingEmojis, setFloatingEmojis] = useState([])
  const [levelUp, setLevelUp] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const emojiCountRef = useRef(0)

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

  const unusedItems = petRedemptions.filter(
    (r) => r.child_id === childId && !r.used
  )

  const triggerAnim = (animClass) => {
    setPetAnim(animClass)
    setTimeout(() => setPetAnim('pet-float'), 800)
  }

  const addFloatingEmoji = (emoji) => {
    const id = ++emojiCountRef.current
    setFloatingEmojis((prev) => [...prev, { id, emoji }])
  }

  const removeEmoji = (id) => {
    setFloatingEmojis((prev) => prev.filter((e) => e.id !== id))
  }

  const handleCare = async (action) => {
    if (acting) return
    setActing(action.id)
    const prevLevel = pet.level
    // trigger pet animation
    const animMap = { feed: 'pet-bounce', water: 'pet-shake', bath: 'pet-spin', play: 'pet-bounce' }
    triggerAnim(animMap[action.id] || 'pet-bounce')
    addFloatingEmoji(action.emoji)
    await petCare(pet.id, action.id, childId, action.cost)
    // check level up
    const newExp = (pet.exp || 0) + 10
    if (Math.floor(newExp / 100) + 1 > prevLevel) {
      setLevelUp(true)
      setTimeout(() => setLevelUp(false), 2000)
    }
    setActing(null)
  }

  const expPct = ((pet.exp || 0) % 100)
  const mood = health > 70 ? '😄' : health > 40 ? '😐' : '😢'

  // background gradient based on health
  const bgGradient = health > 70
    ? 'from-green-50 to-blue-50'
    : health > 40
    ? 'from-yellow-50 to-orange-50'
    : 'from-red-50 to-pink-50'

  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-3xl shadow-lg p-5 flex flex-col gap-4 relative overflow-hidden`}>
      {/* 星星背景装饰 */}
      <div className="absolute top-2 right-4 text-yellow-200 text-2xl opacity-60" style={{ animation: 'sparkle 2s ease-in-out infinite' }}>✦</div>
      <div className="absolute top-8 right-12 text-pink-200 text-lg opacity-60" style={{ animation: 'sparkle 2.5s ease-in-out infinite 0.5s' }}>✦</div>
      <div className="absolute top-3 right-8 text-blue-200 text-sm opacity-60" style={{ animation: 'sparkle 1.8s ease-in-out infinite 1s' }}>✦</div>

      {/* 宠物头部 */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {/* 浮动 emoji */}
          {floatingEmojis.map((e) => (
            <FloatingEmoji key={e.id} id={e.id} emoji={e.emoji} onDone={() => removeEmoji(e.id)} />
          ))}
          <div
            className={`text-7xl select-none cursor-pointer ${petAnim} ${levelUp ? 'level-up-anim' : ''}`}
            onClick={() => { triggerAnim('pet-bounce'); addFloatingEmoji('💕') }}
          >
            {species?.icon || '🐾'}
          </div>
          <span className="absolute -bottom-1 -right-1 text-2xl">{mood}</span>
          {levelUp && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 font-black text-sm whitespace-nowrap" style={{ animation: 'heart-pop 1.5s ease-out forwards' }}>
              ⬆️ 升级啦！
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-2xl font-bold text-gray-800">{pet.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-sm font-bold ${levelUp ? 'bg-yellow-400 text-white level-up-anim' : 'bg-indigo-100 text-indigo-700'}`}>
              Lv.{pet.level}
            </span>
            <button
              onClick={() => setConfirmDelete(true)}
              className="ml-auto text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              🗑️ 删除
            </button>
          </div>
          <p className="text-gray-500 text-sm">{species?.name}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>经验</span>
              <span>{expPct}/100</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${expPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 状态条 */}
      <div className="flex flex-col gap-2 bg-white/60 rounded-2xl p-3">
        {Object.entries(STAT_LABELS).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-base w-5">{cfg.icon}</span>
            <span className="text-xs text-gray-500 w-8">{cfg.label}</span>
            <StatBar value={stats[key]} colorClass={cfg.color} />
            <span className={`text-xs w-8 text-right font-bold ${
              stats[key] > 60 ? 'text-green-600' : stats[key] > 30 ? 'text-yellow-600' : 'text-red-500'
            }`}>{stats[key]}</span>
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
            className={`py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 transition-transform active:scale-95 shadow-sm ${action.color}`}
          >
            <span className={acting === action.id ? 'pet-spin' : ''}>{action.icon}</span>
            <span>{action.label}</span>
            <span className="text-xs opacity-60">-{action.cost}分</span>
          </button>
        ))}
      </div>

      {/* 宠物用品背包 */}
      {unusedItems.length > 0 && (
        <div className="bg-white/60 rounded-2xl p-3">
          <p className="text-sm font-semibold text-gray-600 mb-2">🎒 背包用品</p>
          <div className="flex flex-wrap gap-2">
            {unusedItems.map((item) => {
              const itemData = useStore.getState().petItems.find((i) => i.id === item.item_id)
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    triggerAnim('pet-bounce')
                    addFloatingEmoji('🌟')
                    usePetItem(pet.id, item.id, childId)
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-100 text-purple-700 font-semibold text-sm active:scale-95 transition-transform"
                >
                  {itemData?.icon || '🎁'} {itemData?.name || '用品'}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setConfirmDelete(false)}>
          <div className="bg-white rounded-3xl p-6 mx-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">{species?.icon || '🐾'}</div>
              <h3 className="text-xl font-bold text-gray-800">确认删除宠物？</h3>
              <p className="text-gray-500 mt-2 text-sm">「{pet.name}」将永久离开，无法恢复。</p>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-base active:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={async () => { await removePet(pet.id); setConfirmDelete(false) }}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold text-base active:bg-red-600"
              >
                确认删除
              </button>
            </div>
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

  useEffect(() => { loadPetData() }, [])

  return (
    <div>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl" style={{ animation: 'pet-float 2s ease-in-out infinite' }}>🏡</span>
          <h2 className="text-xl font-bold text-gray-800">我的宠物</h2>
        </div>
        <button
          onClick={() => setShowShop(true)}
          className="px-4 py-2 rounded-2xl bg-pink-500 text-white font-bold text-sm active:scale-95 transition-transform shadow"
        >
          🏪 领养宠物
        </button>
      </div>

      {myPets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4 pet-float inline-block">🐾</div>
          <p className="text-xl font-bold text-gray-600 mb-2">还没有宠物</p>
          <p className="text-gray-400 mb-6">去领养中心领养一只吧！</p>
          <button
            onClick={() => setShowShop(true)}
            className="px-8 py-3 rounded-2xl bg-pink-500 text-white font-bold text-lg active:scale-95 transition-transform shadow"
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
