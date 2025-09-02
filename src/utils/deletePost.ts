import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const deletePost = async ({ id }: DeletePostArgs) => {
    await deleteDoc(doc(db, 'posts', id))
}