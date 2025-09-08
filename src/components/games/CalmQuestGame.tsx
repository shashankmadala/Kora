import { 
    Box, VStack, HStack, Text, Button, Icon, 
    useToast, Heading, Progress
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Wind, Star, RotateCcw, Play, Pause } from 'lucide-react'

const MotionBox = motion(Box)

interface CalmQuestGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function CalmQuestGame({ onComplete, onClose }: CalmQuestGameProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentCycle, setCurrentCycle] = useState(0)
    const [isInhaling, setIsInhaling] = useState(true)
    const [stars, setStars] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const toast = useToast()
    
    const totalCycles = 6
    const inhaleDuration = 4000 // 4 seconds
    const exhaleDuration = 4000 // 4 seconds
    const holdDuration = 2000 // 2 seconds
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const startBreathing = () => {
        setIsPlaying(true)
        setShowInstructions(false)
        setCurrentCycle(0)
        setStars(0)
        startCycle()
    }

    const startCycle = () => {
        if (currentCycle >= totalCycles) {
            setGameComplete(true)
            const points = Math.floor(stars * 2)
            onComplete(points)
            return
        }

        // Inhale phase
        setIsInhaling(true)
        setTimeout(() => {
            // Hold phase
            setTimeout(() => {
                // Exhale phase
                setIsInhaling(false)
                setTimeout(() => {
                    // Complete cycle
                    setCurrentCycle(prev => prev + 1)
                    setStars(prev => prev + 1)
                    
                    if (currentCycle + 1 < totalCycles) {
                        setTimeout(() => startCycle(), 1000) // Brief pause between cycles
                    } else {
                        setGameComplete(true)
                        const points = Math.floor((stars + 1) * 2)
                        onComplete(points)
                    }
                }, exhaleDuration)
            }, holdDuration)
        }, inhaleDuration)
    }

    const pauseBreathing = () => {
        setIsPlaying(false)
        if (intervalRef.current) {
            clearTimeout(intervalRef.current)
        }
    }

    const resetGame = () => {
        setIsPlaying(false)
        setCurrentCycle(0)
        setIsInhaling(true)
        setStars(0)
        setGameComplete(false)
        setShowInstructions(true)
        if (intervalRef.current) {
            clearTimeout(intervalRef.current)
        }
    }

    const getCircleSize = () => {
        if (!isPlaying) return 120
        return isInhaling ? 200 : 80
    }

    const getCircleColor = () => {
        if (!isPlaying) return '#a855f7'
        return isInhaling ? '#10b981' : '#06b6d4'
    }

    const getInstructionText = () => {
        if (!isPlaying) return 'Ready to start?'
        if (isInhaling) return 'Breathe in slowly...'
        return 'Breathe out slowly...'
    }

    if (gameComplete) {
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={Star} boxSize={16} color='#f59e0b' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Amazing! 🌟
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You completed all {totalCycles} breathing cycles!
                    </Text>
                    <HStack spacing={2}>
                        {Array.from({ length: stars }, (_, i) => (
                            <Icon key={i} as={Star} boxSize={6} color='#f59e0b' />
                        ))}
                    </HStack>
                    <Text fontSize='md' color='#10b981' fontWeight='600'>
                        +{Math.floor(stars * 2)} points earned!
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

    if (showInstructions) {
        return (
            <VStack spacing={6} py={8}>
                <VStack spacing={4} textAlign='center'>
                    <Icon as={Wind} boxSize={16} color='#06b6d4' />
                    <Heading size='lg' color='#1f2937'>
                        Calm Quest 🌬️
                    </Heading>
                    <Text fontSize='lg' color='#6b7280' maxW='400px'>
                        Let's practice breathing together! Follow the circle as it grows and shrinks.
                    </Text>
                </VStack>

                <VStack spacing={4} w='full' maxW='400px'>
                    <Box
                        p={4}
                        bg='#f0fdfa'
                        borderRadius='12px'
                        border='1px solid #a7f3d0'
                        w='full'
                    >
                        <Text fontSize='sm' color='#059669' fontWeight='600' mb={2}>
                            How to play:
                        </Text>
                        <VStack spacing={2} align='start'>
                            <Text fontSize='sm' color='#6b7280'>
                                • When the circle grows, breathe in slowly
                            </Text>
                            <Text fontSize='sm' color='#6b7280'>
                                • When the circle shrinks, breathe out slowly
                            </Text>
                            <Text fontSize='sm' color='#6b7280'>
                                • Complete {totalCycles} cycles to finish
                            </Text>
                            <Text fontSize='sm' color='#6b7280'>
                                • Earn a star for each cycle!
                            </Text>
                        </VStack>
                    </Box>

                    <Button
                        leftIcon={<Play size={16} />}
                        colorScheme='purple'
                        size='lg'
                        onClick={startBreathing}
                        borderRadius='12px'
                        px={8}
                    >
                        Start Breathing
                    </Button>
                </VStack>
            </VStack>
        )
    }

    return (
        <VStack spacing={6} py={4}>
            {/* Progress */}
            <VStack spacing={2} w='full'>
                <HStack justify='space-between' w='full'>
                    <Text fontSize='sm' color='#6b7280'>
                        Cycle {currentCycle + 1} of {totalCycles}
                    </Text>
                    <HStack spacing={1}>
                        {Array.from({ length: stars }, (_, i) => (
                            <Icon key={i} as={Star} boxSize={4} color='#f59e0b' />
                        ))}
                    </HStack>
                </HStack>
                <Progress 
                    value={(currentCycle / totalCycles) * 100} 
                    w='full' 
                    colorScheme='purple' 
                    borderRadius='full'
                    size='sm'
                />
            </VStack>

            {/* Breathing Circle */}
            <VStack spacing={6}>
                <motion.div
                    animate={{
                        scale: isPlaying ? (isInhaling ? 1.2 : 0.8) : 1,
                        opacity: isPlaying ? 1 : 0.7
                    }}
                    transition={{
                        duration: isPlaying ? (isInhaling ? 4 : 4) : 0.3,
                        ease: "easeInOut"
                    }}
                >
                    <Box
                        w={`${getCircleSize()}px`}
                        h={`${getCircleSize()}px`}
                        borderRadius='50%'
                        bg={getCircleColor()}
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        boxShadow='0 8px 32px rgba(0, 0, 0, 0.1)'
                        position='relative'
                    >
                        <VStack spacing={2}>
                            <Icon as={Wind} boxSize={8} color='white' />
                            <Text color='white' fontSize='sm' fontWeight='600'>
                                {isPlaying ? (isInhaling ? 'IN' : 'OUT') : 'READY'}
                            </Text>
                        </VStack>
                        
                        {/* Pulse effect */}
                        {isPlaying && (
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    border: '3px solid white',
                                    opacity: 0.3
                                }}
                            />
                        )}
                    </Box>
                </motion.div>

                {/* Instruction */}
                <Text fontSize='xl' color='#1f2937' fontWeight='600' textAlign='center'>
                    {getInstructionText()}
                </Text>
            </VStack>

            {/* Controls */}
            <HStack spacing={4}>
                {!isPlaying ? (
                    <Button
                        leftIcon={<Play size={16} />}
                        colorScheme='purple'
                        size='lg'
                        onClick={startBreathing}
                        borderRadius='12px'
                        px={8}
                    >
                        Start
                    </Button>
                ) : (
                    <Button
                        leftIcon={<Pause size={16} />}
                        colorScheme='gray'
                        size='lg'
                        onClick={pauseBreathing}
                        borderRadius='12px'
                        px={8}
                    >
                        Pause
                    </Button>
                )}
                
                <Button
                    leftIcon={<RotateCcw size={16} />}
                    colorScheme='gray'
                    variant='outline'
                    onClick={resetGame}
                    borderRadius='12px'
                >
                    Reset
                </Button>
            </HStack>

            {/* Stars Collection */}
            {stars > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Box
                        p={4}
                        bg='#fffbeb'
                        borderRadius='12px'
                        border='1px solid #fde68a'
                        textAlign='center'
                    >
                        <HStack spacing={2} justify='center' mb={2}>
                            <Icon as={Star} boxSize={5} color='#f59e0b' />
                            <Text color='#f59e0b' fontWeight='600'>
                                Stars Collected: {stars}
                            </Text>
                        </HStack>
                        <Text fontSize='sm' color='#6b7280'>
                            Keep going! Complete all {totalCycles} cycles to finish.
                        </Text>
                    </Box>
                </motion.div>
            )}
        </VStack>
    )
}

