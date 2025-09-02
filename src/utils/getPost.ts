import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getPost = async (id: string) => {
    const post = await getDoc(doc(db, 'posts', id))
    return post.data() as Post
}