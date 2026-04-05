import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'

// 获取宝可梦图鉴编号
const getDexNumber = (speciesName) => {
  const dexMap = {
    '皮卡丘': 25, '妙蛙种子': 1, '小火龙': 4, '杰尼龟': 7,
    '伊布': 133, '卡比兽': 143, '喷火龙': 6, '水箭龟': 9,
    '妙蛙花': 3, '比雕': 18, '巴大蝶': 12, '大针蜂': 15
  }
  return dexMap[speciesName] || 25
}

export default function PokemonDisplay({ childId }) {
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const children = useStore((s) => s.children)
  const ownedPets = useStore((s) => s.ownedPets)
  const petSpecies = useStore((s) => s.petSpecies)
  const fetchOwnedPets = useStore((s) => s.fetchOwnedPets)
  const fetchPetSpecies = useStore((s) => s.fetchPetSpecies)

  const child = children.find(c => c.id === childId)
  const activePetId = child?.active_pet_id

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchOwnedPets(), fetchPetSpecies()])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl animate-pulse">加载中...</div>
      </div>
    )
  }

  // 获取当前选中的宠物
  const myPets = ownedPets.filter(p => p.child_id === childId)
  const activePet = activePetId ? myPets.find(p => p.id === activePetId) : myPets[0]

  if (!activePet) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <div className="text-6xl mb-4">🎴</div>
        <div className="text-xl">还没有宝可梦</div>
        <div className="text-sm mt-2">去领养中心领养一只吧</div>
      </div>
    )
  }

  const species = petSpecies.find(s => s.id === activePet.species_id)
  const dexNumber = getDexNumber(species?.name)
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100"></div>

      {/* 装饰性圆圈 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* 主内容区 */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-16 pb-8 px-6">

        {/* 宝可梦名称 */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black text-gray-800 mb-2 drop-shadow-sm">
            {activePet.name}
          </h2>
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <span className="text-lg font-semibold">Lv.{activePet.level || 1}</span>
            <span>•</span>
            <span className="text-sm bg-gray-800 text-white px-3 py-1 rounded-full">
              No.{String(dexNumber).padStart(3, '0')}
            </span>
          </div>
        </div>

        {/* 宝可梦图片容器 */}
        <div className="relative mb-8">
          {/* 底部阴影 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-gray-400 rounded-full opacity-20 blur-xl"></div>

          {/* 光晕效果 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 bg-yellow-300 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          </div>

          {/* 宝可梦图片 */}
          <div className="relative animate-float">
            {!imageLoaded && (
              <div className="w-80 h-80 flex items-center justify-center">
                <div className="text-6xl animate-bounce">⚡</div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={activePet.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-80 h-80 object-contain drop-shadow-2xl transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
              }}
            />
          </div>
        </div>

        {/* 经验值条 */}
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold">经验值</span>
            <span className="font-mono">{activePet.exp || 0} / {(activePet.level || 1) * 100}</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${((activePet.exp || 0) % 100)}%` }}
            >
              {/* 闪光效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
