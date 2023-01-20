
import React, { useState } from 'react'

import { Flex, Heading, Input, Button, Radio, RadioGroup, Stack, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton, useColorModeValue, useToast } from '@chakra-ui/react';
import { AlertType, ErrorAlerts } from '../components/alert';
import { createSumbitHandler } from '../utils/formHandler';
import { Loader } from '../components/loading';



const IndexPage = () => {

    const [value, setValue] = useState('1')

    const formBg = useColorModeValue("gray.200", "gray.700");
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const [alerts, setAlerts] = useState<AlertType[]>([])

    const handelSubmit = createSumbitHandler({
        setLoading,
        setAlerts,
        toast,
        toastTitle: 'Registered',
        toastDescription: 'You are registered successfully',
        redirectUrl: '/profile',
        apiEndpoint: 'register'
    });

    return (

        <>
            <Flex mt={"5rem"} alignItems="center" justifyContent="center">

                <form action="" onSubmit={handelSubmit} method='post'>
                    <Flex width="25vw" direction="column" background={formBg} p={12} rounded={6}>

                        <Heading mb={12}>Register</Heading>

                        <Loader loading={loading} />

                        <ErrorAlerts errors={alerts} />

                        <Input required name='fullname' placeholder="Your Fullname" variant="filled" mb={4} type="text" />

                        <Input required name='email' placeholder="Your Email" variant="filled" mb={4} type="email" />

                        {/* SEX */}
                        <Text as='h6' mb={2}>Sex</Text>
                        <RadioGroup aria-required name='sex' onChange={setValue} value={value} mb={4}>
                            <Stack direction='row'>
                                <Radio value='M'>Male</Radio>
                                <Radio value='F'>Female</Radio>
                            </Stack>
                        </RadioGroup>

                        <Input required name='phone' placeholder="Phone number" variant="filled" mb={4} type="phone" />
                        <Input required name='country' placeholder="Your Country" variant="filled" mb={4} type="text" />
                        <Input required name='password' placeholder="Enter a strong password" variant="filled" mb={4} type="password" />
                        <Input required name='confirm_password' placeholder="Confirm password" variant="filled" mb={12} type="password" />

                        <Button type='submit' colorScheme='teal' mb={4}>Create New Account</Button>

                        <Button type='button' colorScheme='blue' onClick={() => window.location.href = '/'}>Login</Button>
                    </Flex>
                </form>
            </Flex>
        </>

    )

}

export default IndexPage
