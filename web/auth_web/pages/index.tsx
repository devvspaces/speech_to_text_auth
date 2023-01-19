
import { Flex, Heading, Input, Button, useColorMode, useColorModeValue } from '@chakra-ui/react';

const IndexPage = () => {

    const { toggleColorMode } = useColorMode();

    const formBg = useColorModeValue("gray.200", "gray.700");

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex direction="column" background={formBg} p={12} rounded={6}>

                <Heading mb={6}>Log In</Heading>
                <Input placeholder="test@gmail.com" variant="filled" mb={3} type="email" />
                <Input placeholder="**************" variant="filled" mb={6} type="password" />

                <Button colorScheme='teal' mb={6}>Log In</Button>
                <Button colorScheme='red' onClick={toggleColorMode}>Toggle</Button>

            </Flex>
        </Flex>
    )

}

export default IndexPage
