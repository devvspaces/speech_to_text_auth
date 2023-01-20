
import React, { useState, useRef } from 'react'

import { Flex, Heading, Input, Button, Radio, RadioGroup, Stack, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton, useColorModeValue, useToast } from '@chakra-ui/react';
import { AlertType, ErrorAlerts } from '../components/alert';
import { createSumbitHandler } from '../utils/formHandler';
import { Loader } from '../components/loading';
import SpeechComponent from '../components/speech';



const IndexPage = () => {

    const [value, setValue] = useState('1')

    const formBg = useColorModeValue("gray.200", "gray.700");
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const [alerts, setAlerts] = useState<AlertType[]>([])

    // Create a new submit handler that handles submit events
    const handelSubmit = createSumbitHandler({
        setLoading,
        setAlerts,
        toast,
        toastTitle: 'Registered',
        toastDescription: 'You are registered successfully',
        redirectUrl: '/profile',
        apiEndpoint: 'register'
    });

    type SpeechToTextField = {
        [key: string]: {
            type: string,
            placeholder: string,
            field: React.ReactElement | null
        }
    }

    const speechToTextFields: SpeechToTextField = {
        email: {
            type: "email",
            placeholder: "Your Email",
            field: null
        },
        fullname: {
            type: "text",
            placeholder: "Your Fullname",
            field: null
        },
        phone: {
            type: "text",
            placeholder: "Your Phone number",
            field: null
        },
        country: {
            type: "text",
            placeholder: "Your Country",
            field: null
        }
    }

    // Generate SpeechComponent for each fields in speechToTextFields
    Object.keys(speechToTextFields).forEach((value, index) => {
        const focusRef = useRef(null)
        const [field, setField] = useState("")

        const conf = speechToTextFields[value];
        conf.field = (
            <Flex mb={4} key={index}>
                <Input onChange={(e) => { setField(e.currentTarget.value) }} value={field} ref={focusRef} name={value} placeholder={conf.placeholder} variant="filled" type={conf.type} />
                <SpeechComponent callback={setField} focusRef={focusRef} />
            </Flex>
        )
    })

    return (

        <>
            <Flex mt={"5rem"} alignItems="center" justifyContent="center">

                <form action="" onSubmit={handelSubmit} method='post'>
                    <Flex width="450px" direction="column" background={formBg} p={"4rem 1.5rem"} rounded={6}>

                        <Heading mb={12}>Register</Heading>

                        <Loader loading={loading} />

                        <ErrorAlerts errors={alerts} />

                        {speechToTextFields.fullname.field}

                        {speechToTextFields.email.field}

                        {/* SEX */}
                        <Text as='h6' mb={2}>Sex</Text>
                        <RadioGroup aria-required name='sex' onChange={setValue} value={value} mb={5}>
                            <Stack direction='row'>
                                <Radio value='M'>Male</Radio>
                                <Radio value='F'>Female</Radio>
                            </Stack>
                        </RadioGroup>

                        {speechToTextFields.phone.field}
                        {speechToTextFields.country.field}

                        <Input required name='password' placeholder="Enter a strong password" variant="filled" mb={5} type="password" />
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
