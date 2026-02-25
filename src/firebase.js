import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDESdDdp83-lUUrqXCO2FPPod-UumHDQOQ",
  authDomain: "family-tasks-2c8a5.firebaseapp.com",
  projectId: "family-tasks-2c8a5",
  storageBucket: "family-tasks-2c8a5.firebasestorage.app",
  messagingSenderId: "933639547361",
  appId: "1:933639547361:web:719a28a50f468f92e9caa0"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

enableIndexedDbPersistence(db).catch(() => {})
