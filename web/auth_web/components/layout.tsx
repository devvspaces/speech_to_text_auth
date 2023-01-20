import { Button, Container, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';


export default function Layout({ children }) {

    const { toggleColorMode } = useColorMode();

    const bgColor = useColorModeValue('dark', 'light');
    return (
        <>
            <Button display={'block'} m={'2rem auto 0'} colorScheme='teal' onClick={toggleColorMode}>
                {bgColor === 'dark' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Container py={'10'}>{children}</Container>
        </>
    )
}