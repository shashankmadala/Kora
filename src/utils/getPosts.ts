import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getPosts = async () => {
    const posts: Post[] = []
    const snapshot = await getDocs(query(collection(db, 'posts'), orderBy('creationDate', 'desc')))
    snapshot.forEach(doc => {
        posts.push({ id: doc.id, ...doc.data() } as Post)
    })
    return posts
}