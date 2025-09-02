import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const saveChatHistory = async ({ uid, history }: { uid: string, history: ChatMessage[] }) => {
    const docRef = doc(db, 'chatHistory', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        await updateDoc(docRef, { history })
    } else {
        await setDoc(docRef, { history })
    }
}