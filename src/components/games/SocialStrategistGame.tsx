import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useToast, Heading, Badge, SimpleGrid, Card, CardBody, Progress, Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle, RotateCcw, Eye, Brain, Users, ArrowRight } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Social Skills Practice scenarios
const scenarios = [
    {
        id: 1,
        title: 'Reading Body Language',
        description: 'Learn to understand non-verbal cues',
        situation: 'Look at this person\'s body language. What are they feeling?',
        image: '😔',
        options: [
            {
                id: 'sad',
                name: 'Sad',
                description: 'Dropped shoulders, looking down',
                correct: true,
                explanation: 'Correct! Dropped shoulders and looking down usually means someone is feeling sad or disappointed.'
            },
            {
                id: 'angry',
                name: 'Angry',
                description: 'Furrowed brow, clenched fists',
                correct: false,
                explanation: 'Not quite. Angry people usually have tense muscles and might be frowning.'
            },
            {
                id: 'happy',
                name: 'Happy',
                description: 'Smiling, open posture',
                correct: false,
                explanation: 'Happy people usually smile and have an open, relaxed posture.'
            },
            {
                id: 'confused',
                name: 'Confused',
                description: 'Tilted head, raised eyebrows',
                correct: false,
                explanation: 'Confused people often tilt their head or raise their eyebrows.'
            }
        ]
    },
    {
        id: 2,
        title: 'Starting Conversations',
        description: 'Practice conversation starters',
        situation: 'You want to talk to someone new. What\'s the best way to start?',
        image: '👋',
        options: [
            {
                id: 'greeting',
                name: 'Say "Hi, I\'m [name]"',
                description: 'Simple and friendly introduction',
                correct: true,
                explanation: 'Great choice! A simple greeting with your name is a good way to start.'
            },
            {
                id: 'compliment',
                name: 'Give a compliment',
                description: '"I like your shirt"',
                correct: true,
                explanation: 'Compliments can be nice conversation starters too!'
            },
            {
                id: 'personal',
                name: 'Ask personal questions',
                description: 'Ask about their family or home',
                correct: false,
                explanation: 'Personal questions can make people uncomfortable when you first meet them.'
            },
            {
                id: 'ignore',
                name: 'Don\'t say anything',
                description: 'Wait for them to talk first',
                correct: false,
                explanation: 'Sometimes you need to be the one to start the conversation!'
            }
        ]
    },
    {
        id: 3,
        title: 'Active Listening',
        description: 'Show you\'re paying attention',
        situation: 'Someone is telling you about their day. How do you show you\'re listening?',
        image: '👂',
        options: [
            {
                id: 'eye_contact',
                name: 'Make eye contact',
                description: 'Look at them while they talk',
                correct: true,
                explanation: 'Eye contact shows you\'re focused on what they\'re saying.'
            },
            {
                id: 'nod',
                name: 'Nod occasionally',
                description: 'Nod to show you understand',
                correct: true,
                explanation: 'Nodding shows you\'re following along with their story.'
            },
            {
                id: 'ask_questions',
                name: 'Ask follow-up questions',
                description: '"What happened next?"',
                correct: true,
                explanation: 'Questions show you\'re interested and want to know more.'
            },
            {
                id: 'look_away',
                name: 'Look at your phone',
                description: 'Check messages while they talk',
                correct: false,
                explanation: 'Looking at your phone makes it seem like you\'re not interested.'
            }
        ]
    },
    {
        id: 4,
        title: 'Reading Facial Expressions',
        description: 'Understand what faces tell us',
        situation: 'Look at this person\'s face. What emotion are they showing?',
        image: '😊',
        options: [
            {
                id: 'happy',
                name: 'Happy',
                description: 'Smiling, bright eyes',
                correct: true,
                explanation: 'Perfect! A genuine smile with bright, engaged eyes shows happiness.'
            },
            {
                id: 'sad',
                name: 'Sad',
                description: 'Frowning, droopy eyes',
                correct: false,
                explanation: 'Sad faces usually have downturned mouths and droopy eyes.'
            },
            {
                id: 'surprised',
                name: 'Surprised',
                description: 'Wide eyes, raised eyebrows',
                correct: false,
                explanation: 'Surprised faces have wide eyes and raised eyebrows.'
            },
            {
                id: 'angry',
                name: 'Angry',
                description: 'Furrowed brow, tight mouth',
                correct: false,
                explanation: 'Angry faces usually have a furrowed brow and tight or frowning mouth.'
            }
        ]
    },
    {
        id: 5,
        title: 'Personal Space',
        description: 'Learn about appropriate distance',
        situation: 'You want to talk to someone. How close should you stand?',
        image: '📏',
        options: [
            {
                id: 'arm_length',
                name: 'About an arm\'s length away',
                description: 'Comfortable distance for conversation',
                correct: true,
                explanation: 'Great! An arm\'s length is usually comfortable for most people.'
            },
            {
                id: 'very_close',
                name: 'Very close, almost touching',
                description: 'Stand right next to them',
                correct: false,
                explanation: 'Too close! This can make people feel uncomfortable.'
            },
            {
                id: 'far_away',
                name: 'Far away, across the room',
                description: 'Stand far from them',
                correct: false,
                explanation: 'Too far! They might not hear you or think you\'re not interested.'
            },
            {
                id: 'behind',
                name: 'Stand behind them',
                description: 'Approach from behind',
                correct: false,
                explanation: 'Approaching from behind can startle people. Try to approach from the front or side.'
            }
        ]
    }
]

