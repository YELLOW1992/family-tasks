// Q版宠物SVG角色库
// stage: 'baby'|'adult'|'evolved'  mood: 'happy'|'neutral'|'sad'

const P = {
  cat:    { b:'#FFAC7A', h:'#FFD4BA', i:'#FFB3DE', s:'#FF6B6B', e:'#7A3B10' },
  dog:    { b:'#D4956A', h:'#EBC49A', i:'#FFCBA4', s:'#6BC5FF', e:'#5C3317' },
  rabbit: { b:'#F0F0F0', h:'#FAFAFA', i:'#FFB3C8', s:'#B8A4FF', e:'#555'   },
  bear:   { b:'#8B6347', h:'#A0795A', i:'#C49A78', s:'#4CAF50', e:'#3E2000' },
  bird:   { b:'#5BA4E0', h:'#7AC0F5', i:'#FFE082', s:'#FF8A65', e:'#1A3A5C' },
  def:    { b:'#B88FE0', h:'#CCA8F5', i:'#FFB3DE', s:'#FFD54F', e:'#4A2070' },
}

function Eyes({ mood, lx=46, rx=74, y=60, c='#333' }) {
  if (mood === 'happy') return (<>
    <path d={`M${lx-6},${y} Q${lx},${y-7} ${lx+6},${y}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d={`M${rx-6},${y} Q${rx},${y-7} ${rx+6},${y}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </>)
  if (mood === 'sad') return (<>
    <path d={`M${lx-6},${y-3} Q${lx},${y+4} ${lx+6},${y-3}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d={`M${rx-6},${y-3} Q${rx},${y+4} ${rx+6},${y-3}`} stroke={c} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </>)
  return (<>
    <circle cx={lx} cy={y} r="4.5" fill={c}/>
    <circle cx={lx+1.5} cy={y-1.5} r="1.5" fill="white"/>
    <circle cx={rx} cy={y} r="4.5" fill={c}/>
    <circle cx={rx+1.5} cy={y-1.5} r="1.5" fill="white"/>
  </>)
}
function Blush({ lx=38, rx=82, y=72 }) {
  return (<>
    <ellipse cx={lx} cy={y} rx="7" ry="4" fill="#FFB3C8" opacity="0.6"/>
    <ellipse cx={rx} cy={y} rx="7" ry="4" fill="#FFB3C8" opacity="0.6"/>
  </>)
}

function Tear({ x=44, y=68 }) {
  return <ellipse cx={x} cy={y+8} rx="2" ry="3" fill="#90CAF9" opacity="0.9"/>
}

function Mouth({ mood, cx=60, y=80 }) {
  if (mood === 'happy') return <path d={`M${cx-8},${y} Q${cx},${y+7} ${cx+8},${y}`} stroke="#C0604A" strokeWidth="2" fill="none" strokeLinecap="round"/>
  if (mood === 'sad')   return <path d={`M${cx-7},${y+5} Q${cx},${y-2} ${cx+7},${y+5}`} stroke="#C0604A" strokeWidth="2" fill="none" strokeLinecap="round"/>
  return <path d={`M${cx-5},${y+1} Q${cx},${y+4} ${cx+5},${y+1}`} stroke="#C0604A" strokeWidth="2" fill="none" strokeLinecap="round"/>
}

function Crown({ cx=60, y=14 }) {
  return (
    <g>
      <polygon points={`${cx-14},${y+10} ${cx-14},${y} ${cx-7},${y+6} ${cx},${y-4} ${cx+7},${y+6} ${cx+14},${y} ${cx+14},${y+10}`}
        fill="#FFD700" stroke="#FFA000" strokeWidth="1"/>
      <circle cx={cx} cy={y-4} r="2.5" fill="#FF4081"/>
      <circle cx={cx-7} cy={y+5} r="2" fill="#40C4FF"/>
      <circle cx={cx+7} cy={y+5} r="2" fill="#69F0AE"/>
    </g>
  )
}

function Glow({ cx=60, cy=70, r=52, color='#FFD700' }) {
  return (
    <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
      <stop offset="100%" stopColor={color} stopOpacity="0"/>
    </radialGradient>
  )
}
function CatSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const hr = isBaby ? 38 : 32
  const hcy = isBaby ? 60 : 54
  const hcx = 60
  return (
    <g>
      {isEvolved && (
        <>
          <defs><radialGradient id="cg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.s} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
          </radialGradient></defs>
          <ellipse cx={hcx} cy={hcy+12} rx="54" ry="46" fill="url(#cg)"/>
        </>
      )}
      {isBaby
        ? <ellipse cx={hcx} cy={hcy+hr+5} rx="14" ry="9" fill={p.b}/>
        : <ellipse cx={hcx} cy={hcy+hr+10} rx="22" ry="16" fill={p.b}/>
      }
      {!isBaby && <ellipse cx={hcx} cy={hcy+hr+1} rx="24" ry="7" fill={p.s} opacity="0.85"/>}
      <circle cx={hcx} cy={hcy} r={hr} fill={p.b}/>
      <polygon points={`${hcx-23},${hcy-26} ${hcx-8},${hcy-hr-12} ${hcx-4},${hcy-22}`} fill={p.b}/>
      <polygon points={`${hcx+4},${hcy-22} ${hcx+8},${hcy-hr-12} ${hcx+23},${hcy-26}`} fill={p.b}/>
      <polygon points={`${hcx-20},${hcy-24} ${hcx-9},${hcy-hr-6} ${hcx-5},${hcy-23}`} fill={p.i}/>
      <polygon points={`${hcx+5},${hcy-23} ${hcx+9},${hcy-hr-6} ${hcx+20},${hcy-24}`} fill={p.i}/>
      <ellipse cx={hcx} cy={hcy+4} rx={hr*0.58} ry={hr*0.48} fill={p.h} opacity="0.45"/>
      <Eyes mood={mood} lx={hcx-13} rx={hcx+13} y={hcy+2} c={p.e}/>
      {mood!=='sad' && <Blush lx={hcx-22} rx={hcx+22} y={hcy+14}/>}
      {mood==='sad' && <Tear x={hcx-13} y={hcy+2}/>}
      <ellipse cx={hcx} cy={hcy+14} rx="4" ry="3" fill={p.i}/>
      <Mouth mood={mood} cx={hcx} y={hcy+22}/>
      <line x1={hcx-8} y1={hcy+13} x2={hcx-28} y2={hcy+10} stroke={p.e} strokeWidth="1.2" opacity="0.55"/>
      <line x1={hcx-8} y1={hcy+16} x2={hcx-28} y2={hcy+17} stroke={p.e} strokeWidth="1.2" opacity="0.55"/>
      <line x1={hcx+8} y1={hcy+13} x2={hcx+28} y2={hcy+10} stroke={p.e} strokeWidth="1.2" opacity="0.55"/>
      <line x1={hcx+8} y1={hcy+16} x2={hcx+28} y2={hcy+17} stroke={p.e} strokeWidth="1.2" opacity="0.55"/>
      {isBaby && <path d={`M${hcx+12},${hcy+hr+8} Q${hcx+34},${hcy+hr+18} ${hcx+26},${hcy+hr+32}`} stroke={p.b} strokeWidth="6" fill="none" strokeLinecap="round"/>}
      {isEvolved && <Crown cx={hcx} y={hcy-hr+2}/>}
    </g>
  )
}

function DogSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const hr = isBaby ? 37 : 31
  const hcy = isBaby ? 60 : 54
  const hcx = 60
  return (
    <g>
      {isEvolved && (
        <>
          <defs><radialGradient id="dg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.s} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
          </radialGradient></defs>
          <ellipse cx={hcx} cy={hcy+12} rx="54" ry="46" fill="url(#dg)"/>
        </>
      )}
      {isBaby
        ? <ellipse cx={hcx} cy={hcy+hr+5} rx="13" ry="8" fill={p.b}/>
        : <ellipse cx={hcx} cy={hcy+hr+10} rx="22" ry="16" fill={p.b}/>
      }
      {!isBaby && <ellipse cx={hcx} cy={hcy+hr+1} rx="24" ry="7" fill={p.s} opacity="0.85"/>}
      <circle cx={hcx} cy={hcy} r={hr} fill={p.b}/>
      {/* Floppy ears */}
      <ellipse cx={hcx-hr*0.75} cy={hcy+4} rx="10" ry="18" fill={p.h} transform={`rotate(-14,${hcx-hr*0.75},${hcy+4})`}/>
      <ellipse cx={hcx+hr*0.75} cy={hcy+4} rx="10" ry="18" fill={p.h} transform={`rotate(14,${hcx+hr*0.75},${hcy+4})`}/>
      <ellipse cx={hcx} cy={hcy+6} rx={hr*0.56} ry={hr*0.46} fill={p.h} opacity="0.45"/>
      <Eyes mood={mood} lx={hcx-12} rx={hcx+12} y={hcy+2} c={p.e}/>
      {mood!=='sad' && <Blush lx={hcx-21} rx={hcx+21} y={hcy+15}/>}
      {mood==='sad' && <Tear x={hcx-12} y={hcy+2}/>}
      <ellipse cx={hcx} cy={hcy+16} rx="10" ry="7" fill={p.i}/>
      <ellipse cx={hcx} cy={hcy+15} rx="5" ry="4" fill={p.e} opacity="0.6"/>
      <Mouth mood={mood} cx={hcx} y={hcy+24}/>
      {isEvolved && <Crown cx={hcx} y={hcy-hr+2}/>}
    </g>
  )
}
function RabbitSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const hr = isBaby ? 36 : 30
  const hcy = isBaby ? 62 : 56
  const hcx = 60
  return (
    <g>
      {isEvolved && (
        <>
          <defs><radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.s} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
          </radialGradient></defs>
          <ellipse cx={hcx} cy={hcy+12} rx="54" ry="46" fill="url(#rg)"/>
        </>
      )}
      {/* Long ears */}
      <ellipse cx={hcx-14} cy={hcy-hr-10} rx="8" ry="20" fill={p.b}/>
      <ellipse cx={hcx+14} cy={hcy-hr-10} rx="8" ry="20" fill={p.b}/>
      <ellipse cx={hcx-14} cy={hcy-hr-10} rx="4" ry="15" fill={p.i}/>
      <ellipse cx={hcx+14} cy={hcy-hr-10} rx="4" ry="15" fill={p.i}/>
      {isBaby
        ? <ellipse cx={hcx} cy={hcy+hr+5} rx="12" ry="8" fill={p.b}/>
        : <ellipse cx={hcx} cy={hcy+hr+10} rx="20" ry="14" fill={p.b}/>
      }
      {!isBaby && <ellipse cx={hcx} cy={hcy+hr} rx="22" ry="7" fill={p.s} opacity="0.85"/>}
      <circle cx={hcx} cy={hcy} r={hr} fill={p.b}/>
      <ellipse cx={hcx} cy={hcy+6} rx={hr*0.55} ry={hr*0.44} fill={p.h} opacity="0.35"/>
      <Eyes mood={mood} lx={hcx-12} rx={hcx+12} y={hcy+1} c={p.e}/>
      {mood!=='sad' && <Blush lx={hcx-20} rx={hcx+20} y={hcy+13}/>}
      {mood==='sad' && <Tear x={hcx-12} y={hcy+1}/>}
      <ellipse cx={hcx} cy={hcy+13} rx="5" ry="4" fill={p.i}/>
      <Mouth mood={mood} cx={hcx} y={hcy+21}/>
      {isEvolved && <Crown cx={hcx} y={hcy-hr-16}/>}
    </g>
  )
}

function BearSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const hr = isBaby ? 38 : 32
  const hcy = isBaby ? 60 : 54
  const hcx = 60
  return (
    <g>
      {isEvolved && (
        <>
          <defs><radialGradient id="brg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.s} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
          </radialGradient></defs>
          <ellipse cx={hcx} cy={hcy+12} rx="54" ry="46" fill="url(#brg)"/>
        </>
      )}
      {isBaby
        ? <ellipse cx={hcx} cy={hcy+hr+5} rx="14" ry="9" fill={p.b}/>
        : <ellipse cx={hcx} cy={hcy+hr+10} rx="24" ry="17" fill={p.b}/>
      }
      {!isBaby && <ellipse cx={hcx} cy={hcy+hr+1} rx="26" ry="8" fill={p.s} opacity="0.85"/>}
      <circle cx={hcx} cy={hcy} r={hr} fill={p.b}/>
      {/* Round ears */}
      <circle cx={hcx-hr*0.72} cy={hcy-hr*0.72} r="11" fill={p.b}/>
      <circle cx={hcx+hr*0.72} cy={hcy-hr*0.72} r="11" fill={p.b}/>
      <circle cx={hcx-hr*0.72} cy={hcy-hr*0.72} r="6" fill={p.h}/>
      <circle cx={hcx+hr*0.72} cy={hcy-hr*0.72} r="6" fill={p.h}/>
      <ellipse cx={hcx} cy={hcy+8} rx={hr*0.52} ry={hr*0.44} fill={p.h} opacity="0.5"/>
      <ellipse cx={hcx} cy={hcy+12} rx="13" ry="10" fill={p.i} opacity="0.7"/>
      <Eyes mood={mood} lx={hcx-13} rx={hcx+13} y={hcy+1} c={p.e}/>
      {mood!=='sad' && <Blush lx={hcx-22} rx={hcx+22} y={hcy+15}/>}
      {mood==='sad' && <Tear x={hcx-13} y={hcy+1}/>}
      <ellipse cx={hcx} cy={hcy+14} rx="6" ry="4.5" fill={p.e} opacity="0.55"/>
      <Mouth mood={mood} cx={hcx} y={hcy+22}/>
      {isEvolved && <Crown cx={hcx} y={hcy-hr+2}/>}
    </g>
  )
}
function BirdSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const hr = isBaby ? 34 : 28
  const hcy = isBaby ? 60 : 54
  const hcx = 60
  return (
    <g>
      {isEvolved && (
        <>
          <defs><radialGradient id="big" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.s} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
          </radialGradient></defs>
          <ellipse cx={hcx} cy={hcy+12} rx="54" ry="46" fill="url(#big)"/>
        </>
      )}
      {/* Body */}
      {isBaby
        ? <ellipse cx={hcx} cy={hcy+hr+6} rx="16" ry="12" fill={p.b}/>
        : <ellipse cx={hcx} cy={hcy+hr+12} rx="24" ry="18" fill={p.b}/>
      }
      {!isBaby && (
        <>
          <ellipse cx={hcx-26} cy={hcy+hr+8} rx="10" ry="7" fill={p.b} transform={`rotate(-20,${hcx-26},${hcy+hr+8})`}/>
          <ellipse cx={hcx+26} cy={hcy+hr+8} rx="10" ry="7" fill={p.b} transform={`rotate(20,${hcx+26},${hcy+hr+8})`}/>
        </>
      )}
      {/* Head */}
      <circle cx={hcx} cy={hcy} r={hr} fill={p.b}/>
      {/* Tuft */}
      <ellipse cx={hcx} cy={hcy-hr+2} rx="7" ry="10" fill={p.h}/>
      <ellipse cx={hcx} cy={hcy+4} rx={hr*0.5} ry={hr*0.4} fill={p.h} opacity="0.4"/>
      <Eyes mood={mood} lx={hcx-11} rx={hcx+11} y={hcy} c={p.e}/>
      {mood!=='sad' && <Blush lx={hcx-19} rx={hcx+19} y={hcy+11}/>}
      {mood==='sad' && <Tear x={hcx-11} y={hcy}/>}
      {/* Beak */}
      <polygon points={`${hcx-6},${hcy+12} ${hcx+6},${hcy+12} ${hcx},${hcy+20}`} fill={p.i}/>
      {isEvolved && <Crown cx={hcx} y={hcy-hr+2}/>}
    </g>
  )
}

function DefaultSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const hr = isBaby ? 36 : 30
  const hcy = isBaby ? 60 : 54
  const hcx = 60
  return (
    <g>
      {isEvolved && (
        <>
          <defs><radialGradient id="defg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.s} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
          </radialGradient></defs>
          <ellipse cx={hcx} cy={hcy+12} rx="54" ry="46" fill="url(#defg)"/>
        </>
      )}
      {isBaby
        ? <ellipse cx={hcx} cy={hcy+hr+5} rx="13" ry="8" fill={p.b}/>
        : <ellipse cx={hcx} cy={hcy+hr+10} rx="22" ry="15" fill={p.b}/>
      }
      {!isBaby && <ellipse cx={hcx} cy={hcy+hr} rx="24" ry="7" fill={p.s} opacity="0.7"/>}
      <circle cx={hcx} cy={hcy} r={hr} fill={p.b}/>
      {/* Antenna */}
      <line x1={hcx-8} y1={hcy-hr+4} x2={hcx-14} y2={hcy-hr-12} stroke={p.h} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={hcx-14} cy={hcy-hr-12} r="4" fill={p.s}/>
      <line x1={hcx+8} y1={hcy-hr+4} x2={hcx+14} y2={hcy-hr-12} stroke={p.h} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={hcx+14} cy={hcy-hr-12} r="4" fill={p.i}/>
      <ellipse cx={hcx} cy={hcy+6} rx={hr*0.55} ry={hr*0.44} fill={p.h} opacity="0.35"/>
      <Eyes mood={mood} lx={hcx-12} rx={hcx+12} y={hcy+1} c={p.e}/>
      {mood!=='sad' && <Blush lx={hcx-20} rx={hcx+20} y={hcy+13}/>}
      {mood==='sad' && <Tear x={hcx-12} y={hcy+1}/>}
      <Mouth mood={mood} cx={hcx} y={hcy+20}/>
      {/* Spots */}
      <circle cx={hcx-8} cy={hcy+28} r="3" fill={p.s} opacity="0.5"/>
      <circle cx={hcx+8} cy={hcy+30} r="2.5" fill={p.i} opacity="0.5"/>
      {isEvolved && <Crown cx={hcx} y={hcy-hr-10}/>}
    </g>
  )
}

const SPECIES_MAP = {
  '🐱':'cat','🐯':'cat','🦁':'cat',
  '🐶':'dog','🦊':'dog',
  '🐰':'rabbit','🐇':'rabbit',
  '🐻':'bear','🐼':'bear','🐨':'bear',
  '🐧':'bird','🦜':'bird',
}

export function PetCharacter({ speciesIcon='', stage='baby', mood='neutral', size=120, animated=true }) {
  const key = SPECIES_MAP[speciesIcon] || 'def'
  const p = P[key]
  const props = { stage, mood, p }
  let idleClass = ''
  if (animated) {
    if (mood === 'happy') idleClass = 'pet-float'
    else if (mood === 'sad') idleClass = 'idle-sway'
    else idleClass = 'idle-sway'
  }
  const svgMap = { cat: CatSVG, dog: DogSVG, rabbit: RabbitSVG, bear: BearSVG, bird: BirdSVG, def: DefaultSVG }
  const Comp = svgMap[key]
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={idleClass}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <Comp {...props}/>
    </svg>
  )
}