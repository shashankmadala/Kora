import { Card, CardBody, CardFooter, CardHeader, Flex, HStack, Tag, Text } from '@chakra-ui/react'
import { MessageSquareIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PostCard(props: Post) {
    return (
        <Card 
            as={Link} 
            to={`/app/post/${props.id}`} 
            w='100%' 
            userSelect='none' 
            _active={{ bg: '#F7F7F7' }} 
            _hover={{ 
                bg: '#F7F7F7',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}
            transition='all 0.2s ease'
            borderRadius='16px'
            boxShadow='0 2px 10px rgba(0,0,0,0.05)'
        >
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