import useStore from '../../store/useStore'

export default function PointLedger({ childId }) {
  const pointHistory = useStore((s) => s.pointHistory)
  const children = useStore((s) => s.children)

  const child = children.find(c => c.id === childId)
  const childHistory = pointHistory.filter((h) => h.child_id === childId)

  // 计算每条记录的结余
  let balance = child?.points || 0
  const ledgerEntries = []

  // 从最新到最旧遍历，计算每个时间点的结余
  for (let i = 0; i < childHistory.length; i++) {
    const entry = childHistory[i]
    ledgerEntries.push({
      ...entry,
      balance: balance
    })
    balance = balance - entry.points // 往前推算
  }

  const typeLabel = {
    task: '完成任务',
    deduct: '家长扣分',
    penalty: '惩罚任务',
    reward: '兑换奖励',
  }

  const typeColor = {
    task: 'text-green-600',
    deduct: 'text-red-600',
    penalty: 'text-orange-600',
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 mb-4 text-white">
        <p className="text-sm opacity-90 mb-1">当前积分</p>
        <p className="text-4xl font-bold">⭐ {child?.points || 0}</p>
      </div>

      {ledgerEntries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl">还没有积分记录</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600 border-b">
            <div className="col-span-3">日期</div>
            <div className="col-span-4">项目</div>
            <div className="col-span-2 text-right">变动</div>
            <div className="col-span-3 text-right">结余</div>
          </div>
          <div className="divide-y">
            {ledgerEntries.map((entry) => (
              <div key={entry.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
                <div className="col-span-3 text-gray-500 text-xs">
                  {entry.date.slice(5)}
                </div>
                <div className="col-span-4">
                  <p className="font-medium text-gray-800 leading-tight">{entry.reason}</p>
                  <p className="text-xs text-gray-400">{typeLabel[entry.type]}</p>
                </div>
                <div className={`col-span-2 text-right font-bold ${entry.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.points > 0 ? `+${entry.points}` : entry.points}
                </div>
                <div className="col-span-3 text-right font-semibold text-gray-700">
                  {entry.balance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
