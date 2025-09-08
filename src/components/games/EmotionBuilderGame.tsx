import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useToast, Heading, Badge, SimpleGrid, Card, CardBody, Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, CheckCircle, RotateCcw, Plus, Minus, Zap } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Complex emotion building system
const basicEmotions = [
    { id: 'happy', name: 'Happy', emoji: '😊', intensity: 0, color: '#10b981' },
    { id: 'sad', name: 'Sad', emoji: '😢', intensity: 0, color: '#3b82f6' },
    { id: 'angry', name: 'Angry', emoji: '😠', intensity: 0, color: '#ef4444' },
    { id: 'scared', name: 'Scared', emoji: '😨', intensity: 0, color: '#8b5cf6' },
    { id: 'surprised', name: 'Surprised', emoji: '😲', intensity: 0, color: '#f59e0b' },
    { id: 'disgusted', name: 'Disgusted', emoji: '🤢', intensity: 0, color: '#06b6d4' }
]

const complexEmotions = [
    {
        id: 'jealousy',
        name: 'Jealousy',
        description: 'A mix of anger, sadness, and fear',
        emoji: '😤',
        recipe: { angry: 3, sad: 2, scared: 1 },
        points: 30
    },
    {
        id: 'nostalgia',
        name: 'Nostalgia',
        description: 'Happy memories mixed with sadness',
        emoji: '😌',
        recipe: { happy: 2, sad: 3 },
        points: 25
    },
    {
        id: 'anxiety',
        name: 'Anxiety',
        description: 'Fear mixed with anticipation',
        emoji: '😰',
        recipe: { scared: 3, surprised: 1 },
        points: 35
    },
    {
        id: 'excitement',
        name: 'Excitement',
        description: 'Happiness mixed with surprise',
        emoji: '🤩',
        recipe: { happy: 3, surprised: 2 },
        points: 20
    },
    {
        id: 'guilt',
        name: 'Guilt',
        description: 'Sadness mixed with fear',
        emoji: '😔',
        recipe: { sad: 3, scared: 2 },
        points: 40
    },
    {
        id: 'relief',
        name: 'Relief',
        description: 'Happiness after fear',
        emoji: '😌',
        recipe: { happy: 2, scared: 1 },
        points: 15
    }
]

interface EmotionBuilderGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function EmotionBuilderGame({ onComplete, onClose }: EmotionBuilderGameProps) {
    const [currentEmotion, setCurrentEmotion] = useState(0)
    const [emotions, setEmotions] = useState([...basicEmotions])
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const toast = useToast()

    const totalEmotions = 4
    const targetEmotion = complexEmotions[currentEmotion]

    const adjustIntensity = (emotionId: string, change: number) => {
        if (showResult) return

        setEmotions(prev => prev.map(emotion => 
            emotion.id === emotionId 
                ? { ...emotion, intensity: Math.max(0, Math.min(5, emotion.intensity + change)) }
                : emotion
        ))
    }

    const checkEmotion = () => {
        if (showResult) return

        setAttempts(attempts + 1)
        
        // Check if the current emotion mix matches the target
        const isCorrect = Object.entries(targetEmotion.recipe).every(([emotionId, requiredIntensity]) => {
            const currentIntensity = emotions.find(e => e.id === emotionId)?.intensity || 0
            return currentIntensity === requiredIntensity
        })

        setShowResult(true)

        if (isCorrect) {
            const points = Math.max(10, targetEmotion.points - (attempts * 5))
            setScore(score + points)
            
            toast({
                title: 'Perfect! 🎉',
                description: `You built ${targetEmotion.name} correctly! +${points} points`,
                status: 'success',
                duration: 3000,
                isClosable: true
            })

            setTimeout(() => {
                if (currentEmotion < totalEmotions - 1) {
                    setCurrentEmotion(currentEmotion + 1)
                    setEmotions([...basicEmotions])
                    setShowResult(false)
                    setAttempts(0)
                } else {
                    setGameComplete(true)
                    onComplete(score + points)
                }
            }, 3000)
        } else {
            toast({
                title: 'Not quite right',
                description: 'Try adjusting the emotion intensities',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })

            setTimeout(() => {
                setShowResult(false)
            }, 2000)
        }
    }

    const resetGame = () => {
        setCurrentEmotion(0)
        setEmotions([...basicEmotions])
        setSelectedEmotion(null)
        setShowResult(false)
        setScore(0)
        setGameComplete(false)
        setAttempts(0)
    }

