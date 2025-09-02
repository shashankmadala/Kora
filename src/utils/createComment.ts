import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const createComment = async ({ id, username, content, commentId }: CreateCommentArgs) => {
    await updateDoc(doc(db, 'posts', id), {
        comments: arrayUnion({ username, content, id: commentId })
    })
}