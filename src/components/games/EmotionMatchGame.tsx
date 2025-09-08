import { 
    Box, VStack, HStack, Text, Button, Image, 
    Progress, Icon, useToast, Heading
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, CheckCircle, XCircle, RotateCcw } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Emotion data
const emotions = [
    { id: 'happy', name: 'Happy', emoji: '😊', color: '#10b981' },
    { id: 'sad', name: 'Sad', emoji: '😢', color: '#3b82f6' },
    { id: 'angry', name: 'Angry', emoji: '😠', color: '#ef4444' },
    { id: 'surprised', name: 'Surprised', emoji: '😲', color: '#f59e0b' },
    { id: 'scared', name: 'Scared', emoji: '😨', color: '#8b5cf6' },
    { id: 'calm', name: 'Calm', emoji: '😌', color: '#06b6d4' }
]

// Face cards with different emotions
const faceCards = [
    { id: 1, emotion: 'happy', emoji: '😊', description: 'A smiling face' },
    { id: 2, emotion: 'sad', emoji: '😢', description: 'A face with tears' },
    { id: 3, emotion: 'angry', emoji: '😠', description: 'A frowning face' },
    { id: 4, emotion: 'surprised', emoji: '😲', description: 'A surprised face' },
    { id: 5, emotion: 'scared', emoji: '😨', description: 'A scared face' },
    { id: 6, emotion: 'calm', emoji: '😌', description: 'A peaceful face' },
    { id: 7, emotion: 'happy', emoji: '😄', description: 'A laughing face' },
    { id: 8, emotion: 'sad', emoji: '😞', description: 'A disappointed face' },
    { id: 9, emotion: 'angry', emoji: '😡', description: 'A very angry face' },
    { id: 10, emotion: 'surprised', emoji: '🤯', description: 'A mind-blown face' }
]

interface EmotionMatchGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function EmotionMatchGame({ onComplete, onClose }: EmotionMatchGameProps) {
    const [currentCard, setCurrentCard] = useState(0)
    const [score, setScore] = useState(0)
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [gameComplete, setGameComplete] = useState(false)
    const toast = useToast()

    const totalCards = 5
    const currentFace = faceCards[currentCard]
    const correctEmotion = currentFace.emotion

    // Get 3 random emotions including the correct one
    const getRandomEmotions = () => {
        const correct = emotions.find(e => e.id === correctEmotion)!
        const others = emotions.filter(e => e.id !== correctEmotion)
        const shuffled = others.sort(() => 0.5 - Math.random())
        return [correct, ...shuffled.slice(0, 2)].sort(() => 0.5 - Math.random())
    }

    const [availableEmotions] = useState(getRandomEmotions())

    const handleEmotionSelect = (emotionId: string) => {
        if (showFeedback) return

        setSelectedEmotion(emotionId)
        const correct = emotionId === correctEmotion
        setIsCorrect(correct)
        setShowFeedback(true)

        if (correct) {
            setScore(score + 1)
        }

        // Show feedback for 2 seconds, then move to next card
        setTimeout(() => {
            if (currentCard < totalCards - 1) {
                setCurrentCard(currentCard + 1)
                setSelectedEmotion(null)
                setShowFeedback(false)
                setIsCorrect(false)
            } else {
                setGameComplete(true)
                const points = Math.floor((score + (correct ? 1 : 0)) * 2)
                onComplete(points)
            }
        }, 2000)
    }

