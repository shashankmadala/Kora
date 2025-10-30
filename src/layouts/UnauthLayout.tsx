import { useUser } from '../firebase/useUser'
import { Outlet, useNavigate } from 'react-router-dom'
import PageLoader from '../components/PageLoader'
import { useEffect } from 'react'

export default function UnauthLayout() {
    const { user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (user !== null) {
            navigate('/app', { replace: true })
        }
    }, [user, navigate])

    if (user !== null) {
        return <PageLoader />
    }

    if (user === undefined) {
        return <PageLoader />
    }

    return (
        <Outlet />
    )
}