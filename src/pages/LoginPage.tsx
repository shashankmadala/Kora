import { FormEvent, useState } from 'react'
import { Box, Button, Flex, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { login, resetPassword } from '../firebase/auth'
import { Link as RouterLink } from 'react-router-dom'

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
        <>
            <Box display='flex' alignItems='center' justifyContent='center' h='100vh' width='calc(100% - 32px)' marginInline='auto'>
                <Box>
                    <Stack gap='1rem' w='100%' as='form' onSubmit={handleLogin}>
                        <Text fontSize='x-large' fontWeight={500} textAlign='center'>Please Login</Text>
                        <Input placeholder='Email' type='email' onChange={e => setEmail(e.target.value)} />
                        <Input placeholder='Password' type='password' onChange={e => setPassword(e.target.value)} />
                        <Button colorScheme='purple' textAlign='center' type='submit'>Login</Button>
                        <Flex justifyContent='space-between'>
                            <Link as={RouterLink} to='/register' fontSize='small' color='purple.500' w='fit-content'>Sign Up</Link>
                            <Button variant='link' fontWeight='normal' fontSize='small' color='purple.500' w='fit-content' onClick={onOpen}>Forgot Password?</Button>
                        </Flex>
                    </Stack>
                </Box>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent as='form' onSubmit={handleResetPassword}>
                    <ModalHeader>Reset Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <label htmlFor='reset-email'>Your Account's Email</label>
                        <Input id='reset-email' autoComplete='email' mt={1} onChange={e => setResetEmail(e.target.value)} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='purple' mr={3} type='submit'>Send Reset Email</Button>
                        <Button variant='ghost' onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
