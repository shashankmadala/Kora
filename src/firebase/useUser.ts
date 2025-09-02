import { useInsertionEffect, useState } from 'react'
import { auth } from './firebase'
import { User } from 'firebase/auth'

export const useUser = () => {
    const [user, setUser] = useState<User | null | undefined>(undefined)

    useInsertionEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user != null && user.displayName == null) {
                const displayName = sessionStorage.getItem('displayName')
                user = { ...user, displayName }
            }
            setUser(user)
        })

        return unsubscribe
    }, [])

    return { user }
}