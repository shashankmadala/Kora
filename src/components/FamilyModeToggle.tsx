import { 
    Box, HStack, Text, Switch, Icon, Tooltip,
    Badge, VStack 
} from '@chakra-ui/react'
import { Users } from 'lucide-react'

interface FamilyModeToggleProps {
    isEnabled: boolean
    onToggle: (enabled: boolean) => void
}

export default function FamilyModeToggle({ isEnabled, onToggle }: FamilyModeToggleProps) {
    return (
        <Box
            p={4}
            borderRadius='16px'
            bg={isEnabled ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'rgba(168, 85, 247, 0.05)'}
            border='2px solid'
            borderColor={isEnabled ? '#f59e0b' : '#c4b5fd'}
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
                opacity={isEnabled ? 0.1 : 0.03}
                backgroundImage="radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)"
                backgroundSize="20px 20px"
            />

            <HStack 
                spacing={4} 
                position='relative' 
                zIndex={1}
                justify='space-between'
                align='center'
            >
                <HStack spacing={3}>
                    <Box
                        p={2}
                        borderRadius='12px'
                        bgGradient={isEnabled ? 'linear(135deg, #f59e0b, #d97706)' : 'linear(135deg, #a855f7, #7c3aed)'}
                    >
                        <Icon 
                            as={Users} 
                            boxSize={5} 
                            color='white' 
                        />
                    </Box>
                    
                    <VStack align='start' spacing={0}>
                        <HStack spacing={2}>
                            <Text 
                                fontSize='md' 
                                fontWeight='700' 
                                color='#1f2937'
                            >
                                Family Mode
                            </Text>
                            {isEnabled && (
                                <Badge 
                                    colorScheme='orange' 
                                    borderRadius='full'
                                    px={2}
                                    py={0.5}
                                >
                                    Active
                                </Badge>
                            )}
                        </HStack>
                        <Text 
                            fontSize='xs' 
                            color='#6b7280'
                        >
                            {isEnabled ? 'Working together with your family!' : 'Invite family to learn with you'}
                        </Text>
                    </VStack>
                </HStack>

                <Tooltip
                    label={isEnabled 
                        ? 'Toggle off to work solo' 
                        : 'Enable to add pauses for family explanations'
                    }
                >
                    <Switch
                        isChecked={isEnabled}
                        onChange={(e) => onToggle(e.target.checked)}
                        colorScheme='purple'
                        size='md'
                    />
                </Tooltip>
            </HStack>
        </Box>
    )
}




