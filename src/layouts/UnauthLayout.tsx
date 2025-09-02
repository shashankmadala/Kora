import { useUser } from '../firebase/useUser'
import { Outlet, useNavigate } from 'react-router-dom'
import PageLoader from '../components/PageLoader'

export default function UnauthLayout() {
    const { user } = useUser()
    const navigate = useNavigate()

    if (user !== null) {
        navigate('/app', { replace: true })
        return (
            <PageLoader />
        )
    }

    if (user === undefined) {
        return <PageLoader />
    }

    return (
        <Outlet />
    )
}