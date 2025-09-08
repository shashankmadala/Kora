import { Box, Container, VStack, Heading, Text, SimpleGrid, Button, useBreakpointValue, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ScaleFade, HStack, Icon, Flex, Badge, Image, AspectRatio, Divider, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Card, CardBody, Progress, useColorModeValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Camera, Users, Lightbulb, Book, Bot, Info, Sparkles, Brain, Heart, MapPin, ArrowRight, Star, Shield, Zap, TrendingUp, Award, Globe, MessageCircle, BarChart3, Target, CheckCircle, Play, Clock, User, Activity, ThumbsUp } from 'lucide-react'
import { useUser } from '../firebase/useUser'
import TypewriterText from '../components/TypeWriterText'
import FeatureBox from '../components/FeatureBox'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
        let startTime: number
        const startValue = 0
        
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart)
            
            setCount(currentCount)
            
            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }
        
        requestAnimationFrame(animate)
    }, [end, duration])
    
    return <>{count.toLocaleString()}{suffix}</>
}

// Quick Stats Component
const QuickStat = ({ icon, value, label, color, trend }: { icon: any, value: string, label: string, color: string, trend?: string }) => (
    <MotionCard
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
        whileHover={{ scale: 1.02 }}
    >
        <VStack spacing={3} align='center'>
            <Box
                p={3}
                borderRadius='12px'
                bg={`${color}10`}
                color={color}
            >
                <Icon as={icon} boxSize={6} />
            </Box>
            <VStack spacing={1}>
                <Text fontSize='2xl' fontWeight='800' color='#1f2937'>
                    {value}
                </Text>
                <Text fontSize='sm' color='#6b7280' textAlign='center'>
                    {label}
                </Text>
                {trend && (
                    <Text fontSize='xs' color='#10b981' fontWeight='600'>
                        {trend}
                    </Text>
                )}
            </VStack>
        </VStack>
    </MotionCard>
)

// Testimonial Component
const TestimonialCard = ({ name, role, content, rating }: { name: string, role: string, content: string, rating: number }) => (
    <MotionCard
        bg='white'
        borderRadius='20px'
        p={6}
        boxShadow='0 4px 20px rgba(0, 0, 0, 0.08)'
        border='1px solid rgba(0, 0, 0, 0.05)'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
    >
        <VStack spacing={4} align='start'>
            <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                    <Icon 
                        key={i} 
                        as={Star} 
                        boxSize={4} 
                        color={i < rating ? '#fbbf24' : '#e5e7eb'} 
                    />
                ))}
            </HStack>
            <Text color='#374151' fontSize='md' lineHeight='1.6' fontStyle='italic'>
                "{content}"
            </Text>
            <HStack spacing={3}>
                <Box
                    p={2}
                    borderRadius='full'
                    bg='#f3f4f6'
                >
                    <Icon as={User} boxSize={4} color='#6b7280' />
                </Box>
                <VStack spacing={0} align='start'>
                    <Text fontSize='sm' fontWeight='600' color='#1f2937'>
                        {name}
                    </Text>
                    <Text fontSize='xs' color='#6b7280'>
                        {role}
                    </Text>
                </VStack>
            </HStack>
        </VStack>
    </MotionCard>
)

