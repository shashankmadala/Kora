import { 
    Box, VStack, HStack, Text, Heading, Button, SimpleGrid, 
    Card, CardBody, Icon, Badge, Progress, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Image, Spinner, useToast, Container
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    Heart, Brain, Target, MessageCircle, Wind, Users,
    Star, Trophy, Zap, Award, Play, Settings
} from 'lucide-react'

// Import game components
import SocialDetectiveGame from '../components/games/SocialDetectiveGame'
import EmotionBuilderGame from '../components/games/EmotionBuilderGame'
import EmpathySimulatorGame from '../components/games/EmpathySimulatorGame'
import SocialStrategistGame from '../components/games/SocialStrategistGame'
import CalmQuestGame from '../components/games/CalmQuestGame'
import ConversationGame from '../components/games/ConversationGame'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

// Game data
const games = [
    {
        id: 'social-detective',
        title: 'Social Detective',
        description: 'Read social cues and solve mysteries',
        icon: Brain,
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        difficulty: 'Hard',
        points: 50
    },
    {
        id: 'emotion-builder',
        title: 'Emotion Builder',
        description: 'Build complex emotions from basic feelings',
        icon: Heart,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#bfdbfe',
        difficulty: 'Medium',
        points: 30
    },
    {
        id: 'conversation-master',
        title: 'Conversation Master',
        description: 'Navigate real social situations',
        icon: Users,
        color: '#10b981',
        bgColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        difficulty: 'Hard',
        points: 40
    },
    {
        id: 'empathy-simulator',
        title: 'Empathy Simulator',
        description: 'Step into others\' shoes and understand their feelings',
        icon: MessageCircle,
        color: '#8b5cf6',
        bgColor: '#faf5ff',
        borderColor: '#e9d5ff',
        difficulty: 'Hard',
        points: 45
    },
    {
        id: 'calm-quest',
        title: 'Calm Quest',
        description: 'Master breathing and self-regulation',
        icon: Wind,
        color: '#06b6d4',
        bgColor: '#f0fdfa',
        borderColor: '#a7f3d0',
        difficulty: 'Medium',
        points: 25
    },
    {
        id: 'social-strategist',
        title: 'Social Strategist',
        description: 'Plan and execute social interactions',
        icon: Target,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        difficulty: 'Hard',
        points: 60
    }
]

// Progress tracking
interface GameProgress {
    points: number
    streak: number
    badges: string[]
    gamesPlayed: { [key: string]: number }
    lastPlayed: string
}

const defaultProgress: GameProgress = {
    points: 0,
    streak: 0,
    badges: [],
    gamesPlayed: {},
    lastPlayed: ''
}

