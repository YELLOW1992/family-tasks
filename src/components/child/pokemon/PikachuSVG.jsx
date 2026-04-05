export default function PikachuSVG({ animation = 'idle' }) {
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
        width="240"
        height="240"
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#FFCC00" />
            <stop offset="100%" stopColor="#F4B400" />
          </linearGradient>
          <linearGradient id="earGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="70%" stopColor="#FFCC00" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <radialGradient id="cheekGradient">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.3" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        <g id="pikachu" filter="url(#shadow)">
          {/* 尾巴 - 闪电形状 */}
          <path
            d="M 165 130 L 185 110 L 175 110 L 195 85 L 185 85 L 205 55 L 180 75 L 185 75 L 170 95 L 175 95 L 160 115 Z"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 180 60 L 195 55 L 205 55 L 190 65 Z"
            fill="#8B4513"
          />

          {/* 身体 */}
          <ellipse
            cx="110"
            cy="140"
            rx="55"
            ry="60"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
          />

          {/* 头部 */}
          <ellipse
            cx="110"
            cy="90"
            rx="52"
            ry="50"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
          />

          {/* 左耳 */}
          <path
            d="M 80 50 L 70 15 Q 68 8 72 10 L 85 45 Z"
            fill="url(#earGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 右耳 */}
          <path
            d="M 140 50 L 150 15 Q 152 8 148 10 L 135 45 Z"
            fill="url(#earGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 左眼 */}
          <g>
            <ellipse cx="92" cy="85" rx="10" ry="14" fill="#000" />
            <ellipse cx="95" cy="82" rx="4" ry="5" fill="#FFF" />
            <circle cx="97" cy="88" r="1.5" fill="#FFF" opacity="0.6" />
          </g>

          {/* 右眼 */}
          <g>
            <ellipse cx="128" cy="85" rx="10" ry="14" fill="#000" />
            <ellipse cx="131" cy="82" rx="4" ry="5" fill="#FFF" />
            <circle cx="133" cy="88" r="1.5" fill="#FFF" opacity="0.6" />
          </g>

          {/* 鼻子 */}
          <ellipse cx="110" cy="98" rx="3" ry="2.5" fill="#000" />

          {/* 嘴巴 */}
          <path
            d="M 110 98 Q 98 105 92 103"
            stroke="#000"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 110 98 Q 122 105 128 103"
            stroke="#000"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* 腮红 */}
          <ellipse cx="75" cy="95" rx="14" ry="12" fill="url(#cheekGradient)" />
          <ellipse cx="145" cy="95" rx="14" ry="12" fill="url(#cheekGradient)" />

          {/* 左手 */}
          <ellipse
            cx="65"
            cy="125"
            rx="14"
            ry="22"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
            transform="rotate(-15 65 125)"
          />

          {/* 右手 */}
          <ellipse
            cx="155"
            cy="125"
            rx="14"
            ry="22"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
            transform="rotate(15 155 125)"
          />

          {/* 左脚 */}
          <ellipse
            cx="85"
            cy="190"
            rx="18"
            ry="14"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
          />
          <ellipse cx="78" cy="195" rx="5" ry="4" fill="#D4A017" />
          <ellipse cx="85" cy="195" rx="5" ry="4" fill="#D4A017" />
          <ellipse cx="92" cy="195" rx="5" ry="4" fill="#D4A017" />

          {/* 右脚 */}
          <ellipse
            cx="135"
            cy="190"
            rx="18"
            ry="14"
            fill="url(#bodyGradient)"
            stroke="#D4A017"
            strokeWidth="2.5"
          />
          <ellipse cx="128" cy="195" rx="5" ry="4" fill="#D4A017" />
          <ellipse cx="135" cy="195" rx="5" ry="4" fill="#D4A017" />
          <ellipse cx="142" cy="195" rx="5" ry="4" fill="#D4A017" />

          {/* 肚子条纹 */}
          <path
            d="M 85 150 Q 110 155 135 150"
            stroke="#D4A017"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 85 162 Q 110 167 135 162"
            stroke="#D4A017"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* 背部条纹 */}
          <path
            d="M 70 115 L 60 120"
            stroke="#D4A017"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 150 115 L 160 120"
            stroke="#D4A017"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* 动画特效 */}
        {animation === 'happy' && (
          <g id="sparkles">
            <text x="30" y="50" fontSize="24" className="animate-ping">✨</text>
            <text x="170" y="60" fontSize="24" className="animate-ping">✨</text>
            <text x="40" y="160" fontSize="24" className="animate-pulse">⭐</text>
            <text x="160" y="170" fontSize="24" className="animate-pulse">⭐</text>
          </g>
        )}

        {animation === 'eating' && (
          <g id="food">
            <text x="140" y="80" fontSize="35" className="animate-bounce">🍎</text>
          </g>
        )}

        {animation === 'drinking' && (
          <g id="water">
            <text x="140" y="80" fontSize="35" className="animate-bounce">💧</text>
          </g>
        )}

        {animation === 'bathing' && (
          <g id="bubbles" className="animate-pulse">
            <circle cx="60" cy="110" r="10" fill="#87CEEB" opacity="0.7">
              <animate attributeName="cy" values="110;90;110" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="160" cy="120" r="12" fill="#87CEEB" opacity="0.7">
              <animate attributeName="cy" values="120;100;120" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="50" r="8" fill="#87CEEB" opacity="0.7">
              <animate attributeName="cy" values="50;30;50" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {animation === 'playing' && (
          <g id="hearts">
            <text x="30" y="70" fontSize="28" className="animate-bounce">❤️</text>
            <text x="170" y="80" fontSize="28" className="animate-bounce">💛</text>
            <text x="100" y="40" fontSize="28" className="animate-pulse">💕</text>
          </g>
        )}
      </svg>

      {/* 阴影 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-5 bg-black/20 rounded-full blur-md" />
    </div>
  )
}
