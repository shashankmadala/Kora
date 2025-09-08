import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

export const getProfile = async ({ userId }: getProfileArgs) => {
    if (!userId) {
        throw new Error('User ID is required')
    }
    
    try {
        const profileDoc = await getDoc(doc(db, 'profiles', userId))
        if (profileDoc.exists()) {
            return profileDoc.data() as Profile
        } else {
            // Return default profile if none exists
            return {
                'Child Name': '',
                'Child Age': '',
                'Diagnosis Date': '',
                'Sensory Sensitivities': '',
                'Current Therapies': '',
                'Preferred Calming Techniques': '',
                'Key Behavioral Traits': '',
                'Primary Method of Communication': 'Verbal'
            } as Profile
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
        throw error
    }
}