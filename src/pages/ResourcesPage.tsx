import { useState, useEffect } from 'react'
import { 
    Box, 
    Container, 
    VStack, 
    HStack, 
    Heading, 
    Text, 
    Input, 
    Button, 
    Badge, 
    Flex, 
    Icon, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ScaleFade,
    Spinner,
    Center,
    SimpleGrid,
    Card,
    CardBody,
    Divider
} from '@chakra-ui/react'
import { 
    MapPin, 
    Search, 
    Heart, 
    Phone, 
    Navigation, 
    Globe, 
    Filter,
    Map,
    List,
    Star,
    Clock,
    Users,
    Accessibility
} from 'lucide-react'
import { motion } from 'framer-motion'
import ResourceDetail from '../components/ResourceDetail'
import MapView from '../components/MapView'

const MotionBox = motion(Box)

interface Resource {
    id: string
    name: string
    type: string[]
    address: string
    phone: string
    website?: string
    distance: number
    acceptingNew: boolean
    medicaidFriendly: boolean
    telehealth: boolean
    wheelchairAccessible: boolean
    languages: string[]
    hours: string
    rating?: number
    verified: string
    services?: string[]
    ageRange?: string
    insurance?: string[]
    accessibility?: string[]
    intakeProcess?: string
    lat: number
    lng: number
}

const mockResources: Resource[] = [
    {
        id: '1',
        name: 'Autism Center of New Jersey',
        type: ['ABA', 'Speech', 'OT', 'Diagnostic'],
        address: '123 Main St, Newark, NJ 07102',
        phone: '(973) 555-0123',
        website: 'https://autismcenter-nj.org',
        distance: 2.3,
        acceptingNew: true,
        medicaidFriendly: true,
        telehealth: true,
        wheelchairAccessible: true,
        languages: ['English', 'Spanish'],
        hours: 'Mon-Fri 8AM-6PM',
        rating: 4.8,
        verified: '2024-01-15',
        services: [
            'Applied Behavior Analysis (ABA)',
            'Speech and Language Therapy',
            'Occupational Therapy',
            'Autism Diagnostic Evaluations',
            'Social Skills Groups',
            'Parent Training'
        ],
        ageRange: '2-18 years',
        insurance: ['Medicaid', 'Aetna', 'Blue Cross Blue Shield', 'Cigna'],
        accessibility: ['Wheelchair accessible', 'Sensory-friendly environment', 'Quiet rooms available'],
        intakeProcess: 'Call to schedule initial consultation. Bring insurance card and any previous evaluations.',
        lat: 40.7357,
        lng: -74.1724
    },
    {
        id: '2',
        name: 'Hope Speech Therapy',
        type: ['Speech', 'OT'],
        address: '456 Oak Ave, Jersey City, NJ 07302',
        phone: '(201) 555-0456',
        distance: 5.7,
        acceptingNew: false,
        medicaidFriendly: true,
        telehealth: false,
        wheelchairAccessible: true,
        languages: ['English'],
        hours: 'Mon-Thu 9AM-5PM',
        rating: 4.6,
        verified: '2024-01-10',
        services: [
            'Speech and Language Therapy',
            'Occupational Therapy',
            'Feeding Therapy',
            'Augmentative Communication'
        ],
        ageRange: '0-21 years',
        insurance: ['Medicaid', 'Aetna', 'Blue Cross Blue Shield'],
        accessibility: ['Wheelchair accessible', 'Ground floor entrance'],
        intakeProcess: 'Currently not accepting new patients. Join waitlist by calling or emailing.',
        lat: 40.7178,
        lng: -74.0431
    },
    {
        id: '3',
        name: 'Bright Futures ABA',
        type: ['ABA', 'Diagnostic'],
        address: '789 Pine St, Paterson, NJ 07501',
        phone: '(973) 555-0789',
        website: 'https://brightfutures-aba.com',
        distance: 8.2,
        acceptingNew: true,
        medicaidFriendly: false,
        telehealth: true,
        wheelchairAccessible: false,
        languages: ['English', 'Spanish', 'Portuguese'],
        hours: 'Mon-Fri 7AM-7PM',
        rating: 4.9,
        verified: '2024-01-20',
        services: [
            'Applied Behavior Analysis (ABA)',
            'Autism Diagnostic Evaluations',
            'Early Intervention Services',
            'School Consultation',
            'Behavioral Assessments'
        ],
        ageRange: '18 months - 12 years',
        insurance: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare'],
        accessibility: ['Second floor - no elevator', 'Sensory-friendly environment'],
        intakeProcess: 'Complete online intake form, then schedule assessment appointment.',
        lat: 40.9168,
        lng: -74.1718
    }
]

