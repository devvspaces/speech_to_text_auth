
import { Flex, Heading, Input, Button, useColorModeValue, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { AlertType, ErrorAlerts } from '../components/alert';
import { Loader } from '../components/loading';
import SpeechComponent from '../components/speech';
import { createSumbitHandler } from '../utils/formHandler';


const IndexPage = () => {

    const [alerts, setAlerts] = useState<AlertType[]>([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    // Create a new submit handler that handles submit events
    const handelSubmit = createSumbitHandler({
        setLoading,
        setAlerts,
        toast,
        toastTitle: 'Logged In',
        toastDescription: 'You are logged in',
        redirectUrl: '/profile',
        apiEndpoint: 'login'
    });

    const formBg = useColorModeValue("gray.200", "gray.700");

    const emailRef = useRef(null)
    const [email, setEmail] = useState("")

    return (
        <Flex mt={'5rem'} alignItems="center" justifyContent="center">
            <form action="" method="post" onSubmit={handelSubmit}>
                <Flex width={'350px'} direction="column" background={formBg} p={"4rem 1.5rem"} rounded={6}>

                    <Heading textAlign={'center'} mb={12}>Sign In</Heading>

                    <Loader loading={loading} />

                    <ErrorAlerts errors={alerts} />

                    <Flex mb={3}>
                        <Input onChange={(e) => {
                            setEmail(e.currentTarget.value)
                        }} value={email} ref={emailRef} name='email' placeholder="test@gmail.com" variant="filled" type="email" />
                        <SpeechComponent callback={(result) => {
                            // Clean result maybe
                            setEmail(result)
                        }} focusRef={emailRef} />
                    </Flex>
                    <Input name='password' placeholder="**************" variant="filled" mb={10} type="password" />

                    <Button colorScheme='teal' mb={4} type='submit' disabled={loading ? true : false}>Log In</Button>

                    <Button colorScheme='blue' mb={6} type='button' onClick={() => window.location.href = '/register'}>Register</Button>
                </Flex>
            </form>

        </Flex>
    )

}

export default IndexPage



export const getServerSideProps = async (context: any) => {
    const { req } = context;
    const { cookies } = req;

    const { token } = cookies;

    if (token) {
        return {
            redirect: {
                destination: '/profile',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}