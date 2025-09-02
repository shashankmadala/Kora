import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const editProfile = async ({ data, userId }: EditProfileArgs) => {
    await updateDoc(doc(db, 'profiles', userId), { ...data })
}