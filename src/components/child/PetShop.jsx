import { useState } from 'react'
import useStore from '../../store/useStore'
import { PetCharacter } from './PetSVG'

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
      <div className="flex items-center gap-3 mb-5 pt-1">
        <span className="text-4xl">🏪</span>
        <div>
          <h2 className="text-xl font-black" style={{ color:'#FFD700', textShadow:'0 0 8px #FFD70088' }}>宠物领养中心</h2>
          <p className="text-sm" style={{ color:'#B0BEC5' }}>用积分领养一只属于你的宠物</p>
        </div>
      </div>

      {available.length === 0 && (
        <div className="text-center py-16" style={{ color:'#B0BEC5' }}>
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-xl">暂无可领养的宠物</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {available.map((species) => {
          const owned = myPetSpeciesIds.includes(species.id)
          const canAfford = child && child.points >= species.cost
          return (
            <div key={species.id} className="relative rounded-3xl overflow-hidden flex items-center gap-4 p-4"
              style={{ background:'linear-gradient(160deg,#1e1e2e,#2a1a4e)', border:`2px solid ${owned ? '#4CAF5066' : canAfford ? '#FFD70055' : '#ffffff18'}`, opacity: !owned && !canAfford ? 0.6 : 1 }}>
              {owned && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-black"
                  style={{ background:'linear-gradient(135deg,#4CAF50,#2E7D32)', color:'#fff' }}>✓ 已领养</div>
              )}
              <div className="flex-shrink-0">
                <PetCharacter speciesIcon={species.icon} stage="baby" mood="happy" size={64} animated={false}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black truncate" style={{ color:'#FFD700' }}>{species.name}</p>
                {species.description && (
                  <p className="text-xs mb-1 truncate" style={{ color:'#B0BEC5' }}>{species.description}</p>
                )}
                <span className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                  style={{ background:'linear-gradient(135deg,#FFD700,#FF8C00)', color:'#3E2000' }}>
                  💰 {species.cost} 积分
                </span>
              </div>
              {!owned && (
                <button disabled={!canAfford}
                  onClick={() => { setNaming(species); setPetName('') }}
                  className="flex-shrink-0 px-4 py-2 rounded-2xl font-bold text-sm active:scale-90 transition-transform"
                  style={canAfford
                    ? { background:'linear-gradient(135deg,#FF80AB,#EC407A)', color:'#fff', boxShadow:'0 0 10px #EC407A66' }
                    : { background:'rgba(255,255,255,0.08)', color:'#607D8B' }}>
                  领养
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 命名弹窗 */}
      {naming && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="rounded-3xl p-6 w-full max-w-sm" style={{ background:'linear-gradient(160deg,#1A0A3C,#0D1B4B)', border:'2px solid #FFD70066', boxShadow:'0 0 32px #FFD70033' }}>
            <div className="text-center mb-4">
              <div className="flex justify-center mb-2">
                <PetCharacter speciesIcon={naming.icon} stage="baby" mood="happy" size={80} animated={true}/>
              </div>
              <h3 className="text-xl font-black" style={{ color:'#FFD700' }}>给你的{naming.name}起个名字吧！</h3>
            </div>
            <input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="宠物名字"
              maxLength={10}
              className="w-full rounded-2xl px-4 py-3 text-lg text-center mb-4 focus:outline-none"
              style={{ background:'rgba(255,255,255,0.08)', border:'2px solid #FFD70066', color:'#FFD700' }}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleBuy} disabled={!petName.trim() || buying}
                className="flex-1 py-3 rounded-2xl font-bold text-lg disabled:opacity-40 active:scale-95 transition-transform"
                style={{ background:'linear-gradient(135deg,#FF80AB,#EC407A)', color:'#fff' }}>
                {buying ? '领养中…' : '确认领养'}
              </button>
              <button onClick={() => setNaming(null)}
                className="flex-1 py-3 rounded-2xl font-bold text-lg"
                style={{ background:'rgba(255,255,255,0.08)', color:'#B0BEC5' }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
