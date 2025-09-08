import { 
    Box, VStack, HStack, Text, Button, Image, 
    Progress, Icon, useToast, Heading, Badge, 
    SimpleGrid, Card, CardBody, Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, RotateCcw, Eye, Brain, Lightbulb } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Complex social scenarios with multiple clues
const scenarios = [
    {
        id: 1,
        title: 'The Lunchroom Mystery',
        description: 'Sarah is sitting alone at lunch. What clues tell you how she feels?',
        image: '🍽️',
        clues: [
            { 
                text: 'Sarah is looking down at her food', 
                correct: true, 
                explanation: 'Looking down often indicates sadness or feeling down',
                points: 10
            },
            { 
                text: 'She\'s not talking to anyone', 
                correct: true, 
                explanation: 'Isolation can be a sign of feeling left out or sad',
                points: 10
            },
            { 
                text: 'Her body is slouched', 
                correct: true, 
                explanation: 'Poor posture often indicates low mood or confidence',
                points: 10
            },
            { 
                text: 'She\'s eating quickly', 
                correct: false, 
                explanation: 'Eating quickly doesn\'t necessarily indicate sadness',
                points: 0
            },
            { 
                text: 'She\'s wearing a red shirt', 
                correct: false, 
                explanation: 'Clothing color doesn\'t indicate emotional state',
                points: 0
            }
        ],
        solution: 'Sarah appears to be feeling sad or lonely based on her body language and isolation.',
        totalPoints: 30
    },
    {
        id: 2,
        title: 'The Group Project Dilemma',
        description: 'Alex is in a group project. What social cues show he\'s frustrated?',
        image: '👥',
        clues: [
            { 
                text: 'Alex keeps sighing loudly', 
                correct: true, 
                explanation: 'Sighing is a common sign of frustration or annoyance',
                points: 10
            },
            { 
                text: 'He\'s tapping his pencil rapidly', 
                correct: true, 
                explanation: 'Rapid tapping often indicates impatience or stress',
                points: 10
            },
            { 
                text: 'He\'s not making eye contact', 
                correct: true, 
                explanation: 'Avoiding eye contact can show frustration or disengagement',
                points: 10
            },
            { 
                text: 'He\'s taking lots of notes', 
                correct: false, 
                explanation: 'Taking notes shows engagement, not frustration',
                points: 0
            },
            { 
                text: 'He\'s asking questions', 
                correct: false, 
                explanation: 'Asking questions shows interest, not frustration',
                points: 0
            }
        ],
        solution: 'Alex is showing clear signs of frustration through his body language and behavior.',
        totalPoints: 30
    },
    {
        id: 3,
        title: 'The Playground Conflict',
        description: 'Two kids are arguing. What clues help you understand the situation?',
        image: '⚽',
        clues: [
            { 
                text: 'Both kids have their arms crossed', 
                correct: true, 
                explanation: 'Crossed arms often indicate defensiveness or disagreement',
                points: 10
            },
            { 
                text: 'They\'re standing very close together', 
                correct: true, 
                explanation: 'Close proximity during conflict can indicate tension',
                points: 10
            },
            { 
                text: 'One kid is pointing at the other', 
                correct: true, 
                explanation: 'Pointing can be aggressive and indicate blame',
                points: 10
            },
            { 
                text: 'They\'re both smiling', 
                correct: false, 
                explanation: 'Smiling during an argument would be unusual',
                points: 0
            },
            { 
                text: 'Other kids are watching', 
                correct: false, 
                explanation: 'Bystanders don\'t indicate the emotional state of those arguing',
                points: 0
            }
        ],
        solution: 'The kids are in a serious conflict based on their defensive body language and aggressive gestures.',
        totalPoints: 30
    }
]

interface SocialDetectiveGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function SocialDetectiveGame({ onComplete, onClose }: SocialDetectiveGameProps) {
    const [currentScenario, setCurrentScenario] = useState(0)
    const [selectedClues, setSelectedClues] = useState<number[]>([])
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [hintsUsed, setHintsUsed] = useState(0)
    const toast = useToast()

    const totalScenarios = 3
    const currentScene = scenarios[currentScenario]

    const handleClueSelect = (clueIndex: number) => {
        if (showResults) return

        const newSelection = selectedClues.includes(clueIndex)
            ? selectedClues.filter(i => i !== clueIndex)
            : [...selectedClues, clueIndex]
        
        setSelectedClues(newSelection)
    }

    const handleSubmit = () => {
        if (selectedClues.length === 0) {
            toast({
                title: 'Select at least one clue',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })
            return
        }

        setShowResults(true)
        
        // Calculate score for this scenario
        const scenarioScore = selectedClues.reduce((total, clueIndex) => {
            return total + currentScene.clues[clueIndex].points
        }, 0)
        
        setScore(score + scenarioScore)

        // Move to next scenario after 4 seconds
        setTimeout(() => {
            if (currentScenario < totalScenarios - 1) {
                setCurrentScenario(currentScenario + 1)
                setSelectedClues([])
                setShowResults(false)
            } else {
                setGameComplete(true)
                const finalScore = score + scenarioScore
                onComplete(finalScore)
            }
        }, 4000)
    }

    const useHint = () => {
        if (hintsUsed >= 2) return

        const correctClues = currentScene.clues
            .map((clue, index) => clue.correct ? index : -1)
            .filter(index => index !== -1)
        
        const unselectedCorrect = correctClues.filter(index => !selectedClues.includes(index))
        
        if (unselectedCorrect.length > 0) {
            const hintIndex = unselectedCorrect[0]
            setSelectedClues([...selectedClues, hintIndex])
            setHintsUsed(hintsUsed + 1)
            
            toast({
                title: 'Hint used!',
                description: 'A correct clue has been selected for you.',
                status: 'info',
                duration: 2000,
                isClosable: true
            })
        }
    }

