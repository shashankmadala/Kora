import { useState, ReactNode } from 'react'
import FamilyExplanationModal from './FamilyExplanationModal'

interface FamilyModeWrapperProps {
    isEnabled: boolean
    children: ReactNode
    onComplete?: (points: number) => void
    onClose: () => void
}

interface GameState {
    currentQuestion?: string
    userAnswer?: string
    isCorrect?: boolean
    explanation?: string
    points?: number
}

export function useFamilyMode(isEnabled: boolean) {
    const [showExplanation, setShowExplanation] = useState(false)
    const [gameState, setGameState] = useState<GameState>({})

    const triggerExplanation = (question: string, answer: string, isCorrect: boolean, explanation: string) => {
        if (isEnabled) {
            setGameState({ currentQuestion: question, userAnswer: answer, isCorrect, explanation })
            setShowExplanation(true)
        }
    }

    const handleContinue = () => {
        setShowExplanation(false)
        setGameState({})
    }

    const handleSkip = () => {
        setShowExplanation(false)
        setGameState({})
    }

    return {
        showExplanation,
        gameState,
        triggerExplanation,
        handleContinue,
        handleSkip
    }
}

export default function FamilyModeWrapper({ 
    isEnabled, 
    children, 
    onComplete, 
    onClose 
}: FamilyModeWrapperProps) {
    const { showExplanation, gameState, handleContinue, handleSkip } = useFamilyMode(isEnabled)

    return (
        <>
            {children}
            {isEnabled && (
                <FamilyExplanationModal
                    isOpen={showExplanation}
                    onClose={handleSkip}
                    onContinue={handleContinue}
                    question={gameState.currentQuestion}
                    userAnswer={gameState.userAnswer}
                    isCorrect={gameState.isCorrect}
                    explanation={gameState.explanation}
                />
            )}
        </>
    )
}




