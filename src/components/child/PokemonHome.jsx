import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import EvolutionView from './pokemon/EvolutionView'
import PokemonSwitcher from './pokemon/PokemonSwitcher'
import ItemShop from './pokemon/ItemShop'
import InteractionPanel from './pokemon/InteractionPanel'

// 获取宝可梦图片URL和动画类名
const getPokemonImageUrl = (speciesName, animation = 'idle') => {
  // 根据动画状态返回不同的皮卡丘姿势和对应的CSS动画类
  const animationMap = {
    'idle': { url: '/pikachu-2.png', class: 'animate-pikachu-sitting' },      // 坐着（默认）
    'happy': { url: '/pikachu-3.png', class: 'animate-pikachu-jumping' },     // 跳跃（开心）
    'playing': { url: '/pikachu-4.png', class: 'animate-pikachu-running' },   // 奔跑（玩耍）
    'eating': { url: '/pikachu-2.png', class: 'animate-pikachu-sitting' },    // 坐着（吃东西）
    'drinking': { url: '/pikachu-2.png', class: 'animate-pikachu-sitting' },  // 坐着（喝水）
    'bathing': { url: '/pikachu-1.png', class: 'animate-pikachu-laying' },    // 躺着（洗澡）
    'sleeping': { url: '/pikachu-1.png', class: 'animate-pikachu-laying' },   // 躺着（睡觉）
  }

  return animationMap[animation] || animationMap['idle']
}