    const resetGame = () => {
        setCurrentScenario(0)
        setSelectedClues([])
        setShowResults(false)
        setScore(0)
        setGameComplete(false)
        setHintsUsed(0)
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={Search} boxSize={16} color='#ef4444' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Excellent Detective Work! 🕵️
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You solved all {totalScenarios} social mysteries!
                    </Text>
                    <Text fontSize='md' color='#ef4444' fontWeight='600'>
                        +{score} points earned!
                    </Text>
                    <Text fontSize='sm' color='#6b7280'>
                        You\'re becoming a social detective expert!
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
                        Case {currentScenario + 1} of {totalScenarios}
                    </Text>
                    <HStack spacing={2}>
                        <Text fontSize='sm' color='#6b7280'>Score:</Text>
                        <Text fontSize='sm' fontWeight='600' color='#ef4444'>{score}</Text>
                    </HStack>
                </HStack>
                <Progress 
                    value={(currentScenario / totalScenarios) * 100} 
                    w='full' 
                    colorScheme='red' 
                    borderRadius='full'
                    size='sm'
                />
            </VStack>

            {/* Scenario Card */}
            <motion.div
                key={currentScenario}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card bg='white' borderRadius='20px' p={6} boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'>
                    <CardBody>
                        <VStack spacing={4}>
                            <HStack spacing={4}>
                                <Text fontSize='4xl'>{currentScene.image}</Text>
                                <VStack align='start' spacing={2}>
                                    <Heading size='md' color='#1f2937'>
                                        {currentScene.title}
                                    </Heading>
                                    <Text fontSize='sm' color='#6b7280'>
                                        {currentScene.description}
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            </motion.div>

            {/* Instructions */}
            <Text fontSize='lg' color='#1f2937' fontWeight='600' textAlign='center'>
                Select ALL the clues that help solve this social mystery:
            </Text>

            {/* Clues Grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w='full' maxW='600px'>
                {currentScene.clues.map((clue, index) => {
                    const isSelected = selectedClues.includes(index)
                    const isCorrect = clue.correct
                    const isWrong = isSelected && !isCorrect
                    
                    return (
                        <MotionButton
                            key={index}
                            size='lg'
                            minH='60px'
                            fontSize='sm'
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
                            onClick={() => handleClueSelect(index)}
                            disabled={showResults}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            textAlign='left'
                            justifyContent='flex-start'
                            px={4}
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
                                <Text flex='1'>{clue.text}</Text>
                                {showResults && isSelected && (
                                    <Icon 
                                        as={isCorrect ? CheckCircle : XCircle} 
                                        boxSize={5} 
                                    />
                                )}
                            </HStack>
                        </MotionButton>
                    )
                })}
            </SimpleGrid>

            {/* Controls */}
            <HStack spacing={4} w='full' justify='center'>
                {!showResults && (
                    <>
                        <Button
                            leftIcon={<Search size={16} />}
                            colorScheme='purple'
                            size='lg'
                            onClick={handleSubmit}
                            borderRadius='12px'
                            px={8}
                            isDisabled={selectedClues.length === 0}
                        >
                            Solve Mystery
                        </Button>
                        
                        {hintsUsed < 2 && (
                            <Button
                                leftIcon={<Lightbulb size={16} />}
                                colorScheme='yellow'
                                variant='outline'
                                onClick={useHint}
                                borderRadius='12px'
                                size='lg'
                            >
                                Hint ({2 - hintsUsed} left)
                            </Button>
                        )}
                    </>
                )}
            </HStack>

            {/* Results */}
            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <VStack spacing={4} w='full' maxW='600px'>
                        <Box
                            p={4}
                            bg='#f0fdf4'
                            borderRadius='12px'
                            border='1px solid #bbf7d0'
                            w='full'
                        >
                            <HStack spacing={2} mb={2}>
                                <Icon as={Brain} boxSize={5} color='#10b981' />
                                <Text color='#10b981' fontWeight='600' fontSize='lg'>
                                    Case Solved!
                                </Text>
                            </HStack>
                            <Text color='#6b7280' fontSize='sm' mb={3}>
                                {currentScene.solution}
                            </Text>
                        </Box>

                        {selectedClues.map((clueIndex) => {
                            const clue = currentScene.clues[clueIndex]
                            return (
                                <Box
                                    key={clueIndex}
                                    p={3}
                                    bg={clue.correct ? '#f0fdf4' : '#fef2f2'}
                                    borderRadius='8px'
                                    border='1px solid'
                                    borderColor={clue.correct ? '#bbf7d0' : '#fecaca'}
                                    w='full'
                                >
                                    <HStack spacing={2} mb={1}>
                                        <Icon 
                                            as={clue.correct ? CheckCircle : XCircle} 
                                            boxSize={4} 
                                            color={clue.correct ? '#10b981' : '#ef4444'} 
                                        />
                                        <Text 
                                            fontWeight='600' 
                                            color={clue.correct ? '#10b981' : '#ef4444'}
                                            fontSize='sm'
                                        >
                                            {clue.text} (+{clue.points} pts)
                                        </Text>
                                    </HStack>
                                    <Text color='#6b7280' fontSize='xs'>
                                        {clue.explanation}
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

