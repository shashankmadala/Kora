import { Button, FormControl, FormLabel, Input, Radio, RadioGroup, Stack, Spinner, Heading, useToast, Box, Link as ChakraLink, AbsoluteCenter, ScaleFade } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getProfile } from '../utils/getProfile'
import { useUser } from '../firebase/useUser'
import { editProfile } from '../utils/editProfile'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const textInputs = [
    'Child Name',
    'Child Age',
    'Diagnosis Date',
    'Sensory Sensitivities',
    'Current Therapies',
    'Preferred Calming Techniques',
    'Key Behavioral Traits'
]

export default function ProfilePage() {
    const { user } = useUser()
    const [data, setData] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const toast = useToast()

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev: any) => {
            return { ...prev, ...{ [e.target.placeholder]: e.target.value } }
        })
    }

    const handleRadio = (value: string) => {
        setData((prev: any) => {
            return { ...prev, ...{ 'Primary Method of Communication': value } }
        })
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (data) {
            await editProfile({ data, userId: user?.uid! })
            toast({
                title: 'Profile Successfully Updated!',
                colorScheme: 'green',
                isClosable: true
            })
            navigate('/')
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const profile = await getProfile({ userId: user?.uid! })
            setData(profile)
            setLoading(false)
        }

        fetchData()
    }, [user])

    const goBack = () => navigate(-1)

    return (
        <>
            {loading && (
                <AbsoluteCenter>
                    <Spinner color='purple.500' />
                </AbsoluteCenter>
            )}
            {data && (
                <ScaleFade initialScale={0.9} in={true}>
                    <Box mt='4.5rem' ml={2} w='fit-content'>
                        <ChakraLink as={Link} onClick={goBack} display='flex' color='purple.500' alignItems='center'>
                            <ChevronLeft height={24} width={24} /><span>Back</span>
                        </ChakraLink>
                    </Box>
                    <Stack gap='1rem' w='calc(100vw - 48px)' bg='white' p='1rem' mt='1rem' mb='4.5rem' mx='auto' rounded='md' as='form' onSubmit={handleUpdate}>
                        <Heading textAlign='center'>My Profile</Heading>
                        {textInputs.map(key => {
                            if (key == 'Diagnosis Date') {
                                return (
                                    <FormControl key={key}>
                                        <FormLabel>{key}</FormLabel>
                                        <Input placeholder={key} onChange={handleInput} type='date' value={data?.[key]} />
                                    </FormControl>
                                )
                            }
                            return (
                                <FormControl key={key}>
                                    <FormLabel>{key}</FormLabel>
                                    <Input placeholder={key} onChange={handleInput} type='text' value={data?.[key as keyof Profile] as string} />
                                </FormControl>
                            )
                        })}
                        <FormControl as='fieldset'>
                            <FormLabel as='legend'>Primary Method of Communication</FormLabel>
                            <RadioGroup onChange={handleRadio} value={data?.['Primary Method of Communication']}>
                                <Stack spacing='24px'>
                                    <Radio value='Verbal'>Verbal</Radio>
                                    <Radio value='Non-verbal'>Non-verbal</Radio>
                                    <Radio value='Combination of both'>Combination of both</Radio>
                                    <Radio value='AAC Device'>AAC Device</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <Button colorScheme='purple' textAlign='center' type='submit' my={3}>Save Changes</Button>
                    </Stack>
                </ScaleFade>
            )}
        </>
    )
}