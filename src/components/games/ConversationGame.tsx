import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useToast, Heading, Avatar
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle, RotateCcw, User, Bot } from 'lucide-react'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

// Conversation data
const conversations = [
    {
        id: 1,
        topic: 'Favorite Games',
        messages: [
            {
                speaker: 'bot',
                text: 'Hi! What\'s your favorite game to play?',
                options: [
                    { text: 'I like playing with blocks!', response: 'That sounds fun! What do you build with your blocks?' },
                    { text: 'I love video games!', response: 'Cool! What kind of video games do you like?' },
                    { text: 'I like playing outside!', response: 'That\'s great! What do you like to do outside?' }
                ]
            },
            {
                speaker: 'bot',
                text: 'That sounds really fun! Do you play with friends or by yourself?',
                options: [
                    { text: 'I play with my friends!', response: 'Playing with friends is the best! What do you like about playing together?' },
                    { text: 'I like playing by myself!', response: 'Sometimes it\'s nice to have quiet time. What makes it fun for you?' },
                    { text: 'Both! Sometimes with friends, sometimes alone.', response: 'That\'s a great balance! You get the best of both worlds.' }
                ]
            },
            {
                speaker: 'bot',
                text: 'You seem to really enjoy playing! What\'s the most fun part for you?',
                options: [
                    { text: 'I like being creative!', response: 'Creativity is wonderful! It\'s so cool that you can make new things.' },
                    { text: 'I like winning!', response: 'Winning feels great! It\'s also fun to try your best even when you don\'t win.' },
                    { text: 'I like learning new things!', response: 'Learning through play is amazing! You\'re always growing and getting better.' }
                ]
            },
            {
                speaker: 'bot',
                text: 'Thanks for talking with me! You seem like a really fun person to play with!',
                options: []
            }
        ]
    },
    {
        id: 2,
        topic: 'School Day',
        messages: [
            {
                speaker: 'bot',
                text: 'How was your day at school today?',
                options: [
                    { text: 'It was really good!', response: 'That\'s wonderful! What made it a good day?' },
                    { text: 'It was okay, I guess.', response: 'Sometimes days are just okay. What was the best part?' },
                    { text: 'It was kind of hard.', response: 'I\'m sorry it was hard. What made it difficult?' }
                ]
            },
            {
                speaker: 'bot',
                text: 'What was your favorite part of the day?',
                options: [
                    { text: 'I liked recess!', response: 'Recess is so much fun! What did you do during recess?' },
                    { text: 'I enjoyed lunch time!', response: 'Lunch is great! Did you eat something yummy?' },
                    { text: 'I liked art class!', response: 'Art is so creative! What did you make today?' }
                ]
            },
            {
                speaker: 'bot',
                text: 'Did you learn anything new today?',
                options: [
                    { text: 'Yes! I learned about animals!', response: 'Animals are so interesting! What did you learn about them?' },
                    { text: 'I learned some new math!', response: 'Math can be tricky but also fun! What kind of math did you do?' },
                    { text: 'I learned about friendship!', response: 'Friendship is so important! What did you learn about being a good friend?' }
                ]
            },
            {
                speaker: 'bot',
                text: 'It sounds like you had a busy day! Thanks for sharing with me!',
                options: []
            }
        ]
    }
]

interface ConversationGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function ConversationGame({ onComplete, onClose }: ConversationGameProps) {
    const [currentConversation, setCurrentConversation] = useState(0)
    const [currentMessage, setCurrentMessage] = useState(0)
    const [selectedResponse, setSelectedResponse] = useState<number | null>(null)
    const [conversationHistory, setConversationHistory] = useState<Array<{speaker: string, text: string}>>([])
    const [gameComplete, setGameComplete] = useState(false)
    const [showResponse, setShowResponse] = useState(false)
    const toast = useToast()

    const conversation = conversations[currentConversation]
    const currentMsg = conversation.messages[currentMessage]

    const handleResponseSelect = (responseIndex: number) => {
        if (showResponse) return

        setSelectedResponse(responseIndex)
        setShowResponse(true)

        // Add user's response to history
        const userResponse = currentMsg.options[responseIndex]
        setConversationHistory(prev => [
            ...prev,
            { speaker: 'user', text: userResponse.text }
        ])

        // Add bot's response to history
        setTimeout(() => {
            setConversationHistory(prev => [
                ...prev,
                { speaker: 'bot', text: userResponse.response }
            ])

            // Move to next message
            if (currentMessage < conversation.messages.length - 1) {
                setCurrentMessage(currentMessage + 1)
                setSelectedResponse(null)
                setShowResponse(false)
            } else {
                // Conversation complete
                if (currentConversation < conversations.length - 1) {
                    setCurrentConversation(currentConversation + 1)
                    setCurrentMessage(0)
                    setSelectedResponse(null)
                    setShowResponse(false)
                    setConversationHistory([])
                } else {
                    setGameComplete(true)
                    const points = Math.floor(conversationHistory.length * 3)
                    onComplete(points)
                }
            }
        }, 2000)
    }

