import useStore from '../../store/useStore'
import Avatar from '../common/Avatar'

export default function ChildSelector({ onSelect, onBack }) {
  const children = useStore((s) => s.children)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-400 flex flex-col items-center justify-center p-8">
      <button onClick={onBack} className="absolute top-8 left-8 bg-white/30 text-white px-4 py-2 rounded-xl font-semibold">
        ← 返回
      </button>
      <h1 className="text-4xl font-bold text-white mb-2">你是谁？</h1>
      <p className="text-white/80 text-xl mb-10">点击你的头像</p>

      {children.length === 0 && (
        <div className="text-center text-white/80">
          <div className="text-6xl mb-4">👨‍👩‍👧</div>
          <p className="text-xl">还没有设置孩子，请让家长设置</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {children.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3 active:scale-95 transition-transform"
          >
            <Avatar emoji={c.avatar} size="lg" />
            <p className="text-2xl font-bold text-gray-800">{c.name}</p>
            <p className="text-indigo-600 font-semibold text-lg">⭐ {c.points} 积分</p>
          </button>
        ))}
      </div>
    </div>
  )
}
