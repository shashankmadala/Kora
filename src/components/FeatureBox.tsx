import { Button, Box, Text, useColorModeValue, VStack, Heading, Icon } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export default function FeatureBox({ title, description, icon: IconComponent, to }: { title: string, description: string, icon: React.FC, to: string }) {
    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            borderRadius='lg'
            boxShadow='md'
            _hover={{ boxShadow: 'lg' }}
        >
            <VStack spacing={3} align='start'>
                <Icon as={IconComponent} width={8} height={8} color={useColorModeValue('purple.500', 'purple.500')} />
                <Heading size='sm'>{title}</Heading>
                <Text fontSize='sm' color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
                <Button
                    as={RouterLink}
                    to={to}
                    colorScheme='purple'
                    size='sm'
                >
                    Explore
                </Button>
            </VStack>
        </Box>
    )
}