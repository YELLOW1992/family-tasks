import useStore from '../../../store/useStore'

export default function InteractionPanel({ pokemon, childId, onInteract, onBack }) {
  const children = useStore((s) => s.children)
  const petCare = useStore((s) => s.petCare)

  const child = children.find(c => c.id === childId)

  const interactions = [
    {
      id: 'feed',
      name: '喂食',
      icon: '🍖',
      cost: 2,
      effect: '饱腹度 +20',
      color: 'from-orange-400 to-red-400',
    },
    {
      id: 'water',
      name: '喝水',
      icon: '💧',
      cost: 1,
      effect: '口渴度 +20',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      id: 'bath',
      name: '洗澡',
      icon: '🛁',
      cost: 3,
      effect: '清洁度 +20',
      color: 'from-purple-400 to-pink-400',
    },
    {
      id: 'play',
      name: '玩耍',
      icon: '🎮',
      cost: 2,
      effect: '心情度 +20',
      color: 'from-green-400 to-teal-400',
    },
  ]

  const handleInteraction = async (action, cost) => {
    if (!child || child.points < cost) {
      alert('积分不足')
      return
    }

    try {
      await petCare(pokemon.id, action, childId, cost)
      onInteract(action)
    } catch (error) {
      alert('互动失败：' + error.message)
    }
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-300 p-4">
        <button onClick={onBack} className="mb-4 px-4 py-2 bg-white rounded-lg">
          ← 返回
        </button>
        <div className="text-center text-white text-xl">未找到宝可梦</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-300 p-4">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white rounded-lg font-bold text-gray-800"
        >
          ← 返回
        </button>
        <h2 className="text-2xl font-bold text-white">互动</h2>
        <div className="w-20"></div>
      </div>

      {/* 积分显示 */}
      <div className="bg-white/90 rounded-xl p-4 mb-6 text-center">
        <span className="text-lg font-bold text-gray-800">
          💰 当前积分: {child?.points || 0}
        </span>
      </div>

      {/* 宝可梦信息 */}
      <div className="bg-white/90 rounded-2xl p-6 mb-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{pokemon.name}</h3>
          <p className="text-gray-600">Lv.{pokemon.level}</p>
        </div>

        {/* 当前状态 */}
        <div className="space-y-3">
          <StatusBar
            label="饱腹度"
            emoji="🍖"
            value={pokemon.hunger}
            color="orange"
          />
          <StatusBar
            label="口渴度"
            emoji="💧"
            value={pokemon.thirst}
            color="blue"
          />
          <StatusBar
            label="清洁度"
            emoji="✨"
            value={pokemon.cleanliness}
            color="purple"
          />
          <StatusBar
            label="心情度"
            emoji="😊"
            value={pokemon.happiness}
            color="pink"
          />
        </div>
      </div>

      {/* 互动选项 */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white mb-3">选择互动方式</h3>
        {interactions.map((action) => {
          const canAfford = child && child.points >= action.cost
          const needsAction = getNeedsAction(pokemon, action.id)

          return (
            <button
              key={action.id}
              onClick={() => handleInteraction(action.id, action.cost)}
              disabled={!canAfford}
              className={`w-full bg-gradient-to-r ${action.color} text-white rounded-2xl p-6 shadow-lg transition-all ${
                canAfford
                  ? 'active:scale-95 hover:shadow-xl'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* 图标 */}
                <div className="text-6xl">{action.icon}</div>

                {/* 信息 */}
                <div className="flex-1 text-left">
                  <h4 className="text-2xl font-bold mb-1">{action.name}</h4>
                  <p className="text-sm opacity-90 mb-2">{action.effect}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">💰 {action.cost}</span>
                    {needsAction && (
                      <span className="text-xs bg-red-500 px-2 py-1 rounded-full animate-pulse">
                        需要！
                      </span>
                    )}
                  </div>
                </div>

                {/* 箭头 */}
                {canAfford && (
                  <div className="text-3xl">→</div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* 提示信息 */}
      <div className="mt-6 bg-white/90 rounded-xl p-4">
        <p className="text-sm text-gray-600 text-center">
          💡 提示：互动会消耗积分，但能提升宝可梦的状态和经验值
        </p>
      </div>
    </div>
  )
}

// 状态条组件
function StatusBar({ label, emoji, value, color }) {
  const colors = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  }

  const getStatusColor = (val) => {
    if (val > 60) return colors[color]
    if (val > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          {emoji} {label}
        </span>
        <span className="text-sm font-bold text-gray-800">{value}/100</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStatusColor(value)} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// 判断是否需要某个互动（状态低于50）
function getNeedsAction(pokemon, actionId) {
  const thresholds = {
    feed: pokemon.hunger < 50,
    water: pokemon.thirst < 50,
    bath: pokemon.cleanliness < 50,
    play: pokemon.happiness < 50,
  }
  return thresholds[actionId] || false
}
