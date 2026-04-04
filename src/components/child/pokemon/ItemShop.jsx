import { useState } from 'react'
import useStore from '../../../store/useStore'

export default function ItemShop({ childId, onBack }) {
  const [selectedItem, setSelectedItem] = useState(null)

  const petItems = useStore((s) => s.petItems)
  const children = useStore((s) => s.children)
  const petRedemptions = useStore((s) => s.petRedemptions)
  const redeemPetItem = useStore((s) => s.redeemPetItem)

  const child = children.find(c => c.id === childId)
  const availableItems = petItems.filter(i => i.available)
  const myItems = petRedemptions.filter(r => r.child_id === childId && !r.used)

  const handleBuy = async () => {
    if (!selectedItem) return
    if (child.points < selectedItem.cost) {
      alert('积分不足')
      return
    }
    try {
      await redeemPetItem(selectedItem.id, childId)
      alert(`成功购买 ${selectedItem.name}！`)
      setSelectedItem(null)
    } catch (error) {
      alert('购买失败：' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 to-red-300 p-4">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white rounded-lg font-bold text-gray-800"
        >
          ← 返回
        </button>
        <h2 className="text-2xl font-bold text-white">物品商店</h2>
        <div className="w-20"></div>
      </div>

      {/* 积分显示 */}
      <div className="bg-white/90 rounded-xl p-4 mb-6 text-center">
        <span className="text-lg font-bold text-gray-800">
          💰 当前积分: {child?.points || 0}
        </span>
      </div>

      {/* 我的物品 */}
      {myItems.length > 0 && (
        <div className="bg-white/90 rounded-2xl p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">我的物品背包</h3>
          <div className="grid grid-cols-4 gap-3">
            {myItems.map((redemption) => {
              const item = petItems.find(i => i.id === redemption.item_id)
              if (!item) return null
              return (
                <div
                  key={redemption.id}
                  className="bg-gradient-to-br from-purple-400 to-pink-400 p-3 rounded-xl text-center text-white shadow-lg"
                >
                  <div className="text-4xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold truncate">{item.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 商品列表 */}
      <div className="space-y-3 mb-20">
        <h3 className="text-lg font-bold text-white mb-3">商店商品</h3>
        {availableItems.length === 0 ? (
          <div className="bg-white/90 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-gray-600">商店暂无商品</p>
          </div>
        ) : (
          availableItems.map((item) => {
            const canAfford = child && child.points >= item.cost
            const isSelected = selectedItem?.id === item.id

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`bg-white/90 rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 shadow-xl scale-105'
                    : 'hover:shadow-lg active:scale-95'
                } ${!canAfford ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* 物品图标 */}
                  <div className="text-6xl">{item.icon || '🎁'}</div>

                  {/* 物品信息 */}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                    {/* 效果说明 */}
                    {item.effect && (
                      <div className="mb-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
                        {getEffectText(item.effect, item.effect_value)}
                      </div>
                    )}

                    {/* 价格 */}
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                        💰 {item.cost}
                      </span>
                      {!canAfford && (
                        <span className="text-xs text-red-600 font-bold">积分不足</span>
                      )}
                    </div>
                  </div>

                  {/* 选中标记 */}
                  {isSelected && (
                    <div className="text-3xl">✓</div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 购买确认面板 */}
      {selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-6 shadow-2xl">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{selectedItem.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{selectedItem.name}</h3>
                <p className="text-sm text-gray-600">{selectedItem.description}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold"
              >
                取消
              </button>
              <button
                onClick={handleBuy}
                disabled={!child || child.points < selectedItem.cost}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                购买 (-{selectedItem.cost}💰)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 获取效果文本
function getEffectText(effect, value) {
  const effectMap = {
    evolution: '进化道具',
    hunger: `饱腹度 +${value}`,
    thirst: `口渴度 +${value}`,
    cleanliness: `清洁度 +${value}`,
    happiness: `心情度 +${value}`,
    exp: `经验值 +${value}`,
    all: `全属性 +${value}`,
  }
  return effectMap[effect] || effect
}