export default function HomePage() {
    const { user } = useUser()
    const navigate = useNavigate()
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Parent of 8-year-old with autism",
            content: "Kora has been a game-changer for understanding my son's emotions. The AI is incredibly accurate and the community support is amazing.",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Special Education Teacher",
            content: "This platform has revolutionized how I approach emotion recognition in my classroom. The resources are comprehensive and easy to use.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Therapist",
            content: "The AI assistant provides insights I never would have thought of. It's like having a specialist available 24/7.",
            rating: 5
        }
    ]

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [testimonials.length])

    return (
        <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='container.xl' pt={{ base: 20, md: 24 }} pb={20} px={4}>
                {/* Hero Section */}
                <ScaleFade initialScale={0.9} in={true}>
                    <MotionBox 
                        bgGradient='linear(to-br, white, #fefbff)'
                        borderRadius='24px'
                        p={{ base: 8, md: 12 }}
                        textAlign='center'
                        boxShadow='0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        border='1px solid rgba(255, 255, 255, 0.2)'
                        mb={12}
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
                        
                        <VStack spacing={8} position='relative' zIndex={1}>
                            {user && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Badge 
                                        px={6} 
                                        py={3} 
                                        borderRadius='full' 
                                        bg='rgba(168, 85, 247, 0.1)' 
                                        color='#7c3aed' 
                                        border='1px solid rgba(168, 85, 247, 0.2)'
                                        fontSize='sm'
                                        fontWeight='600'
                                    >
                                        <TypewriterText 
                                            text={`Welcome back, ${user?.displayName || 'Guest'} ✨`}
                                            speed={50}
                                        />
                                    </Badge>
                                </motion.div>
                            )}
                            
                            <VStack spacing={6}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <HStack spacing={4} align='center'>
                                        <Box
                                            p={4}
                                            borderRadius='20px'
                                            bgGradient='linear(135deg, #a855f7, #7c3aed)'
                                            boxShadow='0 8px 20px rgba(168, 85, 247, 0.3)'
                                            position='relative'
                                        >
                                            <Icon as={Brain} boxSize={10} color='white' />
                                            <Box
                                                position='absolute'
                                                top={-1}
                                                right={-1}
                                                w={4}
                                                h={4}
                                                bg='#10b981'
                                                borderRadius='full'
                                                border='2px solid white'
                                                animation='pulse 2s infinite'
                                            />
                                        </Box>
                                        <VStack align='start' spacing={2}>
                                            <Heading size='3xl' color='#1f2937' fontWeight='800' letterSpacing='-0.02em'>
                                                Kora
                                            </Heading>
                                            <Text fontSize='lg' color='#6b7280' fontWeight='500'>
                                                Next-Gen Autism Support
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </motion.div>
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <Text fontSize={{ base: 'xl', md: '2xl' }} maxW='4xl' mx='auto' color='#374151' lineHeight='1.6' fontWeight='400'>
                                        Revolutionary AI-powered platform that combines <Text as='span' color='#7c3aed' fontWeight='600'>advanced emotion recognition</Text> with a <Text as='span' color='#7c3aed' fontWeight='600'>compassionate community</Text> to support your autism journey.
                                    </Text>
                                </motion.div>
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <HStack spacing={3} flexWrap='wrap' justify='center'>
                                        <Badge 
                                            px={5} 
                                            py={3} 
                                            borderRadius='full' 
                                            bg='rgba(16, 185, 129, 0.1)' 
                                            color='#059669' 
                                            border='1px solid rgba(16, 185, 129, 0.2)'
                                            fontSize='sm'
                                            fontWeight='600'
                                        >
                                            <HStack spacing={2}>
                                                <Icon as={Target} boxSize={4} />
                                                <Text>87.83% Accuracy</Text>
                                            </HStack>
                                        </Badge>
                                        <Badge 
                                            px={5} 
                                            py={3} 
                                            borderRadius='full' 
                                            bg='rgba(168, 85, 247, 0.1)' 
                                            color='#7c3aed' 
                                            border='1px solid rgba(168, 85, 247, 0.2)'
                                            fontSize='sm'
                                            fontWeight='600'
                                        >
                                            <HStack spacing={2}>
                                                <Icon as={Zap} boxSize={4} />
                                                <Text>AI-Powered</Text>
                                            </HStack>
                                        </Badge>
                                        <Badge 
                                            px={5} 
                                            py={3} 
                                            borderRadius='full' 
                                            bg='rgba(59, 130, 246, 0.1)' 
                                            color='#2563eb' 
                                            border='1px solid rgba(59, 130, 246, 0.2)'
                                            fontSize='sm'
                                            fontWeight='600'
                                        >
                                            <HStack spacing={2}>
                                                <Icon as={Shield} boxSize={4} />
                                                <Text>Privacy-First</Text>
                                            </HStack>
                                        </Badge>
                                    </HStack>
                                </motion.div>
                            </VStack>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <HStack spacing={4} flexWrap='wrap' justify='center'>
                                    <Button 
                                        size='lg' 
                                        bgGradient='linear(135deg, #a855f7, #7c3aed)'
                                        color='white'
                                        _hover={{
                                            bgGradient: 'linear(135deg, #9333ea, #6d28d9)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)'
                                        }}
                                        _active={{
                                            transform: 'translateY(0px)'
                                        }}
                                        rightIcon={<ArrowRight />} 
                                        onClick={onOpen}
                                        px={12}
                                        py={8}
                                        fontSize='lg'
                                        fontWeight='600'
                                        borderRadius='16px'
                                        boxShadow='0 10px 25px rgba(168, 85, 247, 0.3)'
                                        transition='all 0.3s ease'
                                    >
                                        Learn More
                                    </Button>
                                    <Button 
                                        size='lg' 
                                        variant='outline'
                                        borderColor='#a855f7'
                                        color='#7c3aed'
                                        _hover={{
                                            bg: 'rgba(168, 85, 247, 0.05)',
                                            borderColor: '#7c3aed'
                                        }}
                                        rightIcon={<Camera />}
                                        px={12}
                                        py={8}
                                        fontSize='lg'
                                        fontWeight='600'
                                        borderRadius='16px'
                                        onClick={() => navigate('/app/camera')}
                                    >
                                        Try Now
                                    </Button>
                                </HStack>
                            </motion.div>
                        </VStack>
                    </MotionBox>
                </ScaleFade>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={16}>
                        <QuickStat 
                            icon={Target} 
                            value="87.83%" 
                            label="Accuracy Rate" 
                            color="#10b981"
                            trend="+12% this month"
                        />
                        <QuickStat 
                            icon={Users} 
                            value="500+" 
                            label="Active Users" 
                            color="#3b82f6"
                            trend="+23 this week"
                        />
                        <QuickStat 
                            icon={MapPin} 
                            value="200+" 
                            label="Resources" 
                            color="#8b5cf6"
                            trend="+15 this week"
                        />
                        <QuickStat 
                            icon={Heart} 
                            value="4.9" 
                            label="User Rating" 
                            color="#f59e0b"
                            trend="Based on 500+ reviews"
                        />
                    </SimpleGrid>
                </motion.div>

                {/* Features Section */}
                <VStack spacing={16} mb={16}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <VStack spacing={6} textAlign='center'>
                            <Heading size='2xl' color='#1f2937' fontWeight='800' letterSpacing='-0.02em'>
                                Everything You Need
                            </Heading>
                            <Text fontSize='lg' color='#6b7280' maxW='2xl' fontWeight='400' lineHeight='1.6'>
                                Comprehensive tools designed to support your autism journey
                            </Text>
                        </VStack>
                    </motion.div>

                    <SimpleGrid columns={gridColumns} spacing={8} w='full'>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <FeatureBox
                                title="Emotion Detection"
                                description="Advanced AI analyzes facial expressions with 87.83% accuracy to understand your child's emotions in real-time."
                                icon={Camera}
                                to="/app/camera"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <FeatureBox
                                title="AI Assistant"
                                description="Get personalized insights and support from Kora AI, trained specifically for autism care and understanding."
                                icon={Bot}
                                to="/app/chatbot"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <FeatureBox
                                title="Find Resources"
                                description="Discover local autism resources, therapists, and support groups tailored to your specific needs and location."
                                icon={MapPin}
                                to="/app/resources"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                        >
                            <FeatureBox
                                title="Community Support"
                                description="Connect with other parents, caregivers, and individuals on the autism spectrum in our supportive community."
                                icon={Users}
                                to="/app/community"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                        >
                            <FeatureBox
                                title="Emotion Games"
                                description="Interactive games and activities designed to help children learn about emotions and social skills in a fun way."
                                icon={Heart}
                                to="/app/games"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                        >
                            <FeatureBox
                                title="Help & Support"
                                description="Access comprehensive guides, FAQs, and support resources to help you navigate your autism journey."
                                icon={Lightbulb}
                                to="/app/help"
                            />
                        </motion.div>
                    </SimpleGrid>
                </VStack>

                {/* Testimonials Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <VStack spacing={12} mb={16}>
                        <VStack spacing={6} textAlign='center'>
                            <Heading size='2xl' color='#1f2937' fontWeight='800' letterSpacing='-0.02em'>
                                What Our Community Says
                            </Heading>
                            <Text fontSize='lg' color='#6b7280' maxW='2xl' fontWeight='400' lineHeight='1.6'>
                                Real stories from parents, teachers, and therapists who use Kora
                            </Text>
                        </VStack>

                        <Box w='full' maxW='4xl'>
                            <TestimonialCard {...testimonials[currentTestimonial]} />
                            
                            <HStack spacing={2} justify='center' mt={6}>
                                {testimonials.map((_, index) => (
                                    <Box
                                        key={index}
                                        w={3}
                                        h={3}
                                        borderRadius='full'
                                        bg={index === currentTestimonial ? '#a855f7' : '#e5e7eb'}
                                        cursor='pointer'
                                        onClick={() => setCurrentTestimonial(index)}
                                        transition='all 0.3s ease'
                                        _hover={{ bg: index === currentTestimonial ? '#a855f7' : '#d1d5db' }}
                                    />
                                ))}
                            </HStack>
                        </Box>
                    </VStack>
                </motion.div>

            </Container>

            {/* Learn More Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
                <ModalContent 
                    bg='white'
                    borderRadius='20px'
                    mx={4}
                    boxShadow='0 25px 50px rgba(0, 0, 0, 0.25)'
                >
                    <ModalHeader 
                        bgGradient='linear(135deg, #a855f7, #7c3aed)' 
                        color='white'
                        borderRadius='20px 20px 0 0'
                        fontSize='xl'
                        fontWeight='700'
                    >
                        <HStack spacing={3}>
                            <Icon as={Info} boxSize={6} />
                            <Text>About Kora</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody p={8}>
                        <VStack spacing={6} align='stretch'>
                            <Text color='#374151' fontSize='md' lineHeight='1.6'>
                                Kora is a revolutionary AI-powered platform designed specifically for autism support. 
                                Our advanced emotion recognition technology helps parents, caregivers, and educators 
                                better understand and support individuals on the autism spectrum.
                            </Text>
                            
                            <VStack spacing={4} align='stretch'>
                                <HStack spacing={3}>
                                    <Icon as={Target} boxSize={5} color='#10b981' />
                                    <Text fontWeight='600' color='#1f2937'>87.83% Accuracy Rate</Text>
                                </HStack>
                                <HStack spacing={3}>
                                    <Icon as={Shield} boxSize={5} color='#3b82f6' />
                                    <Text fontWeight='600' color='#1f2937'>Privacy-First Approach</Text>
                                </HStack>
                                <HStack spacing={3}>
                                    <Icon as={Users} boxSize={5} color='#8b5cf6' />
                                    <Text fontWeight='600' color='#1f2937'>Supportive Community</Text>
                                </HStack>
                                <HStack spacing={3}>
                                    <Icon as={Brain} boxSize={5} color='#f59e0b' />
                                    <Text fontWeight='600' color='#1f2937'>AI-Powered Insights</Text>
                                </HStack>
                            </VStack>
                            
                            <Button 
                                colorScheme='purple' 
                                size='lg' 
                                onClick={onClose}
                                rightIcon={<ArrowRight />}
                            >
                                Start Using Kora
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}