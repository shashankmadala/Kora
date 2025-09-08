import { Box, Text, HStack, Icon } from '@chakra-ui/react'
import { User } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function UserMessage({ text }: { text: string }) {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            mb={4}
            alignSelf='flex-end'
            maxW='80%'
        >
            <HStack spacing={3} align='flex-start' flexDirection='row-reverse'>
                <Box
                    p={2}
                    borderRadius='full'
                    bg='#0ea5e9'
                    border='1px solid #0284c7'
                    flexShrink={0}
                >
                    <Icon as={User} boxSize={4} color='white' />
                </Box>
                <Box
                    bg='#0ea5e9'
                    border='1px solid #0284c7'
                    borderRadius='16px'
                    p={4}
                    boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'
                >
                    <Text color='white' fontSize='sm' lineHeight='1.6' fontWeight='400'>
                        {text}
                    </Text>
                </Box>
            </HStack>
        </MotionBox>
    )
}