import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AbsoluteCenter, Box, Button, Center, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, ScaleFade, Spinner, Stack, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { SearchIcon } from 'lucide-react'
import { getPosts } from '../utils/getPosts'
import PostCard from '../components/PostCard'
import { useUser } from '../firebase/useUser'
import { createPost } from '../utils/createPost'
import { Timestamp } from 'firebase/firestore'

export default function CommunityPage() {
    const { user } = useUser()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([] as string[])
    const [results, setResults] = useState<Post[] | undefined>(undefined)
    const toast = useToast()
    const queryClient = useQueryClient()
    const posts = useQuery({
        queryKey: ['posts'],
        queryFn: () => getPosts(),
        // refetchInterval: 1000 * 30,
        refetchOnMount: true,
        // staleTime: 1000 * 60,
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createPost,
        onSuccess: (id, variables) => {
            const newPost = [{ id, comments: [], creationDate: Timestamp.fromDate(new Date()), ...variables }]
            queryClient.setQueryData(['posts'], (prev: Post[]) => {
                return [...prev, ...newPost]
            })
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            onClose()
            toast({
                title: 'Post Successfully Created!',
                colorScheme: 'green',
                isClosable: true
            })
        }
    })

    const searchPosts = (searchQuery: string) => {
        if (!searchQuery) setResults(undefined)
        const filtered = posts.data?.filter(({ title, content }) => {
            return title.toLowerCase().includes(searchQuery.toLowerCase()) || content.toLowerCase().includes(searchQuery.toLowerCase())
        })
        setResults(filtered)
    }

    const handleCreatePost = () => mutate({ username: user?.displayName as string, title, tags, content })

    const handleClose = () => {
        onClose()
        setTitle('')
        setTags([])
        setContent('')
    }

    return (
        <ScaleFade initialScale={0.9} in={true}>
            <Box bg='linear-gradient(to top, #d799f7, #a699f7, #3f5fe0)' color='white' mt={20} mx={4} p={8} borderRadius='xl' boxShadow='xl' textAlign='center'>
                <Heading size='2xl' mb={4}>Our Community</Heading>
                <Text fontSize='lg' mb={6}>Connect, share, and learn with fellow parents and caregivers</Text>
                <Box maxW='480px' mx='auto'>
                    <Box maxW='320px' w='100%' display='flex' mx='auto' alignItems='center' gap={2}>
                        <Input bg='white' color='black' placeholder='Search' onChange={e => searchPosts(e.target.value)} zIndex='revert-layer' />
                        <Button type='submit' aria-label='Search Icon'>
                            <SearchIcon aria-label='Search Button Icon' />
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Center>
                <Button mt={4} maxW='320px' w='100%' colorScheme='purple' onClick={onOpen}>Create Post</Button>
            </Center>
            <Box mt={4} pb={20}>
                {posts.isLoading && (
                    <Center>
                        <Spinner color='purple.500' />
                    </Center>
                )}
                <Stack spacing='1rem'>
                    {results ? (
                        <>
                            {results.length == 0 && (
                                <Portal>
                                    <AbsoluteCenter>
                                        <Text>No Results</Text>
                                    </AbsoluteCenter>
                                </Portal>
                            )}
                            {results.length > 0 && results.map(post => <PostCard {...post} />)}
                        </>
                    ) : (
                        posts.data?.map(post => <PostCard {...post} />)
                    )}
                </Stack>
            </Box>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <Portal>
                    <ModalOverlay />
                    <ModalContent mx='4'>
                        <ModalHeader>Create Post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <label htmlFor='title'>Post title</label>
                            <Input type='text' placeholder='Title' id='title' mb='1.5rem' mt={1} onChange={e => setTitle(e.target.value)} />

                            <label htmlFor='tags'>Post tags</label>
                            <Input type='text' placeholder='Tags (ex: tag1, tag2, tag3, ...)' id='tags' mb='1.5rem' mt={1} onChange={e => setTags(e.target.value.split(/,\s*/))} />

                            <label htmlFor='content'>Post Content</label>
                            <Textarea placeholder='My post' id='content' mt={1} onChange={e => setContent(e.target.value)} />
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='purple' mr={3} onClick={handleCreatePost} isLoading={isPending} isDisabled={title.length == 0 || content.length == 0}>Submit</Button>
                            <Button colorScheme='red' onClick={handleClose} isLoading={isPending}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Portal>
            </Modal>
        </ScaleFade>
    )
}
