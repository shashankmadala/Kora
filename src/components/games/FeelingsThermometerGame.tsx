import { 
    Box, VStack, HStack, Text, Button, Slider, SliderTrack, 
    SliderFilledTrack, SliderThumb, Icon, useToast, Heading
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, CheckCircle, RotateCcw } from 'lucide-react'

const MotionBox = motion(Box)

// Scenario data
const scenarios = [
    {
        id: 1,
        title: 'Missed the Bus',
        emoji: '🚌',
        description: 'You woke up late and missed your school bus',
        emotion: 'frustrated'
    },
    {
        id: 2,
        title: 'New Friend',
        emoji: '👋',
        description: 'Someone new wants to play with you at recess',
        emotion: 'excited'
    },
    {
        id: 3,
        title: 'Loud Noise',
        emoji: '🔊',
        description: 'There\'s a very loud construction noise outside',
        emotion: 'overwhelmed'
    },
    {
        id: 4,
        title: 'Test Day',
        emoji: '📝',
        description: 'You have an important test today',
        emotion: 'nervous'
    },
    {
        id: 5,
        title: 'Birthday Party',
        emoji: '🎉',
        description: 'It\'s your birthday and everyone is celebrating',
        emotion: 'happy'
    }
]

const intensityLabels = [
    'Not at all',
    'A little bit',
    'Somewhat',
    'Quite a bit',
    'Very much',
    'Extremely'
]

interface FeelingsThermometerGameProps {
    onComplete: (points: number) => void
    onClose: () => void
}

export default function FeelingsThermometerGame({ onComplete, onClose }: FeelingsThermometerGameProps) {
    const [currentScenario, setCurrentScenario] = useState(0)
    const [intensity, setIntensity] = useState(0)
    const [responses, setResponses] = useState<number[]>([])
    const [gameComplete, setGameComplete] = useState(false)
    const toast = useToast()

    const totalScenarios = 3
    const currentScene = scenarios[currentScenario]

    const handleIntensityChange = (value: number) => {
        setIntensity(value)
    }

    const handleSubmit = () => {
        const newResponses = [...responses, intensity]
        setResponses(newResponses)

        if (currentScenario < totalScenarios - 1) {
            setCurrentScenario(currentScenario + 1)
            setIntensity(0)
        } else {
            setGameComplete(true)
            const points = Math.floor(newResponses.reduce((sum, val) => sum + val, 0) * 0.5)
            onComplete(points)
        }
    }

    const resetGame = () => {
        setCurrentScenario(0)
        setIntensity(0)
        setResponses([])
        setGameComplete(false)
    }

    const getThermometerColor = (value: number) => {
        if (value <= 1) return '#10b981' // Green - calm
        if (value <= 2) return '#f59e0b' // Yellow - mild
        if (value <= 3) return '#f97316' // Orange - moderate
        if (value <= 4) return '#ef4444' // Red - strong
        return '#dc2626' // Dark red - very strong
    }

    if (gameComplete) {
        const totalIntensity = responses.reduce((sum, val) => sum + val, 0)
        const averageIntensity = (totalIntensity / responses.length).toFixed(1)
        
        return (
            <VStack spacing={6} py={8}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Icon as={Thermometer} boxSize={16} color='#06b6d4' />
                </motion.div>
                
                <VStack spacing={4} textAlign='center'>
                    <Heading size='lg' color='#1f2937'>
                        Great Job! 🌡️
                    </Heading>
                    <Text fontSize='lg' color='#6b7280'>
                        You completed all {totalScenarios} scenarios!
                    </Text>
                    <Text fontSize='md' color='#06b6d4' fontWeight='600'>
                        Average intensity: {averageIntensity}/5
                    </Text>
                    <Text fontSize='md' color='#10b981' fontWeight='600'>
                        +{Math.floor(totalIntensity * 0.5)} points earned!
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
                <Text fontSize='sm' color='#6b7280'>
                    Scenario {currentScenario + 1} of {totalScenarios}
                </Text>
                <Box w='full' h='4px' bg='#e5e7eb' borderRadius='full' overflow='hidden'>
                    <Box 
                        w={`${((currentScenario + 1) / totalScenarios) * 100}%`}
                        h='100%'
                        bg='#a855f7'
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
                How strong does this make you feel?
            </Text>

            {/* Thermometer Visual */}
            <Box
                p={6}
                bg='white'
                borderRadius='16px'
                border='1px solid #e5e7eb'
                w='full'
                maxW='300px'
            >
                <VStack spacing={4}>
                    {/* Thermometer */}
                    <Box position='relative' w='40px' h='200px'>
                        <Box
                            w='20px'
                            h='180px'
                            bg='#f3f4f6'
                            borderRadius='10px'
                            position='absolute'
                            left='50%'
                            transform='translateX(-50%)'
                            border='2px solid #d1d5db'
                        />
                        <Box
                            w='16px'
                            h={`${(intensity / 5) * 160}px`}
                            bg={getThermometerColor(intensity)}
                            borderRadius='8px'
                            position='absolute'
                            left='50%'
                            bottom='10px'
                            transform='translateX(-50%)'
                            transition='all 0.3s ease'
                        />
                        <Box
                            w='30px'
                            h='30px'
                            bg={getThermometerColor(intensity)}
                            borderRadius='50%'
                            position='absolute'
                            left='50%'
                            bottom='0'
                            transform='translateX(-50%)'
                            transition='all 0.3s ease'
                        />
                    </Box>

                    {/* Intensity Labels */}
                    <VStack spacing={1} fontSize='xs' color='#6b7280'>
                        <Text>5 - Extremely</Text>
                        <Text>4 - Very much</Text>
                        <Text>3 - Quite a bit</Text>
                        <Text>2 - Somewhat</Text>
                        <Text>1 - A little bit</Text>
                        <Text>0 - Not at all</Text>
                    </VStack>
                </VStack>
            </Box>

            {/* Slider */}
            <VStack spacing={4} w='full' maxW='400px'>
                <Slider
                    value={intensity}
                    onChange={handleIntensityChange}
                    min={0}
                    max={5}
                    step={1}
                    colorScheme='purple'
                    size='lg'
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
                
                <Text fontSize='lg' color='#1f2937' fontWeight='600'>
                    {intensityLabels[intensity]}
                </Text>
            </VStack>

            {/* Submit Button */}
            <Button
                leftIcon={<CheckCircle size={16} />}
                colorScheme='purple'
                size='lg'
                onClick={handleSubmit}
                borderRadius='12px'
                px={8}
                isDisabled={intensity === undefined}
            >
                Done
            </Button>
        </VStack>
    )
}

