import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import useStore from './store/useStore'

const unsubscribers = []

export function startFirestoreSync() {
  const set = useStore.setState

  // 监听 pin
  const unsubConfig = onSnapshot(doc(db, 'config', 'family'), (snap) => {
    if (snap.exists()) {
      set({ pin: snap.data().pin ?? null })
    }
  })
  unsubscribers.push(unsubConfig)

  // 监听各集合
  const cols = ['children', 'tasks', 'rewards', 'redemptions']
  cols.forEach((col) => {
    const unsub = onSnapshot(collection(db, col), (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      set({ [col]: items })
    })
    unsubscribers.push(unsub)
  })
}

export function stopFirestoreSync() {
  unsubscribers.forEach((unsub) => unsub())
  unsubscribers.length = 0
}