    const resetGame = () => {
        setCurrentCard(0)
        setScore(0)
        setSelectedEmotion(null)
        setShowFeedback(false)
        setIsCorrect(false)
        setGameComplete(false)
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={Trophy} boxSize={16} color='#f59e0b' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Great Job! 🎉
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You got {score} out of {totalCards} correct!
                    </Text>
                    <Text fontSize='md' color='#10b981' fontWeight='600'>
                        +{Math.floor(score * 2)} points earned!
                    </Text>
                </VStack>

                <HStack spacing={4}>
                    <Button
                        leftIcon={<RotateCcw size={16} />}
                        colorScheme='purple'
                        onClick={resetGame}
                        borderRadius='12px'
                    >
                        Play Again
                    </Button>
                    <Button
                        colorScheme='gray'
                        onClick={onClose}
                        borderRadius='12px'
                    >
                        Close
                    </Button>
                </HStack>
            </VStack>
        )
    }

    return (
        <VStack spacing={6} py={4}>
            {/* Progress */}
            <VStack spacing={2} w='full'>
                <HStack justify='space-between' w='full'>
                    <Text fontSize='sm' color='#6b7280'>
                        Card {currentCard + 1} of {totalCards}
                    </Text>
                    <Text fontSize='sm' color='#6b7280'>
                        Score: {score}
                    </Text>
                </HStack>
                <Progress 
                    value={(currentCard / totalCards) * 100} 
                    w='full' 
                    colorScheme='purple' 
                    borderRadius='full'
                    size='sm'
                />
            </VStack>

            {/* Face Card */}
            <motion.div
                key={currentCard}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    p={8}
                    bg='white'
                    borderRadius='20px'
                    boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'
                    border='1px solid rgba(255, 255, 255, 0.2)'
                    textAlign='center'
                >
                    <Text fontSize='6xl' mb={2}>
                        {currentFace.emoji}
                    </Text>
                    <Text fontSize='lg' color='#6b7280' fontWeight='500'>
                        {currentFace.description}
                    </Text>
                </Box>
            </motion.div>

            {/* Question */}
            <Text fontSize='xl' color='#1f2937' fontWeight='600' textAlign='center'>
                How is this person feeling?
            </Text>

            {/* Emotion Buttons */}
            <VStack spacing={3} w='full'>
                {availableEmotions.map((emotion) => {
                    const isSelected = selectedEmotion === emotion.id
                    const isCorrectChoice = emotion.id === correctEmotion
                    const isWrongChoice = isSelected && !isCorrectChoice
                    
                    return (
                        <MotionButton
                            key={emotion.id}
                            size='lg'
                            w='full'
                            h='60px'
                            fontSize='lg'
                            fontWeight='600'
                            borderRadius='16px'
                            bg={isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'white'}
                            color={isSelected ? 'white' : '#1f2937'}
                            border='2px solid'
                            borderColor={isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#e5e7eb'}
                            _hover={{
                                bg: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#f9fafb',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                            onClick={() => handleEmotionSelect(emotion.id)}
                            disabled={showFeedback}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <HStack spacing={3}>
                                <Text fontSize='2xl'>{emotion.emoji}</Text>
                                <Text>{emotion.name}</Text>
                                {showFeedback && isSelected && (
                                    <Icon 
                                        as={isCorrect ? CheckCircle : XCircle} 
                                        boxSize={5} 
                                    />
                                )}
                            </HStack>
                        </MotionButton>
                    )
                })}
            </VStack>

            {/* Feedback */}
            {showFeedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box
                        p={4}
                        bg={isCorrect ? '#f0fdf4' : '#fef2f2'}
                        borderRadius='12px'
                        border='1px solid'
                        borderColor={isCorrect ? '#bbf7d0' : '#fecaca'}
                        textAlign='center'
                    >
                        <Text 
                            color={isCorrect ? '#10b981' : '#ef4444'} 
                            fontWeight='600'
                            fontSize='lg'
                        >
                            {isCorrect ? 'Correct! 🎉' : 'Not quite right. Try again next time!'}
                        </Text>
                        {!isCorrect && (
                            <Text color='#6b7280' fontSize='sm' mt={1}>
                                The correct answer was: {emotions.find(e => e.id === correctEmotion)?.name}
                            </Text>
                        )}
                    </Box>
                </motion.div>
            )}
        </VStack>
    )
}

