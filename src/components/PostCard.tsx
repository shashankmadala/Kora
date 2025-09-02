import { Card, CardBody, CardFooter, CardHeader, Flex, HStack, Tag, Text } from '@chakra-ui/react'
import { MessageSquareIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PostCard(props: Post) {
    return (
        <Card as={Link} to={`/app/post/${props.id}`} maxW={320} w='100%' mx='auto' userSelect='none' _active={{ bg: '#F7F7F7' }} _hover={{ bg: '#F7F7F7' }}>
            <CardHeader>
                <Text fontSize='small' color='grey'>{props.username}</Text>
                <Text fontSize='large' fontWeight='medium'>{props.title}</Text>
            </CardHeader>
            <CardBody mt={-8} mb={-6}>
                <Text fontSize='small' color='grey'>{props.content}</Text>
                <Flex gap={4} flexWrap='wrap' mt={4}>
                    {props.tags.map(tag => {
                        return (
                            <Tag colorScheme='purple'>{tag}</Tag>
                        )
                    })}
                </Flex>
            </CardBody>
            <CardFooter color='#bababa' display='flex' flexDir='row' alignItems='center' justifyContent='space-between' gap={2}>
                <Text>{props.creationDate.toDate().toLocaleString().split(',')[0]}</Text>
                <HStack>
                    <MessageSquareIcon /><Text>{props?.comments?.length}</Text>
                </HStack>
            </CardFooter>
        </Card>
    )
}