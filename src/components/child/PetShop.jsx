import { useState } from 'react'
import useStore from '../../store/useStore'

export default function PetShop({ childId, onBought }) {
  const { petSpecies, ownedPets, children, buyPet } = useStore()
  const child = children.find((c) => c.id === childId)
  const [naming, setNaming] = useState(null) // species being named
  const [petName, setPetName] = useState('')
  const [buying, setBuying] = useState(false)

  const myPetSpeciesIds = ownedPets
    .filter((p) => p.child_id === childId)
    .map((p) => p.species_id)

  const available = petSpecies.filter((s) => s.available)

  const handleBuy = async () => {
    if (!petName.trim()) return
    setBuying(true)
    await buyPet(naming.id, childId, petName.trim())
    setBuying(false)
    setNaming(null)
    setPetName('')
    onBought && onBought()
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🏪</span>
        <div>
          <h2 className="text-xl font-bold text-gray-800">宠物领养中心</h2>
          <p className="text-sm text-gray-400">用积分领养一只属于你的宠物</p>
        </div>
      </div>

      {available.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-xl">暂无可领养的宠物</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {available.map((species) => {
          const owned = myPetSpeciesIds.includes(species.id)
          const canAfford = child && child.points >= species.cost
          return (
            <div
              key={species.id}
              className={`bg-white rounded-3xl shadow p-5 flex items-center gap-4 ${
                owned || !canAfford ? 'opacity-60' : ''
              }`}
            >
              <div className="text-6xl">{species.icon}</div>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-800">{species.name}</p>
                {species.description && (
                  <p className="text-gray-500 text-sm mb-1">{species.description}</p>
                )}
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                  ⭐ {species.cost} 积分
                </span>
              </div>
              {owned ? (
                <span className="px-4 py-2 rounded-2xl bg-green-100 text-green-700 font-bold text-sm">已领养</span>
              ) : (
                <button
                  disabled={!canAfford}
                  onClick={() => { setNaming(species); setPetName('') }}
                  className="px-5 py-3 rounded-2xl bg-pink-500 text-white font-bold text-base disabled:bg-gray-200 disabled:text-gray-400 active:bg-pink-600"
                >
                  领养
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 命名弹窗 */}
      {naming && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="text-7xl mb-2">{naming.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">给你的{naming.name}起个名字吧！</h3>
            </div>
            <input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="宠物名字"
              maxLength={10}
              className="w-full border-2 border-indigo-200 rounded-2xl px-4 py-3 text-lg text-center mb-4 focus:outline-none focus:border-indigo-400"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleBuy}
                disabled={!petName.trim() || buying}
                className="flex-1 py-3 rounded-2xl bg-pink-500 text-white font-bold text-lg disabled:opacity-40 active:bg-pink-600"
              >
                {buying ? '领养中…' : '确认领养'}
              </button>
              <button
                onClick={() => setNaming(null)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-lg"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
