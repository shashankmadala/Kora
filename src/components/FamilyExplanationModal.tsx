import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    Text,
    Textarea,
    Box,
    Icon,
    HStack,
    Badge
} from '@chakra-ui/react'
import { Users, Lightbulb, ArrowRight } from 'lucide-react'

interface FamilyExplanationModalProps {
    isOpen: boolean
    onClose: () => void
    onContinue: () => void
    question?: string
    userAnswer?: string
    isCorrect?: boolean
    explanation?: string
}

export default function FamilyExplanationModal({
    isOpen,
    onClose,
    onContinue,
    question,
    userAnswer,
    isCorrect,
    explanation
}: FamilyExplanationModalProps) {
    const handleContinue = () => {
        onClose()
        onContinue()
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            isCentered
            size='lg'
            motionPreset='scale'
        >
            <ModalOverlay 
                bg='blackAlpha.600' 
                backdropFilter='blur(4px)' 
            />
            <ModalContent
                borderRadius='24px'
                bg='white'
                boxShadow='0 20px 60px rgba(0, 0, 0, 0.3)'
                border='1px solid rgba(255, 255, 255, 0.2)'
            >
                {/* Background Pattern */}
                <Box
                    position='absolute'
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0.05}
                    backgroundImage="radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)"
                    backgroundSize="20px 20px"
                    borderRadius='24px'
                />

                <ModalHeader 
                    position='relative' 
                    zIndex={1}
                    pb={2}
                >
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            borderRadius='12px'
                            bgGradient='linear(135deg, #f59e0b, #d97706)'
                        >
                            <Icon as={Users} boxSize={5} color='white' />
                        </Box>
                        <VStack align='start' spacing={0}>
                            <Text fontSize='xl' fontWeight='800' color='#1f2937'>
                                Family Time! 👨‍👩‍👧‍👦
                            </Text>
                            <Text fontSize='xs' color='#6b7280'>
                                Take a moment to explain your thinking
                            </Text>
                        </VStack>
                    </HStack>
                </ModalHeader>

                <ModalCloseButton 
                    size='md'
                    borderRadius='full'
                    bg='gray.100'
                    _hover={{ bg: 'gray.200' }}
                />

                <ModalBody 
                    position='relative' 
                    zIndex={1}
                    py={6}
                >
                    <VStack spacing={6} align='stretch'>
                        {/* Question Summary */}
                        {question && (
                            <Box
                                p={4}
                                borderRadius='12px'
                                bg='#f8fafc'
                                border='1px solid #e2e8f0'
                            >
                                <HStack spacing={2} mb={2}>
                                    <Icon as={Lightbulb} boxSize={4} color='#a855f7' />
                                    <Text fontSize='sm' fontWeight='600' color='#6b7280'>
                                        Question:
                                    </Text>
                                </HStack>
                                <Text fontSize='md' color='#1f2937' fontWeight='500'>
                                    {question}
                                </Text>
                            </Box>
                        )}

                        {/* Answer Display */}
                        {userAnswer && (
                            <Box
                                p={4}
                                borderRadius='12px'
                                bg={isCorrect ? '#f0fdf4' : '#fef2f2'}
                                border='1px solid'
                                borderColor={isCorrect ? '#bbf7d0' : '#fecaca'}
                            >
                                <HStack spacing={2} mb={2}>
                                    <Badge 
                                        colorScheme={isCorrect ? 'green' : 'red'}
                                        borderRadius='full'
                                        px={2}
                                        py={0.5}
                                    >
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </Badge>
                                </HStack>
                                <Text fontSize='md' color='#1f2937' fontWeight='600'>
                                    Your Answer:
                                </Text>
                                <Text 
                                    fontSize='md' 
                                    color={isCorrect ? '#10b981' : '#ef4444'}
                                    mt={1}
                                >
                                    {userAnswer}
                                </Text>
                            </Box>
                        )}

                        {/* Explanation */}
                        {explanation && (
                            <Box
                                p={4}
                                borderRadius='12px'
                                bg='#fffbeb'
                                border='1px solid #fde68a'
                            >
                                <Text fontSize='sm' fontWeight='600' color='#92400e' mb={2}>
                                    💡 Why?
                                </Text>
                                <Text fontSize='sm' color='#78350f'>
                                    {explanation}
                                </Text>
                            </Box>
                        )}

                        {/* Explanation Prompt */}
                        <Box
                            p={4}
                            borderRadius='12px'
                            bgGradient='linear(135deg, #fef3c7, #fde68a)'
                            border='2px solid #f59e0b'
                        >
                            <VStack align='start' spacing={3}>
                                <Text 
                                    fontSize='md' 
                                    fontWeight='700' 
                                    color='#78350f'
                                >
                                    💭 Explain to your family:
                                </Text>
                                <Text 
                                    fontSize='sm' 
                                    color='#92400e'
                                >
                                    "I chose this because..."
                                </Text>
                                <Textarea
                                    placeholder='Share your thinking process with your siblings and parents...'
                                    bg='white'
                                    borderRadius='8px'
                                    border='1px solid #e2e8f0'
                                    minH='80px'
                                    _focus={{
                                        borderColor: '#f59e0b',
                                        boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.1)'
                                    }}
                                />
                            </VStack>
                        </Box>

                        {/* Helper Text */}
                        <Box
                            p={3}
                            borderRadius='8px'
                            bg='#f0fdf4'
                            border='1px solid #bbf7d0'
                        >
                            <HStack spacing={2}>
                                <Icon as={ArrowRight} boxSize={4} color='#10b981' />
                                <Text fontSize='xs' color='#059669' lineHeight='1.5'>
                                    This helps your family understand your perspective and learn about autism together! 
                                    Take as long as you need.
                                </Text>
                            </HStack>
                        </Box>
                    </VStack>
                </ModalBody>

                {/* Actions */}
                <Box 
                    p={6} 
                    pt={0}
                    position='relative' 
                    zIndex={1}
                >
                    <HStack spacing={3} justify='flex-end'>
                        <Button
                            variant='outline'
                            onClick={onClose}
                            borderRadius='12px'
                        >
                            Skip
                        </Button>
                        <Button
                            bgGradient='linear(135deg, #f59e0b, #d97706)'
                            color='white'
                            _hover={{
                                bgGradient: 'linear(135deg, #d97706, #b45309)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                            }}
                            rightIcon={<Icon as={ArrowRight} />}
                            borderRadius='12px'
                            onClick={handleContinue}
                        >
                            Continue
                        </Button>
                    </HStack>
                </Box>
            </ModalContent>
        </Modal>
    )
}




