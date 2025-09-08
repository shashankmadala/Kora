import { FormEvent, useState } from 'react'
import { Box, Button, Flex, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure, useToast, VStack, HStack, Icon, Heading, Container } from '@chakra-ui/react'
import { login, resetPassword } from '../firebase/auth'
import { Link as RouterLink } from 'react-router-dom'
import { Brain, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await login(email, password)
        } catch (e) {
            toast({
                title: `${e}`,
                colorScheme: 'red',
                isClosable: true
            })
            console.log('did not work')
        }
    }

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await resetPassword(resetEmail)
            toast({
                title: `Password Reset Email Successfully Sent!`,
                colorScheme: 'green',
                isClosable: true
            })
            onClose()
        } catch (e) {
            toast({
                title: `${e}`,
                colorScheme: 'red',
                isClosable: true
            })
            console.log('did not work')
        }
    }

    return (
        <Box minHeight='100vh' bg='#f9fafb' display='flex' alignItems='center' justifyContent='center'>
            <Container maxW='md'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        bg='white'
                        borderRadius='24px'
                        p={12}
                        boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'
                        border='1px solid #e5e7eb'
                        w='100%'
                        maxW='400px'
                        mx='auto'
                    >
                        <VStack spacing={8} as='form' onSubmit={handleLogin}>
                            {/* Header */}
                            <VStack spacing={6} textAlign='center'>
                                <HStack spacing={4} align='center'>
                                    <Box
                                        p={3}
                                        borderRadius='16px'
                                        bg='#f0f9ff'
                                        border='1px solid #e0f2fe'
                                    >
                                        <Icon as={Brain} boxSize={8} color='#0ea5e9' />
                                    </Box>
                                    <Heading size='xl' color='#111827' fontWeight='700'>
                                        Kora AI
                                    </Heading>
                                </HStack>
                                <Text color='#6b7280' fontSize='lg' fontWeight='400'>
                                    Welcome back! Sign in to continue your journey
                                </Text>
                            </VStack>

                            {/* Form Fields */}
                            <VStack spacing={6} w='full'>
                                <Box w='full'>
                                    <Text color='#374151' fontWeight='600' mb={2} fontSize='sm'>Email</Text>
                                    <Input 
                                        placeholder='Enter your email' 
                                        type='email' 
                                        onChange={e => setEmail(e.target.value)}
                                        variant='outline'
                                        size='lg'
                                    />
                                </Box>
                                
                                <Box w='full'>
                                    <Text color='#374151' fontWeight='600' mb={2} fontSize='sm'>Password</Text>
                                    <Input 
                                        placeholder='Enter your password' 
                                        type='password' 
                                        onChange={e => setPassword(e.target.value)}
                                        variant='outline'
                                        size='lg'
                                    />
                                </Box>
                            </VStack>

                            {/* Login Button */}
                            <Button 
                                type='submit' 
                                variant='primary'
                                size='lg'
                                w='full'
                                rightIcon={<ArrowRight />}
                                py={6}
                                fontSize='lg'
                                fontWeight='600'
                            >
                                Sign In
                            </Button>

                            {/* Links */}
                            <Flex justifyContent='space-between' w='full' pt={4}>
                                <Link 
                                    as={RouterLink} 
                                    to='/register' 
                                    color='#0ea5e9' 
                                    _hover={{ color: '#0284c7' }}
                                    fontSize='sm'
                                    fontWeight='500'
                                >
                                    Create Account
                                </Link>
                                <Button 
                                    variant='link' 
                                    color='#0ea5e9' 
                                    _hover={{ color: '#0284c7' }}
                                    fontSize='sm'
                                    onClick={onOpen}
                                    leftIcon={<KeyRound size={14} />}
                                    fontWeight='500'
                                >
                                    Forgot Password?
                                </Button>
                            </Flex>
                        </VStack>
                    </Box>
                </motion.div>
            </Container>
            {/* Reset Password Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='md'>
                <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
                <ModalContent 
                    as='form' 
                    onSubmit={handleResetPassword}
                    bg='white'
                    borderRadius='16px'
                    mx='4'
                >
                    <ModalHeader color='#111827' fontSize='2xl' fontWeight='700'>
                        Reset Password
                    </ModalHeader>
                    <ModalCloseButton color='#6b7280' />
                    <ModalBody pb={6}>
                        <VStack spacing={6} align='stretch'>
                            <Text color='#6b7280' fontSize='sm' lineHeight='1.6'>
                                Enter your email address and we'll send you a link to reset your password.
                            </Text>
                            <Box>
                                <Text color='#374151' mb={2} fontWeight='600' fontSize='sm'>Email Address</Text>
                                <Input 
                                    id='reset-email' 
                                    autoComplete='email' 
                                    placeholder='Enter your email address'
                                    onChange={e => setResetEmail(e.target.value)}
                                    variant='outline'
                                />
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            variant='primary' 
                            mr={3} 
                            type='submit'
                            leftIcon={<Mail />}
                            fontWeight='600'
                        >
                            Send Reset Email
                        </Button>
                        <Button 
                            variant='secondary' 
                            onClick={onClose}
                            fontWeight='600'
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
