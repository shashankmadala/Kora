import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const editComment = async ({ username, content, commentId, postId }: EditCommentArgs) => {
    const docRef = doc(db, 'posts', postId)
    const originalData = await getDoc(docRef)
    const comments = (originalData.data() as Post).comments
    const index = comments.findIndex(comment => comment.id == commentId)

    if (comments[index].username != username) throw new Error('Invalid user')

    comments[index].content = content

    await updateDoc(docRef, { comments })
}