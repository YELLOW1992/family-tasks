import { useState, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import PetShop from './PetShop'
import { PetCharacter } from './PetSVG'

const CARE_ACTIONS = [
  { id: 'feed',  label: '喂食', icon: '🍖', cost: 2, stat: 'hunger',      color: 'bg-orange-100 text-orange-700 border-orange-200', emoji: '❤️' },
  { id: 'water', label: '喝水', icon: '💧', cost: 1, stat: 'thirst',      color: 'bg-blue-100 text-blue-700 border-blue-200',       emoji: '💧' },
  { id: 'bath',  label: '洗澡', icon: '🛁', cost: 3, stat: 'cleanliness', color: 'bg-cyan-100 text-cyan-700 border-cyan-200',       emoji: '✨' },
  { id: 'play',  label: '陪玩', icon: '🎾', cost: 2, stat: 'happiness',   color: 'bg-pink-100 text-pink-700 border-pink-200',       emoji: '🎉' },
]

const STAT_META = {
  hunger:      { label: '饱腹', icon: '🍖', color: 'bg-orange-400' },
  thirst:      { label: '水分', icon: '💧', color: 'bg-blue-400' },
  cleanliness: { label: '清洁', icon: '✨', color: 'bg-cyan-400' },
  happiness:   { label: '心情', icon: '😊', color: 'bg-pink-400' },
}

const ANIM_MAP = { feed: 'pet-bounce', water: 'head-shake', bath: 'pet-spin', play: 'play-jump' }
const STATS = ['hunger', 'thirst', 'cleanliness', 'happiness']
const CONFETTI_COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF6BFF','#FF9F43']

function getStage(level) {
  if ((level || 1) >= 11) return 'evolved'
  if ((level || 1) >= 6) return 'adult'
  return 'baby'
}

function getMood(pet) {
  const avg = STATS.reduce((s, k) => s + (pet[k] || 0), 0) / 4
  if (avg > 65) return 'happy'
  if (avg < 35) return 'sad'
  return 'neutral'
}

function isDay() {
  const h = new Date().getHours()
  return h >= 6 && h < 18
}
function SceneBackground({ day }) {
  if (day) return (
    <>
      <defs>
        <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB"/>
          <stop offset="100%" stopColor="#E0F4FF"/>
        </linearGradient>
      </defs>
      <rect width="360" height="160" fill="url(#sky-day)"/>
      {/* Sun */}
      <circle cx="300" cy="30" r="22" fill="#FFD700" opacity="0.9"/>
      {/* Clouds */}
      <g className="cloud-drift">
        <ellipse cx="70" cy="38" rx="32" ry="18" fill="white" opacity="0.85"/>
        <ellipse cx="90" cy="30" rx="22" ry="14" fill="white" opacity="0.85"/>
        <ellipse cx="50" cy="34" rx="18" ry="12" fill="white" opacity="0.85"/>
      </g>
      <g className="cloud-drift-slow">
        <ellipse cx="230" cy="55" rx="28" ry="16" fill="white" opacity="0.75"/>
        <ellipse cx="248" cy="47" rx="18" ry="12" fill="white" opacity="0.75"/>
        <ellipse cx="214" cy="51" rx="16" ry="11" fill="white" opacity="0.75"/>
      </g>
      {/* Ground */}
      <rect x="0" y="140" width="360" height="20" fill="#7BC67E" rx="4"/>
      <ellipse cx="60" cy="140" rx="22" ry="8" fill="#6AB86E"/>
      <ellipse cx="300" cy="140" rx="18" ry="7" fill="#6AB86E"/>
    </>
  )
  return (
    <>
      <defs>
        <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D1B4B"/>
          <stop offset="100%" stopColor="#1A3A6B"/>
        </linearGradient>
      </defs>
      <rect width="360" height="160" fill="url(#sky-night)"/>
      {/* Moon */}
      <circle cx="300" cy="34" r="18" fill="#FFF8DC" opacity="0.9"/>
      <circle cx="310" cy="28" r="14" fill="#1A3A6B"/>
      {/* Stars */}
      {[[40,20],[80,35],[150,15],[200,28],[250,18],[130,40],[60,50],[320,50]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="white" className="star-twinkle" style={{animationDelay:`${i*0.3}s`}}/>
      ))}
      {/* Ground */}
      <rect x="0" y="140" width="360" height="20" fill="#1B4D2E" rx="4"/>
      <ellipse cx="60" cy="140" rx="22" ry="8" fill="#163D24"/>
      <ellipse cx="300" cy="140" rx="18" ry="7" fill="#163D24"/>
    </>
  )
}

function StatBar({ value }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  const color = pct > 60 ? 'bg-green-400' : pct > 30 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }}/>
    </div>
  )
}

