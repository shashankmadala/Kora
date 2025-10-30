import { 
    Box, VStack, HStack, Text, Heading, Button, SimpleGrid, 
    Card, CardBody, Icon, Badge, Container, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Image, Spinner, useToast, Input, InputGroup, InputLeftElement,
    Flex, Divider, Link as ChakraLink, ScaleFade
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    MapPin, Search, ExternalLink, Phone, Mail, Globe, 
    Heart, Brain, Users, BookOpen, Calendar, Clock,
    Star, Award, Navigation, Filter, SortAsc
} from 'lucide-react'

const MotionBox = motion(Box as any)
const MotionCard = motion(Card as any)

interface Resource {
    id: number
    name: string
    category: string
    zipCode?: string
    description: string
    address: string
    phone: string
    website: string
    tags: string[]
    rating?: number
    distance?: string
}

const categories = [
    { id: 'therapy', label: 'Therapy Centers', icon: Heart, color: '#ef4444' },
    { id: 'education', label: 'Specialized Schools', icon: BookOpen, color: '#3b82f6' },
    { id: 'support', label: 'Support & Advocacy', icon: Users, color: '#10b981' },
    { id: 'early', label: 'Early Intervention', icon: Calendar, color: '#f59e0b' }
]

const njResources: Resource[] = [
    {
        id: 1,
        name: 'Believe in Me Developmental Therapy Center',
        category: 'therapy',
        zipCode: '07869',
        description: 'Therapeutic preschool and developmental therapy services for children with autism.',
        address: 'Randolph, NJ',
        phone: '(973) 216-1008',
        website: 'https://believeinmetherapy.com',
        tags: ['ABA therapy', 'therapeutic preschool', 'developmental']
    },
    {
        id: 2,
        name: 'Proud Moments ABA – Teaneck Center',
        category: 'therapy',
        zipCode: '07666',
        description: 'Specialized ABA therapy clinic providing comprehensive behavioral intervention services.',
        address: 'Teaneck, NJ',
        phone: '551-363-3303',
        website: 'https://proudmomentsaba.com',
        tags: ['ABA therapy', 'behavioral intervention', 'autism']
    },
    {
        id: 3,
        name: 'Good Talking People',
        category: 'therapy',
        zipCode: '07666',
        description: 'Social skills therapy and communication support services for individuals with autism.',
        address: 'Teaneck, NJ',
        phone: '201-837-8371',
        website: 'https://njkidsonline.com',
        tags: ['social skills', 'communication', 'speech therapy']
    },
    {
        id: 4,
        name: 'The Therapy Gym',
        category: 'therapy',
        zipCode: '07666',
        description: 'Pediatric therapy center offering comprehensive therapy services.',
        address: 'Teaneck, NJ',
        phone: '201-357-0417',
        website: 'https://njkidsonline.com',
        tags: ['pediatric therapy', 'occupational therapy', 'physical therapy']
    },
    {
        id: 5,
        name: 'Achieve Beyond Pediatric Therapy',
        category: 'therapy',
        zipCode: '08837',
        description: 'Multi-site pediatric therapy provider offering comprehensive services.',
        address: 'Edison, NJ',
        phone: '(888) 261-1110',
        website: 'https://njkidsonline.com',
        tags: ['pediatric therapy', 'multi-site', 'comprehensive services']
    },
    {
        id: 6,
        name: 'New Direction ABA',
        category: 'therapy',
        zipCode: '07071',
        description: 'ABA services agency providing behavioral support and intervention.',
        address: 'Lyndhurst, NJ',
        phone: '201-577-1443',
        website: 'https://njkidsonline.com',
        tags: ['ABA services', 'behavioral support', 'intervention']
    },
    {
        id: 7,
        name: 'NeurAbilities Healthcare – Autism Center',
        category: 'therapy',
        zipCode: '08002',
        description: 'Autism center providing healthcare and therapy services.',
        address: 'Cherry Hill, NJ',
        phone: '856-346-0005',
        website: 'https://neurabilities.com',
        tags: ['autism center', 'healthcare', 'therapy services']
    },
    {
        id: 8,
        name: 'Kaleidoscope ABA Therapy Center',
        category: 'therapy',
        zipCode: '08619',
        description: 'ABA therapy center offering specialized behavioral intervention services.',
        address: 'Hamilton (Trenton), NJ',
        phone: '877-ABA-0399',
        website: 'https://kfsaba.org',
        tags: ['ABA therapy', 'behavioral intervention', 'autism']
    },
    {
        id: 25,
        name: 'Autism Learning Partners',
        category: 'therapy',
        zipCode: '07102',
        description: 'ABA therapy provider offering in-home and clinic-based services for individuals with autism.',
        address: 'Newark, NJ',
        phone: '(888) 805-0759',
        website: 'https://autismlearningpartners.com',
        tags: ['ABA therapy', 'in-home services', 'autism']
    },
    {
        id: 26,
        name: 'Bierman Autism Centers',
        category: 'therapy',
        zipCode: '07052',
        description: 'Therapy clinic providing comprehensive autism services and interventions.',
        address: 'West Orange, NJ',
        phone: '(908) 632-2068',
        website: 'https://biermanautism.com',
        tags: ['autism clinic', 'therapy services', 'comprehensive care']
    },
    {
        id: 27,
        name: 'Caldwell University Center for Autism & ABA',
        category: 'therapy',
        zipCode: '07006',
        description: 'Assessment and therapy center providing ABA services and autism evaluations.',
        address: 'Caldwell, NJ',
        phone: '(973) 618-3373',
        website: 'https://caldwell.edu',
        tags: ['assessment', 'ABA therapy', 'university-based']
    },
    {
        id: 28,
        name: 'Children\'s Specialized Hospital – Newark',
        category: 'therapy',
        zipCode: '07112',
        description: 'Pediatric outpatient center providing specialized therapy services for children with autism.',
        address: 'Newark, NJ',
        phone: '(973) 391-2960',
        website: 'https://www.childrens-specialized.org',
        tags: ['pediatric hospital', 'outpatient services', 'specialized care'],
        rating: 4.8
    },
    
    {
        id: 9,
        name: 'The Arc of New Jersey',
        category: 'support',
        zipCode: '08902',
        description: 'Statewide advocacy organization providing support and resources for individuals with disabilities and their families.',
        address: 'North Brunswick, NJ',
        phone: '732-246-2525',
        website: 'https://arcnj.org',
        tags: ['advocacy', 'statewide', 'disability support']
    },
    {
        id: 10,
        name: 'Autism New Jersey',
        category: 'support',
        zipCode: '08691',
        description: 'Helpline and resource center providing support and information for autism families.',
        address: 'Robbinsville, NJ',
        phone: '800-4-AUTISM',
        website: 'https://njkidsonline.com',
        tags: ['helpline', 'resources', 'family support']
    },
    {
        id: 11,
        name: 'POAC Autism Services',
        category: 'support',
        zipCode: '08724',
        description: 'Parents of Autistic Children organization providing support and advocacy.',
        address: 'Brick, NJ',
        phone: '732-785-1099',
        website: 'https://poac.net',
        tags: ['parent organization', 'advocacy', 'support services']
    },
    {
        id: 12,
        name: 'Autism Family Services of NJ',
        category: 'support',
        zipCode: '08520',
        description: 'Family Resource Network providing support and services for autism families.',
        address: 'East Windsor, NJ',
        phone: '800-372-6510',
        website: 'https://familyresourcenetwork.org',
        tags: ['family services', 'resource network', 'support']
    },
    {
        id: 13,
        name: 'Easterseals New Jersey',
        category: 'support',
        zipCode: '08831',
        description: 'Adult and family support services for individuals with disabilities.',
        address: 'Jamesburg, NJ',
        phone: '732-257-6662',
        website: 'https://nj.easterseals.com',
        tags: ['adult services', 'family support', 'disabilities']
    },
    {
        id: 14,
        name: 'ASPEN (Asperger/Autism Educational Network)',
        category: 'support',
        zipCode: '08820',
        description: 'Educational network providing support for Asperger and autism communities.',
        address: 'Edison, NJ',
        phone: '732-321-0880',
        website: 'https://nidcd.nih.gov',
        tags: ['educational network', 'Asperger support', 'autism support']
    },
    {
        id: 15,
        name: 'Eden Autism',
        category: 'support',
        zipCode: '08540',
        description: 'Lifespan services and support providing comprehensive programs for individuals with autism throughout their lives.',
        address: 'Princeton, NJ',
        phone: '609-987-0099',
        website: 'https://edenautism.org',
        tags: ['lifespan services', 'comprehensive support', 'autism programs']
    },
    {
        id: 29,
        name: 'Nassan\'s Place',
        category: 'support',
        zipCode: '07019',
        description: 'Autism family support non-profit providing resources and support for families affected by autism.',
        address: 'East Orange, NJ',
        phone: '(973) 424-7781',
        website: 'https://nassansplace.org',
        tags: ['family support', 'non-profit', 'autism resources']
    },
    {
        id: 30,
        name: 'Family Support Organization of Essex County',
        category: 'support',
        zipCode: '07018',
        description: 'Parent and caregiver support organization providing services and resources for families.',
        address: 'East Orange, NJ',
        phone: '(973) 395-1595',
        website: 'https://fsoec.org',
        tags: ['parent support', 'caregiver support', 'family services']
    },
    {
        id: 31,
        name: 'SPAN Parent Advocacy Network',
        category: 'support',
        zipCode: '07102',
        description: 'Special needs advocacy organization providing support and resources for families of children with disabilities.',
        address: 'Newark, NJ',
        phone: '(973) 642-8100',
        website: 'https://spanadvocacy.org',
        tags: ['parent advocacy', 'special needs', 'support services']
    },
    {
        id: 32,
        name: 'JVS – Jewish Vocational Service of MetroWest',
        category: 'support',
        zipCode: '07017',
        description: 'Job training and vocational services for adults with autism spectrum disorders.',
        address: 'East Orange, NJ',
        phone: '(973) 674-6330',
        website: 'https://jvsmetrowest.org',
        tags: ['vocational training', 'adult services', 'job placement']
    },
    
    {
        id: 16,
        name: 'Alpine Learning Group',
        category: 'education',
        zipCode: '07652',
        description: 'ABA-based school and program providing specialized education for students with autism.',
        address: 'Paramus, NJ',
        phone: '(201) 612-7710',
        website: 'https://njkidsonline.com',
        tags: ['ABA school', 'specialized education', 'autism program']
    },
    {
        id: 17,
        name: 'The Phoenix Center',
        category: 'education',
        zipCode: '07110',
        description: 'Special needs school providing education and support for children with disabilities.',
        address: 'Nutley, NJ',
        phone: '(973) 542-0743',
        website: 'https://njkidsonline.com',
        tags: ['special needs', 'education', 'disability support']
    },
    {
        id: 18,
        name: 'The Forum School',
        category: 'education',
        zipCode: '07463',
        description: 'Autism-focused school providing specialized education and support services.',
        address: 'Wyckoff, NJ',
        phone: '201-445-5882',
        website: 'https://njkidsonline.com',
        tags: ['autism school', 'specialized education', 'support services']
    },
    {
        id: 19,
        name: 'The Bancroft School (Welsh Campus)',
        category: 'education',
        zipCode: '08054',
        description: 'Private school providing specialized education for students with developmental disabilities.',
        address: 'Mount Laurel, NJ',
        phone: '856-429-0010',
        website: 'https://school.bancroft.org',
        tags: ['private school', 'developmental disabilities', 'specialized education']
    },
    {
        id: 20,
        name: 'Princeton Child Development Institute (PCDI)',
        category: 'education',
        zipCode: '08540',
        description: 'Private school and research institute providing evidence-based education for children with autism.',
        address: 'Princeton, NJ',
        phone: '609-924-6280',
        website: 'https://pcdi.org',
        tags: ['research institute', 'evidence-based', 'autism education']
    },
    {
        id: 33,
        name: 'Branch Brook School',
        category: 'education',
        zipCode: '07104',
        description: 'Newark Public Schools autism program serving students Pre-K through Grade 3.',
        address: 'Newark, NJ',
        phone: '(973) 268-5112',
        website: 'https://www.newarkschools.org',
        tags: ['public school', 'autism program', 'Pre-K to 3']
    },
    {
        id: 34,
        name: 'NJ Regional Day School – Newark',
        category: 'education',
        zipCode: '07112',
        description: 'Autism-focused K-12 public school providing specialized education for students with autism.',
        address: 'Newark, NJ',
        phone: '(973) 705-3820',
        website: 'https://www.njrsd.org',
        tags: ['public school', 'autism-focused', 'K-12']
    },
    {
        id: 35,
        name: 'Academy360 Lower School',
        category: 'education',
        zipCode: '07044',
        description: 'Private special education school serving students with autism ages 3-21 through Spectrum360.',
        address: 'Verona, NJ',
        phone: '(973) 509-3050',
        website: 'https://spectrum360.org',
        tags: ['private school', 'special education', 'ages 3-21']
    },
    {
        id: 36,
        name: 'Garden Academy',
        category: 'education',
        zipCode: '07052',
        description: 'Non-profit ABA school providing specialized education and therapy for students with autism.',
        address: 'West Orange, NJ',
        phone: '(973) 731-2030',
        website: 'https://gardenacademy.org',
        tags: ['non-profit', 'ABA school', 'autism education'],
        rating: 4.3
    },
    {
        id: 37,
        name: 'Mt. Carmel Guild Academy',
        category: 'education',
        zipCode: '07052',
        description: 'Catholic Charities special education school providing comprehensive programs for students with autism.',
        address: 'West Orange, NJ',
        phone: '(973) 325-4400',
        website: 'https://catholiccharitiesusa.org',
        tags: ['private school', 'special education', 'Catholic Charities']
    },
    {
        id: 38,
        name: 'Deron School of New Jersey (Montclair Campus)',
        category: 'education',
        zipCode: '07042',
        description: 'Private special education school providing individualized programs for students with autism.',
        address: 'Montclair, NJ',
        phone: '(973) 509-2777',
        website: 'https://deronschool.org',
        tags: ['private school', 'special education', 'Montclair']
    },
    {
        id: 39,
        name: 'YCS Sawtelle Learning Center',
        category: 'education',
        zipCode: '07042',
        description: 'Autism spectrum school providing specialized education and support services.',
        address: 'Montclair, NJ',
        phone: '(973) 744-0615',
        website: 'https://ycs.org',
        tags: ['autism school', 'specialized education', 'support services']
    },
    {
        id: 40,
        name: 'Lakeside School',
        category: 'education',
        zipCode: '07050',
        description: 'Autism program serving students ages 14-21 with specialized education and life skills training.',
        address: 'Orange, NJ',
        phone: '(973) 678-7778',
        website: 'https://lakesideschool-nj.org',
        tags: ['autism program', 'ages 14-21', 'life skills']
    },
    {
        id: 41,
        name: 'Irvington Special Services Autism Programs',
        category: 'education',
        zipCode: '07111',
        description: 'Public school district autism programs providing specialized services for students with autism.',
        address: 'Irvington, NJ',
        phone: '(973) 399-6810',
        website: 'https://www.irvingtonschools.org',
        tags: ['public school district', 'autism programs', 'special services']
    },
    {
        id: 42,
        name: 'The Center for Autism',
        category: 'education',
        zipCode: '07107',
        description: 'Adult day program providing services and support for adults with autism.',
        address: 'Newark, NJ',
        phone: '(973) 732-9301',
        website: 'https://thecenterforautism.org',
        tags: ['adult day program', 'adult services', 'Newark']
    },
    
    {
        id: 21,
        name: 'Northeast NJ Early Intervention – Helpful Hands REIC',
        category: 'early',
        zipCode: '07470',
        description: 'Regional Early Intervention Collaborative (REIC) serving infants and toddlers up to age 3 in Bergen, Hudson, and Passaic counties.',
        address: 'Wayne, NJ',
        phone: '973-256-8484',
        website: 'https://nreic.org',
        tags: ['early intervention', 'regional program', 'infants & toddlers']
    },
    {
        id: 22,
        name: 'Mid-Jersey CARES Early Intervention REIC',
        category: 'early',
        zipCode: '08902',
        description: 'Regional Early Intervention Collaborative (REIC) serving infants and toddlers up to age 3 in Central New Jersey.',
        address: 'North Brunswick, NJ',
        phone: '732-937-5437',
        website: 'https://birthtofivenavigator.org',
        tags: ['early intervention', 'central NJ', 'infants & toddlers']
    },
    {
        id: 23,
        name: 'Family Link Early Intervention REIC',
        category: 'early',
        zipCode: '07083',
        description: 'Regional Early Intervention Collaborative (REIC) serving infants and toddlers up to age 3 in Essex, Morris, and Union counties.',
        address: 'Union, NJ',
        phone: '908-964-5303',
        website: 'https://childcareconnection-nj.org',
        tags: ['early intervention', 'regional program', 'infants & toddlers']
    },
    {
        id: 24,
        name: 'Southern NJ Early Intervention REIC',
        category: 'early',
        zipCode: '08009',
        description: 'Regional Early Intervention Collaborative (REIC) serving infants and toddlers up to age 3 in South Jersey.',
        address: 'Berlin, NJ',
        phone: '856-768-6747',
        website: 'https://www.state.nj.us/humanservices',
        tags: ['early intervention', 'south jersey', 'regional program']
    },
    {
        id: 43,
        name: 'Rutgers NJMS Early Intervention Program',
        category: 'early',
        zipCode: '07103',
        description: 'Early intervention evaluations and services for children in Essex County through Rutgers New Jersey Medical School.',
        address: 'Newark, NJ',
        phone: '(973) 972-8187',
        website: 'https://njms.rutgers.edu',
        tags: ['early intervention', 'evaluations', 'Essex County']
    },
    {
        id: 44,
        name: 'Ben Samuels Children\'s Center (Montclair State University)',
        category: 'early',
        zipCode: '07043',
        description: 'Early intervention program providing services and support for infants and toddlers with developmental needs.',
        address: 'Montclair, NJ',
        phone: '(973) 655-7366',
        website: 'https://www.montclair.edu',
        tags: ['early intervention', 'university-based', 'Montclair State']
    }
]

