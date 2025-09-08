import { 
    Box, Heading, Text, VStack, SimpleGrid, Container, 
    Accordion, AccordionItem, AccordionButton, AccordionPanel, 
    useBreakpointValue, AccordionIcon, HStack, Icon, 
    Badge, Card, CardBody
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
    HelpCircle, BookOpen, Lightbulb, Users, MessageCircle, 
    CheckCircle, Globe, FileText
} from 'lucide-react'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

const quickLinks = [
    { 
        label: 'Autism Symptoms', 
        url: 'https://www.cdc.gov/autism/signs-symptoms/index.html',
        icon: HelpCircle,
        description: 'Learn about early signs and symptoms',
        color: '#ef4444',
        bgColor: '#fef2f2'
    },
    { 
        label: 'Treatment Options', 
        url: 'https://autismsciencefoundation.org/treatment-options/',
        icon: Lightbulb,
        description: 'Explore therapy and intervention options',
        color: '#3b82f6',
        bgColor: '#eff6ff'
    },
    { 
        label: 'Educational Resources', 
        url: 'https://researchautism.org/educators/educator-resources/',
        icon: BookOpen,
        description: 'Resources for educators and parents',
        color: '#10b981',
        bgColor: '#f0fdf4'
    },
    { 
        label: 'Support Groups', 
        url: '#',
        icon: Users,
        description: 'Connect with local support groups',
        color: '#8b5cf6',
        bgColor: '#faf5ff'
    }
]

const faqData = [
    {
        question: "What are the signs of autism in children?",
        answer: "Early signs of autism in children can include difficulty with communication, social interaction, and repetitive behaviors. If you have concerns, speak to your child's doctor or just ask Kora AI!",
    },
    {
        question: "What types of support are available for children with autism?",
        answer: "There are various support options available, including therapy, educational programs, and social skills groups. Talk to your child's doctor or a specialist to determine the best approach.",
    },
    {
        question: "How can I get financial help for raising a child with autism?",
        answer: "Financial assistance options may vary depending on your location. You can explore government programs, disability benefits, and fundraising options.",
    },
]

export default function HelpPage() {
    const headingSize = useBreakpointValue({ base: '2xl', md: '3xl' })
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 })

    return (
        <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='container.xl' pt={20} pb={24}>
                {/* Hero Section */}
                <MotionBox 
                    bgGradient='linear(to-br, white, #fefbff)'
                    borderRadius='24px'
                    p={{ base: 6, md: 12 }}
                    textAlign='center'
                    boxShadow='0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                    border='1px solid rgba(255, 255, 255, 0.2)'
                    mb={12}
                    position='relative'
                    overflow='hidden'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <VStack spacing={6}>
                        <HStack spacing={4} align='center'>
                            <Box
                                p={4}
                                borderRadius='20px'
                                bgGradient='linear(135deg, #a855f7, #7c3aed)'
                                boxShadow='0 8px 32px rgba(168, 85, 247, 0.3)'
                            >
                                <Icon as={HelpCircle} boxSize={8} color='white' />
                            </Box>
                            <VStack align='start' spacing={2}>
                                <Heading 
                                    size={headingSize} 
                                    bgGradient='linear(135deg, #1f2937, #4b5563)'
                                    bgClip='text'
                                    fontWeight='800'
                                >
                                    Help & Support
                                </Heading>
                                <Text 
                                    fontSize='lg' 
                                    color='#6b7280' 
                                    fontWeight='500'
                                    maxW='600px'
                                >
                                    Find answers, resources, and support for your autism journey
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>
                </MotionBox>

                {/* Quick Links Section */}
                <Box mb={16}>
                    <Heading 
                        size='xl' 
                        mb={8} 
                        textAlign='center'
                        bgGradient='linear(135deg, #1f2937, #4b5563)'
                        bgClip='text'
                        fontWeight='700'
                    >
                        Quick Links
                    </Heading>
                    
                    <SimpleGrid 
                        columns={gridColumns} 
                        spacing={6}
                        w='100%'
                    >
                        {quickLinks.map((link, index) => (
                            <MotionCard
                                key={link.label}
                                as='a'
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                p={6}
                                borderRadius='20px'
                                bg='white'
                                boxShadow='0 4px 20px rgba(0, 0, 0, 0.08)'
                                border='1px solid rgba(0, 0, 0, 0.05)'
                                cursor='pointer'
                                _hover={{
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                                    borderColor: link.color
                                }}
                                transition='all 0.3s ease'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <CardBody>
                                    <VStack spacing={4} align='start'>
                                        <HStack spacing={4} align='center'>
                                            <Box
                                                p={3}
                                                borderRadius='12px'
                                                bg={link.bgColor}
                                            >
                                                <Icon as={link.icon} boxSize={6} color={link.color} />
                                            </Box>
                                            <VStack align='start' spacing={1}>
                                                <Text 
                                                    fontSize='lg' 
                                                    fontWeight='700' 
                                                    color='#1f2937'
                                                >
                                                    {link.label}
                                                </Text>
                                                <Text 
                                                    fontSize='sm' 
                                                    color='#6b7280'
                                                >
                                                    {link.description}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </MotionCard>
                        ))}
                    </SimpleGrid>
                </Box>

                {/* FAQ Section */}
                <Box>
                    <Heading 
                        size='xl' 
                        mb={8} 
                        textAlign='center'
                        bgGradient='linear(135deg, #1f2937, #4b5563)'
                        bgClip='text'
                        fontWeight='700'
                    >
                        Frequently Asked Questions
                    </Heading>
                    
                    <MotionBox
                        bg='white'
                        borderRadius='20px'
                        boxShadow='0 4px 20px rgba(0, 0, 0, 0.08)'
                        border='1px solid rgba(0, 0, 0, 0.05)'
                        overflow='hidden'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Accordion allowMultiple>
                            {faqData.map((faq, index) => (
                                <AccordionItem key={index} border='none'>
                                    <AccordionButton 
                                        p={6}
                                        _hover={{ bg: '#f9fafb' }}
                                        _expanded={{ bg: '#f3f4f6' }}
                                    >
                                        <Box flex='1' textAlign='left'>
                                            <Text 
                                                fontSize='lg' 
                                                fontWeight='600' 
                                                color='#1f2937'
                                            >
                                                {faq.question}
                                            </Text>
                                        </Box>
                                        <AccordionIcon color='#6b7280' />
                                    </AccordionButton>
                                    <AccordionPanel pb={6} px={6}>
                                        <Text 
                                            color='#6b7280' 
                                            lineHeight='1.6'
                                            fontSize='md'
                                        >
                                            {faq.answer}
                                        </Text>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </MotionBox>
                </Box>
            </Container>
        </Box>
    )
}