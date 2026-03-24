import { useState, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import PetShop from './PetShop'
import { PetCharacter } from './PetSVG'

const CARE_ACTIONS = [
  { id: 'feed',  label: '喂食', icon: '🍖', cost: 2, stat: 'hunger',      emoji: '❤️',  stripe: '#FF6B35', glow: '#FF6B3566' },
  { id: 'water', label: '喝水', icon: '💧', cost: 1, stat: 'thirst',      emoji: '💧',  stripe: '#4FC3F7', glow: '#4FC3F766' },
  { id: 'bath',  label: '洗澡', icon: '🛁', cost: 3, stat: 'cleanliness', emoji: '✨',  stripe: '#26C6DA', glow: '#26C6DA66' },
  { id: 'play',  label: '陪玩', icon: '🎾', cost: 2, stat: 'happiness',   emoji: '🎉',  stripe: '#EC407A', glow: '#EC407A66' },
]

const STAT_META = {
  hunger:      { label: '饱腹', icon: '🍖', grad: 'linear-gradient(90deg,#FF6B35,#FF4500)' },
  thirst:      { label: '水分', icon: '💧', grad: 'linear-gradient(90deg,#4FC3F7,#7C4DFF)' },
  cleanliness: { label: '清洁', icon: '✨', grad: 'linear-gradient(90deg,#26C6DA,#00BFA5)' },
  happiness:   { label: '心情', icon: '😊', grad: 'linear-gradient(90deg,#EC407A,#FF80AB)' },
}

const ANIM_MAP = { feed: 'pet-bounce', water: 'head-shake', bath: 'pet-spin', play: 'play-jump' }
const STATS = ['hunger', 'thirst', 'cleanliness', 'happiness']
const CONFETTI_COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF6BFF','#FF9F43']
const MOOD_GLOW = { happy: '#FFD700', neutral: '#7C4DFF', sad: '#607D8B' }

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${8 + Math.floor(i * 9.5)}%`,
  size: 3 + (i % 3),
  delay: `${(i * 0.4).toFixed(1)}s`,
  dur: `${2.5 + (i % 3) * 0.7}s`,
  color: ['#FFD700','#FF80AB','#80D8FF','#CCFF90','#FFD700'][i % 5],
}))

function getStage(level) {
  if ((level || 1) >= 11) return 'evolved'
  if ((level || 1) >= 6) return 'adult'
  return 'baby'
}
function getMood(pet) {
  const avg = STATS.reduce((s, k) => s + (pet[k] || 0), 0) / 4
  return avg > 65 ? 'happy' : avg < 35 ? 'sad' : 'neutral'
}
function isDay() { const h = new Date().getHours(); return h >= 6 && h < 18 }
function CornerDeco() {
  return (
    <>
      {[['top-0 left-0','0 0'],['top-0 right-0','rotate(90,8,8)'],['bottom-0 left-0','rotate(-90,8,8)'],['bottom-0 right-0','rotate(180,8,8)']].map(([pos, t], i) => (
        <svg key={i} className={`absolute ${pos} w-6 h-6`} viewBox="0 0 16 16">
          <polygon points="0,0 14,0 0,14" fill="#FFD700" opacity="0.5" transform={t}/>
        </svg>
      ))}
    </>
  )
}

function SceneBackground({ day }) {
  if (day) return (
    <>
      <defs>
        <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB"/><stop offset="100%" stopColor="#E0F4FF"/>
        </linearGradient>
      </defs>
      <rect width="360" height="160" fill="url(#sky-day)"/>
      <circle cx="300" cy="30" r="22" fill="#FFD700" opacity="0.9"/>
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
      <rect x="0" y="140" width="360" height="20" fill="#7BC67E" rx="4"/>
      <ellipse cx="60" cy="140" rx="22" ry="8" fill="#6AB86E"/>
      <ellipse cx="300" cy="140" rx="18" ry="7" fill="#6AB86E"/>
    </>
  )
  return (
    <>
      <defs>
        <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D1B4B"/><stop offset="100%" stopColor="#1A3A6B"/>
        </linearGradient>
      </defs>
      <rect width="360" height="160" fill="url(#sky-night)"/>
      <circle cx="300" cy="34" r="18" fill="#FFF8DC" opacity="0.9"/>
      <circle cx="310" cy="28" r="14" fill="#1A3A6B"/>
      {[[40,20],[80,35],[150,15],[200,28],[250,18],[130,40],[60,50],[320,50]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="white" className="star-twinkle" style={{animationDelay:`${i*0.3}s`}}/>
      ))}
      <rect x="0" y="140" width="360" height="20" fill="#1B4D2E" rx="4"/>
      <ellipse cx="60" cy="140" rx="22" ry="8" fill="#163D24"/>
      <ellipse cx="300" cy="140" rx="18" ry="7" fill="#163D24"/>
    </>
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
          style={{ left:`${p.x}%`, top:0, width:p.size, height:p.size,
            background:p.color, animation:`confetti-fall 1.2s ease-out ${p.delay}s forwards` }}/>
      ))}
    </div>
  )
}

function EvolveBeam({ color='#9C27B0' }) {
  return (
    <div className="absolute inset-0 flex justify-center items-end pointer-events-none z-20 overflow-hidden">
      <div style={{ width:48, height:'100%',
        background:`linear-gradient(to top, ${color}CC, transparent)`,
        transformOrigin:'bottom', animation:'evolve-beam 0.9s ease-out forwards' }}/>
    </div>
  )
}

function GoldenFlash() {
  return (
    <div className="golden-flash absolute inset-0 pointer-events-none z-20 rounded-3xl"
      style={{ background:'radial-gradient(ellipse at center, #FFD700CC 0%, transparent 70%)' }}/>
  )
}
function PetCard({ pet, species, childId }) {
  const { petCare, usePetItem, removePet, petRedemptions } = useStore()
  const [acting, setActing] = useState(null)
  const [petAnim, setPetAnim] = useState('pet-float')
  const [floatingEmojis, setFloatingEmojis] = useState([])
  const [levelUp, setLevelUp] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [evolveEffect, setEvolveEffect] = useState(null)
  const [showEvolveAppear, setShowEvolveAppear] = useState(false)
  const emojiRef = useRef(0)
  const day = isDay()
  const mood = getMood(pet)
  const stage = getStage(pet.level)
  const speciesIcon = species?.icon || ''
  const expInLevel = (pet.exp || 0) % 100
  const myItems = (petRedemptions || []).filter(r => r.child_id === childId && !r.used)

  const triggerAnim = (cls) => {
    setPetAnim(cls)
    setTimeout(() => setPetAnim(mood === 'happy' ? 'pet-float' : 'idle-sway'), 900)
  }
  const addEmoji = (emoji) => {
    const id = ++emojiRef.current
    setFloatingEmojis(prev => [...prev, { id, emoji }])
  }
  const removeEmoji = (id) => setFloatingEmojis(prev => prev.filter(e => e.id !== id))

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
      setEvolveEffect(newStage === 'evolved' ? 'golden' : 'beam')
      setTimeout(() => { setEvolveEffect(null); setShowEvolveAppear(true) }, 1000)
      setTimeout(() => setShowEvolveAppear(false), 1700)
    } else if (newLevel > (pet.level || 1)) {
      setLevelUp(true)
      setTimeout(() => setLevelUp(false), 2200)
    }
    setActing(null)
  }
  const stageInfo = stage === 'evolved'
    ? { label: '👑 进化体', bg: 'linear-gradient(135deg,#FFD700,#FF8C00)', color: '#7B4F00' }
    : stage === 'adult'
    ? { label: '🌟 成长期', bg: 'linear-gradient(135deg,#9C27B0,#673AB7)', color: '#EDE7F6' }
    : { label: '🌱 幼年期', bg: 'linear-gradient(135deg,#43A047,#1B5E20)', color: '#F1F8E9' }

  return (
    <div className="relative rounded-3xl mb-6 overflow-hidden"
      style={{ background:'#fff', border:'2px solid #FFD70088', boxShadow:'0 0 16px #FFD70022, 0 4px 16px #0001' }}>
      <CornerDeco/>

      {/* Scene */}
      <div className="relative" style={{ height:160 }}>
        <svg viewBox="0 0 360 160" width="100%" height="160" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
          <SceneBackground day={day}/>
        </svg>
        {/* Mood glow behind pet */}
        <div className="absolute" style={{ left:'50%', bottom:10, transform:'translateX(-50%)', width:110, height:60,
          background:`radial-gradient(ellipse at center, ${MOOD_GLOW[mood]}55 0%, transparent 70%)`, zIndex:3 }}/>
        {/* Particles */}
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full pointer-events-none"
            style={{ left:p.left, bottom:`${20+p.id*4}%`, width:p.size, height:p.size,
              background:p.color, opacity:0.7, zIndex:4,
              animation:`particle-rise ${p.dur} ease-out ${p.delay} infinite` }}/>
        ))}
        {/* Pet */}
        <div className={`absolute left-1/2 -translate-x-1/2 ${showEvolveAppear ? 'evolve-appear' : ''}`}
          style={{ bottom:18, zIndex:5 }}>
          <div className={petAnim}>
            <PetCharacter speciesIcon={speciesIcon} stage={stage} mood={mood} size={112} animated={false}/>
          </div>
        </div>
        {floatingEmojis.map(e => <FloatingEmoji key={e.id} emoji={e.emoji} onDone={() => removeEmoji(e.id)}/>)}
        {evolveEffect === 'beam' && <EvolveBeam color="#9C27B0"/>}
        {evolveEffect === 'golden' && <GoldenFlash/>}
        {levelUp && <Confetti/>}
        {levelUp && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="level-up-anim text-3xl font-black drop-shadow-lg" style={{ color:'#FFD700', textShadow:'0 0 16px #FFD700' }}>⭐ 升级啦！</div>
          </div>
        )}
        {/* Stage badge */}
        <div className="absolute top-2 left-3 z-10">
          <span className="text-xs font-bold px-2 py-1 rounded-full shadow-lg" style={{ background:stageInfo.bg, color:stageInfo.color }}>{stageInfo.label}</span>
        </div>
        {/* Delete */}
        <button onClick={() => setConfirmDelete(true)}
          className="absolute top-2 right-2 z-10 rounded-full w-7 h-7 flex items-center justify-center text-sm"
          style={{ background:'rgba(0,0,0,0.4)', color:'#FF8A80', border:'1px solid #FF8A8066' }}>🗑</button>
      </div>
      {/* Info panel */}
      <div className="px-4 pt-3 pb-2">
        {/* Name + level */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black truncate"
            style={{ color:'#E65100', textShadow:'none' }}>
            {speciesIcon} {pet.name}
          </h3>
          <div className="glow-pulse flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black"
            style={{ background:'linear-gradient(135deg,#FFD700,#FF8C00)', color:'#3E2000', minWidth:52, justifyContent:'center' }}>
            Lv.{pet.level || 1}
          </div>
        </div>
        {/* EXP bar */}
        <div className="shimmer-bar rounded-full mb-3" style={{ height:10, background:'rgba(0,0,0,0.4)', border:'1px solid #FFD70044' }}>
          <div className="h-full rounded-full" style={{ width:`${expInLevel}%`, background:'linear-gradient(90deg,#FFD700,#FF8C00)', transition:'width 0.6s ease' }}/>
        </div>
        {/* Stats HUD */}
        <div className="rounded-2xl p-3 mb-3" style={{ background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.07)' }}>
          {STATS.map(k => {
            const m = STAT_META[k]
            const val = Math.round(pet[k] || 0)
            const low = val < 30
            return (
              <div key={k} className="flex items-center gap-2 mb-1 last:mb-0">
                <span className="text-base w-5 text-center">{m.icon}</span>
                <span className="text-xs w-8" style={{ color: low ? '#FF5252' : '#78909C', fontWeight: low ? 700 : 400 }}>
                  {low ? '⚠' : ''}{val}
                </span>
                <div className="flex-1 rounded-full" style={{ height:8, background:'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width:`${val}%`, background:m.grad, transition:'width 0.5s ease' }}/>
                </div>
                <span className="text-xs w-10 text-right" style={{ color:'#B0BEC5' }}>{m.label}</span>
              </div>
            )
          })}
        </div>
        {/* Care buttons — skill cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {CARE_ACTIONS.map(action => {
            const isActing = acting === action.id
            return (
              <button key={action.id} disabled={!!acting}
                onClick={() => handleCare(action)}
                className="relative rounded-2xl overflow-hidden text-left active:scale-90 transition-transform"
                style={{ background:'#fff', border:`1.5px solid ${action.stripe}44`, boxShadow: acting ? 'none' : `0 2px 8px ${action.glow}` }}>
                {/* top stripe */}
                <div style={{ height:4, background:action.stripe }}/>
                <div className="px-3 py-2">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{action.icon}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1"
                      style={{ background:action.glow, color:'#fff' }}>⭐{action.cost}</span>
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: isActing ? '#aaa' : '#424242' }}>
                    {isActing ? '⏳…' : action.label}
                  </div>
                </div>
                {/* flash overlay on active */}
                {isActing && <div className="absolute inset-0 rounded-2xl" style={{ background:'rgba(255,255,255,0.08)' }}/>}
              </button>
            )
          })}
        </div>
        {/* Items */}
        {myItems.length > 0 && (
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-2">
              {myItems.map(item => (
                <button key={item.id}
                  onClick={() => usePetItem(item.id, pet.id, childId)}
                  className="flex-shrink-0 rounded-2xl px-3 py-2 text-center"
                  style={{ background:'#fff', border:'1.5px solid #FFD70088', minWidth:64, boxShadow:'0 2px 6px #FFD70022' }}>
                  <div className="text-2xl">{item.icon}</div>
                  <div className="text-xs mt-1" style={{ color:'#616161' }}>{item.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="rounded-3xl p-6 w-full max-w-xs text-center" style={{ background:'#fff', border:'2px solid #FF8A8066', boxShadow:'0 4px 24px #0002' }}>
            <div className="text-4xl mb-3">🗑</div>
            <h3 className="text-lg font-black mb-1" style={{ color:'#E65100' }}>确认删除宠物？</h3>
            <p className="text-sm mb-4" style={{ color:'#757575' }}>删除后无法恢复，积分不退还。</p>
            <div className="flex gap-3">
              <button onClick={() => { removePet(pet.id); setConfirmDelete(false) }}
                className="flex-1 py-2 rounded-2xl font-bold text-white" style={{ background:'#FF5252' }}>删除</button>
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-2xl font-bold" style={{ background:'#F5F5F5', color:'#616161' }}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default function PetHome({ childId }) {
  const { ownedPets, petSpecies, petRedemptions, petItems } = useStore()
  const [tab, setTab] = useState('home')
  const myPets = ownedPets.filter(p => p.child_id === childId)

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,#F0F4FF,#FFF5FB)' }}>
      {/* Tab bar */}
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {[['home','🏠 我的宠物'],['shop','🏪 领养中心']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2 rounded-2xl text-sm font-bold transition-all"
            style={tab===key
              ? { background:'linear-gradient(135deg,#FFD700,#FF8C00)', color:'#3E2000', boxShadow:'0 0 12px #FFD70066' }
              : { background:'rgba(0,0,0,0.07)', color:'#90A4AE' }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8">
        {tab === 'shop' ? (
          <PetShop childId={childId} onBought={() => setTab('home')}/>
        ) : myPets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🐾</div>
            <p className="text-xl font-bold mb-2" style={{ color:'#E65100' }}>还没有宠物</p>
            <p className="text-sm mb-6" style={{ color:'#90A4AE' }}>去领养中心领养一只吧！</p>
            <button onClick={() => setTab('shop')}
              className="px-8 py-3 rounded-2xl font-bold text-lg"
              style={{ background:'linear-gradient(135deg,#FFD700,#FF8C00)', color:'#3E2000' }}>去领养</button>
          </div>
        ) : (
          myPets.map(pet => {
            const species = petSpecies.find(s => s.id === pet.species_id)
            return <PetCard key={pet.id} pet={pet} species={species} childId={childId}/>
          })
        )}
      </div>
    </div>
  )
}