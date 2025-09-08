import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useToast, Heading, Badge, SimpleGrid, Card, CardBody, Image
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, CheckCircle, RotateCcw, Eye, Brain, Users, ArrowRight } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Complex empathy scenarios
const scenarios = [
    {
        id: 1,
        title: 'The New Kid',
        description: 'Imagine you\'re the new kid at school. How would you feel?',
        character: '👦',
        situation: 'You just moved to a new school. It\'s your first day and you don\'t know anyone. Everyone else seems to have friends already.',
        perspectives: [
            {
                id: 'nervous',
                name: 'Nervous',
                description: 'Worried about making friends and fitting in',
                emoji: '😰',
                thoughts: 'What if no one likes me? What if I say something wrong?',
                color: '#8b5cf6'
            },
            {
                id: 'excited',
                name: 'Excited',
                description: 'Looking forward to meeting new people',
                emoji: '🤩',
                thoughts: 'This is a chance to start fresh! I can be whoever I want to be.',
                color: '#f59e0b'
            },
            {
                id: 'sad',
                name: 'Sad',
                description: 'Missing your old friends and familiar places',
                emoji: '😢',
                thoughts: 'I wish I could go back to my old school where I had friends.',
                color: '#3b82f6'
            },
            {
                id: 'angry',
                name: 'Angry',
                description: 'Upset about having to move and start over',
                emoji: '😠',
                thoughts: 'This isn\'t fair! Why did we have to move? I don\'t want to be here.',
                color: '#ef4444'
            }
        ],
        correctPerspectives: ['nervous', 'sad'], // Most likely feelings
        points: 40
    },
    {
        id: 2,
        title: 'The Lost Pet',
        description: 'Your friend\'s dog ran away. How do they feel?',
        character: '👧',
        situation: 'Your best friend\'s dog, who they\'ve had since they were little, ran away yesterday. They\'ve been looking everywhere but can\'t find him.',
        perspectives: [
            {
                id: 'devastated',
                name: 'Devastated',
                description: 'Completely heartbroken and overwhelmed',
                emoji: '😭',
                thoughts: 'I can\'t believe he\'s gone. He was like family to me.',
                color: '#dc2626'
            },
            {
                id: 'worried',
                name: 'Worried',
                description: 'Concerned about the dog\'s safety',
                emoji: '😟',
                thoughts: 'I hope he\'s okay. What if something bad happened to him?',
                color: '#f59e0b'
            },
            {
                id: 'hopeful',
                name: 'Hopeful',
                description: 'Believing the dog will be found',
                emoji: '🙏',
                thoughts: 'Someone will find him and bring him home. He\'s probably just lost.',
                color: '#10b981'
            },
            {
                id: 'guilty',
                name: 'Guilty',
                description: 'Blaming themselves for the dog getting lost',
                emoji: '😔',
                thoughts: 'This is all my fault. I should have been more careful with the gate.',
                color: '#6b7280'
            }
        ],
        correctPerspectives: ['devastated', 'worried', 'guilty'],
        points: 50
    },
    {
        id: 3,
        title: 'The Test Failure',
        description: 'Someone failed an important test. What\'s going through their mind?',
        character: '👨',
        situation: 'A student studied really hard for a big math test but still failed. They were hoping to get into a special program that requires good grades.',
        perspectives: [
            {
                id: 'disappointed',
                name: 'Disappointed',
                description: 'Let down by their performance',
                emoji: '😞',
                thoughts: 'I really thought I understood the material. I\'m so disappointed in myself.',
                color: '#3b82f6'
            },
            {
                id: 'frustrated',
                name: 'Frustrated',
                description: 'Angry about the unfairness of the situation',
                emoji: '😤',
                thoughts: 'This isn\'t fair! I studied so hard. The test was too hard.',
                color: '#ef4444'
            },
            {
                id: 'hopeless',
                name: 'Hopeless',
                description: 'Feeling like they\'ll never succeed',
                emoji: '😔',
                thoughts: 'Maybe I\'m just not smart enough. I\'ll never get into that program.',
                color: '#6b7280'
            },
            {
                id: 'determined',
                name: 'Determined',
                description: 'Ready to try harder next time',
                emoji: '💪',
                thoughts: 'I\'ll study even harder next time. This won\'t stop me from reaching my goals.',
                color: '#10b981'
            }
        ],
        correctPerspectives: ['disappointed', 'frustrated', 'hopeless'],
        points: 45
    }
]

