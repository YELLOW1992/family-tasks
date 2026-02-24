export default function Avatar({ emoji, size = 'md', selected = false }) {
  const sizes = { sm: 'text-3xl w-12 h-12', md: 'text-5xl w-20 h-20', lg: 'text-7xl w-28 h-28' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center bg-indigo-100 transition-all ${
        selected ? 'ring-4 ring-indigo-500 scale-110' : ''
      }`}
    >
      {emoji}
    </div>
  )
}
