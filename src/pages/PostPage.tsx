import { FormEvent, useState } from 'react'
import { AbsoluteCenter, Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Flex, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, ScaleFade, Spinner, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPost } from '../utils/getPost'
import { Link as ChakraLink } from '@chakra-ui/react'
import { ChevronLeft, EllipsisIcon, MessageSquareIcon } from 'lucide-react'
import CommentCard from '../components/CommentCard'
import { createComment } from '../utils/createComment'
import { useUser } from '../firebase/useUser'
import { cardMaxW } from '../utils/constants'
import { deletePost } from '../utils/deletePost'
import { editPost } from '../utils/editPost'

type Params = {
    id: string
}

export default function PostPage() {
    const { id } = useParams<Params>()
    const commentModal = useDisclosure()
    const editPostModal = useDisclosure()
    const [content, setContent] = useState('')
    const queryClient = useQueryClient()
    const { user } = useUser()
    const isSubmitDisabled = content == ''
    const navigate = useNavigate()
    const toast = useToast()

    const post = useQuery({
        queryKey: ['post', id],
        queryFn: () => getPost(id as string),
        // refetchInterval: 1000 * 30,
        refetchOnMount: 'always',
        staleTime: 1000 * 60,
    })

    const { mutate: mutateCreateComment, error: mutateCreateCommentError } = useMutation({
        mutationFn: createComment,
        onSuccess: (_, { username, content, commentId }: any) => {
            queryClient.setQueryData(['post', id], (prev: Post) => {
                const newComments = [...prev.comments, { username, content, id: commentId }]
                return { ...prev, comments: newComments }
            })
        }
    })

    const { mutate: mutateDeletePost, error: mutateDeletePostError } = useMutation({
        mutationFn: deletePost,
        onSuccess: (_, { id }: any) => {
            queryClient.setQueryData(['posts'], (prev: Post[]) => {
                prev.filter(old => old.id == id)
            })
            navigate('/app/community')
            toast({
                title: 'Post Successfully Deleted!',
                colorScheme: 'green',
                isClosable: true
            })
        }
    })

    const { mutate: mutateEditPost, error: mutateEditPostError, isPending: isMutateEditPostPending } = useMutation({
        mutationFn: editPost,
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['post', id], (prev: Post) => {
                return { ...prev, ...variables }
            })
            editPostModal.onClose()
            toast({
                title: 'Post Successfully Edited!',
                colorScheme: 'green',
                isClosable: true
            })
        }
    })

    const handleCreateComment = (e: FormEvent) => {
        e.preventDefault()
        // @ts-ignore
        if (content != '') mutateCreateComment({ id, content, username: user?.displayName, commentId: crypto.randomUUID() })
        commentModal.onClose()
    }

    const handleDeletePost = () => mutateDeletePost({ id })

    const handleEditPost = (e: FormEvent<HTMLFormElement>) => {
        console.log('edit submit')
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const tags = formData.get('tags') as string
        const data = {
            title: formData.get('title') as string,
            tags: tags.split(/,\s*/),
            content: formData.get('content') as string,
            id: id!
        }
        mutateEditPost(data)
    }

    if (post.error || mutateCreateCommentError || mutateDeletePostError || mutateEditPostError) {
        return (
            <AbsoluteCenter>
                <Text color='red'>Error</Text>
            </AbsoluteCenter>
        )
    }

    if (post.isLoading) {
        return (
            <AbsoluteCenter>
                <Spinner color='purple.500' />
            </AbsoluteCenter>
        )
    }

    const goBack = () => navigate(-1)

    return (
        <ScaleFade initialScale={0.9} in={true}>
            <Box pt='56px'>
                <Box ml={2} my={4} w='fit-content'>
                    <ChakraLink as={Link} onClick={goBack} display='flex' color='purple.500' alignItems='center'>
                        <ChevronLeft height={24} width={24} /><span>Back</span>
                    </ChakraLink>
                </Box>
                <Card maxW={cardMaxW} mx='auto'>
                    <CardHeader>
                        <Text fontSize='xl' fontWeight='semibold'>{post.data?.title}</Text>
                    </CardHeader>
                    <CardBody mt={-6}>
                        <Text color='grey'>{post.data?.content}</Text>
                    </CardBody>
                    <CardFooter mt={-6} ml='auto' color='#bababa' display='flex' flexDir='column' w='100%'>
                        <Flex justifyContent='space-between'>
                            <Box mr='auto'>
                                <Text>{post.data?.creationDate.toDate().toLocaleString().split(',')[0]}</Text>
                            </Box>
                            <Box display='flex' flexDir='row' alignItems='center' gap={2}>
                                <MessageSquareIcon /><Text>{post.data?.comments.length}</Text>
                            </Box>
                        </Flex>
                        {post.data?.username == user?.displayName && (
                            <Menu autoSelect={false}>
                                <MenuButton
                                    as={IconButton}
                                    aria-label='Options'
                                    icon={<EllipsisIcon />}
                                    variant='ghost'
                                    size='xs'
                                    alignSelf='end'
                                    mt={4}
                                />
                                <Portal>
                                    <MenuList>
                                        <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                                        <MenuItem onClick={editPostModal.onOpen}>Edit</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        )}
                    </CardFooter>
                </Card>
                <Center>
                    <Button type='submit' colorScheme='purple' w={cardMaxW} mt={4} onClick={commentModal.onOpen}>Leave a comment</Button>
                </Center>
                <Box mt={8} pb={20}>
                    {post.data?.comments.map(comment => {
                        return (
                            <CommentCard data={comment} postId={id as string} />
                        )
                    })}
                </Box>
                <Modal isOpen={commentModal.isOpen} onClose={commentModal.onClose}>
                    <Portal>
                        <ModalOverlay />
                        <ModalContent mx='4'>
                            <ModalHeader>Comment</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <label htmlFor='comment'>Comment Content</label>
                                <Textarea placeholder='My Comment' id='comment' mt={1} onChange={e => setContent(e.target.value)} />
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='purple' mr={3} onClick={handleCreateComment} isDisabled={isSubmitDisabled}>Submit</Button>
                                <Button colorScheme='red' onClick={commentModal.onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Portal>
                </Modal>
                <Modal isOpen={editPostModal.isOpen} onClose={editPostModal.onClose}>
                    <Portal>
                        <ModalOverlay />
                        <ModalContent mx='4' as='form' onSubmit={handleEditPost}>
                            <ModalHeader>Create Post</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <label htmlFor='title'>Post title</label>
                                <Input
                                    type='text'
                                    placeholder='Title'
                                    id='title'
                                    mb='1.5rem'
                                    mt={1}
                                    defaultValue={post.data?.title}
                                    name='title'
                                />

                                <label htmlFor='tags'>Post tags</label>
                                <Input
                                    type='text'
                                    placeholder='Tags (ex: tag1, tag2, tag3, ...)'
                                    id='tags'
                                    mb='1.5rem'
                                    mt={1}
                                    defaultValue={post.data?.tags}
                                    name='tags'
                                />

                                <label htmlFor='content'>Post Content</label>
                                <Textarea
                                    placeholder='My post'
                                    id='content'
                                    mt={1}
                                    defaultValue={post.data?.content}
                                    name='content'
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='purple' mr={3} type='submit' isLoading={isMutateEditPostPending}>Submit</Button>
                                <Button colorScheme='red' onClick={editPostModal.onClose} isLoading={isMutateEditPostPending}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Portal>
                </Modal>
            </Box>
        </ScaleFade>
    )
}