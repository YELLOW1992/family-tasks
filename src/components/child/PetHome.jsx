import { useState } from 'react'
import useStore from '../../store/useStore'
import PokemonHome from './PokemonHome'

export default function PetHome({ childId }) {
  return <PokemonHome childId={childId} />
}