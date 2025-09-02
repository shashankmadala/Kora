import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getProfile = async ({ userId }: getProfileArgs) => {
    const profile = await getDoc(doc(db, 'profiles', userId))
    return profile.data() as Profile
}