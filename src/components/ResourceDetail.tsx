import { 
    Box, 
    VStack, 
    HStack, 
    Heading, 
    Text, 
    Button, 
    Badge, 
    Flex, 
    Icon, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Divider,
    SimpleGrid,
    List,
    ListItem,
    ListIcon
} from '@chakra-ui/react'
import { 
    MapPin, 
    Phone, 
    Navigation, 
    Globe, 
    Star,
    Clock,
    Users,
    Accessibility,
    Heart,
    CheckCircle,
    XCircle
} from 'lucide-react'

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

interface ResourceDetailProps {
    resource: Resource
    isOpen: boolean
    onClose: () => void
    onSave: (resourceId: string) => void
    isSaved: boolean
}

export default function ResourceDetail({ 
    resource, 
    isOpen, 
    onClose, 
    onSave, 
    isSaved 
}: ResourceDetailProps) {
    const handleCall = () => {
        const cleanPhone = resource.phone.replace(/[^\d+]/g, '')
        window.open(`tel:${cleanPhone}`)
    }

    const handleDirections = () => {
        const address = encodeURIComponent(resource.address)
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
    }

    const handleWebsite = () => {
        if (resource.website) {
            window.open(resource.website, '_blank')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='xl'>
            <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
            <ModalContent 
                bg='white'
                borderRadius='16px'
                mx='4'
                maxH='90vh'
                overflowY='auto'
            >
                <ModalHeader color='#111827' fontSize='2xl' fontWeight='700' pb={2}>
                    <HStack justify='space-between' w='full'>
                        <Text>{resource.name}</Text>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onSave(resource.id)}
                        >
                            <Heart 
                                size={20} 
                                color={isSaved ? '#ef4444' : '#9ca3af'}
                                fill={isSaved ? '#ef4444' : 'none'}
                            />
                        </Button>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color='#6b7280' />
                <ModalBody pb={6}>
                    <VStack spacing={6} align='stretch'>
                        {/* Header Info */}
                        <VStack spacing={4} align='stretch'>
                            <HStack justify='space-between' align='start'>
                                <VStack spacing={2} align='start' flex='1'>
                                    <Text color='#6b7280' fontSize='sm'>
                                        {resource.distance} miles away
                                    </Text>
                                    {resource.rating && (
                                        <HStack spacing={1}>
                                            <Icon as={Star} boxSize={4} color='#fbbf24' fill='#fbbf24' />
                                            <Text color='#374151' fontSize='sm' fontWeight='500'>
                                                {resource.rating}
                                            </Text>
                                        </HStack>
                                    )}
                                </VStack>
                                <VStack spacing={2} align='end'>
                                    <Text color='#6b7280' fontSize='xs'>
                                        Verified {new Date(resource.verified).toLocaleDateString()}
                                    </Text>
                                </VStack>
                            </HStack>

                            {/* Service Types */}
                            <Flex wrap='wrap' gap={2}>
                                {resource.type.map((type) => (
                                    <Badge
                                        key={type}
                                        px={3}
                                        py={1}
                                        borderRadius='full'
                                        bg='#f0f9ff'
                                        color='#0ea5e9'
                                        border='1px solid #e0f2fe'
                                        fontSize='sm'
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
                                        px={3}
                                        py={1}
                                        borderRadius='full'
                                        bg='#dcfce7'
                                        color='#16a34a'
                                        border='1px solid #bbf7d0'
                                        fontSize='sm'
                                        fontWeight='500'
                                    >
                                        <HStack spacing={1}>
                                            <Icon as={CheckCircle} boxSize={3} />
                                            <Text>Accepting New Patients</Text>
                                        </HStack>
                                    </Badge>
                                )}
                                {!resource.acceptingNew && (
                                    <Badge
                                        px={3}
                                        py={1}
                                        borderRadius='full'
                                        bg='#fef2f2'
                                        color='#dc2626'
                                        border='1px solid #fecaca'
                                        fontSize='sm'
                                        fontWeight='500'
                                    >
                                        <HStack spacing={1}>
                                            <Icon as={XCircle} boxSize={3} />
                                            <Text>Not Accepting New Patients</Text>
                                        </HStack>
                                    </Badge>
                                )}
                                {resource.medicaidFriendly && (
                                    <Badge
                                        px={3}
                                        py={1}
                                        borderRadius='full'
                                        bg='#fef3c7'
                                        color='#d97706'
                                        border='1px solid #fde68a'
                                        fontSize='sm'
                                        fontWeight='500'
                                    >
                                        Medicaid Friendly
                                    </Badge>
                                )}
                                {resource.telehealth && (
                                    <Badge
                                        px={3}
                                        py={1}
                                        borderRadius='full'
                                        bg='#e0f2fe'
                                        color='#0ea5e9'
                                        border='1px solid #bae6fd'
                                        fontSize='sm'
                                        fontWeight='500'
                                    >
                                        Telehealth Available
                                    </Badge>
                                )}
                                {resource.wheelchairAccessible && (
                                    <Badge
                                        px={3}
                                        py={1}
                                        borderRadius='full'
                                        bg='#f0fdf4'
                                        color='#16a34a'
                                        border='1px solid #bbf7d0'
                                        fontSize='sm'
                                        fontWeight='500'
                                    >
                                        <HStack spacing={1}>
                                            <Icon as={Accessibility} boxSize={3} />
                                            <Text>Wheelchair Accessible</Text>
                                        </HStack>
                                    </Badge>
                                )}
                            </Flex>
                        </VStack>

                        <Divider />

                        {/* Contact Information */}
                        <VStack spacing={4} align='stretch'>
                            <Heading size='md' color='#111827' fontWeight='600'>
                                Contact Information
                            </Heading>
                            
                            <VStack spacing={3} align='stretch'>
                                <HStack spacing={3}>
                                    <Icon as={MapPin} boxSize={5} color='#6b7280' />
                                    <Text color='#374151' fontSize='sm'>
                                        {resource.address}
                                    </Text>
                                </HStack>
                                
                                <HStack spacing={3}>
                                    <Icon as={Phone} boxSize={5} color='#6b7280' />
                                    <Text color='#374151' fontSize='sm'>
                                        {resource.phone}
                                    </Text>
                                </HStack>
                                
                                {resource.website && (
                                    <HStack spacing={3}>
                                        <Icon as={Globe} boxSize={5} color='#6b7280' />
                                        <Button
                                            variant='link'
                                            color='#0ea5e9'
                                            fontSize='sm'
                                            onClick={handleWebsite}
                                            p={0}
                                            h='auto'
                                        >
                                            {resource.website}
                                        </Button>
                                    </HStack>
                                )}
                                
                                <HStack spacing={3}>
                                    <Icon as={Clock} boxSize={5} color='#6b7280' />
                                    <Text color='#374151' fontSize='sm'>
                                        {resource.hours}
                                    </Text>
                                </HStack>
                            </VStack>
                        </VStack>

                        <Divider />

                        {/* Services */}
                        {resource.services && resource.services.length > 0 && (
                            <VStack spacing={4} align='stretch'>
                                <Heading size='md' color='#111827' fontWeight='600'>
                                    Services Offered
                                </Heading>
                                <List spacing={2}>
                                    {resource.services.map((service, index) => (
                                        <ListItem key={index}>
                                            <HStack spacing={3} align='start'>
                                                <ListIcon as={CheckCircle} color='#16a34a' />
                                                <Text color='#374151' fontSize='sm'>
                                                    {service}
                                                </Text>
                                            </HStack>
                                        </ListItem>
                                    ))}
                                </List>
                            </VStack>
                        )}

                        {/* Additional Information */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            {/* Age Range */}
                            {resource.ageRange && (
                                <VStack spacing={3} align='stretch'>
                                    <Heading size='sm' color='#111827' fontWeight='600'>
                                        Age Range
                                    </Heading>
                                    <HStack spacing={2}>
                                        <Icon as={Users} boxSize={4} color='#6b7280' />
                                        <Text color='#374151' fontSize='sm'>
                                            {resource.ageRange}
                                        </Text>
                                    </HStack>
                                </VStack>
                            )}

                            {/* Languages */}
                            <VStack spacing={3} align='stretch'>
                                <Heading size='sm' color='#111827' fontWeight='600'>
                                    Languages
                                </Heading>
                                <Flex wrap='wrap' gap={1}>
                                    {resource.languages.map((language) => (
                                        <Badge
                                            key={language}
                                            px={2}
                                            py={1}
                                            borderRadius='6px'
                                            bg='#f3f4f6'
                                            color='#374151'
                                            fontSize='xs'
                                            fontWeight='500'
                                        >
                                            {language}
                                        </Badge>
                                    ))}
                                </Flex>
                            </VStack>

                            {/* Insurance */}
                            {resource.insurance && resource.insurance.length > 0 && (
                                <VStack spacing={3} align='stretch'>
                                    <Heading size='sm' color='#111827' fontWeight='600'>
                                        Insurance Accepted
                                    </Heading>
                                    <Flex wrap='wrap' gap={1}>
                                        {resource.insurance.map((ins) => (
                                            <Badge
                                                key={ins}
                                                px={2}
                                                py={1}
                                                borderRadius='6px'
                                                bg='#f0f9ff'
                                                color='#0ea5e9'
                                                fontSize='xs'
                                                fontWeight='500'
                                            >
                                                {ins}
                                            </Badge>
                                        ))}
                                    </Flex>
                                </VStack>
                            )}

                            {/* Accessibility */}
                            {resource.accessibility && resource.accessibility.length > 0 && (
                                <VStack spacing={3} align='stretch'>
                                    <Heading size='sm' color='#111827' fontWeight='600'>
                                        Accessibility Features
                                    </Heading>
                                    <List spacing={1}>
                                        {resource.accessibility.map((feature, index) => (
                                            <ListItem key={index}>
                                                <HStack spacing={2} align='start'>
                                                    <ListIcon as={Accessibility} color='#16a34a' />
                                                    <Text color='#374151' fontSize='sm'>
                                                        {feature}
                                                    </Text>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List>
                                </VStack>
                            )}
                        </SimpleGrid>

                        {/* Intake Process */}
                        {resource.intakeProcess && (
                            <VStack spacing={4} align='stretch'>
                                <Divider />
                                <Heading size='md' color='#111827' fontWeight='600'>
                                    Intake Process
                                </Heading>
                                <Box
                                    bg='#f9fafb'
                                    border='1px solid #e5e7eb'
                                    borderRadius='8px'
                                    p={4}
                                >
                                    <Text color='#374151' fontSize='sm' lineHeight='1.6'>
                                        {resource.intakeProcess}
                                    </Text>
                                </Box>
                            </VStack>
                        )}

                        {/* Action Buttons */}
                        <VStack spacing={3} pt={4}>
                            <HStack spacing={3} w='full'>
                                <Button
                                    variant='secondary'
                                    leftIcon={<Phone />}
                                    onClick={handleCall}
                                    flex='1'
                                >
                                    Call Now
                                </Button>
                                <Button
                                    variant='secondary'
                                    leftIcon={<Navigation />}
                                    onClick={handleDirections}
                                    flex='1'
                                >
                                    Get Directions
                                </Button>
                            </HStack>
                            
                            {resource.website && (
                                <Button
                                    variant='primary'
                                    leftIcon={<Globe />}
                                    onClick={handleWebsite}
                                    w='full'
                                >
                                    Visit Website
                                </Button>
                            )}
                        </VStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
