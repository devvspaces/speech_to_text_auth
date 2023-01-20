
import React, { useEffect } from 'react'

import { Flex, Heading, Button, Text, useColorModeValue } from '@chakra-ui/react';


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

    const formBg = useColorModeValue("gray.200", "gray.700");

    const logoutClick = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            window.location.href = '/'
        }
    }

    // Speak after user is logged in
    useEffect(() => {
        const msg = new SpeechSynthesisUtterance(`Welcome ${user.profile.fullname}. Enjoy your stay.`);
        window.speechSynthesis.speak(msg);
    }, [])

    return (

        <Flex padding={"10rem 0"} alignItems="center" justifyContent="center">

            <Flex direction="column" background={formBg} padding={12} rounded={6} width={"25vw"}>
                <Heading mb={6}>Profile</Heading>

                <Text fontWeight={'bold'} mb={2}>Fullname</Text>
                <Text mb={6}>{user.profile.fullname || "-"}</Text>

                <Text fontWeight={'bold'} mb={2}>Email</Text>
                <Text mb={6}>{user.email}</Text>

                <Text fontWeight={'bold'} mb={2}>Country</Text>
                <Text mb={6}>{user.profile.country || "-"}</Text>

                <Text fontWeight={'bold'} mb={2}>Phone</Text>
                <Text mb={6}>{user.profile.phone || "-"}</Text>

                <Text fontWeight={'bold'} mb={2}>Sex</Text>
                <Text mb={6}>{user.profile.sex || "-"}</Text>

                <Button onClick={logoutClick} colorScheme='red'>Logout</Button>
            </Flex>
        </Flex>

    )

}

export default IndexPage


export const getServerSideProps = async (context: any) => {
    const { req, res } = context;
    const { cookies } = req;

    const { token } = cookies;

    if (!token) {
        // User is not logged in yet
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

    if (response.status === 401) {
        // Token has expired
        // Delete token cookie and redirect to login
        res.setHeader('Set-Cookie', `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)

        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const result: User = await response.json()

    return {
        props: {
            user: result
        }
    }
}
