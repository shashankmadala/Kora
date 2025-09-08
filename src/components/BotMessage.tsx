import { Box, Text, HStack, Icon } from '@chakra-ui/react'
import Markdown from 'react-markdown'
import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export default function BotMessage({ text }: { text: string }) {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            mb={4}
            alignSelf='flex-start'
            maxW='80%'
        >
            <HStack spacing={3} align='flex-start'>
                <Box
                    p={2}
                    borderRadius='full'
                    bg='#f0f9ff'
                    border='1px solid #e0f2fe'
                    flexShrink={0}
                >
                    <Icon as={Bot} boxSize={4} color='#0ea5e9' />
                </Box>
                <Box
                    bg='white'
                    border='1px solid #e5e7eb'
                    borderRadius='16px'
                    p={4}
                    boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'
                >
                    <Text color='#111827' fontSize='sm' lineHeight='1.6' fontWeight='400'>
                        <Markdown>
                            {text}
                        </Markdown>
                    </Text>
                </Box>
            </HStack>
        </MotionBox>
    )
}