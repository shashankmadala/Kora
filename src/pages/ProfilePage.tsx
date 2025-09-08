import { 
    Button, 
    FormControl, 
    FormLabel, 
    Input, 
    Radio, 
    RadioGroup, 
    Stack, 
    Spinner, 
    Heading, 
    useToast, 
    Box, 
    Link as ChakraLink, 
    AbsoluteCenter, 
    ScaleFade, 
    Container,
    VStack,
    HStack,
    Icon,
    Text,
    Card,
    CardBody,
    Badge,
    Divider,
    useColorModeValue,
    Flex,
    Avatar,
    Textarea,
    SimpleGrid
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getProfile } from '../utils/getProfile'
import { useUser } from '../firebase/useUser'
import { editProfile } from '../utils/editProfile'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Calendar, Heart, MessageCircle, Settings, Save, ArrowLeft, Brain, Target, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const textInputs = [
    { key: 'Child Name', icon: User, placeholder: 'Enter your child\'s name' },
    { key: 'Child Age', icon: Calendar, placeholder: 'Enter age in years' },
    { key: 'Diagnosis Date', icon: Calendar, placeholder: 'Select diagnosis date', type: 'date' },
    { key: 'Sensory Sensitivities', icon: Heart, placeholder: 'Describe sensory sensitivities' },
    { key: 'Current Therapies', icon: Settings, placeholder: 'List current therapies' },
    { key: 'Preferred Calming Techniques', icon: Heart, placeholder: 'Describe calming techniques' },
    { key: 'Key Behavioral Traits', icon: Brain, placeholder: 'Describe key behavioral traits' }
]

