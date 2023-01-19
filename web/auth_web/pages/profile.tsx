
import React, { useState } from 'react'

import { Flex, Heading, Input, Button, Radio, RadioGroup, Stack, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton } from '@chakra-ui/react';


type User = {
    email: string,
    profile: {
        fullname: string,
        country: string,
        phone: string,
        sex: string
    }
}

const IndexPage = ({ user }: { user: User }) => {

    return (

        <>

            <Alert status={'success'} mb={4} variant='left-accent'>
                <AlertIcon />
                <AlertTitle>Logged In</AlertTitle>
                <AlertDescription>
                    You are logged in as {user.email}
                </AlertDescription>
            </Alert>

            <Flex height="100vh" padding={"10rem 0"} alignItems="center" justifyContent="center">

                <Flex direction="column" background="gray.200" padding={12} rounded={6} width={"25vw"}>
                    <Heading mb={6}>Profile</Heading>

                    <Text fontWeight={'bold'} mb={2}>Fullname</Text>
                    <Text mb={6}>{user.profile.fullname}</Text>

                    <Text fontWeight={'bold'} mb={2}>Email</Text>
                    <Text mb={6}>{user.email}</Text>

                    <Text fontWeight={'bold'} mb={2}>Country</Text>
                    <Text mb={6}>{user.profile.country}</Text>

                    <Text fontWeight={'bold'} mb={2}>Phone</Text>
                    <Text mb={6}>{user.profile.phone}</Text>

                    <Text fontWeight={'bold'} mb={2}>Sex</Text>
                    <Text mb={6}>{user.profile.sex}</Text>

                </Flex>
            </Flex>

        </>

    )

}

export default IndexPage


export const getServerSideProps = async (context: any) => {
    const { req, res } = context;
    const { cookies } = req;

    const { token } = cookies;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    // Make api request to get user details
    const BASE_URL = 'http://localhost:8000/api/v1'
    const response = await fetch(`${BASE_URL}/account/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    const result: User = await response.json()

    return {
        props: {
            user: result
        }
    }
}