export default function ResourcesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredResources, setFilteredResources] = useState(njResources)
    const [selectedResource, setSelectedResource] = useState<any>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    useEffect(() => {
        let filtered = njResources

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(resource => resource.category === selectedCategory)
        }

        if (searchQuery) {
            filtered = filtered.filter(resource => 
                resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                resource.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.zipCode?.includes(searchQuery)
            )
        }

        setFilteredResources(filtered)
    }, [selectedCategory, searchQuery])

    const handleResourceClick = (resource: any) => {
        setSelectedResource(resource)
        onOpen()
    }

    const handleCallResource = (phone: string) => {
        window.open(`tel:${phone}`, '_self')
    }

    const handleVisitWebsite = (website: string) => {
        window.open(website, '_blank', 'noopener,noreferrer')
    }

    return (
        <Container maxW='6xl' py={6} px={4} pb={10}>
            <VStack spacing={6} align='stretch'>
                {/* Header */}
                <VStack spacing={3} textAlign='center'>
                    <Heading size='2xl' color='#1f2937' fontWeight='700'>
                        Autism Support Resources
                            </Heading>
                    <Text fontSize='lg' color='#6b7280' maxW='3xl'>
                        Discover comprehensive autism support services across New Jersey. 
                        Find therapy centers, schools, advocacy groups, and early intervention programs near you.
                    </Text>
                </VStack>

                {/* Search and Filter */}
                <VStack spacing={4} w='full'>
                    {/* Search Bar */}
                    <InputGroup size='lg' maxW='2xl' mx='auto'>
                            <InputLeftElement pointerEvents='none'>
                            <Icon as={Search} color='#9ca3af' />
                            </InputLeftElement>
                            <Input
                            placeholder='Search by name, service, location, or zip code...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                bg='white'
                                border='2px solid #e5e7eb'
                            borderRadius='12px'
                            fontSize='md'
                            _hover={{ borderColor: '#9ca3af' }}
                            _focus={{ borderColor: '#8b5cf6', boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)' }}
                            />
                        </InputGroup>

                    {/* Category Filters */}
                    <HStack spacing={4} wrap='wrap' justify='center'>
                        <Button
                            key='all'
                            size='md'
                            variant={selectedCategory === 'all' ? 'solid' : 'outline'}
                            colorScheme={selectedCategory === 'all' ? 'purple' : 'gray'}
                            borderRadius='full'
                            onClick={() => setSelectedCategory('all')}
                            leftIcon={<Icon as={Filter} boxSize={4} />}
                        >
                            All Resources
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                size='md'
                                variant={selectedCategory === category.id ? 'solid' : 'outline'}
                                colorScheme={selectedCategory === category.id ? 'purple' : 'gray'}
                                borderRadius='full'
                                onClick={() => setSelectedCategory(category.id)}
                                leftIcon={<Icon as={category.icon} boxSize={4} />}
                            >
                                {category.label}
                            </Button>
                        ))}
                    </HStack>
                </VStack>

                {/* Results Summary */}
                <HStack justify='space-between' align='center' px={2} mb={4}>
                    <Text color='#6b7280' fontSize='sm'>
                        Showing {filteredResources.length} of {njResources.length} resources
                        {selectedCategory !== 'all' && (
                            <Text as='span' ml={1}>
                                in {categories.find(c => c.id === selectedCategory)?.label}
                            </Text>
                        )}
                    </Text>
                        </HStack>

                {/* Resources Grid */}
                {isLoading ? (
                    <VStack spacing={4} py={12}>
                        <Spinner size='xl' color='#8b5cf6' thickness='3px' />
                        <Text color='#6b7280'>Loading resources...</Text>
                    </VStack>
                ) : filteredResources.length === 0 ? (
                    <VStack spacing={4} py={12}>
                        <Icon as={Search} boxSize={16} color='#d1d5db' />
                        <VStack spacing={2}>
                            <Heading size='md' color='#6b7280'>
                                No resources found
                            </Heading>
                            <Text color='#9ca3af' textAlign='center'>
                                Try adjusting your search or filter criteria
                            </Text>
                        </VStack>
                    </VStack>
                ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {filteredResources.map((resource, index) => {
                            const category = categories.find(c => c.id === resource.category)
                            
                            return (
                                <ScaleFade key={resource.id} in={true} initialScale={0.8}>
                            <MotionCard
                                        cursor='pointer'
                                        onClick={() => handleResourceClick(resource)}
                                bg='white'
                                borderRadius='16px'
                                        overflow='hidden'
                                        boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'
                                        border='1px solid #f3f4f6'
                                        transition={{ duration: 0.3, ease: 'ease' }}
                                _hover={{
                                    transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                                            borderColor: '#e5e7eb'
                                        }}
                                        h='full'
                                    >
                                        <CardBody p={6}>
                                            <VStack align='stretch' spacing={4} h='full'>
                                                {/* Header */}
                                                <VStack align='stretch' spacing={3}>
                                                    <HStack justify='space-between' align='start'>
                                                        <Badge
                                                            colorScheme='purple'
                                                            variant='subtle'
                                                            px={3}
                                                            py={1}
                                                            borderRadius='full'
                                                            fontSize='xs'
                                                            fontWeight='600'
                                                        >
                                                            <HStack spacing={1}>
                                                                <Icon as={category?.icon} boxSize={3} />
                                                                <Text>{category?.label}</Text>
                                            </HStack>
                                                        </Badge>
                                                        {resource.rating && (
                                            <HStack spacing={1}>
                                                <Icon as={Star} boxSize={4} color='#f59e0b' />
                                                <Text fontSize='sm' fontWeight='600' color='#1f2937'>
                                                    {resource.rating}
                                                </Text>
                                            </HStack>
                                                        )}
                                        </HStack>

                                                    <Heading size='md' color='#1f2937' fontWeight='600' lineHeight='1.3'>
                                                        {resource.name}
                                                    </Heading>
                                                </VStack>

                                                {/* Description */}
                                                <Text 
                                                    color='#6b7280' 
                                                    fontSize='sm' 
                                                    lineHeight='1.5'
                                                    flex='1'
                                                    noOfLines={3}
                                                >
                                            {resource.description}
                                        </Text>

                                                {/* Location */}
                                                <HStack spacing={2} color='#9ca3af'>
                                                    <Icon as={MapPin} boxSize={4} />
                                                    <Text fontSize='sm'>
                                                        {resource.distance || `${resource.address}, ${resource.zipCode}`}
                                                    </Text>
                                                </HStack>

                                                {/* Tags */}
                                                <HStack spacing={2} wrap='wrap'>
                                            {resource.tags.slice(0, 2).map((tag, tagIndex) => (
                                                <Badge 
                                                    key={tagIndex}
                                                            variant='outline'
                                                            colorScheme='gray'
                                                    fontSize='xs'
                                                            px={2}
                                                            py={1}
                                                            borderRadius='md'
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {resource.tags.length > 2 && (
                                                        <Text fontSize='xs' color='#9ca3af'>
                                                            +{resource.tags.length - 2} more
                                                        </Text>
                                            )}
                                        </HStack>

                                                {/* Action Buttons */}
                                                <HStack spacing={2} pt={2}>
                                        <Button
                                            size='sm'
                                            colorScheme='purple'
                                            variant='outline'
                                                        flex='1'
                                                        leftIcon={<Icon as={Phone} boxSize={4} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleCallResource(resource.phone)
                                                        }}
                                                    >
                                                        Call
                                                    </Button>
                                                    <Button
                                                        size='sm'
                                                        colorScheme='purple'
                                                        flex='1'
                                                        leftIcon={<Icon as={ExternalLink} boxSize={4} />}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleVisitWebsite(resource.website)
                                                        }}
                                                    >
                                                        Visit
                                        </Button>
                                                </HStack>
                                    </VStack>
                                </CardBody>
                            </MotionCard>
                                </ScaleFade>
                            )
                        })}
                </SimpleGrid>
                )}
            </VStack>

            {/* Resource Detail Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered>
                <ModalOverlay bg='blackAlpha.600' backdropFilter='blur(4px)' />
                <ModalContent borderRadius='20px' mx={4}>
                    <ModalHeader pb={4}>
                        <VStack align='stretch' spacing={3}>
                            <HStack justify='space-between' align='start'>
                                        <Badge 
                                    colorScheme='purple'
                                    variant='subtle'
                                            px={3} 
                                            py={1} 
                                            borderRadius='full' 
                                    fontSize='xs'
                                            fontWeight='600'
                                        >
                                    {categories.find(c => c.id === selectedResource?.category)?.label}
                                        </Badge>
                                {selectedResource?.rating && (
                                        <HStack spacing={1}>
                                            <Icon as={Star} boxSize={4} color='#f59e0b' />
                                        <Text fontSize='sm' fontWeight='600'>
                                            {selectedResource.rating}
                                        </Text>
                                    </HStack>
                                )}
                            </HStack>
                            <Heading size='lg' color='#1f2937'>
                                {selectedResource?.name}
                            </Heading>
                                </VStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack align='stretch' spacing={6}>
                            {/* Description */}
                            <Text color='#6b7280' lineHeight='1.6'>
                                {selectedResource?.description}
                                    </Text>
                                    
                            {/* Contact Information */}
                            <VStack align='stretch' spacing={4}>
                                <Heading size='sm' color='#1f2937'>
                                    Contact Information
                                </Heading>
                                
                                <VStack align='stretch' spacing={3}>
                                        <HStack spacing={3}>
                                            <Icon as={MapPin} boxSize={5} color='#6b7280' />
                                        <Text>
                                            {selectedResource?.distance || `${selectedResource?.address}, ${selectedResource?.zipCode}`}
                                            </Text>
                                        </HStack>
                                        
                                        <HStack spacing={3}>
                                            <Icon as={Phone} boxSize={5} color='#6b7280' />
                                            <ChakraLink 
                                            href={`tel:${selectedResource?.phone}`}
                                            color='#8b5cf6'
                                            fontWeight='500'
                                                _hover={{ textDecoration: 'underline' }}
                                            >
                                            {selectedResource?.phone}
                                            </ChakraLink>
                                        </HStack>
                                        
                                        <HStack spacing={3}>
                                            <Icon as={Globe} boxSize={5} color='#6b7280' />
                                            <ChakraLink 
                                            href={selectedResource?.website}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            color='#8b5cf6'
                                            fontWeight='500'
                                                _hover={{ textDecoration: 'underline' }}
                                            >
                                                Visit Website
                                            </ChakraLink>
                                        </HStack>
                                    </VStack>
                                </VStack>

                            {/* Services/Tags */}
                            <VStack align='stretch' spacing={3}>
                                <Heading size='sm' color='#1f2937'>
                                    Services & Specialties
                                </Heading>
                                <HStack spacing={2} wrap='wrap'>
                                    {selectedResource?.tags.map((tag: string, index: number) => (
                                            <Badge 
                                                key={index}
                                            variant='outline'
                                                colorScheme='purple'
                                            fontSize='sm'
                                            px={3}
                                            py={1}
                                            borderRadius='md'
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </HStack>
                                </VStack>

                            {/* Action Buttons */}
                                <HStack spacing={4} pt={4}>
                                    <Button
                                        colorScheme='purple'
                                    flex='1'
                                        leftIcon={<Icon as={Phone} boxSize={4} />}
                                    onClick={() => handleCallResource(selectedResource?.phone)}
                                    >
                                        Call Now
                                    </Button>
                                <Button
                                    colorScheme='purple'
                                    variant='outline'
                                    flex='1'
                                    leftIcon={<Icon as={ExternalLink} boxSize={4} />}
                                    onClick={() => handleVisitWebsite(selectedResource?.website)}
                                >
                                    Visit Website
                                    </Button>
                                </HStack>
                            </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    )
}