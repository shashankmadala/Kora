import { Box } from '@chakra-ui/react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useUser } from '../firebase/useUser'
import TopBar from '../components/TopBar'
import BottomBar from '../components/BottomBar'
import PageLoader from '../components/PageLoader'

export default function AppLayout() {
    const { user } = useUser()
    const navigate = useNavigate()

    if (user === null) {
        navigate('/', { replace: true })
        return <PageLoader />
    }

    if (user === undefined) {
        return <PageLoader />
    }

    return (
        <Box minH='100vh' bg='#EEEEEE'>
            <TopBar />
            <Outlet />
            <BottomBar />
        </Box >
    )
}