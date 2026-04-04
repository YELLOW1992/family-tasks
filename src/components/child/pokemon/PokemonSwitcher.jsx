import { useState } from 'react'
import useStore from '../../../store/useStore'

export default function PokemonSwitcher({ childId, currentPokemon, onSelect, onBack }) {
  const [view, setView] = useState('owned') // owned 或 adopt
  const [adoptName, setAdoptName] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState(null)

  const ownedPets = useStore((s) => s.ownedPets)
  const petSpecies = useStore((s) => s.petSpecies)
  const children = useStore((s) => s.children)
  const buyPet = useStore((s) => s.buyPet)

  const child = children.find(c => c.id === childId)
  const myPets = ownedPets.filter(p => p.child_id === childId)
  const availableSpecies = petSpecies.filter(s => s.available)

  const handleAdopt = async () => {
    if (!selectedSpecies || !adoptName.trim()) {
      alert('请选择宝可梦并输入名字')
      return
    }
    if (child.points < selectedSpecies.cost) {
      alert('积分不足')
      return
    }
    try {
      await buyPet(selectedSpecies.id, childId, adoptName.trim())
      alert(`成功领养 ${adoptName}！`)
      setAdoptName('')
      setSelectedSpecies(null)
      setView('owned')
    } catch (error) {
      alert('领养失败：' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-cyan-300 p-4">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white rounded-lg font-bold text-gray-800"
        >
          ← 返回
        </button>
        <h2 className="text-2xl font-bold text-white">宝可梦管理</h2>
        <div className="w-20"></div>
      </div>

      {/* 积分显示 */}
      <div className="bg-white/90 rounded-xl p-4 mb-4 text-center">
        <span className="text-lg font-bold text-gray-800">
          💰 当前积分: {child?.points || 0}
        </span>
      </div>

      {/* 切换视图按钮 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('owned')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            view === 'owned'
              ? 'bg-white text-blue-600 shadow-lg'
              : 'bg-white/50 text-white'
          }`}
        >
          我的宝可梦 ({myPets.length})
        </button>
        <button
          onClick={() => setView('adopt')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            view === 'adopt'
              ? 'bg-white text-blue-600 shadow-lg'
              : 'bg-white/50 text-white'
          }`}
        >
          领养中心
        </button>
      </div>

      {/* 我的宝可梦列表 */}
      {view === 'owned' && (
        <div className="space-y-3">
          {myPets.length === 0 ? (
            <div className="bg-white/90 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🥚</div>
              <p className="text-gray-600 mb-4">你还没有宝可梦</p>
              <button
                onClick={() => setView('adopt')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold"
              >
                去领养中心
              </button>
            </div>
          ) : (
            myPets.map((pet) => {
              const species = petSpecies.find(s => s.id === pet.species_id)
              const isCurrent = currentPokemon?.id === pet.id
              return (
                <div
                  key={pet.id}
                  onClick={() => onSelect(pet)}
                  className={`bg-white/90 rounded-2xl p-4 cursor-pointer transition-all ${
                    isCurrent
                      ? 'ring-4 ring-yellow-400 shadow-xl'
                      : 'hover:shadow-lg active:scale-95'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{species?.icon || '❓'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                        {isCurrent && (
                          <span className="text-xs bg-yellow-400 px-2 py-1 rounded-full font-bold">
                            当前
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{species?.name}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-700">Lv.{pet.level}</span>
                        <span className="text-xs text-gray-500">EXP: {pet.exp}</span>
                      </div>
                      {/* 简化状态条 */}
                      <div className="mt-2 flex gap-2">
                        <MiniStat emoji="🍖" value={pet.hunger} />
                        <MiniStat emoji="💧" value={pet.thirst} />
                        <MiniStat emoji="✨" value={pet.cleanliness} />
                        <MiniStat emoji="😊" value={pet.happiness} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* 领养中心 */}
      {view === 'adopt' && (
        <div className="space-y-4">
          {availableSpecies.map((species) => {
            const canAfford = child && child.points >= species.cost
            const isSelected = selectedSpecies?.id === species.id

            return (
              <div
                key={species.id}
                onClick={() => setSelectedSpecies(species)}
                className={`bg-white/90 rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-4 ring-green-400 shadow-xl'
                    : 'hover:shadow-lg active:scale-95'
                } ${!canAfford ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{species.icon || '❓'}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{species.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{species.description}</p>
                    {species.type1 && (
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {getTypeEmoji(species.type1)} {species.type1}
                        </span>
                        {species.type2 && (
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {getTypeEmoji(species.type2)} {species.type2}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                        💰 {species.cost}
                      </span>
                      {!canAfford && (
                        <span className="text-xs text-red-600">积分不足</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* 领养确认面板 */}
          {selectedSpecies && (
            <div className="bg-white/95 rounded-2xl p-6 sticky bottom-4 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                领养 {selectedSpecies.name}
              </h3>
              <input
                type="text"
                value={adoptName}
                onChange={(e) => setAdoptName(e.target.value)}
                placeholder="给它起个名字..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl mb-3 text-lg"
                maxLength={10}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSpecies(null)
                    setAdoptName('')
                  }}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold"
                >
                  取消
                </button>
                <button
                  onClick={handleAdopt}
                  disabled={!adoptName.trim() || child.points < selectedSpecies.cost}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认领养 (-{selectedSpecies.cost}💰)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 迷你状态条
function MiniStat({ emoji, value }) {
  const color = value > 60 ? 'bg-green-500' : value > 30 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{emoji}</span>
      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

// 属性对应的 emoji
function getTypeEmoji(type) {
  const typeEmojis = {
    fire: '🔥',
    water: '💧',
    grass: '🌿',
    electric: '⚡',
    poison: '☠️',
    flying: '🪶',
    ground: '🌍',
    rock: '🪨',
    bug: '🐛',
    normal: '😐',
    fighting: '🥊',
    psychic: '🔮',
    ice: '❄️',
    dragon: '🐉',
    dark: '🌙',
    steel: '⚙️',
    fairy: '🧚',
    ghost: '👻',
  }
  return typeEmojis[type] || '❓'
}
