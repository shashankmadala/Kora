import { useState } from 'react'
import { Camera, CameraResultType } from '@capacitor/camera'
import { Box, VStack, Heading, Text, Button, Image as ChakraImage, useColorModeValue, useToken, ScaleFade, Card, AbsoluteCenter, Spinner } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import * as tf from '@tensorflow/tfjs'
import { useModel } from '../providers/ModelProvider'
import { CameraIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Prediction {
    emotion: string
    confidence: number
}

export default function CameraPage() {
    const [src, setSrc] = useState<undefined | string>(undefined)
    const [predictions, setPredictions] = useState<Prediction[]>()
    const [error, setError] = useState<any>('')
    const [loading, setLoading] = useState(false)
    const [hidden, setHidden] = useState(false)
    const model = useModel()

    const textColor = useColorModeValue('gray.800', 'white')
    const [lineColor] = useToken('colors', ['purple.500'])

    const takePicture = async () => {
        try {
            setError(false)
            setLoading(true)
            setPredictions([])
            setHidden(true)

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
                saveToGallery: true
            })

            const img = new Image()
            img.src = image.dataUrl as string
            setSrc(image.dataUrl)

            // Handle image loading and processing
            img.onload = async () => {
                try {
                    const tensor = tf.browser.fromPixels(img)
                        .resizeNearestNeighbor([224, 224])
                        .toFloat()
                        .expandDims()
                        .div(255.0)

                    if (model) {
                        const prediction = await model.predict(tensor) as tf.Tensor
                        const results = prediction.dataSync()
                        const emotions = ['Fear', 'Sad', 'Happy', 'Angry', 'Neutral']
                        const predictions = emotions.map((emotion, i) => ({
                            emotion,
                            confidence: results[i]
                        }))

                        setPredictions(predictions)
                    }
                } catch (error) {
                    console.error('Error during prediction:', error)
                    setError('Error during prediction')
                } finally {
                    setLoading(false)
                }
            }

            img.onerror = () => {
                setError('Error loading image')
                setLoading(false)
            }

        } catch (e: any) {
            setError('Error taking picture')
            setLoading(false)
        }
    }

    if (loading == true) console.log('loading')

    return (
        <>
            {!hidden && (
                <ScaleFade initialScale={0.9} in={true}>
                    <Box position='relative' color='white' mx='auto' maxW='332px' mt={20} py={16} px={8} borderRadius='xl' boxShadow='xl' textAlign='center' overflow='hidden'>
                        <Box position='absolute' top={0} left={0} right={0} bottom={0} bgGradient='linear-gradient(to right, #d799f7, #a699f7, #3f5fe0)' zIndex={1} />
                        <VStack spacing={4} position='relative' zIndex={2}>
                            <Heading size='2xl'>Emotion Detection</Heading>
                            <Text fontSize='xl'>Capture and analyze emotions in real-time</Text>
                        </VStack>
                    </Box>
                </ScaleFade>
            )}

            {loading && (
                <AbsoluteCenter>
                    <Spinner color='purple.500' />
                </AbsoluteCenter>
            )}

            {(!loading && !predictions) && (
                <ScaleFade initialScale={0.9} in={true}>
                    <Box p={6} bg='white' mx='auto' rounded='md' mt={8} w='fit-content'>
                        <Button leftIcon={<CameraIcon />} onClick={takePicture} size='md' w='fit-content' colorScheme='purple'>
                            Take Picture
                        </Button>
                    </Box>
                </ScaleFade>
            )}

            {error && (
                <Text color='red.500' textAlign='center'>{error}</Text>
            )}


            {(predictions && !loading) && (
                <ScaleFade initialScale={0.9} in={true}>
                    <Box pb={20}>
                        <Card p={6} maxW='min(90vw, 400px)' mx='auto' mt={20} borderRadius='lg' boxShadow='md' display='block'>
                            <VStack spacing={6}>

                                <ChakraImage src={src} alt='Captured Image' borderRadius={6} maxH='300px' objectFit='cover' />
                                <Heading size='lg' color={textColor}>Detected Emotions</Heading>
                                {predictions.sort((a, b) => b.confidence - a.confidence).map(({ emotion, confidence }) => (
                                    <Box key={emotion} width='100%'>
                                        <Text color={textColor} mb={2}>{emotion}</Text>
                                        <Box width='100%' height='1rem' bg='gray.200' borderRadius='full' overflow='hidden'>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${confidence * 100}%` }}
                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                                style={{
                                                    height: '100%',
                                                    backgroundColor: lineColor,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                                <Button leftIcon={<CameraIcon />} onClick={takePicture} size='md' mt={4} w='fit-content' colorScheme='purple'>
                                    Take Another Picture
                                </Button>
                                <Button as={Link} to='/app/chatbot' size='md' w='fit-content' colorScheme='purple'>
                                    Ask Kora AI for Insights
                                </Button>
                            </VStack>
                        </Card>
                    </Box>
                </ScaleFade>
            )}
        </>
    )
}