interface EmpathySimulatorGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function EmpathySimulatorGame({ onComplete, onClose }: EmpathySimulatorGameProps) {
    const [currentScenario, setCurrentScenario] = useState(0)
    const [selectedPerspectives, setSelectedPerspectives] = useState<string[]>([])
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [currentStep, setCurrentStep] = useState(0) // 0: situation, 1: perspectives, 2: results
    const toast = useToast()

    const totalScenarios = 3
    const currentScene = scenarios[currentScenario]

    const handlePerspectiveSelect = (perspectiveId: string) => {
        if (showResults) return

        const newSelection = selectedPerspectives.includes(perspectiveId)
            ? selectedPerspectives.filter(id => id !== perspectiveId)
            : [...selectedPerspectives, perspectiveId]
        
        setSelectedPerspectives(newSelection)
    }

    const handleSubmit = () => {
        if (selectedPerspectives.length === 0) {
            toast({
                title: 'Select at least one perspective',
                status: 'warning',
                duration: 2000,
                isClosable: true
            })
            return
        }

        setShowResults(true)
        
        // Calculate score based on correct perspectives
        const correctSelections = selectedPerspectives.filter(id => 
            currentScene.correctPerspectives.includes(id)
        ).length
        const incorrectSelections = selectedPerspectives.filter(id => 
            !currentScene.correctPerspectives.includes(id)
        ).length
        
        const scenarioScore = Math.max(0, (correctSelections * 15) - (incorrectSelections * 5))
        setScore(score + scenarioScore)

        // Move to next scenario after 4 seconds
        setTimeout(() => {
            if (currentScenario < totalScenarios - 1) {
                setCurrentScenario(currentScenario + 1)
                setSelectedPerspectives([])
                setShowResults(false)
                setCurrentStep(0)
            } else {
                setGameComplete(true)
                const finalScore = score + scenarioScore
                onComplete(finalScore)
            }
        }, 4000)
    }

