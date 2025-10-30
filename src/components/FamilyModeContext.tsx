import { createContext, useContext, useState, ReactNode } from 'react'

interface FamilyModeContextType {
    isEnabled: boolean
    setEnabled: (enabled: boolean) => void
    shouldPause: () => boolean
}

const FamilyModeContext = createContext<FamilyModeContextType | undefined>(undefined)

export function FamilyModeProvider({ children }: { children: ReactNode }) {
    const [isEnabled, setIsEnabled] = useState(false)

    const shouldPause = () => isEnabled

    return (
        <FamilyModeContext.Provider value={{ isEnabled, setEnabled: setIsEnabled, shouldPause }}>
            {children}
        </FamilyModeContext.Provider>
    )
}

export function useFamilyModeContext() {
    const context = useContext(FamilyModeContext)
    if (context === undefined) {
        throw new Error('useFamilyModeContext must be used within FamilyModeProvider')
    }
    return context
}