    const resetGame = () => {
        setCurrentConversation(0)
        setCurrentMessage(0)
        setSelectedResponse(null)
        setConversationHistory([])
        setGameComplete(false)
        setShowResponse(false)
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={MessageCircle} boxSize={16} color='#f59e0b' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Great Conversation! 💬
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You completed all {conversations.length} conversations!
                    </Text>
                    <Text fontSize='md' color='#10b981' fontWeight='600'>
                        +{Math.floor(conversationHistory.length * 3)} points earned!
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
                        Conversation {currentConversation + 1} of {conversations.length}
                    </Text>
                    <Text fontSize='sm' color='#6b7280'>
                        Topic: {conversation.topic}
                    </Text>
                </HStack>
                <Box w='full' h='4px' bg='#e5e7eb' borderRadius='full' overflow='hidden'>
                    <Box 
                        w={`${((currentConversation + 1) / conversations.length) * 100}%`}
                        h='100%'
                        bg='#f59e0b'
                        borderRadius='full'
                    />
                </Box>
            </VStack>

            {/* Conversation History */}
            <VStack spacing={3} w='full' maxW='500px' maxH='300px' overflowY='auto'>
                {conversationHistory.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: msg.speaker === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <HStack 
                            spacing={3} 
                            align='start' 
                            justify={msg.speaker === 'user' ? 'flex-end' : 'flex-start'}
                            w='full'
                        >
                            {msg.speaker === 'bot' && (
                                <Avatar size='sm' bg='#a855f7' icon={<Bot size={16} />} />
                            )}
                            <Box
                                p={3}
                                bg={msg.speaker === 'user' ? '#a855f7' : '#f3f4f6'}
                                color={msg.speaker === 'user' ? 'white' : '#1f2937'}
                                borderRadius='16px'
                                maxW='80%'
                                boxShadow='0 2px 4px rgba(0, 0, 0, 0.1)'
                            >
                                <Text fontSize='sm'>{msg.text}</Text>
                            </Box>
                            {msg.speaker === 'user' && (
                                <Avatar size='sm' bg='#10b981' icon={<User size={16} />} />
                            )}
                        </HStack>
                    </motion.div>
                ))}
            </VStack>

            {/* Current Message */}
            <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    p={4}
                    bg='white'
                    borderRadius='20px'
                    boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'
                    border='1px solid rgba(255, 255, 255, 0.2)'
                    w='full'
                    maxW='500px'
                >
                    <HStack spacing={3} mb={3}>
                        <Avatar size='sm' bg='#a855f7' icon={<Bot size={16} />} />
                        <Text fontSize='sm' color='#6b7280' fontWeight='500'>
                            Kora AI
                        </Text>
                    </HStack>
                    <Text fontSize='md' color='#1f2937' mb={4}>
                        {currentMsg.text}
                    </Text>
                </Box>
            </motion.div>

            {/* Response Options */}
            {currentMsg.options.length > 0 && (
                <VStack spacing={3} w='full' maxW='500px'>
                    <Text fontSize='lg' color='#1f2937' fontWeight='600' textAlign='center'>
                        How would you respond?
                    </Text>
                    
                    {currentMsg.options.map((option, index) => (
                        <MotionButton
                            key={index}
                            size='lg'
                            w='full'
                            minH='50px'
                            fontSize='md'
                            fontWeight='500'
                            borderRadius='16px'
                            bg={selectedResponse === index ? '#a855f7' : 'white'}
                            color={selectedResponse === index ? 'white' : '#1f2937'}
                            border='2px solid'
                            borderColor={selectedResponse === index ? '#a855f7' : '#e5e7eb'}
                            _hover={{
                                bg: selectedResponse === index ? '#a855f7' : '#f9fafb',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                            onClick={() => handleResponseSelect(index)}
                            disabled={showResponse}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            textAlign='left'
                            justifyContent='flex-start'
                            px={6}
                        >
                            <HStack spacing={3} w='full'>
                                <Avatar size='sm' bg='#10b981' icon={<User size={16} />} />
                                <Text flex='1'>{option.text}</Text>
                            </HStack>
                        </MotionButton>
                    ))}
                </VStack>
            )}

            {/* Loading indicator */}
            {showResponse && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <HStack spacing={2} color='#6b7280'>
                        <Text fontSize='sm'>Kora AI is typing</Text>
                        <Box
                            w='2'
                            h='2'
                            bg='#6b7280'
                            borderRadius='50%'
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </HStack>
                </motion.div>
            )}
        </VStack>
    )
}

