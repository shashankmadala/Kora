import { Button, Box, Text, VStack, Heading, Icon, HStack, Badge } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const MotionBox = motion(Box)

export default function FeatureBox({ title, description, icon: IconComponent, to }: { title: string, description: string, icon: React.FC, to: string }) {
    const getIconColor = (title: string) => {
        switch (title) {
            case 'Emotion Detection': return '#ef4444'
            case 'AI Assistant': return '#7c3aed'
            case 'Find Resources': return '#059669'
            case 'Community Forum': return '#dc2626'
            case 'Research Contribution': return '#d97706'
            case 'Learning Resources': return '#2563eb'
            default: return '#7c3aed'
        }
    }

    const getIconBg = (title: string) => {
        switch (title) {
            case 'Emotion Detection': return 'linear(135deg, #fef2f2, #fee2e2)'
            case 'AI Assistant': return 'linear(135deg, #faf5ff, #f3e8ff)'
            case 'Find Resources': return 'linear(135deg, #f0fdf4, #dcfce7)'
            case 'Community Forum': return 'linear(135deg, #fef2f2, #fee2e2)'
            case 'Research Contribution': return 'linear(135deg, #fffbeb, #fef3c7)'
            case 'Learning Resources': return 'linear(135deg, #eff6ff, #dbeafe)'
            default: return 'linear(135deg, #faf5ff, #f3e8ff)'
        }
    }

    const getBadgeText = (title: string) => {
        switch (title) {
            case 'Emotion Detection': return 'AI-Powered'
            case 'AI Assistant': return 'Smart'
            case 'Find Resources': return 'Local'
            case 'Community Forum': return 'Active'
            case 'Research Contribution': return 'Impact'
            case 'Learning Resources': return 'Expert'
            default: return 'New'
        }
    }

    return (
        <MotionBox
            bg='white'
            border='1px solid rgba(255, 255, 255, 0.2)'
            p={8}
            borderRadius='24px'
            boxShadow='0 4px 6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            _hover={{ 
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)'
            }}
            transition='all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            cursor='pointer'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            position='relative'
            overflow='hidden'
        >
            {/* Background Pattern */}
            <Box
                position='absolute'
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.02}
                backgroundImage="radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)"
                backgroundSize="15px 15px"
            />
            
            <VStack spacing={6} align='start' h='full' position='relative' zIndex={1}>
                <HStack spacing={4} align='center' w='full' justify='space-between'>
                    <HStack spacing={4} align='center'>
                        <Box
                            p={4}
                            borderRadius='20px'
                            bgGradient={getIconBg(title)}
                            border='1px solid rgba(255, 255, 255, 0.2)'
                            boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)'
                        >
                            <Icon as={IconComponent} boxSize={7} color={getIconColor(title)} />
                        </Box>
                        <VStack align='start' spacing={1}>
                            <Heading size='lg' color='#1f2937' fontWeight='700' letterSpacing='-0.01em'>
                                {title}
                            </Heading>
                            <Badge 
                                px={3} 
                                py={1} 
                                borderRadius='full' 
                                bg={`${getIconColor(title)}15`} 
                                color={getIconColor(title)} 
                                border={`1px solid ${getIconColor(title)}30`}
                                fontSize='xs'
                                fontWeight='600'
                            >
                                <HStack spacing={1}>
                                    <Sparkles size={10} />
                                    <Text>{getBadgeText(title)}</Text>
                                </HStack>
                            </Badge>
                        </VStack>
                    </HStack>
                </HStack>
                
                <Text 
                    fontSize='md' 
                    color='#4b5563' 
                    lineHeight='1.7'
                    flex='1'
                    fontWeight='400'
                >
                    {description}
                </Text>
                
                <Button
                    as={RouterLink}
                    to={to}
                    bgGradient='linear(135deg, #a855f7, #7c3aed)'
                    color='white'
                    size='md'
                    rightIcon={<ArrowRight size={18} />}
                    w='full'
                    justifyContent='space-between'
                    borderRadius='12px'
                    fontWeight='600'
                    _hover={{
                        bgGradient: 'linear(135deg, #9333ea, #6d28d9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)'
                    }}
                    _active={{
                        transform: 'translateY(0px)'
                    }}
                    transition='all 0.3s ease'
                    boxShadow='0 4px 12px rgba(168, 85, 247, 0.3)'
                >
                    Explore Feature
                </Button>
            </VStack>
        </MotionBox>
    )
}