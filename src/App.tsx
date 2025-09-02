import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import ChatBotPage from './pages/ChatBotPage'
import CameraPage from './pages/CameraPage'
import CommunityPage from './pages/CommunityPage'
import SignUpPage from './pages/SignUpPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostPage from './pages/PostPage'
import UnauthLayout from './layouts/UnauthLayout'
import ModelProvider from './providers/ModelProvider'
import HelpUsImprovePage from './pages/HelpUsImprovePage'
import HelpPage from './pages/HelpPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorPage from './pages/ErrorPage'

const queryClient = new QueryClient()

const theme = extendTheme({
    components: {
        Input: {
            defaultProps: {
                focusBorderColor: 'purple.500'
            }
        },

        Radio: {
            defaultProps: {
                colorScheme: 'purple'
            }
        },

        Textarea: {
            defaultProps: {
                focusBorderColor: 'purple.500'
            }
        }
    }
})

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <ModelProvider>
                    <HashRouter>
                        <Routes>
                            <Route Component={UnauthLayout} ErrorBoundary={ErrorPage}>
                                <Route path='/' Component={LoginPage} />
                                <Route path='/register' Component={SignUpPage} />
                            </Route>
                            <Route path='/app' Component={AppLayout} ErrorBoundary={ErrorPage}>
                                <Route path='improve' Component={HelpUsImprovePage} />
                                <Route path='profile' Component={ProfilePage} />
                                <Route path='help' Component={HelpPage} />
                                <Route path='camera' Component={CameraPage} />
                                <Route index Component={HomePage} />
                                <Route path='chatbot' Component={ChatBotPage} />
                                <Route path='community' Component={CommunityPage} />
                                <Route path='post/:id' Component={PostPage} />
                            </Route>
                            <Route path='*' Component={NotFoundPage} />
                        </Routes>
                    </HashRouter>
                </ModelProvider>
            </ChakraProvider>
        </QueryClientProvider>
    )
}
