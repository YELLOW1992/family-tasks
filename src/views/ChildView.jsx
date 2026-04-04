import { useState } from 'react'
import ChildSelector from '../components/child/ChildSelector'
import PokemonHome from '../components/child/PokemonHome'

export default function ChildView({ onExit }) {
  const [selectedChild, setSelectedChild] = useState(null)

  if (!selectedChild) {
    return <ChildSelector onSelect={setSelectedChild} onBack={onExit} />
  }

  return <PokemonHome childId={selectedChild.id} />
}
