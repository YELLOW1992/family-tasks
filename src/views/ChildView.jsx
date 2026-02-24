import { useState } from 'react'
import ChildSelector from '../components/child/ChildSelector'
import ChildDashboard from '../components/child/ChildDashboard'

export default function ChildView({ onExit }) {
  const [selectedChild, setSelectedChild] = useState(null)

  if (!selectedChild) {
    return <ChildSelector onSelect={setSelectedChild} onBack={onExit} />
  }

  return <ChildDashboard child={selectedChild} onExit={() => setSelectedChild(null)} />
}