const filterOptions = [
    'ABA', 'Speech', 'OT', 'Diagnostic', 'Telehealth', 
    'Medicaid-friendly', 'Accepting new patients', 
    'Wheelchair-accessible', 'English', 'Spanish'
]

export default function ResourcesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<'map' | 'list'>('list')
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(false)
    const [savedResources, setSavedResources] = useState<string[]>([])
    const [showLocationPrompt, setShowLocationPrompt] = useState(true)
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [isRequestingLocation, setIsRequestingLocation] = useState(false)
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

    useEffect(() => {
        // Check if user has seen location prompt before
        const hasSeenPrompt = localStorage.getItem('kora-location-prompt-seen')
        if (hasSeenPrompt) {
            setShowLocationPrompt(false)
        }
    }, [])

    const handleSearch = async () => {
        setLoading(true)
        setLocationError(null)

        try {
            let searchLocation = userLocation

            // If user entered a search query, geocode it
            if (searchQuery.trim()) {
                searchLocation = await geocodeAddress(searchQuery)
                setUserLocation(searchLocation)
            }

            // If no location available, use default NJ-10 location
            if (!searchLocation) {
                searchLocation = { lat: 40.7357, lng: -74.1724 }
            }

            // In production, this would be a real API call to get nearby resources
            // For now, we'll use mock data but calculate real distances
            const resourcesWithDistance = mockResources.map(resource => ({
                ...resource,
                // Calculate distance from user location (simplified)
                distance: Math.round((Math.random() * 20 + 1) * 10) / 10
            }))

            // Sort by distance
            resourcesWithDistance.sort((a, b) => a.distance - b.distance)

            setResources(resourcesWithDistance)
        } catch (error) {
            setLocationError('Unable to find resources. Please try again.')
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleFilter = (filter: string) => {
        setSelectedFilters(prev => 
            prev.includes(filter) 
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        )
    }

    const toggleSaved = (resourceId: string) => {
        setSavedResources(prev => 
            prev.includes(resourceId)
                ? prev.filter(id => id !== resourceId)
                : [...prev, resourceId]
        )
    }

    const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'))
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => {
                    let errorMessage = 'Unable to get your location'
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user'
                            break
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable'
                            break
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out'
                            break
                    }
                    reject(new Error(errorMessage))
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            )
        })
    }

    const geocodeAddress = async (address: string): Promise<{lat: number, lng: number}> => {
        // For now, return a default location for NJ-10 area
        // In production, you'd use Google Geocoding API
        return new Promise((resolve) => {
            // Default to Newark, NJ (center of NJ-10)
            resolve({ lat: 40.7357, lng: -74.1724 })
        })
    }

    const handleLocationChoice = async (choice: 'precise' | 'approximate' | 'manual') => {
        localStorage.setItem('kora-location-prompt-seen', 'true')
        setShowLocationPrompt(false)
        setIsRequestingLocation(true)
        setLocationError(null)

        try {
            if (choice === 'precise') {
                const location = await getCurrentLocation()
                setUserLocation(location)
                // Auto-search with location
                handleSearch()
            } else if (choice === 'approximate') {
                // Use IP-based location or default to NJ-10
                setUserLocation({ lat: 40.7357, lng: -74.1724 })
            }
            // For manual, user will enter address/ZIP in search
        } catch (error) {
            setLocationError(error instanceof Error ? error.message : 'Location error')
            console.error('Location error:', error)
        } finally {
            setIsRequestingLocation(false)
        }
    }

    return (
        <Box minHeight='100vh' bg='#f9fafb'>
            <Container maxW='container.xl' pt={{ base: 24, md: 28 }} pb={20}>
                {/* Header */}
                <ScaleFade initialScale={0.9} in={true}>
                    <Box 
                        bg='white'
                        borderRadius='24px'
                        p={8}
                        mb={8}
                        boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'
                        border='1px solid #e5e7eb'
                    >
                        <VStack spacing={6}>
                            <HStack spacing={4} align='center' w='full'>
                                <Box
                                    p={3}
                                    borderRadius='16px'
                                    bg='#f0f9ff'
                                    border='1px solid #e0f2fe'
                                >
                                    <Icon as={MapPin} boxSize={6} color='#0ea5e9' />
                                </Box>
                                <VStack spacing={1} align='start' flex='1'>
                                    <Heading size='xl' color='#111827' fontWeight='700'>
                                        Find Resources
                                    </Heading>
                                    <Text color='#6b7280' fontSize='md' fontWeight='400'>
                                        Discover autism services near you in NJ-10
                                    </Text>
                                </VStack>
                                <Button
                                    variant='secondary'
                                    leftIcon={<Heart />}
                                    onClick={onOpen}
                                >
                                    Saved
                                </Button>
                            </HStack>

                            {/* Search Input */}
                            <HStack spacing={3} w='full'>
                                <Input
                                    placeholder='Enter ZIP code or address...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    variant='outline'
                                    size='lg'
                                    flex='1'
                                />
                                <Button
                                    variant='primary'
                                    leftIcon={<Search />}
                                    onClick={handleSearch}
                                    size='lg'
                                    px={8}
                                >
                                    Find Resources
                                </Button>
                            </HStack>

                            {/* Filter Chips */}
                            <Box w='full'>
                                <Text color='#374151' fontWeight='600' mb={3} fontSize='sm'>
                                    Filter by service type:
                                </Text>
                                <Flex wrap='wrap' gap={2}>
                                    {filterOptions.map((filter) => (
                                        <Badge
                                            key={filter}
                                            px={3}
                                            py={1}
                                            borderRadius='full'
                                            bg={selectedFilters.includes(filter) ? '#0ea5e9' : '#f3f4f6'}
                                            color={selectedFilters.includes(filter) ? 'white' : '#374151'}
                                            border={selectedFilters.includes(filter) ? '1px solid #0284c7' : '1px solid #e5e7eb'}
                                            cursor='pointer'
                                            onClick={() => toggleFilter(filter)}
                                            _hover={{
                                                bg: selectedFilters.includes(filter) ? '#0284c7' : '#e5e7eb'
                                            }}
                                            fontSize='sm'
                                            fontWeight='500'
                                        >
                                            {filter}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Box>

                            {/* View Toggle */}
                            <HStack spacing={2} w='full' justify='center'>
                                <Button
                                    variant={viewMode === 'map' ? 'primary' : 'secondary'}
                                    leftIcon={<Map />}
                                    onClick={() => setViewMode('map')}
                                >
                                    Map
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'primary' : 'secondary'}
                                    leftIcon={<List />}
                                    onClick={() => setViewMode('list')}
                                >
                                    List
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </ScaleFade>

                {/* Results */}
                {loading && (
                    <Center py={12}>
                        <VStack spacing={4}>
                            <Spinner color='#0ea5e9' size='xl' thickness='4px' />
                            <Text color='#6b7280' fontSize='lg' fontWeight='500'>
                                Finding resources near you...
                            </Text>
                        </VStack>
                    </Center>
                )}

                {!loading && resources.length > 0 && (
                    <VStack spacing={6}>
                        {/* Active Filters */}
                        {selectedFilters.length > 0 && (
                            <Box w='full'>
                                <Text color='#374151' fontWeight='600' mb={3} fontSize='sm'>
                                    Active filters:
                                </Text>
                                <Flex wrap='wrap' gap={2}>
                                    {selectedFilters.map((filter) => (
                                        <Badge
                                            key={filter}
                                            px={3}
                                            py={1}
                                            borderRadius='full'
                                            bg='#0ea5e9'
                                            color='white'
                                            border='1px solid #0284c7'
                                            fontSize='sm'
                                            fontWeight='500'
                                        >
                                            {filter} ×
                                        </Badge>
                                    ))}
                                </Flex>
                            </Box>
                        )}

                        {/* Map or List View */}
                        {viewMode === 'map' ? (
                            <Box w='full' h='500px' borderRadius='12px' overflow='hidden' boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'>
                                <MapView 
                                    resources={resources}
                                    userLocation={userLocation}
                                    onResourceSelect={setSelectedResource}
                                />
                            </Box>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w='full'>
                                {resources.map((resource) => (
                                <MotionBox
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card
                                        bg='white'
                                        border='1px solid #e5e7eb'
                                        borderRadius='16px'
                                        boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'
                                        _hover={{
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                        }}
                                        transition='all 0.2s ease-in-out'
                                    >
                                        <CardBody p={6}>
                                            <VStack spacing={4} align='start'>
                                                {/* Header */}
                                                <HStack justify='space-between' w='full'>
                                                    <VStack spacing={1} align='start' flex='1'>
                                                        <Heading size='md' color='#111827' fontWeight='700'>
                                                            {resource.name}
                                                        </Heading>
                                                        <Text color='#6b7280' fontSize='sm'>
                                                            {resource.distance} miles away
                                                        </Text>
                                                    </VStack>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => toggleSaved(resource.id)}
                                                    >
                                                        <Heart 
                                                            size={20} 
                                                            color={savedResources.includes(resource.id) ? '#ef4444' : '#9ca3af'}
                                                            fill={savedResources.includes(resource.id) ? '#ef4444' : 'none'}
                                                        />
                                                    </Button>
                                                </HStack>

                                                {/* Service Types */}
                                                <Flex wrap='wrap' gap={1}>
                                                    {resource.type.map((type) => (
                                                        <Badge
                                                            key={type}
                                                            px={2}
                                                            py={1}
                                                            borderRadius='6px'
                                                            bg='#f0f9ff'
                                                            color='#0ea5e9'
                                                            border='1px solid #e0f2fe'
                                                            fontSize='xs'
                                                            fontWeight='500'
                                                        >
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </Flex>

                                                {/* Special Badges */}
                                                <Flex wrap='wrap' gap={2}>
                                                    {resource.acceptingNew && (
                                                        <Badge
                                                            px={2}
                                                            py={1}
                                                            borderRadius='6px'
                                                            bg='#dcfce7'
                                                            color='#16a34a'
                                                            border='1px solid #bbf7d0'
                                                            fontSize='xs'
                                                            fontWeight='500'
                                                        >
                                                            Accepting New
                                                        </Badge>
                                                    )}
                                                    {resource.medicaidFriendly && (
                                                        <Badge
                                                            px={2}
                                                            py={1}
                                                            borderRadius='6px'
                                                            bg='#fef3c7'
                                                            color='#d97706'
                                                            border='1px solid #fde68a'
                                                            fontSize='xs'
                                                            fontWeight='500'
                                                        >
                                                            Medicaid
                                                        </Badge>
                                                    )}
                                                </Flex>

                                                {/* Contact Info */}
                                                <VStack spacing={2} align='start' w='full'>
                                                    <HStack spacing={2}>
                                                        <Icon as={MapPin} boxSize={4} color='#6b7280' />
                                                        <Text color='#6b7280' fontSize='sm'>
                                                            {resource.address}
                                                        </Text>
                                                    </HStack>
                                                    <HStack spacing={2}>
                                                        <Icon as={Phone} boxSize={4} color='#6b7280' />
                                                        <Text color='#6b7280' fontSize='sm'>
                                                            {resource.phone}
                                                        </Text>
                                                    </HStack>
                                                    <HStack spacing={2}>
                                                        <Icon as={Clock} boxSize={4} color='#6b7280' />
                                                        <Text color='#6b7280' fontSize='sm'>
                                                            {resource.hours}
                                                        </Text>
                                                    </HStack>
                                                </VStack>

                                                {/* Actions */}
                                                <HStack spacing={2} w='full'>
                                                    <Button
                                                        variant='secondary'
                                                        size='sm'
                                                        leftIcon={<Phone />}
                                                        flex='1'
                                                        onClick={() => {
                                                            const cleanPhone = resource.phone.replace(/[^\d+]/g, '')
                                                            window.open(`tel:${cleanPhone}`)
                                                        }}
                                                    >
                                                        Call
                                                    </Button>
                                                    <Button
                                                        variant='secondary'
                                                        size='sm'
                                                        leftIcon={<Navigation />}
                                                        flex='1'
                                                        onClick={() => {
                                                            const address = encodeURIComponent(resource.address)
                                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
                                                        }}
                                                    >
                                                        Directions
                                                    </Button>
                                                    <Button
                                                        variant='primary'
                                                        size='sm'
                                                        flex='1'
                                                        onClick={() => {
                                                            setSelectedResource(resource)
                                                            onDetailOpen()
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                </HStack>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </MotionBox>
                            ))}
                        </SimpleGrid>
                        )}
                    </VStack>
                )}

                {!loading && resources.length === 0 && searchQuery && (
                    <Center py={12}>
                        <VStack spacing={4}>
                            <Icon as={MapPin} boxSize={12} color='#9ca3af' />
                            <VStack spacing={2} textAlign='center'>
                                <Heading size='md' color='#374151'>
                                    No resources found
                                </Heading>
                                <Text color='#6b7280' fontSize='sm'>
                                    Try adjusting your search or expanding your radius
                                </Text>
                            </VStack>
                        </VStack>
                    </Center>
                )}

                {!loading && !searchQuery && (
                    <Center py={12}>
                        <VStack spacing={4}>
                            <Icon as={Search} boxSize={12} color='#9ca3af' />
                            <VStack spacing={2} textAlign='center'>
                                <Heading size='md' color='#374151'>
                                    Search for resources
                                </Heading>
                                <Text color='#6b7280' fontSize='sm'>
                                    Enter your ZIP code or address to find autism services near you
                                </Text>
                            </VStack>
                        </VStack>
                    </Center>
                )}
            </Container>

            {/* Location Permission Modal */}
            <Modal isOpen={showLocationPrompt} onClose={() => {}} size='md' closeOnOverlayClick={false}>
                <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
                <ModalContent 
                    bg='white'
                    borderRadius='16px'
                    mx='4'
                >
                    <ModalHeader color='#111827' fontSize='2xl' fontWeight='700'>
                        Help us find resources near you
                    </ModalHeader>
                    <ModalBody pb={6}>
                        <VStack spacing={6} align='stretch'>
                            <Text color='#6b7280' fontSize='md' lineHeight='1.6'>
                                We can help you find autism resources in your area. Choose how you'd like to share your location:
                            </Text>
                            
                            <VStack spacing={3} align='stretch'>
                                <Button
                                    variant='primary'
                                    leftIcon={<MapPin />}
                                    onClick={() => handleLocationChoice('precise')}
                                    size='lg'
                                    justifyContent='flex-start'
                                    isLoading={isRequestingLocation}
                                    loadingText='Getting location...'
                                >
                                    Use my precise location (GPS)
                                </Button>
                                
                                <Button
                                    variant='secondary'
                                    leftIcon={<MapPin />}
                                    onClick={() => handleLocationChoice('approximate')}
                                    size='lg'
                                    justifyContent='flex-start'
                                    isLoading={isRequestingLocation}
                                    loadingText='Setting location...'
                                >
                                    Use approximate location (city/ZIP)
                                </Button>
                                
                                <Button
                                    variant='secondary'
                                    leftIcon={<Search />}
                                    onClick={() => handleLocationChoice('manual')}
                                    size='lg'
                                    justifyContent='flex-start'
                                >
                                    I'll enter ZIP/address manually
                                </Button>
                            </VStack>

                            {locationError && (
                                <Box
                                    bg='#fef2f2'
                                    border='1px solid #fecaca'
                                    borderRadius='8px'
                                    p={3}
                                    mt={4}
                                >
                                    <Text color='#dc2626' fontSize='sm' fontWeight='500'>
                                        {locationError}
                                    </Text>
                                </Box>
                            )}
                            
                            <Text color='#9ca3af' fontSize='sm' textAlign='center'>
                                You can use Kora without sharing your exact location.
                            </Text>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Saved Resources Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='lg'>
                <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
                <ModalContent 
                    bg='white'
                    borderRadius='16px'
                    mx='4'
                >
                    <ModalHeader color='#111827' fontSize='2xl' fontWeight='700'>
                        Saved Resources
                    </ModalHeader>
                    <ModalCloseButton color='#6b7280' />
                    <ModalBody pb={6}>
                        {savedResources.length === 0 ? (
                            <VStack spacing={4} py={8}>
                                <Icon as={Heart} boxSize={12} color='#9ca3af' />
                                <VStack spacing={2} textAlign='center'>
                                    <Heading size='md' color='#374151'>
                                        No saved resources yet
                                    </Heading>
                                    <Text color='#6b7280' fontSize='sm'>
                                        Save resources you're interested in for quick access
                                    </Text>
                                </VStack>
                            </VStack>
                        ) : (
                            <VStack spacing={4} align='stretch'>
                                {resources
                                    .filter(resource => savedResources.includes(resource.id))
                                    .map((resource) => (
                                        <Card
                                            key={resource.id}
                                            bg='white'
                                            border='1px solid #e5e7eb'
                                            borderRadius='12px'
                                        >
                                            <CardBody p={4}>
                                                <HStack justify='space-between'>
                                                    <VStack spacing={1} align='start' flex='1'>
                                                        <Heading size='sm' color='#111827' fontWeight='600'>
                                                            {resource.name}
                                                        </Heading>
                                                        <Text color='#6b7280' fontSize='xs'>
                                                            {resource.distance} miles away
                                                        </Text>
                                                    </VStack>
                                                    <HStack spacing={2}>
                                                        <Button 
                                                            size='sm' 
                                                            variant='secondary' 
                                                            leftIcon={<Phone />}
                                                            onClick={() => {
                                                                const cleanPhone = resource.phone.replace(/[^\d+]/g, '')
                                                                window.open(`tel:${cleanPhone}`)
                                                            }}
                                                        >
                                                            Call
                                                        </Button>
                                                        <Button 
                                                            size='sm' 
                                                            variant='secondary' 
                                                            leftIcon={<Navigation />}
                                                            onClick={() => {
                                                                const address = encodeURIComponent(resource.address)
                                                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
                                                            }}
                                                        >
                                                            Directions
                                                        </Button>
                                                    </HStack>
                                                </HStack>
                                            </CardBody>
                                        </Card>
                                    ))}
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Resource Detail Modal */}
            {selectedResource && (
                <ResourceDetail
                    resource={selectedResource}
                    isOpen={isDetailOpen}
                    onClose={onDetailClose}
                    onSave={toggleSaved}
                    isSaved={savedResources.includes(selectedResource.id)}
                />
            )}
        </Box>
    )
}
