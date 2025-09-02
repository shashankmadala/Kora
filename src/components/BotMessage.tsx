import { Box, Text } from '@chakra-ui/react'
import Markdown from 'react-markdown'

export default function BotMessage({ text }: { text: string }) {
    return (
        <Box bg='gray.500' rounded='md' w='50%' color='white' p='3' my='2'>
            <Text>
                <Markdown>
                    {text}
                </Markdown>
            </Text>
        </Box>
    )
}