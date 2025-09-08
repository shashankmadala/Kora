import { 
    Box, 
    Text, 
    Heading, 
    Stack, 
    ScaleFade, 
    Link as ChakraLink, 
    Container,
    VStack,
    HStack,
    Icon,
    Button,
    Card,
    CardBody,
    Badge,
    Divider,
    Flex,
    useToast
} from '@chakra-ui/react'
import { cardMaxW } from '../utils/constants'
import { ChevronLeft, ArrowLeft, Heart, Brain, Target, Users, Shield, Upload, MessageCircle, Star, Award, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

export default function HelpUsImprovePage() {
    const navigate = useNavigate()
    const toast = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const goBack = () => navigate(-1)

    const handleFormSubmit = () => {
        setIsSubmitting(true)
        toast({
            title: 'Thank you for your contribution!',
            description: 'Your feedback helps us improve Kora for everyone.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
        })
        setTimeout(() => setIsSubmitting(false), 2000)
    }

    const benefits = [
        {
            icon: Target,
            title: 'Improve Accuracy',
            description: 'Help us achieve even higher emotion recognition accuracy',
            color: '#10b981'
        },
        {
            icon: Brain,
            title: 'Better AI Training',
            description: 'Your data helps train more sophisticated AI models',
            color: '#7c3aed'
        },
        {
            icon: Users,
            title: 'Help Community',
            description: 'Contribute to a better experience for all families',
            color: '#3b82f6'
        },
        {
            icon: Shield,
            title: 'Privacy Protected',
            description: 'Your data is anonymized and securely protected',
            color: '#f59e0b'
        }
    ]

    return (
        <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='container.xl' pt={{ base: 20, md: 24 }} pb={20} px={4}>
                {/* Header */}
                <MotionBox
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    mb={8}
                >
                    <HStack spacing={4} mb={6}>
                        <Button
                            variant='ghost'
                            leftIcon={<Icon as={ArrowLeft} />}
                            onClick={goBack}
                            color='#7c3aed'
                            _hover={{ bg: 'rgba(168, 85, 247, 0.1)' }}
                        >
                            Back
                        </Button>
                    </HStack>

                    <VStack spacing={4} textAlign='center'>
                        <Box
                            p={4}
                            borderRadius='20px'
                            bgGradient='linear(135deg, #a855f7, #7c3aed)'
                            boxShadow='0 8px 20px rgba(168, 85, 247, 0.3)'
                            position='relative'
                        >
                            <Icon as={Heart} boxSize={8} color='white' />
                            <Box
                                position='absolute'
                                top={-1}
                                right={-1}
                                w={4}
                                h={4}
                                bg='#10b981'
                                borderRadius='full'
                                border='2px solid white'
                            />
                        </Box>
                        <VStack spacing={2}>
                            <Heading size='2xl' color='#1f2937' fontWeight='800' letterSpacing='-0.02em'>
                                Help Us Improve
                            </Heading>
                            <Text fontSize='lg' color='#6b7280' fontWeight='400'>
                                Your contribution makes Kora better for everyone
                            </Text>
                        </VStack>
                    </VStack>
                </MotionBox>

                <ScaleFade initialScale={0.9} in={true}>
                    <VStack spacing={12}>
                        {/* Introduction Card */}
                        <MotionCard
                            bg='white'
                            borderRadius='24px'
                            p={{ base: 6, md: 8 }}
                            boxShadow='0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            border='1px solid rgba(255, 255, 255, 0.2)'
                            w='full'
                            position='relative'
                            overflow='hidden'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Background Pattern */}
                            <Box
                                position='absolute'
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                opacity={0.03}
                                backgroundImage="radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)"
                                backgroundSize="20px 20px"
                            />

                            <VStack spacing={6} position='relative' zIndex={1}>
                                <VStack spacing={4} textAlign='center'>
                                    <Heading size='lg' color='#1f2937' fontWeight='700'>
                                        Help Us Improve Our AI Model
                                    </Heading>
                                    <Text fontSize='md' color='#6b7280' maxW='3xl' lineHeight='1.6'>
                                        Please help us improve our emotion recognition model by submitting photos
                                        of your child expressing different emotions. This data will be used to
                                        train and refine our model, ultimately leading to a more accurate and
                                        reliable experience for everyone.
                                    </Text>
                                </VStack>

                                <HStack spacing={3} flexWrap='wrap' justify='center'>
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
                                        <HStack spacing={1}>
                                            <Icon as={Shield} boxSize={3} />
                                            <Text>Privacy Protected</Text>
                                        </HStack>
                                    </Badge>
                                    <Badge 
                                        px={4} 
                                        py={2} 
                                        borderRadius='full' 
                                        bg='rgba(168, 85, 247, 0.1)' 
                                        color='#7c3aed' 
                                        border='1px solid rgba(168, 85, 247, 0.2)'
                                        fontSize='sm'
                                        fontWeight='600'
                                    >
                                        <HStack spacing={1}>
                                            <Icon as={Brain} boxSize={3} />
                                            <Text>AI Training</Text>
                                        </HStack>
                                    </Badge>
                                    <Badge 
                                        px={4} 
                                        py={2} 
                                        borderRadius='full' 
                                        bg='rgba(59, 130, 246, 0.1)' 
                                        color='#2563eb' 
                                        border='1px solid rgba(59, 130, 246, 0.2)'
                                        fontSize='sm'
                                        fontWeight='600'
                                    >
                                        <HStack spacing={1}>
                                            <Icon as={Users} boxSize={3} />
                                            <Text>Community Help</Text>
                                        </HStack>
                                    </Badge>
                                </HStack>
                            </VStack>
                        </MotionCard>

                        {/* Benefits Section */}
                        <VStack spacing={8} w='full'>
                            <VStack spacing={4} textAlign='center'>
                                <Heading size='lg' color='#1f2937' fontWeight='700'>
                                    How Your Contribution Helps
                                </Heading>
                                <Text fontSize='md' color='#6b7280' maxW='2xl'>
                                    Every photo you share helps us build a better future for autism support
                                </Text>
                            </VStack>

                            <Box
                                display='grid'
                                gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                                gap={6}
                                w='full'
                            >
                                {benefits.map((benefit, index) => (
                                    <MotionCard
                                        key={benefit.title}
                                        bg='white'
                                        borderRadius='16px'
                                        p={6}
                                        boxShadow='0 4px 20px rgba(0, 0, 0, 0.08)'
                                        border='1px solid rgba(0, 0, 0, 0.05)'
                                        _hover={{
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                        }}
                                        transition='all 0.3s ease'
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <VStack spacing={4} align='center' textAlign='center'>
                                            <Box
                                                p={3}
                                                borderRadius='12px'
                                                bg={`${benefit.color}10`}
                                                color={benefit.color}
                                            >
                                                <Icon as={benefit.icon} boxSize={6} />
                                            </Box>
                                            <VStack spacing={2}>
                                                <Text fontSize='md' fontWeight='600' color='#1f2937'>
                                                    {benefit.title}
                                                </Text>
                                                <Text fontSize='sm' color='#6b7280' lineHeight='1.5'>
                                                    {benefit.description}
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    </MotionCard>
                                ))}
                            </Box>
                        </VStack>

                        {/* Form Section */}
                        <MotionCard
                            bg='white'
                            borderRadius='24px'
                            p={{ base: 6, md: 8 }}
                            boxShadow='0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            border='1px solid rgba(255, 255, 255, 0.2)'
                            w='full'
                            position='relative'
                            overflow='hidden'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {/* Background Pattern */}
                            <Box
                                position='absolute'
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                opacity={0.03}
                                backgroundImage="radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)"
                                backgroundSize="20px 20px"
                            />

                            <VStack spacing={6} position='relative' zIndex={1}>
                                <VStack spacing={4} textAlign='center'>
                                    <HStack spacing={3}>
                                        <Icon as={Upload} boxSize={6} color='#7c3aed' />
                                        <Heading size='lg' color='#1f2937' fontWeight='700'>
                                            Submit Your Photos
                                        </Heading>
                                    </HStack>
                                    <Text fontSize='md' color='#6b7280' maxW='2xl' lineHeight='1.6'>
                                        Use the form below to submit photos and help us improve our emotion recognition model.
                                        All data is anonymized and used solely for improving our AI technology.
                                    </Text>
                                </VStack>

                                <Box
                                    width='100%'
                                    mx='auto'
                                    borderRadius='16px'
                                    overflow='hidden'
                                    boxShadow='0 4px 20px rgba(0, 0, 0, 0.1)'
                                >
                                    <iframe
                                        src='https://docs.google.com/forms/d/e/1FAIpQLSeGI3ZsOuwaHQI-RPd4MEdAvsEI9u6QZmmEYBcAHg0gCrZbzw/viewform?embedded=true'
                                        style={{
                                            height: 1212,
                                            width: '100%',
                                            border: 'none'
                                        }}
                                        onLoad={handleFormSubmit}
                                    >
                                        Loading...
                                    </iframe>
                                </Box>

                                <VStack spacing={4} pt={4}>
                                    <Divider />
                                    <Text fontSize='sm' color='#6b7280' textAlign='center' maxW='2xl'>
                                        By submitting photos, you agree to our privacy policy and consent to the use of 
                                        anonymized data for AI model improvement. Your privacy and your child's safety 
                                        are our top priorities.
                                    </Text>
                                    <HStack spacing={4} flexWrap='wrap' justify='center'>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            color='#7c3aed'
                                            borderColor='#a855f7'
                                            _hover={{
                                                bg: 'rgba(168, 85, 247, 0.05)',
                                                borderColor: '#7c3aed'
                                            }}
                                            leftIcon={<Icon as={MessageCircle} />}
                                        >
                                            Contact Support
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            color='#7c3aed'
                                            borderColor='#a855f7'
                                            _hover={{
                                                bg: 'rgba(168, 85, 247, 0.05)',
                                                borderColor: '#7c3aed'
                                            }}
                                            leftIcon={<Icon as={Star} />}
                                        >
                                            Rate Our App
                                        </Button>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </MotionCard>
                    </VStack>
                </ScaleFade>
            </Container>
        </Box>
    )
}