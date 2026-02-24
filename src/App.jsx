import { useState } from 'react'
import HomeView from './views/HomeView'
import ParentView from './views/ParentView'
import ChildView from './views/ChildView'

export default function App() {
  const [view, setView] = useState('home')

  if (view === 'parent') return <ParentView onExit={() => setView('home')} />
  if (view === 'child') return <ChildView onExit={() => setView('home')} />
  return <HomeView onSelectParent={() => setView('parent')} onSelectChild={() => setView('child')} />
}
