import { GoogleGenerativeAI, } from '@google/generative-ai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { getChatHistory } from '../utils/getChatHistory'
import { useUser } from '../firebase/useUser'
import { AbsoluteCenter, Box, Button, Flex, ScaleFade, Spinner, Textarea } from '@chakra-ui/react'
import BotMessage from '../components/BotMessage'
import UserMessage from '../components/UserMessage'
import { SendIcon } from 'lucide-react'
import { saveChatHistory } from '../utils/saveChatHistory'
import { historyConverter } from '../utils/historyConverter'

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
}

const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const geminiModel = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' })

export default function ChatBotPage() {
    const { user } = useUser()
    const [message, setMessage] = useState('')
    const queryClient = useQueryClient()
    const { data: history, isLoading } = useQuery({
        queryKey: ['chatHistory', user?.uid],
        queryFn: () => getChatHistory(user?.uid as string),
        retry: false,
    })

    const chat = useMemo(() => {
        if (!isLoading && history != undefined) {
            return geminiModel.startChat({ history: historyConverter(history as ChatMessage[]), generationConfig })
        }

        return geminiModel.startChat({ generationConfig })
    }, [isLoading])

    const { mutate } = useMutation({
        mutationFn: async () => {
            queryClient.setQueryData(['chatHistory', user?.uid], (prev: ChatMessage[] | undefined) => {
                if (prev == undefined) return [{ role: 'user', text: message }]
                return [...prev, { role: 'user', text: message }]
            })
            const result = await chat!.sendMessage(message)
            return result.response.text()
        },
        onSuccess: (text) => {
            let newHistory
            queryClient.setQueryData(['chatHistory', user?.uid], (prev: ChatMessage[] | undefined) => {
                if (prev == undefined) newHistory = [{ role: 'model', text }]
                else newHistory = [...prev, { role: 'model', text }]
                return newHistory
            })
            saveChatHistory({ uid: user?.uid!, history: newHistory as any as ChatMessage[] })
            setMessage('')
        },
    })

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault()
        mutate()
    }

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)

        return () => window.scrollTo(0, 0)
    }, [history])

    useEffect(() => {
        if (history == undefined) window.scrollTo(0, document.body.scrollHeight)
    })

    return (
        <>
            {isLoading && (
                <AbsoluteCenter>
                    <Spinner color='purple.500' />
                </AbsoluteCenter>
            )}
            {!isLoading && (
                <ScaleFade initialScale={0.9} in={true}>
                    <Box display='flex' flexDir='column-reverse' minH='calc(100vh - 112px)' maxW='384px' w='calc(100vw - 1rem)' mx='auto' mb='120px' mt='64px'>
                        {history && [...history].reverse().map((message, i) => {
                            if (message.role == 'model') {
                                return <BotMessage key={i} text={message.text} />
                            }
                            return <UserMessage key={i} text={message.text} />
                        })}
                    </Box>
                </ScaleFade>
            )}
            <Flex position='fixed' bottom='56px' left='50%' transform='translateX(-50%)' direction='row' gap={2} mb={4} as='form' onSubmit={sendMessage} maxW='400px' width='calc(100vw - 1rem)'>
                <Textarea rows={1} placeholder='Message' bg='white' onChange={e => setMessage(e.target.value)} value={message} />
                <Button type='submit' aria-label='Search Icon' colorScheme='purple'>
                    <SendIcon aria-label='Search Button Icon' />
                </Button>
            </Flex>
        </>
    )
}