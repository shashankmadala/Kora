import { Stack, Input, Button, Box, Link, RadioGroup, FormLabel, FormControl, Radio, TabList, Tab, Tabs, TabPanels, TabPanel, useToast, Flex } from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { register } from '../firebase/auth'
import ContinueButton from '../components/ContinueButton'

const textInputs = [
    'Child Name',
    'Child Age',
    'Diagnosis Date',
    'Sensory Sensitivities',
    'Current Therapies',
    'Preferred Calming Techniques',
    'Key Behavioral Traits'
]

export default function SignUpPage() {
    const [data, setData] = useState({
        'Name': '',
        'Email': '',
        'Password': '',
        'Child Name': '',
        'Child Age': '',
        'Diagnosis Date': '',
        'Sensory Sensitivities': '',
        'Current Therapies': '',
        'Preferred Calming Techniques': '',
        'Primary Method of Communication': ''
    })
    const toast = useToast()

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault()
        try {
            if (Object.values(data).some(val => val == '')) throw new Error('Please Fill Out Everything')
            await register(data)
        } catch (e) {
            toast({
                title: `${e}`,
                colorScheme: 'red',
                isClosable: true
            })
            console.log('did not work')
        }
    }

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setData(prev => {
            return { ...prev, ...{ [e.target.placeholder]: e.target.value } }
        })
    }

    const handleRadio = (value: string) => {
        setData(prev => {
            return { ...prev, ...{ 'Primary Method of Communication': value } }
        })
    }

    return (
        <Box display='flex' alignItems='center' justifyContent='center' minH='100vh' width='calc(100% - 32px)' marginInline='auto'>
            <Tabs colorScheme='purple'>
                <TabList w='fit-content' mx='auto' my={4}>
                    <Tab>Account Info</Tab>
                    <Tab>Child Info</Tab>
                </TabList>

                <TabPanels as='form' onSubmit={handleRegister}>
                    <TabPanel>
                        <Box>
                            <Stack gap='1rem' w='100%'>
                                <Input placeholder='Name' type='text' onChange={handleInput} />
                                <Input placeholder='Email' type='email' onChange={handleInput} />
                                <Input placeholder='Password' type='password' onChange={handleInput} />
                                <Flex dir='row' alignItems='center' justifyContent='space-between'>
                                    <Link as={RouterLink} to='/' fontSize='small' color='purple.500' w='fit-content'>Login</Link>
                                    <ContinueButton />
                                </Flex>
                            </Stack>
                        </Box>
                    </TabPanel>

                    <TabPanel>
                        <Stack gap='1rem' w='100%'>
                            {textInputs.map(key => {
                                if (key == 'Diagnosis Date') {
                                    return (
                                        <FormControl key={key}>
                                            <FormLabel>{key}</FormLabel>
                                            <Input placeholder={key} onChange={handleInput} type='date' />
                                        </FormControl>
                                    )
                                }
                                return (
                                    <FormControl key={key}>
                                        <FormLabel>{key}</FormLabel>
                                        <Input placeholder={key} onChange={handleInput} type='text' />
                                    </FormControl>
                                )
                            })}
                            <FormControl as='fieldset'>
                                <FormLabel as='legend'>Primary Method of Communication</FormLabel>
                                <RadioGroup onChange={handleRadio}>
                                    <Stack spacing='24px'>
                                        <Radio value='Verbal'>Verbal</Radio>
                                        <Radio value='Non-verbal'>Non-verbal</Radio>
                                        <Radio value='Combination of both'>Combination of both</Radio>
                                        <Radio value='AAC Device'>AAC Device</Radio>
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                            <Button colorScheme='purple' textAlign='center' type='submit' my={3}>Register</Button>
                        </Stack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

