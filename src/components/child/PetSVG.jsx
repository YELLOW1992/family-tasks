// Q版宠物SVG角色库 v2 — 精致版
// stage: 'baby'|'adult'|'evolved'  mood: 'happy'|'neutral'|'sad'

const P = {
  cat:    { b:'#FFAC7A', h:'#FFE0C8', i:'#FFB3DE', s:'#FF7043', e:'#3E2000', iris:'#26A69A' },
  dog:    { b:'#D4956A', h:'#F0C899', i:'#FFCBA4', s:'#5C9EE0', e:'#3E1A00', iris:'#795548' },
  rabbit: { b:'#EDE7F6', h:'#FAFAFA', i:'#F48FB1', s:'#CE93D8', e:'#4A148C', iris:'#7E57C2' },
  bear:   { b:'#8B6347', h:'#C49A78', i:'#D7B89A', s:'#4CAF50', e:'#1B0000', iris:'#5D4037' },
  bird:   { b:'#42A5F5', h:'#90CAF9', i:'#FFE082', s:'#FF7043', e:'#0D2137', iris:'#1565C0' },
  def:    { b:'#B39DDB', h:'#D1C4E9', i:'#F8BBD9', s:'#FFD54F', e:'#311B92', iris:'#7B1FA2' },
}

// Shared big-eye renderer
function BigEye({ cx, cy, r=9, irisColor='#26A69A', pupilColor='#1A0A00', mood='neutral', flip=false }) {
  if (mood === 'happy') {
    const d = flip
      ? `M${cx+r},${cy} Q${cx},${cy-r*1.1} ${cx-r},${cy}`
      : `M${cx-r},${cy} Q${cx},${cy-r*1.1} ${cx+r},${cy}`
    return <path d={d} stroke={pupilColor} strokeWidth="3" fill="none" strokeLinecap="round"/>
  }
  if (mood === 'sad') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={irisColor} opacity="0.9"/>
        <circle cx={cx} cy={cy} r={r*0.62} fill={pupilColor}/>
        <circle cx={cx+r*0.28} cy={cy-r*0.28} r={r*0.22} fill="white"/>
        <circle cx={cx-r*0.22} cy={cy+r*0.15} r={r*0.12} fill="white" opacity="0.7"/>
        {/* droopy lid */}
        <path d={`M${cx-r},${cy+1} Q${cx},${cy-r*0.5} ${cx+r},${cy+1}`} fill={pupilColor} opacity="0.35"/>
      </g>
    )
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={irisColor} opacity="0.95"/>
      <circle cx={cx} cy={cy+r*0.1} r={r*0.6} fill={pupilColor}/>
      <circle cx={cx+r*0.3} cy={cy-r*0.3} r={r*0.24} fill="white"/>
      <circle cx={cx-r*0.25} cy={cy+r*0.2} r={r*0.13} fill="white" opacity="0.75"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="0.8" opacity="0.15"/>
    </g>
  )
}

function Cheeks({ lx, rx, y }) {
  return (
    <>
      <ellipse cx={lx} cy={y} rx="9" ry="5.5" fill="#FFB3C8" opacity="0.6"/>
      <ellipse cx={rx} cy={y} rx="9" ry="5.5" fill="#FFB3C8" opacity="0.6"/>
    </>
  )
}

function CuteMouth({ mood, cx, y }) {
  if (mood === 'happy') return (
    <g>
      <path d={`M${cx-8},${y} Q${cx-2},${y+7} ${cx},${y+8} Q${cx+2},${y+7} ${cx+8},${y}`} stroke="#C0604A" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </g>
  )
  if (mood === 'sad') return <path d={`M${cx-7},${y+6} Q${cx},${y-1} ${cx+7},${y+6}`} stroke="#C0604A" strokeWidth="2" fill="none" strokeLinecap="round"/>
  return <path d={`M${cx-6},${y+1} Q${cx},${y+6} ${cx+6},${y+1}`} stroke="#C0604A" strokeWidth="2" fill="none" strokeLinecap="round"/>
}

function Tears({ lx, rx, y }) {
  return (
    <>
      <ellipse cx={lx} cy={y+12} rx="2.5" ry="5" fill="#90CAF9" opacity="0.9"/>
      <ellipse cx={rx} cy={y+15} rx="2" ry="4" fill="#90CAF9" opacity="0.7"/>
    </>
  )
}

