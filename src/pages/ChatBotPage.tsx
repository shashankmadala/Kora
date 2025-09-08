import { GoogleGenerativeAI } from '@google/generative-ai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useMemo, useState, useRef } from 'react'
import { getChatHistory } from '../utils/getChatHistory'
import { useUser } from '../firebase/useUser'
import { 
    Box, Button, Flex, Spinner, Textarea, 
    HStack, Icon, useToast, VStack, Text, 
    Container, Heading, Input, IconButton, 
    ScaleFade, Badge, Tooltip
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import BotMessage from '../components/BotMessage'
import UserMessage from '../components/UserMessage'
import { SendIcon, Mic, MicOff, Bot, Brain } from 'lucide-react'
import { saveChatHistory } from '../utils/saveChatHistory'
import { historyConverter } from '../utils/historyConverter'

const MotionBox = motion(Box)

// TypeScript declarations for Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any
        SpeechRecognition: any
    }
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    onstart: (() => void) | null
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    length: number
    isFinal: boolean
}

interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
}

interface SpeechRecognitionErrorEvent {
    error: string
    message: string
}

export default function ChatBotPage() {
    const { user } = useUser()
    const [message, setMessage] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [messageCount, setMessageCount] = useState(0)
    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const toast = useToast()
    const queryClient = useQueryClient()

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = false
                recognitionRef.current.interimResults = false
                recognitionRef.current.lang = 'en-US'

                recognitionRef.current.onstart = () => {
                    setIsListening(true)
                    setIsRecording(true)
                }

                recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = event.results[0][0].transcript
                    setMessage(transcript)
                }

                recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error:', event.error)
                    setIsListening(false)
                    setIsRecording(false)
                    toast({
                        title: 'Voice recognition error',
                        description: 'Please try again',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    })
                }

                recognitionRef.current.onend = () => {
                    setIsListening(false)
                    setIsRecording(false)
                }
            }
        }
    }, [toast])

    const genAI = useMemo(() => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!apiKey) {
            console.error('Gemini API key not found')
            return null
        }
        return new GoogleGenerativeAI(apiKey)
    }, [])

    const { data: chatHistory, isLoading } = useQuery({
        queryKey: ['chatHistory', user?.uid],
        queryFn: () => getChatHistory(user?.uid || ''),
        enabled: !!user?.uid,
    })

    const sendMessageMutation = useMutation({
        mutationFn: async (userMessage: string) => {
            if (!genAI) throw new Error('AI not initialized')
            
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
                
                const prompt = `You are Kora AI, a supportive AI assistant specialized in autism care and understanding. Respond helpfully to: ${userMessage}`
                
                const result = await model.generateContent(prompt)
                const response = await result.response
                return response.text()
            } catch (error) {
                console.error('Gemini API error:', error)
                throw new Error('Failed to get response from AI')
            }
        },
        onSuccess: async (response) => {
            if (user?.uid) {
                const newMessage = {
                    role: 'user' as const,
                    text: message,
                }
                const newResponse = {
                    role: 'model' as const,
                    text: response,
                }
                
                const updatedHistory = [...(chatHistory || []), newMessage, newResponse]
                
                // Auto-clear chat every 10 messages (5 exchanges)
                const newMessageCount = messageCount + 1
                setMessageCount(newMessageCount)
                
                if (newMessageCount >= 10) {
                    // Clear chat history
                    await saveChatHistory({ uid: user.uid, history: [] })
                    setMessageCount(0)
                    toast({
                        title: 'Chat cleared',
                        description: 'Starting fresh conversation after 10 messages',
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    })
                } else {
                    await saveChatHistory({ uid: user.uid, history: updatedHistory })
                }
                
                queryClient.invalidateQueries({ queryKey: ['chatHistory', user.uid] })
            }
            
            setMessage('')
        },
        onError: (error) => {
            console.error('Error sending message:', error)
            toast({
                title: 'Error',
                description: 'Failed to send message. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        },
    })

    const handleSendMessage = (messageToSend?: string) => {
        const messageText = messageToSend || message.trim()
        if (!messageText || sendMessageMutation.isPending) return
        
        sendMessageMutation.mutate(messageText)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleSendMessage()
    }

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start()
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }


    return (
        <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='container.xl' pt={20} pb={24} px={4}>
                {/* Header */}
                <MotionBox
                    textAlign='center'
                    mb={8}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <HStack justify='center' spacing={4} mb={4}>
                        <Box
                            p={3}
                            borderRadius='16px'
                            bgGradient='linear(135deg, #a855f7, #7c3aed)'
                            boxShadow='0 8px 32px rgba(168, 85, 247, 0.3)'
                        >
                            <Icon as={Bot} boxSize={8} color='white' />
                        </Box>
                        <VStack align='start' spacing={1}>
                            <Heading 
                                size='xl' 
                                bgGradient='linear(135deg, #1f2937, #4b5563)'
                                bgClip='text'
                                fontWeight='800'
                            >
                                Kora AI Assistant
                            </Heading>
                            <Text color='#6b7280' fontSize='md'>
                                Your Personal Autism Support
                            </Text>
                        </VStack>
                    </HStack>
                    
                    <Text 
                        fontSize='lg' 
                        color='#6b7280' 
                        maxW='600px' 
                        mx='auto'
                        mb={6}
                    >
                        Get <Text as='span' color='#a855f7' fontWeight='600'>personalized insights</Text> and support from our AI assistant, trained specifically for autism care and understanding.
                    </Text>
                    
                    {/* Message Counter */}
                    {messageCount > 0 && (
                        <Badge 
                            px={4} 
                            py={2} 
                            borderRadius='full' 
                            bg='#f0f9ff' 
                            color='#0ea5e9' 
                            border='1px solid #e0f2fe'
                            fontSize='sm'
                            fontWeight='600'
                        >
                            Messages: {messageCount}/10
                        </Badge>
                    )}

                </MotionBox>

                {/* Chat Area */}
                <MotionBox
                    bg='white'
                    borderRadius='20px'
                    boxShadow='0 10px 40px rgba(0, 0, 0, 0.1)'
                    border='1px solid rgba(255, 255, 255, 0.2)'
                    minH='500px'
                    maxH='600px'
                    display='flex'
                    flexDirection='column'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Messages */}
                    <Box 
                        flex='1' 
                        p={6} 
                        overflowY='auto'
                        maxH='400px'
                    >
                        {isLoading ? (
                            <Flex justify='center' align='center' h='200px'>
                                <VStack spacing={4}>
                                    <Spinner color='purple.500' size='xl' />
                                    <Text color='#6b7280'>Loading chat history...</Text>
                                </VStack>
                            </Flex>
                        ) : (
                            <VStack spacing={4} align='stretch'>
                                {chatHistory?.map((msg, index) => (
                                    <ScaleFade key={index} in={true} initialScale={0.95}>
                                        {msg.role === 'user' ? (
                                            <UserMessage text={msg.text} />
                                        ) : (
                                            <BotMessage text={msg.text} />
                                        )}
                                    </ScaleFade>
                                ))}
                                
                                {sendMessageMutation.isPending && (
                                    <HStack spacing={3} align='start'>
                                        <Box
                                            p={2}
                                            borderRadius='full'
                                            bg='purple.100'
                                        >
                                            <Icon as={Brain} boxSize={4} color='purple.500' />
                                        </Box>
                                        <Box
                                            bg='gray.100'
                                            p={3}
                                            borderRadius='12px'
                                            maxW='80%'
                                        >
                                            <HStack spacing={2}>
                                                <Spinner size='sm' color='purple.500' />
                                                <Text fontSize='sm' color='#6b7280'>
                                                    Thinking...
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </HStack>
                                )}
                            </VStack>
                        )}
                    </Box>

                    {/* Input Area */}
                    <Box p={6} borderTop='1px solid #f3f4f6'>
                        <form onSubmit={handleSubmit}>
                            <HStack spacing={3}>
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message or click mic to speak..."
                                    size='lg'
                                    borderRadius='12px'
                                    border='2px solid #e5e7eb'
                                    _focus={{
                                        borderColor: '#a855f7',
                                        boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)'
                                    }}
                                    disabled={sendMessageMutation.isPending}
                                />
                                
                                {/* Voice Button */}
                                <Tooltip label={isListening ? 'Stop Recording' : 'Start Recording'}>
                                    <IconButton
                                        aria-label={isListening ? 'Stop Recording' : 'Start Recording'}
                                        icon={
                                            <Icon 
                                                as={isListening ? MicOff : Mic} 
                                                boxSize={5} 
                                                color={isListening ? 'red.500' : 'purple.500'}
                                            />
                                        }
                                        onClick={isListening ? stopListening : startListening}
                                        colorScheme={isListening ? 'red' : 'purple'}
                                        variant={isListening ? 'solid' : 'outline'}
                                        size='lg'
                                        borderRadius='12px'
                                        isDisabled={sendMessageMutation.isPending}
                                    />
                                </Tooltip>
                                
                                {/* Send Button */}
                                <Button
                                    type='submit'
                                    colorScheme='purple'
                                    size='lg'
                                    px={6}
                                    borderRadius='12px'
                                    leftIcon={<Icon as={SendIcon} boxSize={4} />}
                                    isLoading={sendMessageMutation.isPending}
                                    loadingText='Sending...'
                                    isDisabled={!message.trim() || sendMessageMutation.isPending}
                                >
                                    Send
                                </Button>
                            </HStack>
                        </form>
                    </Box>
                </MotionBox>

                {/* Voice Status */}
                {isListening && (
                    <MotionBox
                        position='fixed'
                        bottom={24}
                        right={6}
                        bg='white'
                        p={4}
                        borderRadius='16px'
                        boxShadow='0 8px 32px rgba(0, 0, 0, 0.15)'
                        border='1px solid #e5e7eb'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                borderRadius='full'
                                bg='red.100'
                                animation='pulse 1.5s infinite'
                            >
                                <Icon 
                                    as={Mic} 
                                    boxSize={4} 
                                    color='red.500'
                                />
                            </Box>
                            <VStack align='start' spacing={0}>
                                <Text fontSize='sm' fontWeight='600' color='#1f2937'>
                                    Listening...
                                </Text>
                                <Text fontSize='xs' color='#6b7280'>
                                    Speak now
                                </Text>
                            </VStack>
                        </HStack>
                    </MotionBox>
                )}
            </Container>
        </Box>
    )
}