    const resetGame = () => {
        setCurrentScenario(0)
        setSelectedPerspectives([])
        setShowResults(false)
        setScore(0)
        setGameComplete(false)
        setCurrentStep(0)
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={Heart} boxSize={16} color='#8b5cf6' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Empathy Master! 💝
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You completed all {totalScenarios} empathy challenges!
                    </Text>
                    <Text fontSize='md' color='#8b5cf6' fontWeight='600'>
                        +{score} points earned!
                    </Text>
                    <Text fontSize='sm' color='#6b7280'>
                        You\'re becoming an expert at understanding others\' feelings!
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
                        Challenge {currentScenario + 1} of {totalScenarios}
                    </Text>
                    <HStack spacing={2}>
                        <Text fontSize='sm' color='#6b7280'>Score:</Text>
                        <Text fontSize='sm' fontWeight='600' color='#8b5cf6'>{score}</Text>
                    </HStack>
                </HStack>
                <Box w='full' h='4px' bg='#e5e7eb' borderRadius='full' overflow='hidden'>
                    <Box 
                        w={`${((currentScenario + 1) / totalScenarios) * 100}%`}
                        h='100%'
                        bg='#8b5cf6'
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
                <Card bg='white' borderRadius='20px' p={6} boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'>
                    <CardBody>
                        <VStack spacing={4}>
                            <HStack spacing={4}>
                                <Text fontSize='4xl'>{currentScene.character}</Text>
                                <VStack align='start' spacing={2}>
                                    <Heading size='md' color='#1f2937'>
                                        {currentScene.title}
                                    </Heading>
                                    <Text fontSize='sm' color='#6b7280'>
                                        {currentScene.description}
                                    </Text>
                                </VStack>
                            </HStack>
                            
                            <Box
                                p={4}
                                bg='#f8fafc'
                                borderRadius='12px'
                                border='1px solid #e2e8f0'
                                w='full'
                            >
                                <Text fontSize='sm' color='#4a5568' lineHeight='1.6'>
                                    <strong>Situation:</strong> {currentScene.situation}
                                </Text>
                            </Box>
                        </VStack>
                    </CardBody>
                </Card>
            </motion.div>

            {/* Instructions */}
            <Text fontSize='lg' color='#1f2937' fontWeight='600' textAlign='center'>
                Step into their shoes. What emotions might they be feeling?
            </Text>

            {/* Perspectives Grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w='full' maxW='700px'>
                {currentScene.perspectives.map((perspective) => {
                    const isSelected = selectedPerspectives.includes(perspective.id)
                    const isCorrect = currentScene.correctPerspectives.includes(perspective.id)
                    const isWrong = isSelected && !isCorrect
                    
                    return (
                        <MotionBox
                            key={perspective.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                cursor="pointer"
                                onClick={() => handlePerspectiveSelect(perspective.id)}
                                bg={isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'white'}
                                borderColor={isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#e5e7eb'}
                                borderWidth="2px"
                                _hover={{
                                    borderColor: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : '#8b5cf6',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }}
                                transition="all 0.2s"
                                minH="140px"
                                opacity={showResults && !isSelected ? 0.6 : 1}
                            >
                                <CardBody p={4} h="100%">
                                    <VStack spacing={3} align="stretch" h="100%">
                                        <HStack spacing={3} align="start">
                                            <Text fontSize="2xl" flexShrink={0}>{perspective.emoji}</Text>
                                            <VStack align="start" spacing={2} flex="1">
                                                <Text fontWeight="600" fontSize="md" color={isSelected ? 'white' : '#1f2937'}>
                                                    {perspective.name}
                                                </Text>
                                                <Text 
                                                    fontSize="sm" 
                                                    color={isSelected ? 'white' : '#6b7280'}
                                                    lineHeight="1.4"
                                                    wordBreak="break-word"
                                                >
                                                    {perspective.description}
                                                </Text>
                                            </VStack>
                                            {showResults && isSelected && (
                                                <Icon 
                                                    as={isCorrect ? CheckCircle : XCircle} 
                                                    boxSize={5}
                                                    color="white"
                                                />
                                            )}
                                        </HStack>
                                        <Text 
                                            fontSize="sm" 
                                            color={isSelected ? 'white' : '#6b7280'}
                                            fontStyle="italic"
                                            lineHeight="1.3"
                                            wordBreak="break-word"
                                            flex="1"
                                        >
                                            "{perspective.thoughts}"
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </MotionBox>
                    )
                })}
            </SimpleGrid>

            {/* Submit Button */}
            {!showResults && (
                <Button
                    leftIcon={<Heart size={16} />}
                    colorScheme='purple'
                    size='lg'
                    onClick={handleSubmit}
                    borderRadius='12px'
                    px={8}
                    isDisabled={selectedPerspectives.length === 0}
                >
                    Show Empathy
                </Button>
            )}

            {/* Results */}
            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <VStack spacing={4} w='full' maxW='700px'>
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
                                    Great empathy!
                                </Text>
                            </HStack>
                            <Text color='#6b7280' fontSize='sm'>
                                You showed understanding of how others might feel in this situation.
                            </Text>
                        </Box>

                        {selectedPerspectives.map((perspectiveId) => {
                            const perspective = currentScene.perspectives.find(p => p.id === perspectiveId)!
                            const isCorrect = currentScene.correctPerspectives.includes(perspectiveId)
                            
                            return (
                                <Box
                                    key={perspectiveId}
                                    p={3}
                                    bg={isCorrect ? '#f0fdf4' : '#fef2f2'}
                                    borderRadius='8px'
                                    border='1px solid'
                                    borderColor={isCorrect ? '#bbf7d0' : '#fecaca'}
                                    w='full'
                                >
                                    <HStack spacing={2} mb={1}>
                                        <Icon 
                                            as={isCorrect ? CheckCircle : XCircle} 
                                            boxSize={4} 
                                            color={isCorrect ? '#10b981' : '#ef4444'} 
                                        />
                                        <Text 
                                            fontWeight='600' 
                                            color={isCorrect ? '#10b981' : '#ef4444'}
                                            fontSize='sm'
                                        >
                                            {perspective.name} {isCorrect ? '(+15 pts)' : '(-5 pts)'}
                                        </Text>
                                    </HStack>
                                    <Text color='#6b7280' fontSize='xs'>
                                        {isCorrect ? 'Good understanding of this emotion!' : 'This might not be the most likely feeling in this situation.'}
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
