import { Capacitor } from '@capacitor/core'
import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID
}

const initAuth = () => {
    let auth
    if (Capacitor.isNativePlatform()) {
        auth = initializeAuth(app, {
            persistence: browserLocalPersistence
        })
    } else {
        auth = getAuth(app)
    }
    return auth
}

export const app = initializeApp(firebaseConfig)
export const auth = initAuth()
export const db = getFirestore(app)