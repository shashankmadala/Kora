import { useRef } from 'react'
import { Box, Menu, MenuButton, IconButton, MenuList, MenuItem, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Portal, HStack, VStack, Text, Icon } from '@chakra-ui/react'
import { MenuIcon, Brain, User, HelpCircle, LogOut } from 'lucide-react'
import { logout } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef(null)
    const navigate = useNavigate()

    const handleLogout = () => {
        onClose()
        logout()
    }

    return (
        <>
            <Box 
                h='72px' 
                bg='rgba(255, 255, 255, 0.8)'
                backdropFilter='blur(20px)'
                borderBottom='1px solid rgba(255, 255, 255, 0.2)'
                display='flex' 
                flexDir='row' 
                alignItems='center' 
                justifyContent='space-between'
                position='fixed' 
                top={0} 
                left={0}
                right={0}
                w='100%' 
                px={6} 
                zIndex={1000} 
                boxShadow='0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            >
                <HStack spacing={4}>
                    <Box
                        p={3}
                        borderRadius='16px'
                        bgGradient='linear(135deg, #a855f7, #7c3aed)'
                        boxShadow='0 4px 12px rgba(168, 85, 247, 0.3)'
                        position='relative'
                    >
                        <Icon as={Brain} boxSize={6} color='white' />
                        <Box
                            position='absolute'
                            top={-1}
                            right={-1}
                            w={3}
                            h={3}
                            bg='#10b981'
                            borderRadius='full'
                            border='2px solid white'
                        />
                    </Box>
                    <VStack align='start' spacing={0}>
                        <Text fontSize='xl' fontWeight='800' color='#1f2937' letterSpacing='-0.02em'>
                            Kora AI
                        </Text>
                        <Text fontSize='xs' color='#6b7280' fontWeight='500'>
                            Next-Gen Autism Support
                        </Text>
                    </VStack>
                </HStack>
                
                <Menu autoSelect={false}>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<MenuIcon color='#6b7280' />}
                        variant='ghost'
                        color='#6b7280'
                        borderRadius='12px'
                        _hover={{ 
                            bg: 'rgba(168, 85, 247, 0.1)',
                            color: '#7c3aed',
                            transform: 'scale(1.05)'
                        }}
                        _active={{ 
                            bg: 'rgba(168, 85, 247, 0.2)',
                            transform: 'scale(0.95)'
                        }}
                        transition='all 0.2s ease'
                    />
                    <Portal>
                        <MenuList 
                            bg='rgba(255, 255, 255, 0.95)'
                            backdropFilter='blur(20px)'
                            border='1px solid rgba(255, 255, 255, 0.2)'
                            boxShadow='0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                            borderRadius='16px'
                            py={2}
                        >
                            <MenuItem 
                                onClick={() => navigate('/app/improve')}
                                icon={<HelpCircle size={16} />}
                                color='#374151'
                                borderRadius='8px'
                                mx={2}
                                _hover={{ 
                                    bg: 'rgba(168, 85, 247, 0.1)',
                                    color: '#7c3aed'
                                }}
                            >
                                Help Us Improve
                            </MenuItem>
                            <MenuItem 
                                onClick={() => navigate('/app/profile')}
                                icon={<User size={16} />}
                                color='#374151'
                                borderRadius='8px'
                                mx={2}
                                _hover={{ 
                                    bg: 'rgba(168, 85, 247, 0.1)',
                                    color: '#7c3aed'
                                }}
                            >
                                View Profile
                            </MenuItem>
                            <MenuItem 
                                onClick={onOpen}
                                icon={<LogOut size={16} />}
                                color='#dc2626'
                                borderRadius='8px'
                                mx={2}
                                _hover={{ 
                                    bg: 'rgba(220, 38, 38, 0.1)',
                                    color: '#dc2626'
                                }}
                            >
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Portal>
                </Menu>
            </Box>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent mx={3}>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>Logout</AlertDialogHeader>
                        <AlertDialogBody>Are you sure? You will need to login again if you want to use this app.</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleLogout} ml={3}>
                                Logout
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}
