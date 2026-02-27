import { useState } from 'react'
import useStore from '../../store/useStore'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function TaskCalendar({ childId }) {
  const pointHistory = useStore((s) => s.pointHistory)
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  const childHistory = pointHistory.filter((h) => h.child_id === childId)

  // Group by date
  const byDate = {}
  for (const h of childHistory) {
    if (!byDate[h.date]) byDate[h.date] = []
    byDate[h.date].push(h)
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  const todayStr = now.toISOString().slice(0, 10)

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

  const selectedKey = selectedDate
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    : null
  const selectedEntries = selectedKey ? (byDate[selectedKey] || []) : []

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-gray-100 text-xl flex items-center justify-center active:bg-gray-200">‹</button>
        <span className="text-lg font-bold text-gray-700">{year}年{month + 1}月</span>
        <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-gray-100 text-xl flex items-center justify-center active:bg-gray-200">›</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const entries = byDate[dateKey] || []
          const total = entries.reduce((s, h) => s + h.points, 0)
          const isToday = dateKey === todayStr
          const isSelected = selectedDate === day

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : day)}
              className={`relative flex flex-col items-center justify-center rounded-2xl py-2 transition-all
                ${isSelected ? 'bg-orange-400 text-white' : isToday ? 'bg-orange-100' : 'bg-gray-50'}
                ${entries.length > 0 ? 'ring-2 ring-orange-300' : ''}
              `}
            >
              <span className={`text-sm font-bold ${isSelected ? 'text-white' : isToday ? 'text-orange-500' : 'text-gray-700'}`}>{day}</span>
              {entries.length > 0 && (
                <span className={`text-xs font-semibold ${isSelected ? 'text-white' : total >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {total > 0 ? `+${total}` : total}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <p className="font-bold text-gray-700 mb-3">{month + 1}月{selectedDate}日</p>
          {selectedEntries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-2">这天没有积分记录</p>
          ) : (
            <div className="space-y-2">
              {selectedEntries.map((h) => (
                <div key={h.id} className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{h.reason || (h.type === 'deduct' ? '扣分' : '完成任务')}</span>
                  <span className={`font-bold text-sm ${h.points >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {h.points > 0 ? `+${h.points}` : h.points} 分
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">当日合计</span>
                <span className={`font-bold text-sm ${selectedEntries.reduce((s, h) => s + h.points, 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {selectedEntries.reduce((s, h) => s + h.points, 0) > 0
                    ? `+${selectedEntries.reduce((s, h) => s + h.points, 0)}`
                    : selectedEntries.reduce((s, h) => s + h.points, 0)} 分
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
