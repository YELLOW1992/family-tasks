import useStore from '../store/useStore'

export default function HomeView({ onSelectParent, onSelectChild }) {
  const pin = useStore((s) => s.pin)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-indigo-600 flex flex-col items-center justify-center gap-10 p-8">
      <div className="text-center text-white">
        <div className="text-7xl mb-4">🏠</div>
        <h1 className="text-5xl font-bold mb-2">Family Tasks</h1>
        <p className="text-xl opacity-80">谁在使用？</p>
      </div>

      <div className="flex flex-col gap-5 w-full max-w-sm">
        <button
          onClick={onSelectParent}
          className="bg-white text-indigo-700 font-bold text-2xl py-6 rounded-3xl shadow-xl active:scale-95 transition-transform"
        >
          👨‍👩‍👧 家长
          {!pin && <span className="block text-sm font-normal text-indigo-400 mt-1">请先设置PIN码</span>}
        </button>
        <button
          onClick={onSelectChild}
          className="bg-yellow-400 text-yellow-900 font-bold text-2xl py-6 rounded-3xl shadow-xl active:scale-95 transition-transform"
        >
          🧒 孩子
        </button>
      </div>
    </div>
  )
}