export default function PokemonHome({ childId }) {
  const [currentView, setCurrentView] = useState('main') // main, evolution, switch, shop
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [animation, setAnimation] = useState('idle') // idle, happy, eating, drinking, bathing, playing
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showInteractDrawer, setShowInteractDrawer] = useState(false)

  const ownedPets = useStore((s) => s.ownedPets)
  const petSpecies = useStore((s) => s.petSpecies)
  const children = useStore((s) => s.children)

  const child = children.find(c => c.id === childId)
  const myPets = ownedPets.filter(p => p.child_id === childId)

  // 默认选中第一只宝可梦
  useEffect(() => {
    if (myPets.length > 0 && !selectedPokemon) {
      setSelectedPokemon(myPets[0])
    }
  }, [myPets, selectedPokemon])

  const currentSpecies = selectedPokemon ? petSpecies.find(s => s.id === selectedPokemon.species_id) : null
  const imageData = getPokemonImageUrl(currentSpecies?.name || '皮卡丘', animation)
  const imageUrl = imageData.url
  const imageAnimClass = imageData.class

  // 触发动画
  const triggerAnimation = (animType) => {
    setAnimation(animType)
    setTimeout(() => setAnimation('idle'), 2000)
  }

  if (!child) return <div className="p-4">未找到孩子信息</div>

  // 主界面
  if (currentView === 'main') {
    return (
      <div className="h-screen bg-gradient-to-b from-sky-400 via-green-300 to-green-400 flex flex-col relative overflow-hidden touch-none">
        {/* 草地纹理背景 */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,100,0,0.1) 2px, rgba(0,100,0,0.1) 4px),
                           repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,100,0,0.1) 2px, rgba(0,100,0,0.1) 4px)`
        }}></div>

        {/* 装饰性草丛 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-600/40 to-transparent pointer-events-none"></div>

        {selectedPokemon ? (
          <div className="relative z-10 flex-1 flex items-start justify-center px-4 pt-2">
            {/* 宝可梦显示区域 */}
            <div className="flex items-start gap-3 max-w-4xl w-full">
              {/* 左侧：宝可梦图片 */}
              <div className="flex-1 flex flex-col items-center">
                {/* 宝可梦图片 - 单张图片动画 */}
                <div className="relative mt-8">
                  {/* 底部阴影 */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-3 bg-black/20 rounded-full blur-lg"></div>

                  {!imageLoaded && (
                    <div className="w-40 h-40 flex items-center justify-center">
                      <div className="text-6xl animate-bounce">⚡</div>
                    </div>
                  )}

                  <img
                    src={imageUrl}
                    alt={selectedPokemon.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      console.error('Image load failed:', imageUrl)
                      setImageLoaded(false)
                    }}
                    className={`w-40 h-40 object-contain drop-shadow-2xl transition-opacity duration-500 ${
                      imageLoaded ? `opacity-100 ${imageAnimClass}` : 'opacity-0'
                    }`}
                    style={{
                      filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.3))',
                    }}
                  />
                </div>

                {/* 等级和经验值条 */}
                <div className="mt-8 w-full max-w-xs">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[10px] font-bold text-white drop-shadow">Lv.{selectedPokemon.level} 经验值</span>
                    <span className="text-[10px] font-mono font-bold text-white drop-shadow">{selectedPokemon.exp} / {selectedPokemon.level * 100}</span>
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden border border-white/80">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 transition-all duration-500 relative"
                      style={{ width: `${((selectedPokemon.exp || 0) % 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* 状态条 */}
                <div className="mt-1.5 w-full max-w-xs bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
                  <div className="grid grid-cols-2 gap-1.5">
                    <StatBar label="饱腹" value={selectedPokemon.hunger} emoji="🍖" color="orange" />
                    <StatBar label="口渴" value={selectedPokemon.thirst} emoji="💧" color="blue" />
                    <StatBar label="清洁" value={selectedPokemon.cleanliness} emoji="✨" color="purple" />
                    <StatBar label="心情" value={selectedPokemon.happiness} emoji="😊" color="pink" />
                  </div>
                </div>
              </div>
              {/* 右侧：功能按钮 */}
              <div className="flex flex-col gap-1.5 pt-2">
                <ActionButton
                  icon="📊"
                  label="属性"
                  bgColor="bg-yellow-500"
                  borderColor="border-yellow-700"
                  onClick={() => {}}
                />
                <ActionButton
                  icon="🎒"
                  label="道具"
                  bgColor="bg-green-500"
                  borderColor="border-green-700"
                  onClick={() => setCurrentView('shop')}
                />
                <ActionButton
                  icon="🔄"
                  label="切换"
                  bgColor="bg-orange-500"
                  borderColor="border-orange-700"
                  onClick={() => setCurrentView('switch')}
                />
                <ActionButton
                  icon="⚡"
                  label="进化"
                  bgColor="bg-red-500"
                  borderColor="border-red-700"
                  onClick={() => setCurrentView('evolution')}
                />
                <ActionButton
                  icon="🎮"
                  label="互动"
                  bgColor="bg-purple-500"
                  borderColor="border-purple-700"
                  onClick={() => setShowInteractDrawer(true)}
                />
              </div>
            </div>
          </div>
        ) : (
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">🥚</div>
              <p className="text-xl text-white font-bold mb-4 drop-shadow-lg">你还没有宝可梦</p>
              <button
                onClick={() => setCurrentView('switch')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                去领养宝可梦
              </button>
            </div>
          )}

        {/* 动画特效 */}
        {animation === 'happy' && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="text-4xl absolute top-1/4 left-1/4 animate-ping">✨</div>
            <div className="text-4xl absolute top-1/3 right-1/4 animate-ping" style={{animationDelay: '0.2s'}}>⭐</div>
            <div className="text-4xl absolute bottom-1/3 left-1/3 animate-ping" style={{animationDelay: '0.4s'}}>💫</div>
          </div>
        )}

        {animation === 'eating' && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-6xl animate-bounce z-20">🍎</div>
        )}

        {animation === 'drinking' && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-6xl animate-bounce z-20">💧</div>
        )}

        {/* 互动抽屉 */}
        {showInteractDrawer && (
          <div
            className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
            onClick={() => setShowInteractDrawer(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transform transition-transform duration-300 ease-out"
              style={{ maxHeight: '70vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-center mb-4">与 {selectedPokemon?.name} 互动</h3>

              <div className="grid grid-cols-2 gap-3 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 100px)' }}>
                <InteractButton
                  icon="🍎"
                  label="喂食"
                  description="+20 饱腹"
                  onClick={() => {
                    triggerAnimation('eating')
                    setShowInteractDrawer(false)
                  }}
                />
                <InteractButton
                  icon="💧"
                  label="喝水"
                  description="+20 口渴"
                  onClick={() => {
                    triggerAnimation('drinking')
                    setShowInteractDrawer(false)
                  }}
                />
                <InteractButton
                  icon="🛁"
                  label="洗澡"
                  description="+20 清洁"
                  onClick={() => {
                    triggerAnimation('bathing')
                    setShowInteractDrawer(false)
                  }}
                />
                <InteractButton
                  icon="🎮"
                  label="玩耍"
                  description="+20 心情"
                  onClick={() => {
                    triggerAnimation('playing')
                    setShowInteractDrawer(false)
                  }}
                />
                <InteractButton
                  icon="😊"
                  label="抚摸"
                  description="+10 心情"
                  onClick={() => {
                    triggerAnimation('happy')
                    setShowInteractDrawer(false)
                  }}
                />
                <InteractButton
                  icon="😴"
                  label="睡觉"
                  description="恢复全部"
                  onClick={() => {
                    triggerAnimation('sleeping')
                    setShowInteractDrawer(false)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          .animate-wiggle {
            animation: wiggle 0.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  // 进化路线视图
  if (currentView === 'evolution') {
    return (
      <EvolutionView
        pokemon={selectedPokemon}
        species={currentSpecies}
        onBack={() => setCurrentView('main')}
      />
    )
  }

  // 切换宝可梦视图
  if (currentView === 'switch') {
    return (
      <PokemonSwitcher
        childId={childId}
        currentPokemon={selectedPokemon}
        onSelect={(pet) => {
          setSelectedPokemon(pet)
          setCurrentView('main')
        }}
        onBack={() => setCurrentView('main')}
      />
    )
  }

  // 物品商店视图
  if (currentView === 'shop') {
    return (
      <ItemShop
        childId={childId}
        onBack={() => setCurrentView('main')}
      />
    )
  }

  // 互动面板视图
  if (currentView === 'interact') {
    return (
      <InteractionPanel
        pokemon={selectedPokemon}
        childId={childId}
        onInteract={(action) => {
          triggerAnimation(action)
          setCurrentView('main')
        }}
        onBack={() => setCurrentView('main')}
      />
    )
  }
}

// 互动按钮组件
function InteractButton({ icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 active:scale-95 transition-transform shadow-md"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm font-bold text-gray-800">{label}</div>
      <div className="text-xs text-gray-600 mt-1">{description}</div>
    </button>
  )
}

// 状态条组件
function StatBar({ label, value, emoji, color }) {
  const colors = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[10px] font-semibold text-gray-700">{emoji} {label}</span>
        <span className="text-[10px] font-bold text-gray-800">{value}/100</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
        <div
          className={`h-full ${colors[color]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// 右侧功能按钮组件
function ActionButton({ icon, label, bgColor, borderColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${borderColor} border-2 rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform`}
    >
      <div className="text-xl">{icon}</div>
      <div className="text-[9px] font-bold text-white leading-tight">{label}</div>
    </button>
  )
}
