import { useEffect, useRef, useState } from 'react'
import { Box, VStack, HStack, Text, Button, Icon, Badge, Card, CardBody } from '@chakra-ui/react'
import { MapPin, Phone, Navigation, Star, Clock, Users } from 'lucide-react'

interface Resource {
    id: string
    name: string
    type: string[]
    address: string
    phone: string
    hours: string
    rating?: number
    distance: number
    services?: string[]
    insurance?: string[]
    languages: string[]
    accessibility?: string[]
    acceptingNew: boolean
    telehealth: boolean
    medicaidFriendly: boolean
    lat: number
    lng: number
}

interface MapViewProps {
    resources: Resource[]
    userLocation: { lat: number, lng: number } | null
    onResourceSelect: (resource: Resource) => void
}

export default function MapView({ resources, userLocation, onResourceSelect }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [markers, setMarkers] = useState<google.maps.Marker[]>([])
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

    useEffect(() => {
        if (!mapRef.current) return

        // Initialize map
        const mapInstance = new google.maps.Map(mapRef.current, {
            center: userLocation || { lat: 40.7128, lng: -74.0060 }, // Default to NYC
            zoom: 12,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        })

        setMap(mapInstance)

        // Add user location marker if available
        if (userLocation) {
            new google.maps.Marker({
                position: userLocation,
                map: mapInstance,
                title: 'Your Location',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            })
        }
    }, [userLocation])

    useEffect(() => {
        if (!map) return

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null))

        // Add resource markers
        const newMarkers = resources.map(resource => {
            const marker = new google.maps.Marker({
                position: { lat: resource.lat, lng: resource.lng },
                map: map,
                title: resource.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: getMarkerColor(resource.type),
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            })

            marker.addListener('click', () => {
                setSelectedResource(resource)
                onResourceSelect(resource)
            })

            return marker
        })

        setMarkers(newMarkers)

        // Fit map to show all markers
        if (resources.length > 0) {
            const bounds = new google.maps.LatLngBounds()
            resources.forEach(resource => {
                bounds.extend({ lat: resource.lat, lng: resource.lng })
            })
            if (userLocation) {
                bounds.extend(userLocation)
            }
            map.fitBounds(bounds)
        }
    }, [map, resources, userLocation, onResourceSelect])

    const getMarkerColor = (types: string[]) => {
        const colors: { [key: string]: string } = {
            'ABA': '#10b981',
            'Speech': '#3b82f6',
            'OT': '#8b5cf6',
            'Diagnostic': '#f59e0b',
            'Support Group': '#ef4444',
            'Telehealth': '#06b6d4'
        }
        // Use the first type for color, or default if none match
        const firstType = types[0] || 'Other'
        return colors[firstType] || '#6b7280'
    }

    const getDirections = (resource: Resource) => {
        const destination = `${resource.lat},${resource.lng}`
        const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : ''
        const url = `https://www.google.com/maps/dir/${origin}/${destination}`
        window.open(url, '_blank')
    }

    return (
        <Box position="relative" w="full" h="full">
            {/* Map Container */}
            <Box ref={mapRef} w="full" h="full" borderRadius="12px" />
            
            {/* Selected Resource Info */}
            {selectedResource && (
                <Box
                    position="absolute"
                    bottom="4"
                    left="4"
                    right="4"
                    bg="white"
                    borderRadius="12px"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                    maxH="200px"
                    overflowY="auto"
                >
                    <Card>
                        <CardBody p={4}>
                            <VStack spacing={3} align="start">
                                <HStack justify="space-between" w="full">
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="600" fontSize="md" color="#1f2937">
                                            {selectedResource.name}
                                        </Text>
                                        <HStack spacing={2}>
                                            {selectedResource.type.map((type, index) => (
                                                <Badge key={index} colorScheme="blue" size="sm">
                                                    {type}
                                                </Badge>
                                            ))}
                                            {selectedResource.acceptingNew && (
                                                <Badge colorScheme="green" size="sm">
                                                    Accepting New
                                                </Badge>
                                            )}
                                        </HStack>
                                    </VStack>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        leftIcon={<Navigation size={14} />}
                                        onClick={() => getDirections(selectedResource)}
                                    >
                                        Directions
                                    </Button>
                                </HStack>

                                <VStack spacing={2} align="start" w="full">
                                    <HStack spacing={2}>
                                        <Icon as={MapPin} boxSize={3} color="#6b7280" />
                                        <Text fontSize="sm" color="#6b7280" noOfLines={2}>
                                            {selectedResource.address}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Icon as={Phone} boxSize={3} color="#6b7280" />
                                        <Text fontSize="sm" color="#6b7280">
                                            {selectedResource.phone}
                                        </Text>
                                    </HStack>
                                    <HStack spacing={2}>
                                        <Icon as={Clock} boxSize={3} color="#6b7280" />
                                        <Text fontSize="sm" color="#6b7280">
                                            {selectedResource.hours}
                                        </Text>
                                    </HStack>
                                </VStack>

                                <HStack spacing={4} w="full">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        leftIcon={<Phone size={14} />}
                                        onClick={() => window.open(`tel:${selectedResource.phone}`)}
                                        flex="1"
                                    >
                                        Call
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorScheme="purple"
                                        onClick={() => onResourceSelect(selectedResource)}
                                        flex="1"
                                    >
                                        View Details
                                    </Button>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                </Box>
            )}

            {/* Legend */}
            <Box
                position="absolute"
                top="4"
                right="4"
                bg="white"
                borderRadius="8px"
                p={3}
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                maxW="200px"
            >
                <VStack spacing={2} align="start">
                    <Text fontSize="sm" fontWeight="600" color="#1f2937">
                        Resource Types
                    </Text>
                    {['ABA', 'Speech', 'OT', 'Diagnostic', 'Support Group', 'Telehealth'].map(type => (
                        <HStack key={type} spacing={2}>
                            <Box
                                w="3"
                                h="3"
                                borderRadius="full"
                                bg={getMarkerColor([type])}
                            />
                            <Text fontSize="xs" color="#6b7280">
                                {type}
                            </Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>
        </Box>
    )
}
