export default function Avatar({ emoji, size = 'md', selected = false }) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }
  const textSizes = { sm: 'text-3xl', md: 'text-5xl', lg: 'text-7xl' }
  const isImage = emoji && (emoji.startsWith('data:') || emoji.startsWith('http'))

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center bg-indigo-100 overflow-hidden transition-all ${
        selected ? 'ring-4 ring-indigo-500 scale-110' : ''
      }`}
    >
      {isImage
        ? <img src={emoji} alt="avatar" className="w-full h-full object-cover" />
        : <span className={textSizes[size]}>{emoji}</span>
      }
    </div>
  )
}
