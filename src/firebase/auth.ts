import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

export const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const logout = async () => {
    return auth.signOut()
}

export const register = async (data: RegisterArgs) => {
    sessionStorage.setItem('displayName', data['Name'])
    const result = await createUserWithEmailAndPassword(auth, data['Email'], data['Password'])
    const { uid } = result.user
    await updateProfile(result.user, {
        displayName: data['Name'],
    })
    await setDoc(doc(db, 'profiles', uid), { ...data, ...{ creationDate: Timestamp.fromDate(new Date()) } })
}

export const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email)
}