interface SocialSkillsGameProps {
    onClose: () => void
}

export default function SocialSkillsGame({ onClose }: SocialSkillsGameProps) {
    const [currentScenario, setCurrentScenario] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const toast = useToast()

    const totalScenarios = scenarios.length

    const handleOptionSelect = (optionId: string) => {
        if (showExplanation) return

        const option = scenarios[currentScenario].options.find(opt => opt.id === optionId)
        if (!option) return

        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId)
            } else {
                return [...prev, optionId]
            }
        })
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

        const correctOptions = scenarios[currentScenario].options.filter(opt => opt.correct)
        const selectedCorrect = selectedOptions.filter(optId => 
            correctOptions.some(correct => correct.id === optId)
        )

        const points = selectedCorrect.length * 10
        setScore(prev => prev + points)
        setShowExplanation(true)

        toast({
            title: `You earned ${points} points!`,
            status: 'success',
            duration: 2000,
            isClosable: true
        })
    }

    const handleNext = () => {
        if (currentScenario < totalScenarios - 1) {
            setCurrentScenario(prev => prev + 1)
            setSelectedOptions([])
            setShowExplanation(false)
        } else {
            setGameComplete(true)
        }
    }

    const handleRestart = () => {
        setCurrentScenario(0)
        setSelectedOptions([])
        setShowExplanation(false)
        setScore(0)
        setGameComplete(false)
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={4}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <VStack spacing={4} textAlign="center">
                        <Icon as={CheckCircle} boxSize={16} color="green.500" />
                        <Heading size="lg" color="#1f2937">
                            Great Job!
                        </Heading>
                        <Text fontSize="lg" color="#6b7280">
                            You completed all social skills challenges!
                        </Text>
                        <VStack spacing={2}>
                            <Text fontSize="2xl" fontWeight="bold" color="#3b82f6">
                                Final Score: {score}
                            </Text>
                            <Text fontSize="sm" color="#6b7280">
                                out of {totalScenarios * 10} possible points
                            </Text>
                        </VStack>
                    </VStack>
                </motion.div>

                <HStack spacing={4}>
                    <Button
                        colorScheme="blue"
                        onClick={handleRestart}
                        leftIcon={<Icon as={RotateCcw} />}
                        borderRadius="12px"
                    >
                        Play Again
                    </Button>
                    <Button
                        colorScheme="gray"
                        onClick={onClose}
                        borderRadius="12px"
                    >
                        Close
                    </Button>
                </HStack>
            </VStack>
        )
    }

    const scenario = scenarios[currentScenario]

    return (
        <VStack spacing={6} py={4}>
            {/* Progress */}
            <VStack spacing={2} w="full">
                <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="#6b7280">
                        Challenge {currentScenario + 1} of {totalScenarios}
                    </Text>
                    <HStack spacing={2}>
                        <Text fontSize="sm" color="#6b7280">Score:</Text>
                        <Text fontSize="sm" fontWeight="600" color="#3b82f6">{score}</Text>
                    </HStack>
                </HStack>
                <Box w="full" h="4px" bg="#e5e7eb" borderRadius="full" overflow="hidden">
                    <Box 
                        w={`${((currentScenario + 1) / totalScenarios) * 100}%`}
                        h="100%"
                        bg="#3b82f6"
                        borderRadius="full"
                    />
                </Box>
            </VStack>

            {/* Scenario */}
            <motion.div
                key={currentScenario}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card bg="white" borderRadius="20px" p={6} boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)">
                    <CardBody>
                        <VStack spacing={4}>
                            <HStack spacing={4}>
                                <Text fontSize="4xl">{scenario.image}</Text>
                                <VStack align="start" spacing={2}>
                                    <Heading size="md" color="#1f2937">
                                        {scenario.title}
                                    </Heading>
                                    <Text fontSize="sm" color="#6b7280">
                                        {scenario.description}
                                    </Text>
                                </VStack>
                            </HStack>
                            
                            <Divider />
                            
                            <VStack spacing={4} align="start" w="full">
                                <Text fontSize="md" color="#1f2937" fontWeight="600">
                                    {scenario.situation}
                                </Text>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="full">
                                    {scenario.options.map((option) => (
                                        <MotionBox
                                            key={option.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Card
                                                cursor="pointer"
                                                onClick={() => handleOptionSelect(option.id)}
                                                bg={selectedOptions.includes(option.id) ? 'purple.100' : 'white'}
                                                borderColor={selectedOptions.includes(option.id) ? 'purple.300' : 'gray.200'}
                                                borderWidth="2px"
                                                _hover={{ borderColor: 'purple.300' }}
                                                transition="all 0.2s"
                                            >
                                                <CardBody p={4}>
                                                    <VStack spacing={2} align="start">
                                                        <Text fontWeight="600" color="#1f2937">
                                                            {option.name}
                                                        </Text>
                                                        <Text fontSize="sm" color="#6b7280">
                                                            {option.description}
                                                        </Text>
                                                    </VStack>
                                                </CardBody>
                                            </Card>
                                        </MotionBox>
                                    ))}
                                </SimpleGrid>

                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card bg="blue.50" borderColor="blue.200" borderWidth="1px" p={4} w="full">
                                            <VStack spacing={2} align="start">
                                                <Text fontWeight="600" color="blue.700">
                                                    Explanation:
                                                </Text>
                                                {scenario.options
                                                    .filter(opt => selectedOptions.includes(opt.id))
                                                    .map(opt => (
                                                        <Text key={opt.id} fontSize="sm" color="blue.600">
                                                            <Text as="span" fontWeight="600">{opt.name}:</Text> {opt.explanation}
                                                        </Text>
                                                    ))
                                                }
                                            </VStack>
                                        </Card>
                                    </motion.div>
                                )}

                                <HStack spacing={3} w="full" justify="flex-end">
                                    {!showExplanation ? (
                                        <Button
                                            colorScheme="blue"
                                            onClick={handleSubmit}
                                            isDisabled={selectedOptions.length === 0}
                                            borderRadius="12px"
                                        >
                                            Submit Answer
                                        </Button>
                                    ) : (
                                        <Button
                                            colorScheme="blue"
                                            onClick={handleNext}
                                            rightIcon={<Icon as={ArrowRight} />}
                                            borderRadius="12px"
                                        >
                                            {currentScenario < totalScenarios - 1 ? 'Next Challenge' : 'Finish'}
                                        </Button>
                                    )}
                                </HStack>
                            </VStack>
                        </VStack>
                    </CardBody>
                </Card>
            </motion.div>
        </VStack>
    )
}