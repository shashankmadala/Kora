import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getChatHistory = async (uid: string) => {
    const chatHistory = await getDoc(doc(db, 'chatHistory', uid))
    return chatHistory.data()!.history as ChatMessage[]
}