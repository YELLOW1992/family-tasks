import { useState } from 'react'
import useStore from '../../store/useStore'
import PokemonDisplay from './PokemonDisplay'

export default function PetHome({ childId }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <PokemonDisplay childId={childId} />
    </div>
  )
}