function FloatingEmoji({ emoji, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t) }, [])
  return (
    <div className="heart-pop absolute text-4xl pointer-events-none z-20"
      style={{ left: '50%', top: '15%', transform: 'translateX(-50%)' }}>
      {emoji}
    </div>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 14 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (Math.random() * 0.6).toFixed(2),
    size: 6 + Math.floor(Math.random() * 6),
  }))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {pieces.map((p, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            left: `${p.x}%`, top: 0,
            width: p.size, height: p.size,
            background: p.color,
            animation: `confetti-fall 1.2s ease-out ${p.delay}s forwards`,
          }}/>
      ))}
    </div>
  )
}

function EvolveBeam({ color='#9C27B0' }) {
  return (
    <div className="absolute inset-0 flex justify-center items-end pointer-events-none z-20 overflow-hidden">
      <div style={{
        width: 48, height: '100%',
        background: `linear-gradient(to top, ${color}CC, transparent)`,
        transformOrigin: 'bottom',
        animation: 'evolve-beam 0.9s ease-out forwards',
      }}/>
    </div>
  )
}

function GoldenFlash() {
  return (
    <div className="golden-flash absolute inset-0 pointer-events-none z-20 rounded-3xl"
      style={{ background: 'radial-gradient(ellipse at center, #FFD700CC 0%, transparent 70%)' }}/>
  )
}
function PetCard({ pet, species, childId, points }) {
  const { petCare, usePetItem, removePet, petRedemptions } = useStore()
  const [acting, setActing] = useState(null)
  const [petAnim, setPetAnim] = useState('pet-float')
  const [floatingEmojis, setFloatingEmojis] = useState([])
  const [levelUp, setLevelUp] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [evolveEffect, setEvolveEffect] = useState(null) // 'beam'|'golden'
  const [showEvolveAppear, setShowEvolveAppear] = useState(false)
  const emojiRef = useRef(0)
  const day = isDay()

  const mood = getMood(pet)
  const stage = getStage(pet.level)
  const speciesIcon = species?.icon || ''

  const health = Math.round(
    STATS.reduce((s, k) => s + (pet[k] || 0), 0) / 4
  )
  const expInLevel = (pet.exp || 0) % 100
  const expToNext = 100

  const myItems = (petRedemptions || []).filter(
    (r) => r.child_id === childId && !r.used
  )

  const triggerAnim = (cls) => {
    setPetAnim(cls)
    setTimeout(() => setPetAnim(mood === 'happy' ? 'pet-float' : 'idle-sway'), 900)
  }

  const addEmoji = (emoji) => {
    const id = ++emojiRef.current
    setFloatingEmojis((prev) => [...prev, { id, emoji }])
  }

  const removeEmoji = (id) => setFloatingEmojis((prev) => prev.filter((e) => e.id !== id))

  const handleCare = async (action) => {
    if (acting) return
    setActing(action.id)
    const prevStage = getStage(pet.level)
    triggerAnim(ANIM_MAP[action.id])
    addEmoji(action.emoji)
    if (action.id === 'water') { addEmoji('💧'); addEmoji('💧') }
    if (action.id === 'bath')  { addEmoji('✨'); addEmoji('🫧') }
    if (action.id === 'play')  { addEmoji('🎊') }
    await petCare(pet.id, action.id, childId, action.cost)
    const newLevel = Math.floor(((pet.exp || 0) + 10) / 100) + (pet.level || 1)
    const newStage = getStage(newLevel)
    if (newStage !== prevStage) {
      if (newStage === 'adult') {
        setEvolveEffect('beam')
        setTimeout(() => { setEvolveEffect(null); setShowEvolveAppear(true) }, 1000)
        setTimeout(() => setShowEvolveAppear(false), 1700)
      } else if (newStage === 'evolved') {
        setEvolveEffect('golden')
        setTimeout(() => setEvolveEffect(null), 900)
        setShowEvolveAppear(true)
        setTimeout(() => setShowEvolveAppear(false), 1500)
      }
    } else if (newLevel > (pet.level || 1)) {
      setLevelUp(true)
      setTimeout(() => setLevelUp(false), 2200)
    }
    setActing(null)
  }
  return (
    <div className="rounded-3xl shadow-xl overflow-hidden mb-6 relative">
      {/* Scene */}
      <div className="relative" style={{ height: 160 }}>
        <svg viewBox="0 0 360 160" width="100%" height="160" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
          <SceneBackground day={day}/>
        </svg>
        {/* Pet character */}
        <div className={`absolute left-1/2 -translate-x-1/2 ${showEvolveAppear ? 'evolve-appear' : ''}`}
          style={{ bottom: 18, zIndex: 5 }}>
          <div className={petAnim}>
            <PetCharacter speciesIcon={speciesIcon} stage={stage} mood={mood} size={112} animated={false}/>
          </div>
        </div>
        {/* Floating emojis */}
        {floatingEmojis.map((e) => (
          <FloatingEmoji key={e.id} emoji={e.emoji} onDone={() => removeEmoji(e.id)}/>
        ))}
        {/* Evolve effects */}
        {evolveEffect === 'beam' && <EvolveBeam color={stage === 'adult' ? '#9C27B0' : '#FFD700'}/>}
        {evolveEffect === 'golden' && <GoldenFlash/>}
        {/* Level-up confetti */}
        {levelUp && <Confetti/>}
        {/* Level-up text */}
        {levelUp && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="level-up-anim text-3xl font-black text-yellow-400 drop-shadow-lg">⭐ 升级啦！</div>
          </div>
        )}
        {/* Stage badge */}
        <div className="absolute top-2 left-3 z-10">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full shadow ${
            stage === 'evolved' ? 'bg-yellow-400 text-yellow-900' :
            stage === 'adult'   ? 'bg-purple-200 text-purple-800' :
                                  'bg-green-200 text-green-800'
          }`}>{stage === 'evolved' ? '✨进化体' : stage === 'adult' ? '🌟成长期' : '🥚幼年期'}</span>
        </div>
        {/* Delete btn */}
        <button onClick={() => setConfirmDelete(true)}
          className="absolute top-2 right-2 z-10 bg-white/70 rounded-full w-7 h-7 flex items-center justify-center text-red-400 text-sm shadow">
          🗑
        </button>
      </div>

      {/* Info panel */}
      <div className={`p-4 ${day ? 'bg-sky-50' : 'bg-indigo-950 text-white'}`}>
        {/* Name + level */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-black text-lg">{pet.name || species?.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            day ? 'bg-white text-gray-700 shadow-sm' : 'bg-white/20 text-white'
          }`}>Lv.{pet.level || 1}</span>
          <span className="text-base">{mood === 'happy' ? '😄' : mood === 'sad' ? '😢' : '😐'}</span>
        </div>
        {/* Exp bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs ${day ? 'text-gray-500' : 'text-white/60'}`}>经验</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-700"
              style={{ width: `${expInLevel}%` }}/>
          </div>
          <span className={`text-xs font-mono ${day ? 'text-gray-500' : 'text-white/60'}`}>{expInLevel}/{expToNext}</span>
        </div>
        {/* Stat bars */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-4">
          {STATS.map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="text-sm">{STAT_META[k].icon}</span>
              <span className={`text-xs w-8 ${day ? 'text-gray-500' : 'text-white/70'}`}>{STAT_META[k].label}</span>
              <StatBar value={pet[k]}/>
              <span className={`text-xs w-6 text-right font-mono ${day ? 'text-gray-500' : 'text-white/70'}`}>{Math.round(pet[k] || 0)}</span>
            </div>
          ))}
        </div>
        {/* Care buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {CARE_ACTIONS.map((action) => (
            <button key={action.id}
              onClick={() => handleCare(action)}
              disabled={!!acting}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-2xl border font-semibold text-xs transition-all active:scale-95 disabled:opacity-50 ${action.color}`}>
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
        {/* Items */}
        {myItems.length > 0 && (
          <div>
            <p className={`text-xs mb-1.5 ${day ? 'text-gray-500' : 'text-white/60'}`}>🎒 背包道具</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {myItems.map((r) => (
                <button key={r.id}
                  onClick={async () => { if (!acting) { setActing('item'); await usePetItem(r.id, pet.id, childId); setActing(null) } }}
                  disabled={!!acting}
                  className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl bg-white/80 border border-gray-200 text-xs font-semibold disabled:opacity-50">
                  <span className="text-xl">{r.icon || '🎁'}</span>
                  <span className="text-gray-600">{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-3xl">
          <div className="bg-white rounded-2xl p-6 mx-6 shadow-2xl text-center">
            <p className="text-lg font-bold text-gray-800 mb-1">删除宠物</p>
            <p className="text-sm text-gray-500 mb-5">「{pet.name || species?.name}」将永远离开，确认吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">取消</button>
              <button onClick={async () => { await removePet(pet.id); setConfirmDelete(false) }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold">确认删除</button>
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
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl pet-float" style={{ display: 'inline-block' }}>🏡</span>
          <h2 className="text-xl font-bold text-gray-800">我的宠物</h2>
        </div>
        <button
          onClick={() => setShowShop(true)}
          className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform">
          <span>🐾</span> 领养宠物
        </button>
      </div>

      {/* Empty state */}
      {myPets.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4" style={{ animation: 'pet-float 3s ease-in-out infinite', display: 'inline-block' }}>🐣</div>
          <p className="font-semibold text-gray-500 mb-1">还没有宠物</p>
          <p className="text-sm">去领养一只吧！</p>
        </div>
      )}

      {/* Pet cards */}
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

      {/* Adopt shop modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowShop(false)}>
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">🏪 宠物领养中心</h3>
              <button onClick={() => setShowShop(false)} className="text-gray-400 text-2xl">✕</button>
            </div>
            <PetShop childId={childId} onBought={() => setShowShop(false)}/>
          </div>
        </div>
      )}
    </div>
  )
}