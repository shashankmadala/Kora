import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useToast, Heading, Badge
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Scenario data
const scenarios = [
    {
        id: 1,
        title: 'Someone takes your pencil',
        emoji: '✏️',
        description: 'A classmate grabs your pencil without asking',
        options: [
            { text: 'Ask for help from the teacher', correct: true, explanation: 'Asking for help is a good way to solve problems peacefully.' },
            { text: 'Take deep breaths and ask nicely for it back', correct: true, explanation: 'Staying calm and being polite often works best.' },
            { text: 'Yell and grab it back', correct: false, explanation: 'Yelling can make things worse and upset others.' }
        ]
    },
    {
        id: 2,
        title: 'Loud noise in the hallway',
        emoji: '🔊',
        description: 'There\'s a very loud noise that hurts your ears',
        options: [
            { text: 'Cover your ears and ask to move somewhere quiet', correct: true, explanation: 'Protecting yourself and asking for help is smart.' },
            { text: 'Scream to make it stop', correct: false, explanation: 'Screaming might make the noise worse and upset others.' },
            { text: 'Ignore it and try to focus on something else', correct: true, explanation: 'Sometimes focusing on other things can help.' }
        ]
    },
    {
        id: 3,
        title: 'Someone calls you a name',
        emoji: '😔',
        description: 'Another student says something mean to you',
        options: [
            { text: 'Tell a teacher or trusted adult', correct: true, explanation: 'Adults can help stop mean behavior and keep you safe.' },
            { text: 'Call them a name back', correct: false, explanation: 'Being mean back usually makes things worse.' },
            { text: 'Walk away and find a friend', correct: true, explanation: 'Walking away and finding support is a good choice.' }
        ]
    },
    {
        id: 4,
        title: 'You don\'t understand the homework',
        emoji: '📚',
        description: 'The math problem is too hard and confusing',
        options: [
            { text: 'Ask the teacher for help', correct: true, explanation: 'Teachers are there to help you learn and understand.' },
            { text: 'Give up and don\'t do it', correct: false, explanation: 'Giving up means you won\'t learn, and that\'s okay sometimes.' },
            { text: 'Ask a classmate to explain it', correct: true, explanation: 'Sometimes friends can help explain things in a different way.' }
        ]
    },
    {
        id: 5,
        title: 'You\'re feeling overwhelmed',
        emoji: '😰',
        description: 'Everything feels like too much right now',
        options: [
            { text: 'Take deep breaths and count to 10', correct: true, explanation: 'Breathing exercises can help calm your body and mind.' },
            { text: 'Ask for a break or quiet time', correct: true, explanation: 'It\'s okay to need a break when things feel overwhelming.' },
            { text: 'Keep pushing through it', correct: false, explanation: 'Sometimes it\'s better to take care of yourself first.' }
        ]
    }
]

