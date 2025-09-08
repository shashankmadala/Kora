import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import ChatBotPage from './pages/ChatBotPage'
import CameraPage from './pages/CameraPage'
import CommunityPage from './pages/CommunityPage'
import ResourcesPage from './pages/ResourcesPage'
import SignUpPage from './pages/SignUpPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostPage from './pages/PostPage'
import UnauthLayout from './layouts/UnauthLayout'
import ModelProvider from './providers/ModelProvider'
import HelpUsImprovePage from './pages/HelpUsImprovePage'
import HelpPage from './pages/HelpPage'
import ProfilePage from './pages/ProfilePage'
import EmotionGamesPage from './pages/EmotionGamesPage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorPage from './pages/ErrorPage'

const queryClient = new QueryClient()

const theme = extendTheme({
    colors: {
        brand: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
        },
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        }
    },
    fonts: {
        heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: '#faf5ff',
                color: '#111827',
                minHeight: '100vh',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: '600',
                borderRadius: '12px',
                transition: 'all 0.2s ease-in-out',
                _hover: {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
            },
            variants: {
                primary: {
                    bg: '#a855f7',
                    color: 'white',
                    _hover: {
                        bg: '#9333ea',
                    },
                },
                secondary: {
                    bg: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    _hover: {
                        bg: '#e5e7eb',
                    },
                },
            },
        },
        Input: {
            defaultProps: {
                focusBorderColor: '#a855f7',
                variant: 'outline',
            },
            variants: {
                outline: {
                    field: {
                        bg: 'white',
                        border: '1px solid #e5e7eb',
                        color: '#111827',
                        _hover: {
                            borderColor: '#d1d5db',
                        },
                        _focus: {
                            borderColor: '#a855f7',
                            boxShadow: '0 0 0 1px #a855f7',
                        },
                    },
                },
            },
        },
        Textarea: {
            defaultProps: {
                focusBorderColor: '#a855f7',
                variant: 'outline',
            },
            variants: {
                outline: {
                    bg: 'white',
                    border: '1px solid #e5e7eb',
                    color: '#111827',
                    _hover: {
                        borderColor: '#d1d5db',
                    },
                    _focus: {
                        borderColor: '#a855f7',
                        boxShadow: '0 0 0 1px #a855f7',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        Modal: {
            baseStyle: {
                dialog: {
                    bg: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                },
            },
        },
    },
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
                                <Route path='games' Component={EmotionGamesPage} />
                                <Route index Component={HomePage} />
                                <Route path='chatbot' Component={ChatBotPage} />
                                <Route path='resources' Component={ResourcesPage} />
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
