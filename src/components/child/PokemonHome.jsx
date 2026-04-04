import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import PikachuSVG from './pokemon/PikachuSVG'
import EvolutionView from './pokemon/EvolutionView'
import PokemonSwitcher from './pokemon/PokemonSwitcher'
import ItemShop from './pokemon/ItemShop'
import InteractionPanel from './pokemon/InteractionPanel'

export default function PokemonHome({ childId }) {
  const [currentView, setCurrentView] = useState('main') // main, evolution, switch, shop
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [animation, setAnimation] = useState('idle') // idle, happy, eating, drinking, bathing, playing

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

  // 触发动画
  const triggerAnimation = (animType) => {
    setAnimation(animType)
    setTimeout(() => setAnimation('idle'), 2000)
  }

  if (!child) return <div className="p-4">未找到孩子信息</div>

  // 主界面
  if (currentView === 'main') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 to-green-200 flex flex-col">
        {/* 顶部信息栏 */}
        <div className="bg-white/90 backdrop-blur p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{child.name} 的宝可梦</h2>
              <p className="text-sm text-gray-600">积分: {child.points} 💰</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              返回
            </button>
          </div>
        </div>

        {/* 宝可梦显示区域 */}
        <div className="flex-1 flex items-center justify-center p-8">
          {selectedPokemon ? (
            <div className="text-center">
              {/* 宝可梦名称和等级 */}
              <div className="mb-4">
                <h3 className="text-3xl font-bold text-gray-800">{selectedPokemon.name}</h3>
                <p className="text-lg text-gray-600">Lv.{selectedPokemon.level}</p>
                <div className="mt-2 bg-white/80 rounded-full px-4 py-1 inline-block">
                  <span className="text-sm">EXP: {selectedPokemon.exp} / {selectedPokemon.level * 100}</span>
                </div>
              </div>

              {/* 宝可梦形象 */}
              <div className="relative">
                {currentSpecies?.name === '皮卡丘' && (
                  <PikachuSVG animation={animation} />
                )}
                {!currentSpecies && (
                  <div className="text-6xl">❓</div>
                )}
              </div>

              {/* 状态条 */}
              <div className="mt-6 bg-white/90 rounded-2xl p-4 max-w-md mx-auto">
                <StatBar label="饱腹" value={selectedPokemon.hunger} emoji="🍖" color="orange" />
                <StatBar label="口渴" value={selectedPokemon.thirst} emoji="💧" color="blue" />
                <StatBar label="清洁" value={selectedPokemon.cleanliness} emoji="✨" color="purple" />
                <StatBar label="心情" value={selectedPokemon.happiness} emoji="😊" color="pink" />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">🥚</div>
              <p className="text-xl text-gray-700 mb-4">你还没有宝可梦</p>
              <button
                onClick={() => setCurrentView('switch')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold"
              >
                去领养宝可梦
              </button>
            </div>
          )}
        </div>

        {/* 底部菜单 */}
        {selectedPokemon && (
          <div className="bg-white/90 backdrop-blur p-4 grid grid-cols-4 gap-2">
            <MenuButton
              icon="🔄"
              label="进化"
              onClick={() => setCurrentView('evolution')}
            />
            <MenuButton
              icon="🔀"
              label="切换"
              onClick={() => setCurrentView('switch')}
            />
            <MenuButton
              icon="🏪"
              label="商店"
              onClick={() => setCurrentView('shop')}
            />
            <MenuButton
              icon="🎮"
              label="互动"
              onClick={() => setCurrentView('interact')}
            />
          </div>
        )}
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

// 状态条组件
function StatBar({ label, value, emoji, color }) {
  const colors = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  }

  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{emoji} {label}</span>
        <span className="text-sm font-bold text-gray-800">{value}/100</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// 菜单按钮组件
function MenuButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl active:scale-95 transition-transform"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs font-bold">{label}</div>
    </button>
  )
}
