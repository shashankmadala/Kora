import { Box, Icon, Text, VStack, HStack } from '@chakra-ui/react'
import { Bot, Camera, HelpCircle, Home, Users, MapPin, Sparkles, Heart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface NavLink {
    to: string,
    ariaLabel: string,
    icon: React.ComponentType,
    label: string
}

const navLinks: NavLink[] = [
    {
        to: '/app/help',
        ariaLabel: 'Help link',
        icon: HelpCircle,
        label: 'Help'
    },
    {
        to: '/app/camera',
        ariaLabel: 'Camera link',
        icon: Camera,
        label: 'Camera'
    },
    {
        to: '/app',
        ariaLabel: 'Home link',
        icon: Home,
        label: 'Home'
    },
    {
        to: '/app/games',
        ariaLabel: 'Emotion Games link',
        icon: Heart,
        label: 'Games'
    },
    {
        to: '/app/chatbot',
        ariaLabel: 'AI Chat link',
        icon: Bot,
        label: 'AI Chat'
    },
    {
        to: '/app/resources',
        ariaLabel: 'Resources link',
        icon: MapPin,
        label: 'Resources'
    },
    {
        to: '/app/community',
        ariaLabel: 'Community link',
        icon: Users,
        label: 'Community'
    }
]

export default function BottomBar() {
    const location = useLocation()

    return (
        <Box 
            h='90px' 
            bg='rgba(255, 255, 255, 0.8)'
            backdropFilter='blur(20px)'
            borderTop='1px solid rgba(255, 255, 255, 0.2)'
            display='flex' 
            flexDir='row' 
            justifyContent='space-around' 
            alignItems='center' 
            position='fixed' 
            bottom={0}
            left={0}
            right={0}
            w='100%' 
            zIndex={1000} 
            boxShadow='0 -8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            px={6}
            py={2}
        >
            {navLinks.map(({ to, icon: IconComponent, ariaLabel, label }) => {
                let condition = location.pathname == to
                if (to == '/app/community') condition = condition || location.pathname.includes('/app/post')
                
                return (
                    <Link to={to} aria-label={ariaLabel} key={to}>
                        <MotionBox
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <VStack spacing={2} align='center'>
                                <Box
                                    p={3}
                                    borderRadius='16px'
                                    bg={condition ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.5)'}
                                    border={condition ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)'}
                                    boxShadow={condition ? '0 4px 12px rgba(168, 85, 247, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)'}
                                    position='relative'
                                    overflow='hidden'
                                >
                                    {condition && (
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
                                    )}
                                    <Icon 
                                        as={IconComponent} 
                                        boxSize={6} 
                                        color={condition ? '#7c3aed' : '#6b7280'}
                                    />
                                </Box>
                                <Text 
                                    fontSize='xs' 
                                    color={condition ? '#7c3aed' : '#6b7280'}
                                    fontWeight={condition ? '700' : '500'}
                                    letterSpacing='0.025em'
                                >
                                    {label}
                                </Text>
                            </VStack>
                        </MotionBox>
                    </Link>
                )
            })}
        </Box>
    )
}