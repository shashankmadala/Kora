import { Button, Card, CardBody, CardHeader, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { cardMaxW } from '../utils/constants'
import { useUser } from '../firebase/useUser'
import { EllipsisVerticalIcon } from 'lucide-react'
import { deleteComment } from '../utils/deleteComment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editComment } from '../utils/editComment'
import { FormEvent } from 'react'

export default function CommentCard({ data, postId }: { data: PostComment, postId: string }) {
    const { user } = useUser()
    const queryClient = useQueryClient()
    const editCommentModal = useDisclosure()
    const toast = useToast()

    const { mutate: mutateDeleteComment } = useMutation({
        mutationFn: deleteComment,
        onSuccess: (_, { id }: DeleteCommentArgs) => {
            queryClient.setQueryData(['post', postId], (prev: Post) => {
                const updatedComments = prev.comments.filter((comment: any) => comment.id != id)
                return { ...prev, comments: updatedComments }
            })
            toast({
                title: 'Comment Successfully Deleted!',
                colorScheme: 'green',
                isClosable: true
            })
        }
    })

    const { mutate: mutateEditComment, isPending: isMutateEditCommentPending } = useMutation({
        mutationFn: editComment,
        onSuccess: (_, { content, commentId }) => {
            queryClient.setQueryData(['post', postId], (post: Post) => {
                const comments = post.comments
                const index = comments.findIndex(comment => comment.id == commentId)
                comments[index].content = content
                return post
            })
            editCommentModal.onClose()
            toast({
                title: 'Comment Successfully Edited!',
                colorScheme: 'green',
                isClosable: true
            })
        }
    })

    const handleDeleteComment = () => mutateDeleteComment({ username: user?.displayName as string, content: data.content, id: data.id, postId })

    const handleEditComment = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const content = new FormData(e.currentTarget).get('content') as string
        mutateEditComment({ username: user?.displayName!, content, postId, commentId: data.id })
    }

    return (
        <>
            <Card maxW={cardMaxW} mx='auto' mt='4'>
                <CardHeader display='flex' flexDir='row' alignItems='center' justifyContent='space-between'>
                    <Text>{data.username}</Text>
                    {data.username == user?.displayName && (
                        <Menu autoSelect={false}>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<EllipsisVerticalIcon />}
                                variant='ghost'
                                size='xs'
                            />
                            <Portal>
                                <MenuList>
                                    <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
                                    <MenuItem onClick={editCommentModal.onOpen}>Edit</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    )}
                </CardHeader>
                <CardBody mt={-8}>
                    <Text color='grey'>{data.content}</Text>
                </CardBody>
            </Card>
            <Modal isOpen={editCommentModal.isOpen} onClose={editCommentModal.onClose}>
                <Portal>
                    <ModalOverlay />
                    <ModalContent mx='4' as='form' onSubmit={handleEditComment}>
                        <ModalHeader>Create Post</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <label htmlFor='content'>Post Content</label>
                            <Textarea
                                placeholder='My post'
                                id='content'
                                mt={1}
                                defaultValue={data?.content}
                                name='content'
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='purple' mr={3} type='submit' isLoading={isMutateEditCommentPending}>Submit</Button>
                            <Button colorScheme='red' onClick={editCommentModal.onClose} isLoading={isMutateEditCommentPending}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Portal>
            </Modal>
        </>
    )
}