function Crown({ cx, y }) {
  return (
    <g>
      <polygon points={`${cx-16},${y} ${cx-8},${y-16} ${cx},${y-8} ${cx+8},${y-16} ${cx+16},${y} `} fill="#FFD700" stroke="#FFA000" strokeWidth="1.2"/>
      <circle cx={cx} cy={y-8} r="3.5" fill="#FF4081"/>
      <circle cx={cx-9} cy={y-1} r="2.5" fill="#40C4FF"/>
      <circle cx={cx+9} cy={y-1} r="2.5" fill="#69F0AE"/>
    </g>
  )
}

function CatSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const cx = 60, cy = stage === 'baby' ? 62 : 56
  const hr = isBaby ? 30 : 26
  const id = `cg${stage}`
  return (
    <g>
      <defs>
        <radialGradient id={`cb${stage}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.h}/>
          <stop offset="100%" stopColor={p.b}/>
        </radialGradient>
        {isEvolved && <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.s} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
        </radialGradient>}
      </defs>
      {isEvolved && <ellipse cx={cx} cy={cy+14} rx="58" ry="50" fill={`url(#${id})`}/>}
      {/* Shadow */}
      <ellipse cx={cx} cy={cy+hr+18} rx={isBaby?18:28} ry={isBaby?5:8} fill="#0002"/>
      {/* Body */}
      {!isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+8} rx="24" ry="20" fill={`url(#cb${stage})`}/>
          <ellipse cx={cx} cy={cy+hr+2} rx="25" ry="8" fill={p.s} opacity="0.7"/>
          {/* tail */}
          <path d={`M${cx+20},${cy+hr+14} Q${cx+44},${cy+hr+28} ${cx+36},${cy+hr+44}`} stroke={p.b} strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d={`M${cx+20},${cy+hr+14} Q${cx+44},${cy+hr+28} ${cx+36},${cy+hr+44}`} stroke={p.h} strokeWidth="4" fill="none" strokeLinecap="round"/>
        </g>
      )}
      {isBaby && <ellipse cx={cx} cy={cy+hr+6} rx="14" ry="10" fill={`url(#cb${stage})`}/>}
      {/* Ears */}
      <polygon points={`${cx-24},${cy-22} ${cx-10},${cy-hr-14} ${cx-5},${cy-20}`} fill={p.b}/>
      <polygon points={`${cx+5},${cy-20} ${cx+10},${cy-hr-14} ${cx+24},${cy-22}`} fill={p.b}/>
      <polygon points={`${cx-21},${cy-21} ${cx-11},${cy-hr-7} ${cx-6},${cy-21}`} fill={p.i}/>
      <polygon points={`${cx+6},${cy-21} ${cx+11},${cy-hr-7} ${cx+21},${cy-21}`} fill={p.i}/>
      {/* Head */}
      <circle cx={cx} cy={cy} r={hr} fill={`url(#cb${stage})`}/>
      {/* Face highlight */}
      <ellipse cx={cx-4} cy={cy-8} rx={hr*0.55} ry={hr*0.42} fill="white" opacity="0.12"/>
      {/* Muzzle */}
      <ellipse cx={cx} cy={cy+10} rx="12" ry="9" fill={p.h} opacity="0.8"/>
      <ellipse cx={cx} cy={cy+9} rx="5" ry="3.5" fill={p.i} opacity="0.9"/>
      {/* Eyes */}
      <BigEye cx={cx-14} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood}/>
      <BigEye cx={cx+14} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood} flip/>
      {mood==='sad' && <Tears lx={cx-14} rx={cx+14} y={cy-2}/>}
      {mood!=='sad' && <Cheeks lx={cx-22} rx={cx+22} y={cy+12}/>}
      <CuteMouth mood={mood} cx={cx} y={cy+16}/>
      {/* Whiskers */}
      {[[-8,-28,-1],[-8,-28,3],[8,28,-1],[8,28,3]].map(([ox,tx,oy],i)=>(
        <line key={i} x1={cx+ox} y1={cy+11+oy} x2={cx+tx} y2={cy+10+oy} stroke={p.e} strokeWidth="1" opacity="0.45"/>
      ))}
      {isBaby && <path d={`M${cx+12},${cy+hr+8} Q${cx+36},${cy+hr+20} ${cx+28},${cy+hr+36}`} stroke={p.b} strokeWidth="7" fill="none" strokeLinecap="round"/>}
      {isEvolved && <Crown cx={cx} y={cy-hr}/>}
    </g>
  )
}
function DogSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const cx = 60, cy = isBaby ? 62 : 56
  const hr = isBaby ? 30 : 26
  const id = `dg${stage}`
  return (
    <g>
      <defs>
        <radialGradient id={`db${stage}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.h}/>
          <stop offset="100%" stopColor={p.b}/>
        </radialGradient>
        {isEvolved && <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.s} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
        </radialGradient>}
      </defs>
      {isEvolved && <ellipse cx={cx} cy={cy+14} rx="58" ry="50" fill={`url(#${id})`}/>}
      <ellipse cx={cx} cy={cy+hr+18} rx={isBaby?18:28} ry={isBaby?5:8} fill="#0002"/>
      {!isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+8} rx="24" ry="20" fill={`url(#db${stage})`}/>
          <ellipse cx={cx} cy={cy+hr+2} rx="25" ry="8" fill={p.s} opacity="0.7"/>
          <path d={`M${cx-18},${cy+hr+12} Q${cx-42},${cy+hr+22} ${cx-34},${cy+hr+38}`} stroke={p.b} strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d={`M${cx-18},${cy+hr+12} Q${cx-42},${cy+hr+22} ${cx-34},${cy+hr+38}`} stroke={p.h} strokeWidth="4" fill="none" strokeLinecap="round"/>
        </g>
      )}
      {isBaby && <ellipse cx={cx} cy={cy+hr+6} rx="14" ry="10" fill={`url(#db${stage})`}/>}
      {/* Floppy ears */}
      <ellipse cx={cx-hr-2} cy={cy+4} rx="11" ry="18" fill={p.b} transform={`rotate(-18,${cx-hr-2},${cy+4})`}/>
      <ellipse cx={cx-hr-2} cy={cy+4} rx="7" ry="13" fill={p.h} opacity="0.5" transform={`rotate(-18,${cx-hr-2},${cy+4})`}/>
      <ellipse cx={cx+hr+2} cy={cy+4} rx="11" ry="18" fill={p.b} transform={`rotate(18,${cx+hr+2},${cy+4})`}/>
      <ellipse cx={cx+hr+2} cy={cy+4} rx="7" ry="13" fill={p.h} opacity="0.5" transform={`rotate(18,${cx+hr+2},${cy+4})`}/>
      <circle cx={cx} cy={cy} r={hr} fill={`url(#db${stage})`}/>
      <ellipse cx={cx-4} cy={cy-8} rx={hr*0.55} ry={hr*0.42} fill="white" opacity="0.12"/>
      {/* Snout */}
      <ellipse cx={cx} cy={cy+12} rx="14" ry="11" fill={p.h} opacity="0.85"/>
      <ellipse cx={cx} cy={cy+9} rx="7" ry="5" fill={p.i} opacity="0.8"/>
      <ellipse cx={cx} cy={cy+8} rx="4" ry="2.5" fill={p.e} opacity="0.7"/>
      <BigEye cx={cx-14} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood}/>
      <BigEye cx={cx+14} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood} flip/>
      {mood==='sad' && <Tears lx={cx-14} rx={cx+14} y={cy-2}/>}
      {mood!=='sad' && <Cheeks lx={cx-22} rx={cx+22} y={cy+14}/>}
      <CuteMouth mood={mood} cx={cx} y={cy+18}/>
      {isBaby && <path d={`M${cx-12},${cy+hr+8} Q${cx-36},${cy+hr+18} ${cx-28},${cy+hr+32}`} stroke={p.b} strokeWidth="7" fill="none" strokeLinecap="round"/>}
      {isEvolved && <Crown cx={cx} y={cy-hr}/>}
    </g>
  )
}
function RabbitSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const cx = 60, cy = isBaby ? 62 : 56
  const hr = isBaby ? 30 : 26
  const id = `rg${stage}`
  return (
    <g>
      <defs>
        <radialGradient id={`rb${stage}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.h}/>
          <stop offset="100%" stopColor={p.b}/>
        </radialGradient>
        {isEvolved && <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.s} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
        </radialGradient>}
      </defs>
      {isEvolved && <ellipse cx={cx} cy={cy+14} rx="58" ry="50" fill={`url(#${id})`}/>}
      <ellipse cx={cx} cy={cy+hr+18} rx={isBaby?18:28} ry={isBaby?5:8} fill="#0002"/>
      {!isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+8} rx="24" ry="20" fill={`url(#rb${stage})`}/>
          <ellipse cx={cx} cy={cy+hr+2} rx="25" ry="8" fill={p.s} opacity="0.6"/>
          {/* fluffy tail */}
          <circle cx={cx+22} cy={cy+hr+22} r="9" fill="white" opacity="0.9"/>
          <circle cx={cx+22} cy={cy+hr+22} r="6" fill={p.h}/>
        </g>
      )}
      {isBaby && <ellipse cx={cx} cy={cy+hr+6} rx="14" ry="10" fill={`url(#rb${stage})`}/>}
      {/* Long ears */}
      <ellipse cx={cx-14} cy={cy-hr-18} rx="9" ry="22" fill={p.b}/>
      <ellipse cx={cx-14} cy={cy-hr-18} rx="5.5" ry="17" fill={p.i} opacity="0.85"/>
      <ellipse cx={cx+14} cy={cy-hr-18} rx="9" ry="22" fill={p.b}/>
      <ellipse cx={cx+14} cy={cy-hr-18} rx="5.5" ry="17" fill={p.i} opacity="0.85"/>
      <circle cx={cx} cy={cy} r={hr} fill={`url(#rb${stage})`}/>
      <ellipse cx={cx-4} cy={cy-8} rx={hr*0.55} ry={hr*0.42} fill="white" opacity="0.15"/>
      {/* Muzzle */}
      <ellipse cx={cx} cy={cy+12} rx="11" ry="8" fill={p.h} opacity="0.7"/>
      <ellipse cx={cx} cy={cy+10} rx="4" ry="3" fill={p.i} opacity="0.9"/>
      <BigEye cx={cx-13} cy={cy-1} r={isBaby?9.5:8.5} irisColor={p.iris} pupilColor={p.e} mood={mood}/>
      <BigEye cx={cx+13} cy={cy-1} r={isBaby?9.5:8.5} irisColor={p.iris} pupilColor={p.e} mood={mood} flip/>
      {mood==='sad' && <Tears lx={cx-13} rx={cx+13} y={cy-1}/>}
      {mood!=='sad' && <Cheeks lx={cx-21} rx={cx+21} y={cy+12}/>}
      <CuteMouth mood={mood} cx={cx} y={cy+16}/>
      {isBaby && <circle cx={cx+18} cy={cy+hr+10} r="6" fill="white" opacity="0.85"/>}
      {isEvolved && <Crown cx={cx} y={cy-hr-4}/>}
    </g>
  )
}
function BearSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const cx = 60, cy = isBaby ? 62 : 56
  const hr = isBaby ? 31 : 27
  const id = `brg${stage}`
  return (
    <g>
      <defs>
        <radialGradient id={`brb${stage}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.h}/>
          <stop offset="100%" stopColor={p.b}/>
        </radialGradient>
        {isEvolved && <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.s} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
        </radialGradient>}
      </defs>
      {isEvolved && <ellipse cx={cx} cy={cy+14} rx="58" ry="50" fill={`url(#${id})`}/>}
      <ellipse cx={cx} cy={cy+hr+18} rx={isBaby?20:30} ry={isBaby?6:9} fill="#0002"/>
      {!isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+10} rx="26" ry="22" fill={`url(#brb${stage})`}/>
          <ellipse cx={cx} cy={cy+hr+3} rx="27" ry="9" fill={p.h} opacity="0.6"/>
        </g>
      )}
      {isBaby && <ellipse cx={cx} cy={cy+hr+7} rx="16" ry="11" fill={`url(#brb${stage})`}/>}
      {/* Round ears */}
      <circle cx={cx-hr+4} cy={cy-hr+6} r="13" fill={p.b}/>
      <circle cx={cx-hr+4} cy={cy-hr+6} r="8" fill={p.i} opacity="0.7"/>
      <circle cx={cx+hr-4} cy={cy-hr+6} r="13" fill={p.b}/>
      <circle cx={cx+hr-4} cy={cy-hr+6} r="8" fill={p.i} opacity="0.7"/>
      <circle cx={cx} cy={cy} r={hr} fill={`url(#brb${stage})`}/>
      <ellipse cx={cx-4} cy={cy-8} rx={hr*0.55} ry={hr*0.42} fill="white" opacity="0.12"/>
      {/* Muzzle */}
      <ellipse cx={cx} cy={cy+13} rx="16" ry="12" fill={p.i} opacity="0.75"/>
      <ellipse cx={cx} cy={cy+10} rx="6" ry="4" fill={p.h} opacity="0.6"/>
      <ellipse cx={cx} cy={cy+9} rx="3.5" ry="2.2" fill={p.e} opacity="0.65"/>
      <BigEye cx={cx-14} cy={cy-3} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood}/>
      <BigEye cx={cx+14} cy={cy-3} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood} flip/>
      {mood==='sad' && <Tears lx={cx-14} rx={cx+14} y={cy-3}/>}
      {mood!=='sad' && <Cheeks lx={cx-23} rx={cx+23} y={cy+14}/>}
      <CuteMouth mood={mood} cx={cx} y={cy+19}/>
      {isEvolved && <Crown cx={cx} y={cy-hr}/>}
    </g>
  )
}
function BirdSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const cx = 60, cy = isBaby ? 62 : 56
  const hr = isBaby ? 28 : 24
  const id = `big${stage}`
  return (
    <g>
      <defs>
        <radialGradient id={`bib${stage}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.h}/>
          <stop offset="100%" stopColor={p.b}/>
        </radialGradient>
        {isEvolved && <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.s} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
        </radialGradient>}
      </defs>
      {isEvolved && <ellipse cx={cx} cy={cy+14} rx="58" ry="50" fill={`url(#${id})`}/>}
      <ellipse cx={cx} cy={cy+hr+16} rx={isBaby?16:26} ry={isBaby?5:8} fill="#0002"/>
      {!isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+6} rx="22" ry="18" fill={`url(#bib${stage})`}/>
          {/* Wings */}
          <ellipse cx={cx-26} cy={cy+hr-2} rx="14" ry="9" fill={p.b} transform={`rotate(-20,${cx-26},${cy+hr-2})`}/>
          <ellipse cx={cx+26} cy={cy+hr-2} rx="14" ry="9" fill={p.b} transform={`rotate(20,${cx+26},${cy+hr-2})`}/>
          <ellipse cx={cx-26} cy={cy+hr-2} rx="10" ry="6" fill={p.h} opacity="0.5" transform={`rotate(-20,${cx-26},${cy+hr-2})`}/>
          <ellipse cx={cx+26} cy={cy+hr-2} rx="10" ry="6" fill={p.h} opacity="0.5" transform={`rotate(20,${cx+26},${cy+hr-2})`}/>
          {/* Tail feathers */}
          <path d={`M${cx-8},${cy+hr+10} Q${cx-18},${cy+hr+30} ${cx-12},${cy+hr+42}`} stroke={p.b} strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d={`M${cx},${cy+hr+10} Q${cx},${cy+hr+34} ${cx},${cy+hr+46}`} stroke={p.s} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d={`M${cx+8},${cy+hr+10} Q${cx+18},${cy+hr+30} ${cx+12},${cy+hr+42}`} stroke={p.b} strokeWidth="7" fill="none" strokeLinecap="round"/>
        </g>
      )}
      {isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+5} rx="12" ry="9" fill={`url(#bib${stage})`}/>
          <ellipse cx={cx-18} cy={cy+hr} rx="10" ry="6" fill={p.b} transform={`rotate(-15,${cx-18},${cy+hr})`}/>
          <ellipse cx={cx+18} cy={cy+hr} rx="10" ry="6" fill={p.b} transform={`rotate(15,${cx+18},${cy+hr})`}/>
        </g>
      )}
      {/* Crest */}
      <path d={`M${cx-6},${cy-hr+4} Q${cx-2},${cy-hr-16} ${cx+2},${cy-hr+4}`} stroke={p.s} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx={cx} cy={cy-hr-12} r="5" fill={p.s}/>
      <circle cx={cx} cy={cy} r={hr} fill={`url(#bib${stage})`}/>
      <ellipse cx={cx-4} cy={cy-8} rx={hr*0.55} ry={hr*0.42} fill="white" opacity="0.15"/>
      {/* Beak */}
      <polygon points={`${cx-7},${cy+8} ${cx+7},${cy+8} ${cx},${cy+18}`} fill={p.i}/>
      <line x1={cx-7} y1={cy+8} x2={cx+7} y2={cy+8} stroke="#FFA000" strokeWidth="1"/>
      <BigEye cx={cx-13} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood}/>
      <BigEye cx={cx+13} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood} flip/>
      {mood==='sad' && <Tears lx={cx-13} rx={cx+13} y={cy-2}/>}
      {mood!=='sad' && <Cheeks lx={cx-20} rx={cx+20} y={cy+4}/>}
      {isEvolved && <Crown cx={cx} y={cy-hr-2}/>}
    </g>
  )
}
function DefaultSVG({ stage, mood, p }) {
  const isBaby = stage === 'baby'
  const isEvolved = stage === 'evolved'
  const cx = 60, cy = isBaby ? 62 : 56
  const hr = isBaby ? 29 : 25
  const id = `dfg${stage}`
  return (
    <g>
      <defs>
        <radialGradient id={`dfb${stage}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.h}/>
          <stop offset="100%" stopColor={p.b}/>
        </radialGradient>
        {isEvolved && <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.s} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={p.s} stopOpacity="0"/>
        </radialGradient>}
      </defs>
      {isEvolved && <ellipse cx={cx} cy={cy+14} rx="58" ry="50" fill={`url(#${id})`}/>}
      <ellipse cx={cx} cy={cy+hr+18} rx={isBaby?18:28} ry={isBaby?5:8} fill="#0002"/>
      {!isBaby && (
        <g>
          <ellipse cx={cx} cy={cy+hr+8} rx="24" ry="20" fill={`url(#dfb${stage})`}/>
          <ellipse cx={cx} cy={cy+hr+2} rx="25" ry="8" fill={p.s} opacity="0.6"/>
        </g>
      )}
      {isBaby && <ellipse cx={cx} cy={cy+hr+6} rx="14" ry="10" fill={`url(#dfb${stage})`}/>}
      {/* Antennae */}
      <line x1={cx-8} y1={cy-hr+4} x2={cx-16} y2={cy-hr-14} stroke={p.h} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={cx-16} cy={cy-hr-14} r="5" fill={p.s}/>
      <circle cx={cx-16} cy={cy-hr-14} r="2.5" fill="white" opacity="0.7"/>
      <line x1={cx+8} y1={cy-hr+4} x2={cx+16} y2={cy-hr-14} stroke={p.h} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={cx+16} cy={cy-hr-14} r="5" fill={p.i}/>
      <circle cx={cx+16} cy={cy-hr-14} r="2.5" fill="white" opacity="0.7"/>
      <circle cx={cx} cy={cy} r={hr} fill={`url(#dfb${stage})`}/>
      <ellipse cx={cx-4} cy={cy-8} rx={hr*0.55} ry={hr*0.42} fill="white" opacity="0.13"/>
      <ellipse cx={cx} cy={cy+10} rx="10" ry="7.5" fill={p.h} opacity="0.7"/>
      <BigEye cx={cx-13} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood}/>
      <BigEye cx={cx+13} cy={cy-2} r={isBaby?9:8} irisColor={p.iris} pupilColor={p.e} mood={mood} flip/>
      {mood==='sad' && <Tears lx={cx-13} rx={cx+13} y={cy-2}/>}
      {mood!=='sad' && <Cheeks lx={cx-21} rx={cx+21} y={cy+12}/>}
      <CuteMouth mood={mood} cx={cx} y={cy+16}/>
      <circle cx={cx-8} cy={cy+26} r="3.5" fill={p.s} opacity="0.5"/>
      <circle cx={cx+8} cy={cy+28} r="3" fill={p.i} opacity="0.5"/>
      {isEvolved && <Crown cx={cx} y={cy-hr-8}/>}
    </g>
  )
}

const SPECIES_MAP = {
  '🐱':'cat','🐯':'cat','🦁':'cat',
  '🐶':'dog','🦊':'dog',
  '🐰':'rabbit','🐇':'rabbit',
  '🐻':'bear','🐼':'bear','🐨':'bear',
  '🐧':'bird','🦜':'bird','🐦':'bird',
}

export function PetCharacter({ speciesIcon='', stage='baby', mood='neutral', size=120, animated=true }) {
  const key = SPECIES_MAP[speciesIcon] || 'def'
  const p = P[key]
  const props = { stage, mood, p }
  let idleClass = ''
  if (animated) {
    if (mood === 'happy') idleClass = 'pet-happy-bob'
    else if (mood === 'sad') idleClass = 'pet-sad-sway'
    else idleClass = 'pet-breathe'
  }
  const svgMap = { cat: CatSVG, dog: DogSVG, rabbit: RabbitSVG, bear: BearSVG, bird: BirdSVG, def: DefaultSVG }
  const Comp = svgMap[key]
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={idleClass}
      style={{ display:'block', overflow:'visible', filter: mood==='happy' ? 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' : mood==='sad' ? 'drop-shadow(0 0 4px rgba(100,150,255,0.4))' : 'none' }}>
      <Comp {...props}/>
    </svg>
  )
}