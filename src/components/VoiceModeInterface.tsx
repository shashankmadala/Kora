import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useDisclosure, Modal, ModalOverlay, ModalContent, 
    ModalHeader, ModalBody, ModalCloseButton, Badge,
    useToast, Spinner, Flex, Container
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
    Mic, MicOff, Volume2, VolumeX, Settings, 
    Play, Pause, RotateCcw, X, Check, 
    Zap, Brain, MessageCircle, Clock
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const MotionBox = motion.div
const MotionButton = motion.button

interface VoiceModeInterfaceProps {
    isVoiceMode: boolean
    onToggleVoiceMode: () => void
    onSendVoiceMessage: (message: string) => void
    isListening: boolean
    isProcessing: boolean
    isSpeaking: boolean
    onStartListening: () => void
    onStopListening: () => void
    onStopSpeaking: () => void
    currentVoice: string
    onVoiceChange: (voice: string) => void
}

const voices = [
    { id: 'kora', name: 'Kora', description: 'Warm and supportive', color: '#a855f7' },
    { id: 'alex', name: 'Alex', description: 'Professional and clear', color: '#3b82f6' },
    { id: 'sarah', name: 'Sarah', description: 'Gentle and understanding', color: '#10b981' },
    { id: 'mike', name: 'Mike', description: 'Friendly and encouraging', color: '#f59e0b' }
]

