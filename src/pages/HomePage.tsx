import { Box, Container, VStack, Heading, Text, SimpleGrid, useColorModeValue, Button, useBreakpointValue, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ScaleFade, } from '@chakra-ui/react'
import { Camera, Users, Lightbulb, Book, BotIcon, Info } from 'lucide-react'
import { useUser } from '../firebase/useUser'
import TypewriterText from '../components/TypeWriterText'
import FeatureBox from '../components/FeatureBox'

export default function HomePage() {
    const { user } = useUser()
    const textColor = useColorModeValue('gray.800', 'white')
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 })
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <ScaleFade initialScale={0.9} in={true}>
            <Box minHeight='100vh' marginBottom={6}>
                <Container maxW='container.xl' pt={{ base: 16, md: 20 }} pb={8}>
                    <Box position='relative' color='white' pt={12} pb={6} px={4} borderRadius='xl' boxShadow='xl' textAlign='center' overflow='hidden' display='flex' alignItems='center' justifyContent='center' bgGradient='linear-gradient(to top, #d799f7, #a699f7, #3f5fe0)'>
                        <VStack spacing={4} position='relative' zIndex={2}>
                            {user && (
                                <Text fontSize='lg' fontWeight='medium'>
                                    W<TypewriterText text={`elcome back, ${user?.displayName || 'Guest'}`} />
                                </Text>
                            )}
                            <Heading>Discover Kora</Heading>
                            <Text fontSize='md' maxW='xl' mx='auto'>
                                Empowering parents and caregivers with AI-driven insights and community support for autism understanding.
                            </Text>
                            <Button size='md' colorScheme='whiteAlpha' mt={2} rightIcon={<Info />} onClick={onOpen}>
                                Learn More
                            </Button>
                        </VStack>
                    </Box>

                    <Heading size='xl' textAlign='center' py={10} color={textColor}>
                        Our Features
                    </Heading>

                    <SimpleGrid columns={gridColumns} spacing={6} mb={8}>
                        <FeatureBox
                            title="Emotion Detection"
                            description="Understand your child's emotions with advanced AI technology."
                            icon={Camera}
                            to="/app/camera"
                        />
                        <FeatureBox
                            title="AI Assistant"
                            description="Get personalized support and answers about autism."
                            icon={BotIcon}
                            to="/app/chatbot"
                        />
                        <FeatureBox
                            title="Community Forum"
                            description="Connect with other parents and caregivers for support and advice."
                            icon={Users}
                            to="/app/community"
                        />
                        <FeatureBox
                            title="Help Us Improve"
                            description="Contribute to our research by submitting photos of your child expressing different emotions."
                            icon={Lightbulb}
                            to="/app/improve"
                        />
                        <FeatureBox
                            title="Learn More About Autism"
                            description="Access resources and expert insights on autism spectrum disorders."
                            icon={Book}
                            to="/app/help"
                        />
                    </SimpleGrid>
                </Container>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent maxW='320px' pb={3}>
                        <ModalHeader>About Kora</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Kora is an innovative platform designed to support parents and caregivers of children with autism.
                                Our AI-driven tools and community features provide personalized insights, emotional support, and
                                valuable resources to help you navigate the unique challenges and joys of raising a child with autism.
                            </Text>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </ScaleFade>
    )
}