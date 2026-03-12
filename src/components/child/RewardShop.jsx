import { useState } from 'react'
import useStore from '../../store/useStore'
import ConfirmModal from '../common/ConfirmModal'

export default function RewardShop({ childId }) {
  const { rewards, children, redeemReward, redemptions } = useStore()
  const child = children.find((c) => c.id === childId)
  const available = rewards.filter((r) => r.available)
  const [confirming, setConfirming] = useState(null)

  const getRedemptionCount = (rewardId) => {
    return redemptions.filter((rd) => rd.rewardId === rewardId).length
  }

  const canRedeem = (reward) => {
    if (!child || child.points < reward.cost) return false
    if (reward.max_redemptions !== null && reward.max_redemptions !== undefined) {
      const redeemedCount = getRedemptionCount(reward.id)
      if (redeemedCount >= reward.max_redemptions) return false
    }
    return true
  }

  const handleRedeem = () => {
    redeemReward(confirming.id, childId)
    setConfirming(null)
  }

  return (
    <div>
      {available.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-xl">暂无可用奖励</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {available.map((r) => {
          const canAfford = canRedeem(r)
          const redeemedCount = getRedemptionCount(r.id)
          const hasLimit = r.max_redemptions !== null && r.max_redemptions !== undefined
          const remaining = hasLimit ? r.max_redemptions - redeemedCount : null
          const soldOut = hasLimit && remaining <= 0

          return (
            <div key={r.id} className={`bg-white rounded-3xl shadow p-5 flex items-center gap-4 ${!canAfford || soldOut ? 'opacity-60' : ''}`}>
              <div className="text-5xl">{r.icon}</div>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-800">{r.title}</p>
                {r.description && <p className="text-gray-500">{r.description}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">⭐ {r.cost} 积分</span>
                  {hasLimit && (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${remaining > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}>
                      {soldOut ? '已兑完' : `剩余 ${remaining} 次`}
                    </span>
                  )}
                </div>
              </div>
              <button
                disabled={!canAfford || soldOut}
                onClick={() => setConfirming(r)}
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-lg disabled:bg-gray-200 disabled:text-gray-400 active:bg-indigo-700"
              >
                {soldOut ? '已兑完' : '兑换'}
              </button>
            </div>
          )
        })}
      </div>

      {confirming && (
        <ConfirmModal
          message={`兑换 "${confirming.title}" 需要 ${confirming.cost} 积分，确认吗？`}
          onConfirm={handleRedeem}
          onCancel={() => setConfirming(null)}
        />
      )}
    </div>
  )
}
