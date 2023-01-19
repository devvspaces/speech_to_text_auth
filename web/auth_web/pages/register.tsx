
import React, { useState } from 'react'

import { Flex, Heading, Input, Button, Radio, RadioGroup, Stack, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton } from '@chakra-ui/react';


function capitalize(value: string){
    return value.charAt(0).toUpperCase() + value.slice(1)
}

const IndexPage = () => {

    const [value, setValue] = useState('1')

    type Alert = {
        field: string,
        message: string
    }

    const [alerts, setAlerts] = useState<Alert[]>([])

    const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget
        const formData = new FormData(form)

        const data = Object.fromEntries(formData.entries())

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        if (response.status === 201) {
            alert('Registration successful')
            
            // Redirect to the profile page
            window.location.href = '/profile'

        } else {
            console.log('Registration failed')
            // Error handling
            const alerts = Object.keys(result).map((field) => {
                return {
                    field,
                    message: result[field].join('\n')
                }
            })
            setAlerts(alerts)
        }
    }

    return (

        <>
            <Flex height="100vh" padding={"30rem 0"} alignItems="center" justifyContent="center">

                <form action="" onSubmit={handelSubmit} method='post'>
                    <Flex width="25vw" direction="column" background="gray.300" p={12} rounded={6}>

                        <Heading mb={6}>Register</Heading>

                        {
                            alerts.map((alert, index) => {
                                return (
                                    <Alert status='error' mb={4} variant='left-accent'>
                                        <AlertIcon />
                                        <Box>
                                            <AlertTitle mb={2}>{capitalize(alert.field)}</AlertTitle>
                                            <AlertDescription>{alert.message}</AlertDescription>
                                        </Box>
                                    </Alert>
                                )
                            })
                        }

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
                        <Input required name='confirm_password' placeholder="Confirm password" variant="filled" mb={6} type="password" />

                        <Button type='submit' colorScheme='teal' mb={6}>Create New Account</Button>
                    </Flex>
                </form>
            </Flex>
        </>

    )

}

export default IndexPage
