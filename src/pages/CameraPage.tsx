import { useState, useEffect } from 'react'
import { Camera, CameraResultType } from '@capacitor/camera'
import { 
    Box, VStack, Heading, Text, Button, Image as ChakraImage, 
    Card, Spinner, HStack, Icon, Badge, useToast, Container,
    SimpleGrid, Progress, ScaleFade, Flex
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import * as tf from '@tensorflow/tfjs'
import { useModel } from '../providers/ModelProvider'
import { 
    Camera as CameraIcon, Brain, Smile, Frown, Meh, AlertCircle, 
    CheckCircle, BarChart3, Share2, RotateCcw, Zap, Clock
} from 'lucide-react'

const MotionBox = motion(Box)

interface Prediction {
    emotion: string
    confidence: number
    icon: any
    color: string
}

const emotionConfig = {
    'Happy': { icon: Smile, color: '#10b981', bg: '#ecfdf5' },
    'Sad': { icon: Frown, color: '#ef4444', bg: '#fef2f2' },
    'Angry': { icon: AlertCircle, color: '#f59e0b', bg: '#fffbeb' },
    'Fear': { icon: AlertCircle, color: '#8b5cf6', bg: '#f3e8ff' },
    'Neutral': { icon: Meh, color: '#6b7280', bg: '#f9fafb' }
}

export default function CameraPage() {
    const [src, setSrc] = useState<string | undefined>(undefined)
    const [predictions, setPredictions] = useState<Prediction[]>([])
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [hasTakenPhoto, setHasTakenPhoto] = useState(false)
    const model = useModel()
    const toast = useToast()

    const takePicture = async () => {
        try {
            setError('')
            setLoading(true)
            setPredictions([])
            setHasTakenPhoto(false)

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
            })

            if (image.dataUrl) {
                setSrc(image.dataUrl)
                setHasTakenPhoto(true)
                await analyzeEmotion(image.dataUrl)
            }
        } catch (e: any) {
            console.error('Camera error:', e)
            setError('Failed to take picture. Please try again.')
            setLoading(false)
        }
    }

    const analyzeEmotion = async (imageDataUrl: string) => {
        try {
            if (!model) {
                setError('AI model not loaded. Please try again.')
                setLoading(false)
                return
            }

            const img = new Image()
            img.crossOrigin = 'anonymous'
            
            img.onload = async () => {
                try {
                    // Preprocess image for the model
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = 224
                    canvas.height = 224
                    
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, 224, 224)
                        const imageData = ctx.getImageData(0, 0, 224, 224)
                        
                        // Convert to tensor
                        const tensor = tf.browser.fromPixels(imageData)
                            .resizeNearestNeighbor([224, 224])
                            .expandDims(0)
                            .div(255.0)

                        // Make prediction
                        const prediction = model.predict(tensor) as tf.Tensor
                        const data = await prediction.data()
                        
                        // Process results
                        const emotions = ['Happy', 'Sad', 'Angry', 'Fear', 'Neutral']
                        const results: Prediction[] = emotions.map((emotion, index) => ({
                            emotion,
                            confidence: data[index],
                            icon: emotionConfig[emotion as keyof typeof emotionConfig].icon,
                            color: emotionConfig[emotion as keyof typeof emotionConfig].color
                        }))

                        setPredictions(results)
                        setLoading(false)
                        
                        // Clean up
                        tensor.dispose()
                        prediction.dispose()
                    }
                } catch (err) {
                    console.error('Analysis error:', err)
                    setError('Failed to analyze emotions. Please try again.')
                    setLoading(false)
                }
            }

            img.onerror = () => {
                setError('Error loading image')
                setLoading(false)
            }

            img.src = imageDataUrl
        } catch (err) {
            console.error('Analysis error:', err)
            setError('Failed to analyze emotions. Please try again.')
            setLoading(false)
        }
    }

    const resetCamera = () => {
        setSrc(undefined)
        setPredictions([])
        setError('')
        setHasTakenPhoto(false)
        setLoading(false)
    }

    const shareResults = async () => {
        if (predictions.length > 0 && src) {
            const topEmotion = predictions.sort((a, b) => b.confidence - a.confidence)[0]
            const text = `I just analyzed my emotions with Kora AI! Detected: ${topEmotion.emotion} (${Math.round(topEmotion.confidence * 100)}% confidence)`
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Kora AI Emotion Detection',
                        text: text,
                        url: window.location.href
                    })
                } catch (err) {
                    console.log('Error sharing:', err)
                }
            } else {
                navigator.clipboard.writeText(text)
                toast({
                    title: 'Copied to clipboard!',
                    status: 'success',
                    duration: 2000,
                })
            }
        }
    }

    const getEmotionInsights = (emotion: string) => {
        const insights = {
            'Happy': {
                message: 'Great! You seem to be in a positive mood. Consider what made you feel this way.',
                recommendations: ['Continue activities that bring you joy', 'Share your positive energy with others', 'Document what contributed to this mood'],
                color: '#10b981'
            },
            'Sad': {
                message: 'It\'s okay to feel sad sometimes. Consider talking to someone you trust or doing something you enjoy.',
                recommendations: ['Reach out to a friend or family member', 'Try a calming activity like reading or music', 'Consider professional support if needed'],
                color: '#ef4444'
            },
            'Angry': {
                message: 'Anger is a normal emotion. Try taking deep breaths or stepping away from the situation.',
                recommendations: ['Practice deep breathing exercises', 'Take a short walk or break', 'Use calming techniques like counting to 10'],
                color: '#f59e0b'
            },
            'Fear': {
                message: 'Fear can be overwhelming. Remember that you\'re safe and try to focus on the present moment.',
                recommendations: ['Practice grounding techniques', 'Focus on your breathing', 'Remind yourself of your strengths'],
                color: '#8b5cf6'
            },
            'Neutral': {
                message: 'A neutral mood is perfectly normal. You might be feeling calm and balanced.',
                recommendations: ['Enjoy this peaceful state', 'Consider what activities help maintain balance', 'Use this time for reflection'],
                color: '#6b7280'
            }
        }
        return insights[emotion as keyof typeof insights] || {
            message: 'Every emotion is valid and temporary.',
            recommendations: ['Practice self-compassion', 'Remember emotions are temporary', 'Seek support when needed'],
            color: '#6b7280'
        }
    }

    return (
        <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='container.xl' pt={20} pb={24} px={4}>
                {/* Header */}
                <MotionBox
                    textAlign='center'
                    mb={8}
                    mt={4}
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
                            <Icon as={Brain} boxSize={8} color='white' />
                        </Box>
                        <VStack align='start' spacing={1}>
                            <Heading 
                                size='xl' 
                                bgGradient='linear(135deg, #1f2937, #4b5563)'
                                bgClip='text'
                                fontWeight='800'
                            >
                                Emotion Detection
                            </Heading>
                            <Text color='#6b7280' fontSize='md'>
                                AI-powered facial expression analysis
                            </Text>
                        </VStack>
                    </HStack>
                    
                    <HStack spacing={4} justify='center' mb={6}>
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
                            <Icon as={Zap} boxSize={3} mr={1} />
                            87.83% Accuracy
                        </Badge>
                        <Badge 
                            px={4} 
                            py={2} 
                            borderRadius='full' 
                            bg='#fef3c7' 
                            color='#d97706' 
                            border='1px solid #fde68a'
                            fontSize='sm'
                            fontWeight='600'
                        >
                            <Icon as={Clock} boxSize={3} mr={1} />
                            Real-time
                        </Badge>
                    </HStack>
                </MotionBox>

                {/* Main Content */}
                <VStack spacing={6}>
                    {/* Camera Section */}
                    {!hasTakenPhoto && !loading && (
                        <ScaleFade initialScale={0.9} in={true}>
                            <Card 
                                bg='white' 
                                borderRadius='20px' 
                                p={8} 
                                w='full' 
                                boxShadow='0 10px 40px rgba(0, 0, 0, 0.1)'
                                border='1px solid rgba(255, 255, 255, 0.2)'
                                textAlign='center'
                            >
                                <VStack spacing={6}>
                                    <Box
                                        p={6}
                                        borderRadius='20px'
                                        bg='#f8fafc'
                                        border='2px dashed #d1d5db'
                                    >
                                        <Icon as={CameraIcon} boxSize={16} color='#6b7280' />
                                    </Box>
                                    
                                    <VStack spacing={3}>
                                        <Heading size='lg' color='#1f2937'>
                                            Ready to analyze your emotions?
                                        </Heading>
                                        <Text color='#6b7280' maxW='400px'>
                                            Take a photo and our AI will analyze your facial expressions to detect emotions
                                        </Text>
                                    </VStack>
                                    
                                    <Button 
                                        leftIcon={<CameraIcon />} 
                                        onClick={takePicture} 
                                        size='lg' 
                                        colorScheme='purple'
                                        px={8}
                                        py={6}
                                        fontSize='lg'
                                        borderRadius='16px'
                                        boxShadow='0 4px 12px rgba(168, 85, 247, 0.3)'
                                        _hover={{
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
                                        }}
                                    >
                                        Take Photo
                                    </Button>
                                </VStack>
                            </Card>
                        </ScaleFade>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <ScaleFade initialScale={0.9} in={true}>
                            <Card 
                                bg='white' 
                                borderRadius='20px' 
                                p={8} 
                                w='full' 
                                boxShadow='0 10px 40px rgba(0, 0, 0, 0.1)'
                                textAlign='center'
                            >
                                <VStack spacing={6}>
                                    <Spinner color='purple.500' size='xl' thickness='4px' />
                                    <VStack spacing={2}>
                                        <Text color='#1f2937' fontSize='lg' fontWeight='600'>
                                            Analyzing emotions...
                                        </Text>
                                        <Text color='#6b7280' fontSize='sm'>
                                            Our AI is processing your photo
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Card>
                        </ScaleFade>
                    )}

                    {/* Error State */}
                    {error && (
                        <ScaleFade initialScale={0.9} in={true}>
                            <Card 
                                bg='#fef2f2' 
                                border='1px solid #fecaca' 
                                borderRadius='20px' 
                                p={6} 
                                w='full'
                            >
                                <VStack spacing={4}>
                                    <Icon as={AlertCircle} boxSize={8} color='#dc2626' />
                                    <VStack spacing={2}>
                                        <Text color='#dc2626' fontSize='lg' fontWeight='600'>
                                            {error}
                                        </Text>
                                        <Text color='#dc2626' fontSize='sm' textAlign='center'>
                                            Please try taking another photo
                                        </Text>
                                    </VStack>
                                    <HStack spacing={3}>
                                        <Button 
                                            colorScheme='red' 
                                            variant='outline' 
                                            onClick={resetCamera}
                                        >
                                            Try Again
                                        </Button>
                                        <Button 
                                            colorScheme='red' 
                                            onClick={resetCamera}
                                        >
                                            Start Over
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Card>
                        </ScaleFade>
                    )}

                    {/* Results */}
                    {hasTakenPhoto && predictions.length > 0 && !loading && (
                        <ScaleFade initialScale={0.9} in={true}>
                            <VStack spacing={6} w='full'>
                                {/* Image and Top Emotion */}
                                <Card 
                                    bg='white' 
                                    borderRadius='20px' 
                                    p={6} 
                                    w='full' 
                                    boxShadow='0 10px 40px rgba(0, 0, 0, 0.1)'
                                >
                                    <VStack spacing={6}>
                                        <ChakraImage 
                                            src={src} 
                                            alt='Captured Image' 
                                            borderRadius='16px' 
                                            maxH='300px' 
                                            objectFit='cover'
                                            w='full'
                                        />
                                        
                                        {(() => {
                                            const topEmotion = predictions.sort((a, b) => b.confidence - a.confidence)[0]
                                            const config = emotionConfig[topEmotion.emotion as keyof typeof emotionConfig]
                                            const insights = getEmotionInsights(topEmotion.emotion)
                                            
                                            return (
                                                <VStack spacing={4}>
                                                    <HStack spacing={4}>
                                                        <Box
                                                            p={4}
                                                            borderRadius='16px'
                                                            bg={config.bg}
                                                            border='2px solid'
                                                            borderColor={config.color + '20'}
                                                        >
                                                            <Icon as={config.icon} boxSize={8} color={config.color} />
                                                        </Box>
                                                        <VStack spacing={1} align='start'>
                                                            <Text fontSize='3xl' fontWeight='800' color='#1f2937'>
                                                                {topEmotion.emotion}
                                                            </Text>
                                                            <Text fontSize='lg' color='#6b7280' fontWeight='500'>
                                                                {Math.round(topEmotion.confidence * 100)}% confidence
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                    
                                                    <Box 
                                                        p={4} 
                                                        bg={insights.color + '10'} 
                                                        borderRadius='12px' 
                                                        border='1px solid'
                                                        borderColor={insights.color + '20'}
                                                        w='full'
                                                    >
                                                        <Text color={insights.color} fontSize='md' fontWeight='600' mb={3}>
                                                            {insights.message}
                                                        </Text>
                                                        
                                                        <VStack spacing={2} align='start'>
                                                            <Text color='#374151' fontSize='sm' fontWeight='600'>
                                                                Recommendations:
                                                            </Text>
                                                            {insights.recommendations.map((rec, index) => (
                                                                <HStack key={index} spacing={2}>
                                                                    <Icon as={CheckCircle} boxSize={4} color='#10b981' />
                                                                    <Text color='#6b7280' fontSize='sm'>
                                                                        {rec}
                                                                    </Text>
                                                                </HStack>
                                                            ))}
                                                        </VStack>
                                                    </Box>
                                                </VStack>
                                            )
                                        })()}
                                    </VStack>
                                </Card>

                                {/* All Emotions */}
                                <Card 
                                    bg='white' 
                                    borderRadius='20px' 
                                    p={6} 
                                    w='full' 
                                    boxShadow='0 10px 40px rgba(0, 0, 0, 0.1)'
                                >
                                    <VStack spacing={4}>
                                        <HStack spacing={3} align='center'>
                                            <Icon as={BarChart3} boxSize={6} color='#a855f7' />
                                            <Heading size='lg' color='#1f2937' fontWeight='700'>
                                                All Emotions Detected
                                            </Heading>
                                        </HStack>
                                        
                                        <VStack spacing={3} w='full'>
                                            {predictions.sort((a, b) => b.confidence - a.confidence).map(({ emotion, confidence, icon, color }, index) => (
                                                <Box key={emotion} width='100%'>
                                                    <HStack justify='space-between' mb={2}>
                                                        <HStack spacing={3}>
                                                            <Icon as={icon} boxSize={5} color={color} />
                                                            <Text color='#1f2937' fontWeight='600' fontSize='md'>
                                                                {emotion}
                                                            </Text>
                                                        </HStack>
                                                        <Text color='#6b7280' fontSize='md' fontWeight='700'>
                                                            {Math.round(confidence * 100)}%
                                                        </Text>
                                                    </HStack>
                                                    <Box width='100%' height='12px' bg='#f3f4f6' borderRadius='full' overflow='hidden'>
                                                        <Box
                                                            width={`${confidence * 100}%`}
                                                            height='100%'
                                                            bg={`linear-gradient(90deg, ${color}, ${color}80)`}
                                                            borderRadius='full'
                                                            transition='width 0.8s ease-out'
                                                        />
                                                    </Box>
                                                </Box>
                                            ))}
                                        </VStack>
                                    </VStack>
                                </Card>

                                {/* Action Buttons */}
                                <HStack spacing={4} w='full'>
                                    <Button
                                        leftIcon={<RotateCcw />}
                                        onClick={resetCamera}
                                        variant='outline'
                                        colorScheme='gray'
                                        flex={1}
                                        size='lg'
                                    >
                                        Take Another Photo
                                    </Button>
                                    <Button
                                        leftIcon={<Share2 />}
                                        onClick={shareResults}
                                        colorScheme='purple'
                                        flex={1}
                                        size='lg'
                                    >
                                        Share Results
                                    </Button>
                                </HStack>
                            </VStack>
                        </ScaleFade>
                    )}
                </VStack>
            </Container>
        </Box>
    )
}