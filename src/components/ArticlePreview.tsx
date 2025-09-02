import { Card, CardBody, Heading, useDisclosure, Text, CardFooter, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'

export default function ArticlePreview({ title, description, url }: { title: string, description: string, url: string }) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Card direction='column' overflow='hidden' variant='outline' cursor='pointer' onClick={onOpen} h="100%" _hover={{ boxShadow: 'lg' }}>
                <CardBody>
                    <Heading size='md' mb={2}>{title}</Heading>
                    <Text fontSize='sm' noOfLines={2}>{description}</Text>
                </CardBody>
                <CardFooter mt={-6}>
                    <Button rightIcon={<ChevronRight size={16} />} colorScheme='purple' size='sm'>Read More</Button>
                </CardFooter>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW='320px'>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mt={-2}>
                        <Text>{description}</Text>
                    </ModalBody>
                    <ModalFooter mt={-2}>
                        <Button as='a' href={url} target='_blank' colorScheme='purple' mr='auto'>Read Full Article</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}