export default function ProfilePage() {
    const { user } = useUser()
    const [data, setData] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData((prev: any) => {
            return { ...prev, ...{ [e.target.placeholder]: e.target.value } }
        })
    }

    const handleRadio = (value: string) => {
        setData((prev: any) => {
            return { ...prev, ...{ 'Primary Method of Communication': value } }
        })
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        if (data) {
            try {
                await editProfile({ data, userId: user?.uid! })
                toast({
                    title: 'Profile Successfully Updated!',
                    description: 'Your profile has been saved successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
                navigate('/')
            } catch (error) {
                toast({
                    title: 'Error updating profile',
                    description: 'Please try again later.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top'
                })
            }
        }
        setSaving(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getProfile({ userId: user?.uid! })
                setData(profile)
            } catch (error) {
                console.error('Error fetching profile:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.uid) {
            fetchData()
        }
    }, [user])

    const goBack = () => navigate(-1)

    if (loading) {
        return (
            <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
                <AbsoluteCenter>
                    <VStack spacing={4}>
                        <Spinner color='purple.500' size='xl' thickness='4px' />
                        <Text color='#6b7280' fontSize='lg'>Loading your profile...</Text>
                    </VStack>
                </AbsoluteCenter>
            </Box>
        )
    }

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
                            <Icon as={User} boxSize={8} color='white' />
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
                                My Profile
                            </Heading>
                            <Text fontSize='lg' color='#6b7280' fontWeight='400'>
                                Manage your child's information and preferences
                            </Text>
                        </VStack>
                    </VStack>
                </MotionBox>

                {data && (
                    <ScaleFade initialScale={0.9} in={true}>
                        <MotionCard
                            bg='white'
                            borderRadius='24px'
                            p={{ base: 6, md: 8 }}
                            boxShadow='0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            border='1px solid rgba(255, 255, 255, 0.2)'
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

                            <VStack spacing={8} position='relative' zIndex={1} as='form' onSubmit={handleUpdate}>
                                {/* Profile Stats */}
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    w='full'
                                >
                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                                        <VStack spacing={2} p={4} bg='rgba(168, 85, 247, 0.05)' borderRadius='16px'>
                                            <Icon as={Target} boxSize={6} color='#7c3aed' />
                                            <Text fontSize='sm' color='#6b7280' fontWeight='600'>Profile Completion</Text>
                                            <Text fontSize='2xl' color='#1f2937' fontWeight='800'>
                                                {Math.round((Object.values(data).filter(value => value && value.toString().trim() !== '').length / 8) * 100)}%
                                            </Text>
                                        </VStack>
                                        <VStack spacing={2} p={4} bg='rgba(16, 185, 129, 0.05)' borderRadius='16px'>
                                            <Icon as={Award} boxSize={6} color='#10b981' />
                                            <Text fontSize='sm' color='#6b7280' fontWeight='600'>Member Since</Text>
                                            <Text fontSize='2xl' color='#1f2937' fontWeight='800'>
                                                {new Date().getFullYear()}
                                            </Text>
                                        </VStack>
                                        <VStack spacing={2} p={4} bg='rgba(59, 130, 246, 0.05)' borderRadius='16px'>
                                            <Icon as={Heart} boxSize={6} color='#3b82f6' />
                                            <Text fontSize='sm' color='#6b7280' fontWeight='600'>Support Level</Text>
                                            <Text fontSize='2xl' color='#1f2937' fontWeight='800'>Active</Text>
                                        </VStack>
                                    </SimpleGrid>
                                </MotionBox>

                                <Divider />

                                {/* Form Fields */}
                                <VStack spacing={6} w='full'>
                                    <Heading size='lg' color='#1f2937' fontWeight='700' textAlign='left' w='full'>
                                        Child Information
                                    </Heading>

                                    {textInputs.map((input, index) => (
                                        <MotionBox
                                            key={input.key}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                                            w='full'
                                        >
                                            <FormControl>
                                                <FormLabel 
                                                    fontSize='md' 
                                                    fontWeight='600' 
                                                    color='#374151'
                                                    mb={2}
                                                >
                                                    <HStack spacing={2}>
                                                        <Icon as={input.icon} boxSize={4} color='#7c3aed' />
                                                        <Text>{input.key}</Text>
                                                    </HStack>
                                                </FormLabel>
                                                {input.key === 'Sensory Sensitivities' || input.key === 'Current Therapies' || 
                                                 input.key === 'Preferred Calming Techniques' || input.key === 'Key Behavioral Traits' ? (
                                                    <Textarea
                                                        placeholder={input.placeholder}
                                                        onChange={handleInput}
                                                        value={data?.[input.key as keyof Profile] as string || ''}
                                                        bg='#f8fafc'
                                                        border='1px solid #e2e8f0'
                                                        borderRadius='12px'
                                                        _focus={{
                                                            borderColor: '#a855f7',
                                                            boxShadow: '0 0 0 1px #a855f7'
                                                        }}
                                                        _hover={{
                                                            borderColor: '#c4b5fd'
                                                        }}
                                                        minH='100px'
                                                        resize='vertical'
                                                    />
                                                ) : (
                                                    <Input
                                                        placeholder={input.placeholder}
                                                        onChange={handleInput}
                                                        type={input.type || 'text'}
                                                        value={data?.[input.key as keyof Profile] as string || ''}
                                                        bg='#f8fafc'
                                                        border='1px solid #e2e8f0'
                                                        borderRadius='12px'
                                                        _focus={{
                                                            borderColor: '#a855f7',
                                                            boxShadow: '0 0 0 1px #a855f7'
                                                        }}
                                                        _hover={{
                                                            borderColor: '#c4b5fd'
                                                        }}
                                                    />
                                                )}
                                            </FormControl>
                                        </MotionBox>
                                    ))}

                                    <Divider />

                                    <MotionBox
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        w='full'
                                    >
                                        <FormControl as='fieldset'>
                                            <FormLabel 
                                                as='legend' 
                                                fontSize='md' 
                                                fontWeight='600' 
                                                color='#374151'
                                                mb={4}
                                            >
                                                <HStack spacing={2}>
                                                    <Icon as={MessageCircle} boxSize={4} color='#7c3aed' />
                                                    <Text>Primary Method of Communication</Text>
                                                </HStack>
                                            </FormLabel>
                                            <RadioGroup 
                                                onChange={handleRadio} 
                                                value={data?.['Primary Method of Communication'] || ''}
                                            >
                                                <Stack spacing={4}>
                                                    {['Verbal', 'Non-verbal', 'Combination of both', 'AAC Device'].map((option) => (
                                                        <Radio 
                                                            key={option}
                                                            value={option}
                                                            colorScheme='purple'
                                                            size='lg'
                                                            _checked={{
                                                                color: '#7c3aed',
                                                                borderColor: '#7c3aed'
                                                            }}
                                                        >
                                                            <Text fontSize='md' fontWeight='500' color='#374151'>
                                                                {option}
                                                            </Text>
                                                        </Radio>
                                                    ))}
                                                </Stack>
                                            </RadioGroup>
                                        </FormControl>
                                    </MotionBox>
                                </VStack>

                                {/* Save Button */}
                                <MotionBox
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.0 }}
                                    w='full'
                                    pt={4}
                                >
                                    <Button
                                        type='submit'
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
                                        rightIcon={<Icon as={Save} />}
                                        px={12}
                                        py={8}
                                        fontSize='lg'
                                        fontWeight='600'
                                        borderRadius='16px'
                                        boxShadow='0 10px 25px rgba(168, 85, 247, 0.3)'
                                        transition='all 0.3s ease'
                                        isLoading={saving}
                                        loadingText='Saving...'
                                        w='full'
                                    >
                                        Save Changes
                                    </Button>
                                </MotionBox>
                            </VStack>
                        </MotionCard>
                    </ScaleFade>
                )}
            </Container>
        </Box>
    )
}