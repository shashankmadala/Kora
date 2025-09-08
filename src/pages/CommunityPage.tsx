import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
    Box, Button, Center, Heading, Input, Modal, ModalBody, 
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, 
    ScaleFade, Spinner, Text, Textarea, useDisclosure, 
    useToast, Container, VStack, HStack, Icon, Badge, Flex, FormControl, 
    FormLabel, useBreakpointValue, SimpleGrid
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { SearchIcon, Users, MessageCircle, Plus, Heart, Share2, Filter, TrendingUp, Clock, Star } from 'lucide-react'
import { getPosts } from '../utils/getPosts'
import PostCard from '../components/PostCard'
import { useUser } from '../firebase/useUser'
import { createPost } from '../utils/createPost'
import { Timestamp } from 'firebase/firestore'

const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function CommunityPage() {
    const { user } = useUser()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([] as string[])
    const [results, setResults] = useState<Post[] | undefined>(undefined)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('recent')
    const toast = useToast()
    const queryClient = useQueryClient()
    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 })
    
    const posts = useQuery({
        queryKey: ['posts'],
        queryFn: () => getPosts(),
        refetchOnMount: true,
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

    const searchPosts = (query: string) => {
        setSearchQuery(query)
        if (!query) {
            setResults(undefined)
            return
        }
        const filtered = posts.data?.filter(({ title, content, tags }) => {
            const searchLower = query.toLowerCase()
            return title.toLowerCase().includes(searchLower) || 
                   content.toLowerCase().includes(searchLower) ||
                   tags.some(tag => tag.toLowerCase().includes(searchLower))
        })
        setResults(filtered)
    }

    const getSortedPosts = () => {
        const postsToSort = results || posts.data || []
        switch (sortBy) {
            case 'recent':
                return [...postsToSort].sort((a, b) => b.creationDate.seconds - a.creationDate.seconds)
            case 'popular':
                return [...postsToSort].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
            case 'trending':
                return [...postsToSort].sort((a, b) => {
                    const aScore = (a.comments?.length || 0) + (a.likes || 0)
                    const bScore = (b.comments?.length || 0) + (b.likes || 0)
                    return bScore - aScore
                })
            default:
                return postsToSort
        }
    }

    const handleCreatePost = () => mutate({ username: user?.displayName as string, title, tags, content })

    const handleClose = () => {
        onClose()
        setTitle('')
        setTags([])
        setContent('')
    }

    return (
        <Box minHeight='100vh' bgGradient='linear(to-br, #faf5ff, #f3e8ff, #e9d5ff)'>
            <Container maxW='container.xl' pt={20} pb={24}>
                {/* Hero Section */}
        <ScaleFade initialScale={0.9} in={true}>
                    <MotionBox 
                        bgGradient='linear(to-br, white, #fefbff)'
                        borderRadius='24px'
                        p={{ base: 6, md: 12 }}
                        textAlign='center'
                        boxShadow='0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        border='1px solid rgba(255, 255, 255, 0.2)'
                        mb={12}
                        position='relative'
                        overflow='hidden'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Background Pattern */}
                        <Box
                            position='absolute'
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            opacity={0.03}
                            backgroundImage="radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)"
                            backgroundSize="20px 20px"
                        />
                        
                        <VStack spacing={6} position='relative' zIndex={1}>
                            <HStack spacing={4} align='center'>
                                <Box
                                    p={3}
                                    borderRadius='20px'
                                    bgGradient='linear(135deg, #a855f7, #7c3aed)'
                                    boxShadow='0 8px 20px rgba(168, 85, 247, 0.3)'
                                    position='relative'
                                >
                                    <Icon as={Users} boxSize={8} color='white' />
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
                                </Box>
                                <VStack align='start' spacing={1}>
                                    <Heading size='2xl' color='#1f2937' fontWeight='800' letterSpacing='-0.02em'>
                                        Community
                                    </Heading>
                                    <Text fontSize='md' color='#6b7280' fontWeight='500'>
                                        Connect & Share Together
                                    </Text>
                                </VStack>
                            </HStack>
                            
                            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW='3xl' mx='auto' color='#374151' lineHeight='1.6' fontWeight='400'>
                                Join our <Text as='span' color='#7c3aed' fontWeight='600'>supportive community</Text> of parents, caregivers, and experts sharing experiences, advice, and encouragement on the autism journey.
                            </Text>
                            
                            {/* Search Bar */}
                            <Box maxW='2xl' w='full' mt={4}>
                                <HStack spacing={3} bg='white' p={2} borderRadius='16px' boxShadow='0 4px 6px rgba(0, 0, 0, 0.05)'>
                                    <Icon as={SearchIcon} color='#6b7280' boxSize={5} />
                                    <Input
                                        placeholder='Search posts, topics, or tags...'
                                        value={searchQuery}
                                        onChange={e => searchPosts(e.target.value)}
                                        border='none'
                                        _focus={{ boxShadow: 'none' }}
                                        fontSize='md'
                                    />
                                </HStack>
                            </Box>
                        </VStack>
                    </MotionBox>
                </ScaleFade>

                {/* Controls Section */}
                <Flex justify='space-between' align='center' mb={8} flexWrap='wrap' gap={4}>
                    <HStack spacing={4}>
                        <Badge 
                            px={4} 
                            py={2} 
                            borderRadius='full' 
                            bg='rgba(168, 85, 247, 0.1)' 
                            color='#7c3aed' 
                            border='1px solid rgba(168, 85, 247, 0.2)'
                            fontSize='sm'
                            fontWeight='600'
                        >
                            <HStack spacing={2}>
                                <Icon as={MessageCircle} boxSize={4} />
                                <Text>{posts.data?.length || 0} Posts</Text>
                            </HStack>
                        </Badge>
                        
                        {searchQuery && (
                            <Badge 
                                px={4} 
                                py={2} 
                                borderRadius='full' 
                                bg='rgba(16, 185, 129, 0.1)' 
                                color='#059669' 
                                border='1px solid rgba(16, 185, 129, 0.2)'
                                fontSize='sm'
                                fontWeight='600'
                            >
                                <HStack spacing={2}>
                                    <Icon as={SearchIcon} boxSize={4} />
                                    <Text>{results?.length || 0} Results</Text>
                                </HStack>
                            </Badge>
                        )}
                    </HStack>

                    <HStack spacing={3}>
                        <Button
                            size='sm'
                            variant='outline'
                            leftIcon={<Filter size={16} />}
                            onClick={() => setSortBy(sortBy === 'recent' ? 'popular' : 'recent')}
                        >
                            {sortBy === 'recent' ? 'Recent' : 'Popular'}
                        </Button>
                        
                        <MotionButton
                            size='lg'
                            bgGradient='linear(135deg, #a855f7, #7c3aed)'
                            color='white'
                            _hover={{
                                bgGradient: 'linear(135deg, #9333ea, #6d28d9)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)'
                            }}
                            _active={{
                                transform: 'translateY(0px)'
                            }}
                            leftIcon={<Plus size={20} />}
                            onClick={onOpen}
                            px={8}
                            py={6}
                            fontSize='md'
                            fontWeight='600'
                            borderRadius='16px'
                            boxShadow='0 10px 25px rgba(168, 85, 247, 0.3)'
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Create Post
                        </MotionButton>
                    </HStack>
                </Flex>

                {/* Posts Section */}
                <Box>
                {posts.isLoading && (
                        <Center py={20}>
                            <VStack spacing={4}>
                                <Spinner color='purple.500' size='xl' />
                                <Text color='#6b7280'>Loading community posts...</Text>
                            </VStack>
                    </Center>
                )}
                    
                    {!posts.isLoading && (
                        <SimpleGrid 
                            columns={{ base: 1, md: 2, lg: 3, xl: 4 }} 
                            spacing={6}
                            w='100%'
                        >
                    {results ? (
                        <>
                                    {results.length === 0 && (
                                        <Box gridColumn={{ base: '1', md: '1 / -1' }}>
                                            <Center py={20}>
                                                <VStack spacing={4}>
                                                    <Icon as={SearchIcon} boxSize={12} color='#d1d5db' />
                                                    <Text fontSize='lg' color='#6b7280' fontWeight='500'>
                                                        No posts found
                                                    </Text>
                                                    <Text color='#9ca3af' textAlign='center'>
                                                        Try adjusting your search terms or create a new post
                                                    </Text>
                                                </VStack>
                                            </Center>
                                        </Box>
                                    )}
                                    {results.length > 0 && getSortedPosts().map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <PostCard {...post} />
                                        </motion.div>
                                    ))}
                                </>
                            ) : (
                                getSortedPosts().map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <PostCard {...post} />
                                    </motion.div>
                                ))
                            )}
                        </SimpleGrid>
                    )}
            </Box>
            </Container>

            {/* Create Post Modal */}
            <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
                <ModalOverlay bg='rgba(0, 0, 0, 0.5)' />
                <ModalContent 
                    bg='white'
                    borderRadius='20px'
                    mx={4}
                    boxShadow='0 25px 50px rgba(0, 0, 0, 0.25)'
                >
                    <ModalHeader 
                        bgGradient='linear(135deg, #a855f7, #7c3aed)' 
                        color='white'
                        borderRadius='20px 20px 0 0'
                        fontSize='xl'
                        fontWeight='700'
                    >
                        <HStack spacing={3}>
                            <Icon as={Plus} boxSize={6} />
                            <Text>Create New Post</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody p={8}>
                        <VStack spacing={6} align='stretch'>
                            <FormControl>
                                <FormLabel fontWeight='600' color='#374151'>Post Title</FormLabel>
                                <Input
                                    placeholder='What would you like to share?'
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    size='lg'
                                    borderRadius='12px'
                                    border='2px solid #e5e7eb'
                                    _focus={{ borderColor: '#a855f7', boxShadow: '0 0 0 1px #a855f7' }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight='600' color='#374151'>Tags (optional)</FormLabel>
                                <Input
                                    placeholder='autism, therapy, support, advice...'
                                    value={tags.join(', ')}
                                    onChange={e => setTags(e.target.value.split(/,\s*/).filter(tag => tag.trim()))}
                                    size='lg'
                                    borderRadius='12px'
                                    border='2px solid #e5e7eb'
                                    _focus={{ borderColor: '#a855f7', boxShadow: '0 0 0 1px #a855f7' }}
                                />
                                <Text fontSize='sm' color='#6b7280' mt={1}>
                                    Separate tags with commas
                                </Text>
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight='600' color='#374151'>Post Content</FormLabel>
                                <Textarea
                                    placeholder='Share your thoughts, experiences, or ask questions...'
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    rows={6}
                                    borderRadius='12px'
                                    border='2px solid #e5e7eb'
                                    _focus={{ borderColor: '#a855f7', boxShadow: '0 0 0 1px #a855f7' }}
                                    resize='vertical'
                                />
                            </FormControl>
                        </VStack>
                        </ModalBody>

                    <ModalFooter p={8} pt={0}>
                        <HStack spacing={4} w='full' justify='flex-end'>
                            <Button
                                variant='outline'
                                onClick={handleClose}
                                size='lg'
                                px={8}
                                borderRadius='12px'
                                borderColor='#d1d5db'
                                color='#6b7280'
                                _hover={{ bg: '#f9fafb' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                bgGradient='linear(135deg, #a855f7, #7c3aed)'
                                color='white'
                                onClick={handleCreatePost}
                                isLoading={isPending}
                                isDisabled={title.length === 0 || content.length === 0}
                                size='lg'
                                px={8}
                                borderRadius='12px'
                                _hover={{
                                    bgGradient: 'linear(135deg, #9333ea, #6d28d9)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)'
                                }}
                                _active={{ transform: 'translateY(0px)' }}
                            >
                                {isPending ? 'Publishing...' : 'Publish Post'}
                            </Button>
                        </HStack>
                        </ModalFooter>
                    </ModalContent>
            </Modal>
        </Box>
    )
}
