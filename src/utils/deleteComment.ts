import { arrayRemove, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const deleteComment = async ({ username, content, id, postId }: DeleteCommentArgs) => {
    await updateDoc(doc(db, 'posts', postId), {
        comments: arrayRemove({ username, content, id })
    })
}