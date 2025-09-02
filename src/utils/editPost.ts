import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const editPost = async (data: EditPostArgs) => {
    await updateDoc(doc(db, 'posts', data.id), { ...data })
}