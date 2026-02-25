import { create } from 'zustand'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  setDoc, runTransaction, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

const useStore = create((set, get) => ({
  pin: null,
  children: [],
  tasks: [],
  rewards: [],
  redemptions: [],

  // PIN
  setPin: async (pin) => {
    await setDoc(doc(db, 'config', 'family'), { pin }, { merge: true })
  },
  verifyPin: (input) => get().pin === input,

  // Children
  addChild: async (child) => {
    await addDoc(collection(db, 'children'), { ...child, points: 0 })
  },
  updateChild: async (id, data) => {
    await updateDoc(doc(db, 'children', id), data)
  },
  removeChild: async (id) => {
    await deleteDoc(doc(db, 'children', id))
  },

  // Tasks
  addTask: async (task) => {
    await addDoc(collection(db, 'tasks'), {
      ...task,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
  },
  updateTask: async (id, data) => {
    await updateDoc(doc(db, 'tasks', id), data)
  },
  deleteTask: async (id) => {
    await deleteDoc(doc(db, 'tasks', id))
  },
  markTaskDone: async (id) => {
    await updateDoc(doc(db, 'tasks', id), { status: 'done' })
  },
  approveTask: async (id) => {
    await runTransaction(db, async (tx) => {
      const taskRef = doc(db, 'tasks', id)
      const taskSnap = await tx.get(taskRef)
      if (!taskSnap.exists()) return
      const task = taskSnap.data()
      const childRef = doc(db, 'children', task.assignedTo)
      const childSnap = await tx.get(childRef)
      if (!childSnap.exists()) return
      tx.update(taskRef, { status: 'approved' })
      tx.update(childRef, { points: (childSnap.data().points || 0) + task.points })
    })
  },
  rejectTask: async (id) => {
    await updateDoc(doc(db, 'tasks', id), { status: 'rejected' })
  },

  // Rewards
  addReward: async (reward) => {
    await addDoc(collection(db, 'rewards'), { ...reward, available: true })
  },
  updateReward: async (id, data) => {
    await updateDoc(doc(db, 'rewards', id), data)
  },
  deleteReward: async (id) => {
    await deleteDoc(doc(db, 'rewards', id))
  },

  // Redemptions
  redeemReward: async (rewardId, childId) => {
    await runTransaction(db, async (tx) => {
      const rewardRef = doc(db, 'rewards', rewardId)
      const childRef = doc(db, 'children', childId)
      const [rewardSnap, childSnap] = await Promise.all([tx.get(rewardRef), tx.get(childRef)])
      if (!rewardSnap.exists() || !childSnap.exists()) return
      const reward = rewardSnap.data()
      const child = childSnap.data()
      if (!reward.available || child.points < reward.cost) return
      const redemptionRef = doc(collection(db, 'redemptions'))
      tx.set(redemptionRef, {
        rewardId,
        childId,
        redeemedAt: serverTimestamp(),
        status: 'pending',
      })
      tx.update(childRef, { points: child.points - reward.cost })
    })
  },
  fulfillRedemption: async (id) => {
    await updateDoc(doc(db, 'redemptions', id), { status: 'fulfilled' })
  },
}))

export default useStore
