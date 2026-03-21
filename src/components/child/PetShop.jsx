import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'
import ConfirmModal from '../common/ConfirmModal'

function isOpenNow(schedule) {
  if (!schedule) return true
  const now = new Date()
  const day = now.getDay() // 0=Sun,1=Mon,...
  const hhmm = now.getHours() * 60 + now.getMinutes()
  if (schedule.days && schedule.days.length > 0 && !schedule.days.includes(day)) return false
  if (schedule.startTime && schedule.endTime) {
    const [sh, sm] = schedule.startTime.split(':').map(Number)
    const [eh, em] = schedule.endTime.split(':').map(Number)
    const start = sh * 60 + sm
    const end = eh * 60 + em
    if (hhmm < start || hhmm > end) return false
  }
  return true
}

function formatSchedule(schedule) {
  if (!schedule) return null
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const days = schedule.days && schedule.days.length > 0
    ? schedule.days.map((d) => dayNames[d]).join('、')
    : '每天'
  const time = schedule.startTime && schedule.endTime
    ? `${schedule.startTime} - ${schedule.endTime}`
    : '全天'
  return `${days} ${time}`
}

export default function PetShop({ childId }) {
  const { petItems, petRedemptions, petSchedule, children, redeemPetItem, loadPetData } = useStore()
  const child = children.find((c) => c.id === childId)
  const [confirming, setConfirming] = useState(null)
  const open = isOpenNow(petSchedule)

  useEffect(() => {
    loadPetData()
  }, [])

  const getCount = (itemId) => petRedemptions.filter((r) => r.item_id === itemId && r.child_id === childId).length

  const handleRedeem = () => {
    redeemPetItem(confirming.id, childId)
    setConfirming(null)
  }

  const available = petItems.filter((i) => i.available)

  if (!open) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-7xl">🔒</div>
        <h2 className="text-2xl font-bold text-gray-700">宠物商店暂未开放</h2>
        {petSchedule && (
          <p className="text-gray-400 text-center px-4">
            开放时间：{formatSchedule(petSchedule)}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 px-1">
        <span className="text-4xl">🐾</span>
        <div>
          <h2 className="text-xl font-bold text-gray-800">宠物用品店</h2>
          {petSchedule && (
            <p className="text-xs text-green-600 font-semibold">✅ 开放中 · {formatSchedule(petSchedule)}</p>
          )}
        </div>
      </div>

      {available.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-xl">暂无宠物用品</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {available.map((item) => {
          const count = getCount(item.id)
          const canAfford = child && child.points >= item.cost
          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl shadow p-5 flex items-center gap-4 ${
                !canAfford ? 'opacity-60' : ''
              }`}
            >
              <div className="text-5xl">{item.icon}</div>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-800">{item.name}</p>
                {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                    ⭐ {item.cost} 积分
                  </span>
                  {count > 0 && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      已兑 {count} 次
                    </span>
                  )}
                </div>
              </div>
              <button
                disabled={!canAfford}
                onClick={() => setConfirming(item)}
                className="px-5 py-3 rounded-2xl bg-pink-500 text-white font-bold text-lg disabled:bg-gray-200 disabled:text-gray-400 active:bg-pink-600"
              >
                兑换
              </button>
            </div>
          )
        })}
      </div>

      {confirming && (
        <ConfirmModal
          message={`兑换 "${confirming.name}" 需要 ${confirming.cost} 积分，确认吗？`}
          onConfirm={handleRedeem}
          onCancel={() => setConfirming(null)}
        />
      )}
    </div>
  )
}
