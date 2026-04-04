import useStore from '../../../store/useStore'

export default function EvolutionView({ pokemon, species, onBack }) {
  const petSpecies = useStore((s) => s.petSpecies)
  const petItems = useStore((s) => s.petItems)
  const petRedemptions = useStore((s) => s.petRedemptions)

  if (!pokemon || !species) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 p-4">
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-white rounded-lg">
          ← 返回
        </button>
        <div className="text-center text-white text-xl">未找到宝可梦信息</div>
      </div>
    )
  }

  // 查找进化链
  const evolutionChain = []

  // 找到进化链的起点
  let current = species
  while (current.evolves_from_species_id) {
    const prev = petSpecies.find(s => s.id === current.evolves_from_species_id)
    if (prev) {
      evolutionChain.unshift(prev)
      current = prev
    } else {
      break
    }
  }

  // 添加当前宝可梦
  evolutionChain.push(species)

  // 找到所有可能的进化形态
  const nextEvolutions = petSpecies.filter(s => s.evolves_from_species_id === species.id)
  evolutionChain.push(...nextEvolutions)

  // 获取当前拥有的进化石
  const myItems = petRedemptions.filter(r => r.child_id === pokemon.child_id && !r.used)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 p-4">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white rounded-lg font-bold text-gray-800"
        >
          ← 返回
        </button>
        <h2 className="text-2xl font-bold text-white">进化路线</h2>
        <div className="w-20"></div>
      </div>

      {/* 当前宝可梦信息 */}
      <div className="bg-white/90 rounded-2xl p-6 mb-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{species.icon || '❓'}</div>
          <h3 className="text-2xl font-bold text-gray-800">{pokemon.name}</h3>
          <p className="text-gray-600">{species.name}</p>
          <div className="mt-2 inline-block bg-yellow-400 px-4 py-1 rounded-full">
            <span className="font-bold">Lv.{pokemon.level}</span>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              EXP: {pokemon.exp} / {pokemon.level * 100}
            </span>
          </div>
        </div>
      </div>

      {/* 进化链展示 */}
      <div className="bg-white/90 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">进化链</h3>
        <div className="space-y-4">
          {evolutionChain.map((evo, index) => {
            const isCurrent = evo.id === species.id
            const canEvolve = index > 0 && evolutionChain[index - 1].id === species.id
            const isNext = evo.evolves_from_species_id === species.id

            return (
              <div key={evo.id}>
                {/* 进化箭头和条件 */}
                {index > 0 && (
                  <div className="flex items-center justify-center my-2">
                    <div className="text-center">
                      <div className="text-2xl mb-1">⬇️</div>
                      {evo.evolution_level && (
                        <div className="text-sm text-gray-600">
                          等级 {evo.evolution_level}
                          {pokemon.level >= evo.evolution_level ? (
                            <span className="text-green-600 ml-1">✓</span>
                          ) : (
                            <span className="text-red-600 ml-1">✗</span>
                          )}
                        </div>
                      )}
                      {evo.evolution_item_id && (
                        <div className="text-sm text-gray-600">
                          需要进化石
                          {myItems.some(item => item.item_id === evo.evolution_item_id) ? (
                            <span className="text-green-600 ml-1">✓</span>
                          ) : (
                            <span className="text-red-600 ml-1">✗</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 宝可梦卡片 */}
                <div
                  className={`p-4 rounded-xl border-2 ${
                    isCurrent
                      ? 'bg-yellow-100 border-yellow-500'
                      : isNext
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{evo.icon || '❓'}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800">{evo.name}</h4>
                      <p className="text-sm text-gray-600">{evo.description}</p>
                      {evo.type1 && (
                        <div className="mt-1 flex gap-2">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {getTypeEmoji(evo.type1)} {evo.type1}
                          </span>
                          {evo.type2 && (
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {getTypeEmoji(evo.type2)} {evo.type2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="text-yellow-600 font-bold">当前</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 我的进化石 */}
      {myItems.length > 0 && (
        <div className="bg-white/90 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">我的进化石</h3>
          <div className="grid grid-cols-3 gap-3">
            {myItems.map((redemption) => {
              const item = petItems.find(i => i.id === redemption.item_id)
              if (!item) return null
              return (
                <div
                  key={redemption.id}
                  className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl text-center text-white"
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold">{item.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
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