interface ReactionCoachGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function ReactionCoachGame({ onComplete, onClose }: ReactionCoachGameProps) {
    const [currentScenario, setCurrentScenario] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])
    const [showFeedback, setShowFeedback] = useState(false)
    const [score, setScore] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const toast = useToast()

    const totalScenarios = 3
    const currentScene = scenarios[currentScenario]
    const correctOptions = currentScene.options
        .map((option, index) => option.correct ? index : -1)
        .filter(index => index !== -1)

    const handleOptionSelect = (optionIndex: number) => {
        if (showFeedback) return

        const newSelection = selectedOptions.includes(optionIndex)
            ? selectedOptions.filter(i => i !== optionIndex)
            : [...selectedOptions, optionIndex]
        
        setSelectedOptions(newSelection)
    }

    const handleSubmit = () => {
        if (selectedOptions.length === 0) {
            toast({
                title: 'Please select at least one option',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })
            return
        }

        setShowFeedback(true)
        
        // Calculate score for this scenario
        const correctSelections = selectedOptions.filter(option => 
            correctOptions.includes(option)
        ).length
        const incorrectSelections = selectedOptions.filter(option => 
            !correctOptions.includes(option)
        ).length
        
        const scenarioScore = Math.max(0, correctSelections - incorrectSelections)
        setScore(score + scenarioScore)

        // Move to next scenario after 3 seconds
        setTimeout(() => {
            if (currentScenario < totalScenarios - 1) {
                setCurrentScenario(currentScenario + 1)
                setSelectedOptions([])
                setShowFeedback(false)
            } else {
                setGameComplete(true)
                const points = Math.floor(score + scenarioScore)
                onComplete(points)
            }
        }, 3000)
    }

    const resetGame = () => {
        setCurrentScenario(0)
        setSelectedOptions([])
        setShowFeedback(false)
        setScore(0)
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
                    <Icon as={Target} boxSize={16} color='#10b981' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Excellent Work! 🎯
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You completed all {totalScenarios} scenarios!
                    </Text>
                    <Text fontSize='md' color='#10b981' fontWeight='600'>
                        +{Math.floor(score)} points earned!
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
                        Scenario {currentScenario + 1} of {totalScenarios}
                    </Text>
                    <Text fontSize='sm' color='#6b7280'>
                        Score: {score}
                    </Text>
                </HStack>
                <Box w='full' h='4px' bg='#e5e7eb' borderRadius='full' overflow='hidden'>
                    <Box 
                        w={`${((currentScenario + 1) / totalScenarios) * 100}%`}
                        h='100%'
                        bg='#10b981'
                        borderRadius='full'
                    />
                </Box>
            </VStack>

            {/* Scenario Card */}
            <motion.div
                key={currentScenario}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    p={6}
                    bg='white'
                    borderRadius='20px'
                    boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'
                    border='1px solid rgba(255, 255, 255, 0.2)'
                    textAlign='center'
                    minW='300px'
                >
                    <Text fontSize='4xl' mb={3}>
                        {currentScene.emoji}
                    </Text>
                    <Heading size='md' color='#1f2937' mb={2}>
                        {currentScene.title}
                    </Heading>
                    <Text fontSize='md' color='#6b7280'>
                        {currentScene.description}
                    </Text>
                </Box>
            </motion.div>

            {/* Question */}
            <Text fontSize='xl' color='#1f2937' fontWeight='600' textAlign='center'>
                What could you try? (Choose all that apply)
            </Text>

            {/* Options */}
            <VStack spacing={3} w='full' maxW='500px'>
                {currentScene.options.map((option, index) => {
                    const isSelected = selectedOptions.includes(index)
                    const isCorrect = option.correct
                    const isWrong = isSelected && !isCorrect
                    const isCorrectChoice = isSelected && isCorrect
                    
                    return (
                        <MotionButton
                            key={index}
                            size='lg'
                            w='full'
                            minH='60px'
                            fontSize='md'
                            fontWeight='500'
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
                            onClick={() => handleOptionSelect(index)}
                            disabled={showFeedback}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            textAlign='left'
                            justifyContent='flex-start'
                            px={6}
                        >
                            <HStack spacing={3} w='full'>
                                <Box
                                    w='6'
                                    h='6'
                                    borderRadius='50%'
                                    border='2px solid'
                                    borderColor={isSelected ? 'white' : '#d1d5db'}
                                    bg={isSelected ? 'white' : 'transparent'}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                >
                                    {isSelected && (
                                        <Box w='3' h='3' bg={isCorrect ? '#10b981' : '#ef4444'} borderRadius='50%' />
                                    )}
                                </Box>
                                <Text flex='1'>{option.text}</Text>
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

            {/* Submit Button */}
            {!showFeedback && (
                <Button
                    leftIcon={<Target size={16} />}
                    colorScheme='purple'
                    size='lg'
                    onClick={handleSubmit}
                    borderRadius='12px'
                    px={8}
                    isDisabled={selectedOptions.length === 0}
                >
                    Submit Answer
                </Button>
            )}

            {/* Feedback */}
            {showFeedback && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <VStack spacing={4} w='full' maxW='500px'>
                        <Box
                            p={4}
                            bg='#f0fdf4'
                            borderRadius='12px'
                            border='1px solid #bbf7d0'
                            w='full'
                        >
                            <HStack spacing={2} mb={2}>
                                <Icon as={Lightbulb} boxSize={5} color='#10b981' />
                                <Text color='#10b981' fontWeight='600' fontSize='lg'>
                                    Great thinking!
                                </Text>
                            </HStack>
                            <Text color='#6b7280' fontSize='sm'>
                                Here's what we learned from your choices:
                            </Text>
                        </Box>

                        {currentScene.options.map((option, index) => {
                            if (!selectedOptions.includes(index)) return null
                            
                            return (
                                <Box
                                    key={index}
                                    p={3}
                                    bg={option.correct ? '#f0fdf4' : '#fef2f2'}
                                    borderRadius='8px'
                                    border='1px solid'
                                    borderColor={option.correct ? '#bbf7d0' : '#fecaca'}
                                    w='full'
                                >
                                    <HStack spacing={2} mb={1}>
                                        <Icon 
                                            as={option.correct ? CheckCircle : XCircle} 
                                            boxSize={4} 
                                            color={option.correct ? '#10b981' : '#ef4444'} 
                                        />
                                        <Text 
                                            fontWeight='600' 
                                            color={option.correct ? '#10b981' : '#ef4444'}
                                            fontSize='sm'
                                        >
                                            {option.text}
                                        </Text>
                                    </HStack>
                                    <Text color='#6b7280' fontSize='xs'>
                                        {option.explanation}
                                    </Text>
                                </Box>
                            )
                        })}
                    </VStack>
                </motion.div>
            )}
        </VStack>
    )
}