export default function VoiceModeInterface({
    isVoiceMode,
    onToggleVoiceMode,
    onSendVoiceMessage,
    isListening,
    isProcessing,
    isSpeaking,
    onStartListening,
    onStopListening,
    onStopSpeaking,
    currentVoice,
    onVoiceChange
}: VoiceModeInterfaceProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isInitializing, setIsInitializing] = useState(false)
    const [voiceLevel, setVoiceLevel] = useState(0)
    const toast = useToast()
    const animationRef = useRef<number>()

    // Simulate voice level animation
    useEffect(() => {
        if (isListening || isSpeaking) {
            const animate = () => {
                setVoiceLevel(Math.random() * 100)
                animationRef.current = requestAnimationFrame(animate)
            }
            animate()
        } else {
            setVoiceLevel(0)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isListening, isSpeaking])

    const handleVoiceModeToggle = async () => {
        if (!isVoiceMode) {
            setIsInitializing(true)
            // Simulate initialization delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            setIsInitializing(false)
        }
        onToggleVoiceMode()
    }

    const handleVoiceSelect = (voiceId: string) => {
        onVoiceChange(voiceId)
        toast({
            title: 'Voice changed',
            description: `Switched to ${voices.find(v => v.id === voiceId)?.name}`,
            status: 'success',
            duration: 2000,
            isClosable: true
        })
    }

    if (!isVoiceMode) {
        return (
            <VStack spacing={6} py={20} textAlign='center'>
                <MotionBox
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        p={8}
                        borderRadius='50%'
                        bgGradient='linear(135deg, #a855f7, #7c3aed)'
                        boxShadow='0 20px 40px rgba(168, 85, 247, 0.3)'
                        position='relative'
                    >
                        <Icon as={Mic} boxSize={12} color='white' />
                        <Box
                            position='absolute'
                            top={-2}
                            right={-2}
                            w={6}
                            h={6}
                            bg='#10b981'
                            borderRadius='full'
                            border='3px solid white'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Icon as={Zap} boxSize={3} color='white' />
                        </Box>
                    </Box>
                </MotionBox>

                <VStack spacing={4}>
                    <Text fontSize='2xl' fontWeight='800' color='#1f2937'>
                        Say hello to advanced voice mode
                    </Text>
                    <Text fontSize='lg' color='#6b7280' maxW='md' lineHeight='1.6'>
                        Have natural conversations with Kora AI using your voice
                    </Text>
                </VStack>

                <VStack spacing={4} w='full' maxW='md'>
                    <HStack spacing={4} w='full' p={4} bg='white' borderRadius='12px' boxShadow='sm'>
                        <Box p={2} bg='#f0f9ff' borderRadius='8px'>
                            <Icon as={MessageCircle} color='#0ea5e9' boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={1} flex='1'>
                            <Text fontWeight='600' color='#1f2937'>Natural conversations</Text>
                            <Text fontSize='sm' color='#6b7280'>Senses and responds to interruptions, humor, and more</Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={4} w='full' p={4} bg='white' borderRadius='12px' boxShadow='sm'>
                        <Box p={2} bg='#fef2f2' borderRadius='8px'>
                            <Icon as={Volume2} color='#ef4444' boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={1} flex='1'>
                            <Text fontWeight='600' color='#1f2937'>Multiple voices</Text>
                            <Text fontSize='sm' color='#6b7280'>Offers an expanded set of voices to choose from</Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={4} w='full' p={4} bg='white' borderRadius='12px' boxShadow='sm'>
                        <Box p={2} bg='#f0fdf4' borderRadius='8px'>
                            <Icon as={Brain} color='#10b981' boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={1} flex='1'>
                            <Text fontWeight='600' color='#1f2937'>Personalized to you</Text>
                            <Text fontSize='sm' color='#6b7280'>Can use memory and custom instructions to shape responses</Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={4} w='full' p={4} bg='white' borderRadius='12px' boxShadow='sm'>
                        <Box p={2} bg='#fef3c7' borderRadius='8px'>
                            <Icon as={Settings} color='#d97706' boxSize={5} />
                        </Box>
                        <VStack align='start' spacing={1} flex='1'>
                            <Text fontWeight='600' color='#1f2937'>You're in control</Text>
                            <Text fontSize='sm' color='#6b7280'>Audio recordings are saved, and you can delete them at any time</Text>
                        </VStack>
                    </HStack>
                </VStack>

                <VStack spacing={4} w='full' maxW='md'>
                    <MotionButton
                        size='lg'
                        bgGradient='linear(135deg, #a855f7, #7c3aed)'
                        color='white'
                        onClick={handleVoiceModeToggle}
                        isLoading={isInitializing}
                        loadingText='Initializing...'
                        px={12}
                        py={6}
                        fontSize='lg'
                        fontWeight='600'
                        borderRadius='16px'
                        boxShadow='0 10px 25px rgba(168, 85, 247, 0.3)'
                        _hover={{
                            bgGradient: 'linear(135deg, #9333ea, #6d28d9)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 15px 35px rgba(168, 85, 247, 0.4)'
                        }}
                        _active={{ transform: 'translateY(0px)' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isInitializing ? 'Initializing...' : 'Continue'}
                    </MotionButton>

                    <Text fontSize='xs' color='#9ca3af' textAlign='center'>
                        Voice mode can make mistakes - check important info. Usage limits may change.
                    </Text>
                </VStack>
            </VStack>
        )
    }

    return (
        <VStack spacing={8} py={12}>
            {/* Voice Mode Header */}
            <VStack spacing={4} textAlign='center'>
                <HStack spacing={3}>
                    <Badge 
                        px={4} 
                        py={2} 
                        borderRadius='full' 
                        bg='rgba(16, 185, 129, 0.1)' 
                        color='#059669' 
                        border='1px solid rgba(16, 185, 129, 0.2)'
                        fontSize='sm'
                        fontWeight='600'
                    >
                        <HStack spacing={2}>
                            <Icon as={Mic} boxSize={4} />
                            <Text>Voice Mode Active</Text>
                        </HStack>
                    </Badge>
                    
                    <Button
                        size='sm'
                        variant='outline'
                        leftIcon={<Settings size={16} />}
                        onClick={onOpen}
                        borderRadius='full'
                    >
                        Settings
                    </Button>
                </HStack>

                <Text fontSize='lg' color='#6b7280'>
                    Start a new chat to use advanced voice
                </Text>
            </VStack>

            {/* Voice Visualizer */}
            <VStack spacing={6}>
                <Box position='relative'>
                    {isListening && (
                        <MotionBox
                            position='absolute'
                            top='50%'
                            left='50%'
                            transform='translate(-50%, -50%)'
                            w='200px'
                            h='200px'
                            borderRadius='50%'
                            bg='rgba(168, 85, 247, 0.1)'
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                    )}
                    
                    <Box
                        w='120px'
                        h='120px'
                        borderRadius='50%'
                        bg={isListening ? '#a855f7' : isSpeaking ? '#10b981' : '#6b7280'}
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        position='relative'
                        boxShadow='0 10px 25px rgba(0, 0, 0, 0.2)'
                    >
                        {isProcessing ? (
                            <Spinner color='white' size='lg' />
                        ) : isListening ? (
                            <Icon as={Mic} boxSize={8} color='white' />
                        ) : isSpeaking ? (
                            <Icon as={Volume2} boxSize={8} color='white' />
                        ) : (
                            <Icon as={Mic} boxSize={8} color='white' />
                        )}
                    </Box>
                </Box>

                {/* Voice Level Indicator */}
                {(isListening || isSpeaking) && (
                    <HStack spacing={2}>
                        {[...Array(4)].map((_, i) => (
                            <MotionBox
                                key={i}
                                w='8px'
                                h={`${20 + (voiceLevel * 0.3)}px`}
                                bg={isListening ? '#a855f7' : '#10b981'}
                                borderRadius='4px'
                                animate={{
                                    height: [`${20 + (voiceLevel * 0.3)}px`, `${20 + (Math.random() * 80)}px`, `${20 + (voiceLevel * 0.3)}px`]
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                        ))}
                    </HStack>
                )}

                <Text fontSize='sm' color='#6b7280'>
                    {isListening ? 'Tap to cancel' : isSpeaking ? 'Tap to interrupt' : 'Tap to start speaking'}
                </Text>
            </VStack>

            {/* Voice Controls */}
            <HStack spacing={4}>
                <Button
                    size='lg'
                    variant='outline'
                    leftIcon={<Settings size={20} />}
                    onClick={onOpen}
                    borderRadius='full'
                    px={8}
                >
                    Settings
                </Button>

                <MotionButton
                    size='lg'
                    bg={isListening ? '#ef4444' : isSpeaking ? '#ef4444' : '#a855f7'}
                    color='white'
                    onClick={isListening ? onStopListening : isSpeaking ? onStopSpeaking : onStartListening}
                    borderRadius='full'
                    px={8}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isListening ? (
                        <Icon as={MicOff} boxSize={6} />
                    ) : isSpeaking ? (
                        <Icon as={Pause} boxSize={6} />
                    ) : (
                        <Icon as={Mic} boxSize={6} />
                    )}
                </MotionButton>

                <Button
                    size='lg'
                    variant='outline'
                    onClick={onToggleVoiceMode}
                    borderRadius='full'
                    px={8}
                >
                    <Icon as={X} boxSize={6} />
                </Button>
            </HStack>

            {/* Voice Selection Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='md'>
                <ModalOverlay />
                <ModalContent borderRadius='20px' overflow='hidden'>
                    <ModalHeader 
                        bgGradient='linear(135deg, #a855f7, #7c3aed)' 
                        color='white'
                        textAlign='center'
                    >
                        Choose a Voice
                    </ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody p={6}>
                        <VStack spacing={4}>
                            {voices.map((voice) => (
                                <MotionButton
                                    key={voice.id}
                                    w='full'
                                    p={6}
                                    bg={currentVoice === voice.id ? `${voice.color}20` : 'white'}
                                    border={`2px solid ${currentVoice === voice.id ? voice.color : '#e5e7eb'}`}
                                    borderRadius='16px'
                                    onClick={() => handleVoiceSelect(voice.id)}
                                    _hover={{ bg: `${voice.color}10` }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <HStack spacing={4} w='full'>
                                        <Box
                                            p={3}
                                            borderRadius='12px'
                                            bg={voice.color}
                                            color='white'
                                        >
                                            <Icon as={Volume2} boxSize={6} />
                                        </Box>
                                        <VStack align='start' spacing={1} flex='1'>
                                            <Text fontWeight='700' color='#1f2937' fontSize='lg'>
                                                {voice.name}
                                            </Text>
                                            <Text color='#6b7280' fontSize='sm'>
                                                {voice.description}
                                            </Text>
                                        </VStack>
                                        {currentVoice === voice.id && (
                                            <Icon as={Check} boxSize={5} color={voice.color} />
                                        )}
                                    </HStack>
                                </MotionButton>
                            ))}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    )
}
