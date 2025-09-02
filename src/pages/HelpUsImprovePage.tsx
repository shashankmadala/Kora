import { Box, Text, Heading, Stack, ScaleFade, Link as ChakraLink } from '@chakra-ui/react'
import { cardMaxW } from '../utils/constants'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function HelpUsImprovePage() {
    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    return (
        <ScaleFade initialScale={0.9} in={true}>
            <Box mt='4.5rem' ml={2} w='fit-content'>
                <ChakraLink as={Link} onClick={goBack} display='flex' color='purple.500' alignItems='center'>
                    <ChevronLeft height={24} width={24} /><span>Back</span>
                </ChakraLink>
            </Box>
            <Stack spacing={6} textAlign='center' mt={6}>
                <Heading>Help Us Improve</Heading>
                <Text maxW={cardMaxW} mx='auto' textAlign='center'>
                    Please help us improve our emotion recognition model by submitting photos
                    of your child expressing different emotions.This data will be used to
                    train and refine our model, ultimately leading to a more accurate and
                    reliable experience for everyone.
                </Text>
                <Box
                    width='100%'
                    mx='auto'
                >
                    <iframe
                        src='https://docs.google.com/forms/d/e/1FAIpQLSeGI3ZsOuwaHQI-RPd4MEdAvsEI9u6QZmmEYBcAHg0gCrZbzw/viewform?embedded=true'
                        style={{
                            height: 1212,
                            width: '100%',
                        }}
                    >
                        Loading...
                    </iframe>
                </Box>
            </Stack>
        </ScaleFade>
    )
}