    const getEmotionColor = (intensity: number) => {
        if (intensity === 0) return '#e5e7eb'
        if (intensity <= 2) return '#fbbf24'
        if (intensity <= 4) return '#f59e0b'
        return '#d97706'
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={Heart} boxSize={16} color='#3b82f6' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Emotion Master! 🎭
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You built all {totalEmotions} complex emotions!
                    </Text>
                    <Text fontSize='md' color='#3b82f6' fontWeight='600'>
                        +{score} points earned!
                    </Text>
                    <Text fontSize='sm' color='#6b7280'>
                        You understand how emotions combine and build!
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
                        Emotion {currentEmotion + 1} of {totalEmotions}
                    </Text>
                    <HStack spacing={2}>
                        <Text fontSize='sm' color='#6b7280'>Score:</Text>
                        <Text fontSize='sm' fontWeight='600' color='#3b82f6'>{score}</Text>
                    </HStack>
                </HStack>
                <Box w='full' h='4px' bg='#e5e7eb' borderRadius='full' overflow='hidden'>
                    <Box 
                        w={`${((currentEmotion + 1) / totalEmotions) * 100}%`}
                        h='100%'
                        bg='#3b82f6'
                        borderRadius='full'
                    />
                </Box>
            </VStack>

            {/* Target Emotion */}
            <motion.div
                key={currentEmotion}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card bg='white' borderRadius='20px' p={6} boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'>
                    <CardBody>
                        <VStack spacing={4}>
                            <HStack spacing={4}>
                                <Text fontSize='4xl'>{targetEmotion.emoji}</Text>
                                <VStack align='start' spacing={2}>
                                    <Heading size='md' color='#1f2937'>
                                        Build: {targetEmotion.name}
                                    </Heading>
                                    <Text fontSize='sm' color='#6b7280'>
                                        {targetEmotion.description}
                                    </Text>
                                </VStack>
                            </HStack>
                            
                            <Divider />
                            
                            <VStack spacing={2} align='start' w='full'>
                                <Text fontSize='sm' fontWeight='600' color='#1f2937'>
                                    Recipe needed:
                                </Text>
                                <HStack spacing={4} flexWrap='wrap'>
                                    {Object.entries(targetEmotion.recipe).map(([emotionId, intensity]) => {
                                        const emotion = basicEmotions.find(e => e.id === emotionId)!
                                        return (
                                            <Badge
                                                key={emotionId}
                                                colorScheme='blue'
                                                variant='subtle'
                                                fontSize='xs'
                                            >
                                                {emotion.emoji} {emotion.name} x{intensity}
                                            </Badge>
                                        )
                                    })}
                                </HStack>
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>
            </motion.div>

            {/* Emotion Builder */}
            <VStack spacing={4} w='full' maxW='600px'>
                <Text fontSize='lg' color='#1f2937' fontWeight='600' textAlign='center'>
                    Mix emotions to create {targetEmotion.name}:
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w='full'>
                    {emotions.map((emotion) => (
                        <Card key={emotion.id} bg='white' borderRadius='12px' p={4}>
                            <CardBody p={0}>
                                <VStack spacing={3}>
                                    <HStack spacing={3} w='full'>
                                        <Text fontSize='2xl'>{emotion.emoji}</Text>
                                        <VStack align='start' spacing={1} flex='1'>
                                            <Text fontSize='sm' fontWeight='600' color='#1f2937'>
                                                {emotion.name}
                                            </Text>
                                            <Text fontSize='xs' color='#6b7280'>
                                                Intensity: {emotion.intensity}/5
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    <HStack spacing={2} w='full'>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={() => adjustIntensity(emotion.id, -1)}
                                            isDisabled={emotion.intensity === 0 || showResult}
                                            borderRadius='8px'
                                        >
                                            <Minus size={12} />
                                        </Button>
                                        
                                        <Box
                                            flex='1'
                                            h='8px'
                                            bg={getEmotionColor(emotion.intensity)}
                                            borderRadius='4px'
                                            position='relative'
                                        >
                                            <Box
                                                w={`${(emotion.intensity / 5) * 100}%`}
                                                h='100%'
                                                bg={emotion.color}
                                                borderRadius='4px'
                                                transition='all 0.3s ease'
                                            />
                                        </Box>
                                        
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={() => adjustIntensity(emotion.id, 1)}
                                            isDisabled={emotion.intensity === 5 || showResult}
                                            borderRadius='8px'
                                        >
                                            <Plus size={12} />
                                        </Button>
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            </VStack>

            {/* Check Button */}
            {!showResult && (
                <Button
                    leftIcon={<CheckCircle size={16} />}
                    colorScheme='purple'
                    size='lg'
                    onClick={checkEmotion}
                    borderRadius='12px'
                    px={8}
                >
                    Check Emotion Mix
                </Button>
            )}

            {/* Result */}
            {showResult && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box
                        p={4}
                        bg='#f0fdf4'
                        borderRadius='12px'
                        border='1px solid #bbf7d0'
                        w='full'
                        maxW='600px'
                    >
                        <HStack spacing={2} mb={2}>
                            <Icon as={Zap} boxSize={5} color='#10b981' />
                            <Text color='#10b981' fontWeight='600' fontSize='lg'>
                                Great work!
                            </Text>
                        </HStack>
                        <Text color='#6b7280' fontSize='sm'>
                            You successfully built {targetEmotion.name} by mixing the right emotions!
                        </Text>
                    </Box>
                </motion.div>
            )}
        </VStack>
    )
}
