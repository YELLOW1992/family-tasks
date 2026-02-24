import { useState } from 'react'
import useStore from '../store/useStore'
import PinPad from '../components/common/PinPad'
import ParentDashboard from '../components/parent/ParentDashboard'

export default function ParentView({ onExit }) {
  const pin = useStore((s) => s.pin)
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return (
      <PinPad
        mode={pin ? 'verify' : 'setup'}
        onSuccess={() => setAuthed(true)}
        onCancel={onExit}
      />
    )
  }

  return <ParentDashboard onExit={onExit} />
}
