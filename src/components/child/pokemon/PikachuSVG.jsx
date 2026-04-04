export default function PikachuSVG({ animation = 'idle' }) {
  // 根据动画类型添加不同的 CSS 类
  const getAnimationClass = () => {
    switch (animation) {
      case 'happy': return 'animate-bounce'
      case 'eating': return 'animate-pulse'
      case 'drinking': return 'animate-pulse'
      case 'bathing': return 'animate-spin-slow'
      case 'playing': return 'animate-wiggle'
      default: return 'animate-float'
    }
  }

  return (
    <div className={`relative ${getAnimationClass()}`}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* 皮卡丘身体 */}
        <g id="pikachu">
          {/* 尾巴 */}
          <path
            d="M 150 120 Q 170 100 180 80 Q 185 60 175 50 Q 165 45 160 55 Q 155 65 150 75 L 145 90 Z"
            fill="#F4D03F"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          <path
            d="M 165 50 L 175 45 L 180 55 L 170 60 Z"
            fill="#8B4513"
          />

          {/* 身体主体 */}
          <ellipse
            cx="100"
            cy="120"
            rx="50"
            ry="55"
            fill="#FFD700"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* 头部 */}
          <circle
            cx="100"
            cy="80"
            r="45"
            fill="#FFD700"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* 左耳 */}
          <g>
            <path
              d="M 75 45 L 65 10 L 80 35 Z"
              fill="#FFD700"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            <path
              d="M 70 25 L 68 15 L 75 30 Z"
              fill="#000"
            />
          </g>

          {/* 右耳 */}
          <g>
            <path
              d="M 125 45 L 135 10 L 120 35 Z"
              fill="#FFD700"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            <path
              d="M 130 25 L 132 15 L 125 30 Z"
              fill="#000"
            />
          </g>

          {/* 左眼 */}
          <g>
            <circle cx="85" cy="75" r="8" fill="#000" />
            <circle cx="87" cy="73" r="3" fill="#FFF" />
          </g>

          {/* 右眼 */}
          <g>
            <circle cx="115" cy="75" r="8" fill="#000" />
            <circle cx="117" cy="73" r="3" fill="#FFF" />
          </g>

          {/* 鼻子 */}
          <circle cx="100" cy="85" r="3" fill="#000" />

          {/* 嘴巴 */}
          <path
            d="M 100 85 Q 90 90 85 88"
            stroke="#000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 100 85 Q 110 90 115 88"
            stroke="#000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* 腮红 */}
          <circle cx="70" cy="85" r="10" fill="#FF6B6B" opacity="0.6" />
          <circle cx="130" cy="85" r="10" fill="#FF6B6B" opacity="0.6" />

          {/* 左手 */}
          <ellipse
            cx="60"
            cy="110"
            rx="12"
            ry="20"
            fill="#FFD700"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* 右手 */}
          <ellipse
            cx="140"
            cy="110"
            rx="12"
            ry="20"
            fill="#FFD700"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* 左脚 */}
          <ellipse
            cx="80"
            cy="165"
            rx="15"
            ry="12"
            fill="#FFD700"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* 右脚 */}
          <ellipse
            cx="120"
            cy="165"
            rx="15"
            ry="12"
            fill="#FFD700"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* 肚子上的条纹 */}
          <path
            d="M 80 130 Q 100 135 120 130"
            stroke="#D4AF37"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 80 140 Q 100 145 120 140"
            stroke="#D4AF37"
            strokeWidth="3"
            fill="none"
          />
        </g>

        {/* 动画特效 */}
        {animation === 'happy' && (
          <g id="sparkles">
            <text x="40" y="50" fontSize="20">✨</text>
            <text x="150" y="60" fontSize="20">✨</text>
            <text x="50" y="140" fontSize="20">⭐</text>
            <text x="140" y="150" fontSize="20">⭐</text>
          </g>
        )}

        {animation === 'eating' && (
          <g id="food">
            <text x="120" y="70" fontSize="30">🍎</text>
          </g>
        )}

        {animation === 'drinking' && (
          <g id="water">
            <text x="120" y="70" fontSize="30">💧</text>
          </g>
        )}

        {animation === 'bathing' && (
          <g id="bubbles">
            <circle cx="60" cy="100" r="8" fill="#87CEEB" opacity="0.6" />
            <circle cx="140" cy="110" r="10" fill="#87CEEB" opacity="0.6" />
            <circle cx="100" cy="60" r="6" fill="#87CEEB" opacity="0.6" />
          </g>
        )}

        {animation === 'playing' && (
          <g id="hearts">
            <text x="40" y="60" fontSize="25">❤️</text>
            <text x="150" y="70" fontSize="25">💛</text>
          </g>
        )}
      </svg>

      {/* 阴影 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 rounded-full blur-sm" />
    </div>
  )
}
