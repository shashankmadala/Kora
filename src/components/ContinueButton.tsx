import { Button, useTabsContext } from '@chakra-ui/react'

export default function ContinueButton() {
    const { setSelectedIndex } = useTabsContext()

    return (
        <Button onClick={() => setSelectedIndex(1)} type='button' variant='link' colorScheme='purple' size='sm' fontWeight='normal'>Continue &rarr;</Button>
    )
}