export default function EmotionGamesPage() {
    const [progress, setProgress] = useState<GameProgress>(defaultProgress)
    const [selectedGame, setSelectedGame] = useState<string | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // Load progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem('emotionGamesProgress')
        if (savedProgress) {
            setProgress(JSON.parse(savedProgress))
        }
    }, [])

    // Save progress to localStorage
    const saveProgress = (newProgress: GameProgress) => {
        setProgress(newProgress)
        localStorage.setItem('emotionGamesProgress', JSON.stringify(newProgress))
    }

    const handleGameSelect = (gameId: string) => {
        setSelectedGame(gameId)
        onOpen()
    }

    const handleGameComplete = (gameId: string, pointsEarned: number) => {
        const game = games.find(g => g.id === gameId)
        if (!game) return

        const newProgress = {
            ...progress,
            points: progress.points + pointsEarned,
            streak: progress.streak + 1,
            gamesPlayed: {
                ...progress.gamesPlayed,
                [gameId]: (progress.gamesPlayed[gameId] || 0) + 1
            },
            lastPlayed: new Date().toISOString()
        }

        // Check for new badges
        const newBadges = []
        if (newProgress.points >= 100 && !progress.badges.includes('first-100')) {
            newBadges.push('first-100')
        }
        if (newProgress.streak >= 7 && !progress.badges.includes('week-streak')) {
            newBadges.push('week-streak')
        }
        if (Object.keys(newProgress.gamesPlayed).length >= 6 && !progress.badges.includes('all-games')) {
            newBadges.push('all-games')
        }

        newProgress.badges = [...progress.badges, ...newBadges]

        saveProgress(newProgress)

        toast({
            title: `Great job! +${pointsEarned} points`,
            description: newBadges.length > 0 ? `You earned ${newBadges.length} new badge(s)!` : undefined,
            status: 'success',
            duration: 3000,
            isClosable: true
        })
    }

    return (
        <Box minH='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='6xl' pt={20} pb={24}>
                {/* Header */}
                <VStack spacing={4} mb={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <VStack spacing={4}>
                            <HStack spacing={3}>
                                <Box
                                    p={3}
                                    borderRadius='16px'
                                    bgGradient='linear(135deg, #a855f7, #7c3aed)'
                                    boxShadow='0 6px 16px rgba(168, 85, 247, 0.3)'
                                >
                                    <Icon as={Heart} boxSize={6} color='white' />
                                </Box>
                                <VStack align='start' spacing={1}>
                                    <Heading size='xl' color='#1f2937' fontWeight='800'>
                                        Emotion Games
                                    </Heading>
                                    <Text color='#6b7280' fontSize='md'>
                                        Fun games to help with feelings and emotions
                                    </Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </motion.div>

                    {/* Progress Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card bg='white' borderRadius='16px' p={4} boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'>
                            <HStack spacing={6} justify='center'>
                                <VStack spacing={1}>
                                    <HStack spacing={2}>
                                        <Icon as={Star} boxSize={4} color='#f59e0b' />
                                        <Text fontSize='xl' fontWeight='700' color='#1f2937'>
                                            {progress.points}
                                        </Text>
                                    </HStack>
                                    <Text fontSize='xs' color='#6b7280'>Points</Text>
                                </VStack>
                                <VStack spacing={1}>
                                    <HStack spacing={2}>
                                        <Icon as={Zap} boxSize={4} color='#10b981' />
                                        <Text fontSize='xl' fontWeight='700' color='#1f2937'>
                                            {progress.streak}
                                        </Text>
                                    </HStack>
                                    <Text fontSize='xs' color='#6b7280'>Day Streak</Text>
                                </VStack>
                                <VStack spacing={1}>
                                    <HStack spacing={2}>
                                        <Icon as={Trophy} boxSize={4} color='#8b5cf6' />
                                        <Text fontSize='xl' fontWeight='700' color='#1f2937'>
                                            {progress.badges.length}
                                        </Text>
                                    </HStack>
                                    <Text fontSize='xs' color='#6b7280'>Badges</Text>
                                </VStack>
                            </HStack>
                        </Card>
                    </motion.div>
                </VStack>

                {/* Games Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} mb={4}>
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <MotionCard
                                bg='white'
                                borderRadius='16px'
                                p={5}
                                boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'
                                border='1px solid rgba(255, 255, 255, 0.2)'
                                cursor='pointer'
                                whileHover={{ 
                                    y: -2,
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleGameSelect(game.id)}
                            >
                                <CardBody p={0}>
                                    <VStack spacing={4} align='start'>
                                        <HStack spacing={4} w='full'>
                                            <Box
                                                p={3}
                                                borderRadius='12px'
                                                bg={game.bgColor}
                                                border={`1px solid ${game.borderColor}`}
                                            >
                                                <Icon as={game.icon} boxSize={6} color={game.color} />
                                            </Box>
                                            <VStack align='start' spacing={1} flex='1'>
                                                <Heading size='md' color='#1f2937' fontWeight='700'>
                                                    {game.title}
                                                </Heading>
                                                <Text fontSize='sm' color='#6b7280'>
                                                    {game.description}
                                                </Text>
                                            </VStack>
                                        </HStack>

                                        <HStack spacing={2} w='full' justify='space-between'>
                                            <Badge 
                                                colorScheme={game.difficulty === 'Easy' ? 'green' : game.difficulty === 'Medium' ? 'yellow' : 'red'}
                                                variant='subtle'
                                                fontSize='xs'
                                                size='sm'
                                            >
                                                {game.difficulty}
                                            </Badge>
                                            <HStack spacing={1}>
                                                <Icon as={Star} boxSize={3} color='#f59e0b' />
                                                <Text fontSize='xs' fontWeight='600' color='#1f2937'>
                                                    {game.points} pts
                                                </Text>
                                            </HStack>
                                        </HStack>

                                        <Button
                                            leftIcon={<Play size={16} />}
                                            colorScheme='purple'
                                            size='sm'
                                            w='full'
                                            borderRadius='12px'
                                            h='36px'
                                        >
                                            Play Game
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </MotionCard>
                        </motion.div>
                    ))}
                </SimpleGrid>
            </Container>

            {/* Game Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
                <ModalContent borderRadius='20px' overflow='hidden' maxH='90vh'>
                    <ModalHeader bgGradient='linear(135deg, #a855f7, #7c3aed)' color='white'>
                        {selectedGame && games.find(g => g.id === selectedGame)?.title}
                    </ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody p={6} overflowY='auto'>
                        {selectedGame === 'social-detective' && (
                            <SocialDetectiveGame 
                                onComplete={handleGameComplete} 
                                onClose={onClose} 
                            />
                        )}
                        {selectedGame === 'emotion-builder' && (
                            <EmotionBuilderGame 
                                onComplete={handleGameComplete} 
                                onClose={onClose} 
                            />
                        )}
                        {selectedGame === 'conversation-master' && (
                            <ConversationGame 
                                onComplete={handleGameComplete} 
                                onClose={onClose} 
                            />
                        )}
                        {selectedGame === 'empathy-simulator' && (
                            <EmpathySimulatorGame 
                                onComplete={handleGameComplete} 
                                onClose={onClose} 
                            />
                        )}
                        {selectedGame === 'calm-quest' && (
                            <CalmQuestGame 
                                onComplete={handleGameComplete} 
                                onClose={onClose} 
                            />
                        )}
                        {selectedGame === 'social-strategist' && (
                            <SocialStrategistGame 
                                onComplete={handleGameComplete} 
                                onClose={onClose} 
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}
