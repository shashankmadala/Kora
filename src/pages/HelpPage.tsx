import { Box, Heading, Text, VStack, Select, SimpleGrid, Container, Accordion, AccordionItem, AccordionButton, AccordionPanel, useBreakpointValue, AccordionIcon, ScaleFade } from '@chakra-ui/react'
import ArticlePreview from '../components/ArticlePreview'

const quickLinks: { label: string; url: string }[] = [
    { label: 'Autism Symptoms', url: 'https://www.cdc.gov/autism/signs-symptoms/index.html' },
    { label: 'Treatment Options', url: 'https://autismsciencefoundation.org/treatment-options/' },
    // { label: 'Support Groups', url: '#' },
    { label: 'Educational Resources', url: 'https://researchautism.org/educators/educator-resources/' },
]

const articles = [
    {
        title: "Autism Spectrum Disorders (ASD)",
        description: "An easy-to-understand guide to autism spectrum disorders, including common symptoms.",
        url: "https://www.helpguide.org/mental-health/autism/autism-spectrum-disorders"
    },
    {
        title: "Signs of Autism in Children",
        description: "Learn about the early signs of autism spectrum disorder including signs of autism in babies, signs of autism in toddlers, when autism is diagnosed and more.",
        url: "https://www.autismspeaks.org/signs-autism"
    },
    {
        title: "Autism and Social Skills Development",
        description: "Click here to read an excerpt on autism and social skills development from the Autism Speaks School Community Tool Kit.",
        url: "https://www.autismspeaks.org/tool-kit-excerpt/autism-and-social-skills-development"
    },
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

    return (
        <ScaleFade initialScale={0.9} in={true}>
            <Box minHeight='100vh'>
                <Container maxW='container.xl' pt={20} mb={8}>
                    <VStack spacing={8} align='stretch'>
                        <Box position='relative' color='white' py={8} px={4} borderRadius='xl' boxShadow='xl' textAlign='center' overflow='hidden' display='flex' alignItems='center' justifyContent='center'>
                            <Box position='absolute' top={0} left={0} right={0} bottom={0} bgGradient='linear-gradient(to top, #d799f7, #a699f7, #3f5fe0)' zIndex={1} />
                            <VStack spacing={4} position='relative' zIndex={2}>
                                <Heading size={headingSize}>Need Some Help?</Heading>
                                <Text fontSize='md' maxW='xl' mx='auto'>
                                    Kora is here to support you on your journey with autism understanding and care.
                                </Text>
                            </VStack>
                        </Box>


                        <Box>
                            <Heading size='lg' mb={4}>Quick Links</Heading>
                            <Select placeholder='Select a resource' bg='white' onChange={(e) => window.open(e.target.value, '_blank')} size='lg'>
                                {quickLinks.map((link, index) => (
                                    <option key={index} value={link.url}>
                                        {link.label}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <Heading as='h2' size='lg' mb={4}>Learn More</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                                {articles.map((article, index) => (
                                    <ArticlePreview {...article} key={index} />
                                ))}
                            </SimpleGrid>
                        </Box>

                        <Box mb={12}>
                            <Heading as='h2' size='lg' textAlign='center' mb={4}>Frequently Asked Questions</Heading>
                            <Accordion allowMultiple>
                                {faqData.map((item, index) => (
                                    <AccordionItem key={index} border='none'>
                                        <AccordionButton bg='white' p={4}>
                                            <Text textAlign='left' fontWeight='semibold'>
                                                {item.question}
                                            </Text>

                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4} pt={2} px={4}>
                                            {item.answer}
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </ScaleFade>
    )
}