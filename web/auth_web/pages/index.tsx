
import { Flex, Heading, Input, Button, useColorModeValue, CircularProgress, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, useDisclosure, ModalFooter, FormLabel, Text, Checkbox } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AlertType, ErrorAlerts } from '../components/alert';
import { Loader } from '../components/loading';
import { createSumbitHandler } from '../utils/formHandler';
import useSound from 'use-sound';


const IndexPage = () => {

    const [alerts, setAlerts] = useState<AlertType[]>([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const [recorder, setRecorder] = useState<any>()

    const [playSuccess] = useSound(
        '/success.wav',
        {
            volume: 0.25
        }
    );
    const [playRecording] = useSound(
        '/recording.wav',
        {
            volume: 0.25
        }
    );
    const [playTranslating] = useSound(
        '/translating.wav',
        {
            volume: 0.25
        }
    );


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

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)
    const finalRef = useRef(null)

    enum RecordingState {
        Init,
        Recording,
        Translating,
        Translated,
    }

    const [recording, setRecording] = useState<RecordingState>(RecordingState.Init)
    const [translated, setTranslatedText] = useState("")

    return (
        <Flex mt={'5rem'} alignItems="center" justifyContent="center">
            <form action="" method="post" onSubmit={handelSubmit}>
                <Flex width={'350px'} direction="column" background={formBg} p={12} rounded={6}>

                    <Heading textAlign={'center'} mb={12}>Sign In</Heading>

                    <Loader loading={loading} />

                    <ErrorAlerts errors={alerts} />

                    <Input name='email' placeholder="test@gmail.com" variant="filled" mb={3} type="email" />
                    <Input name='password' placeholder="**************" variant="filled" mb={10} type="password" />

                    <Button colorScheme='teal' mb={4} type='submit' disabled={loading ? true : false}>Log In</Button>

                    <Button colorScheme='blue' mb={6} type='button' onClick={() => window.location.href = '/register'}>Register</Button>

                    <Flex>
                        <Button onClick={onOpen}>Open Modal</Button>
                        <Button ml={4} ref={finalRef}>
                            Focus
                        </Button>
                    </Flex>
                </Flex>
            </form>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Speech to Text Helper</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        {
                            recording === RecordingState.Init && (
                                <Text>Record: Use <strong>Speak</strong> to covert your speech to text</Text>
                            )
                        }
                        {
                            recording === RecordingState.Recording && (
                                <Text>Recording: You can speak now, your voice is being recorded</Text>
                            )
                        }
                        {
                            recording === RecordingState.Translating && (
                                <Text>Translating: Your voice is being converted to text</Text>
                            )
                        }
                        {
                            recording === RecordingState.Translated && (
                                <>
                                    <Text>
                                        Translated: Your voice has been converted to text, you can <strong>Redo</strong> to speak again or <strong>Done</strong> to use the result in the input box.
                                    </Text>
                                    <Text mt={3}>
                                        Result: <strong>{ translated }</strong>
                                    </Text>
                                </>
                            )
                        }
                        {
                            (recording === RecordingState.Translating || recording === RecordingState.Recording) && (
                                <CircularProgress mt={4} size={7} isIndeterminate color="green.300" thickness={'10px'} />
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        {
                            recording === RecordingState.Init && (
                                <Button colorScheme='blue' mr={3} onClick={async () => {
                                    // Dynamically load fuse.js
                                    const rtc = (await import('../node_modules/recordrtc'))

                                    const RecordRTC = rtc.default

                                    navigator.mediaDevices.getUserMedia({ audio: true })
                                        .then(async (stream) => {
                                            const recorder = new RecordRTC(stream, {
                                                type: 'audio',
                                                mimeType: 'audio/webm;codecs=pcm',
                                                recorderType: RecordRTC.StereoAudioRecorder,
                                                timeSlice: 250,
                                                desiredSampRate: 16000,
                                                numberOfAudioChannels: 1,
                                                bufferSize: 4096,
                                                audioBitsPerSecond: 128000,
                                            });
                                            recorder.startRecording();
                                            setRecorder(recorder)
                                        })
                                        .catch((err) => console.error(err));

                                    setRecording(RecordingState.Recording);
                                    playRecording();
                                }}>Speak</Button>
                            )
                        }

                        {
                            recording === RecordingState.Recording && (
                                <Button colorScheme='blue' mr={3} onClick={async () => {

                                    if (recorder) {
                                        await recorder.stopRecording(function () {
                                            let blob = recorder.getBlob();
                                            const x = new FileReader();
                                            x.onload = async () => {
                                                const base64data = x.result as string;

                                                // Send the data to the API
                                                const response = await fetch('/api/speech', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        'record': base64data.split('base64,')[1]
                                                    })
                                                })

                                                if (response.status === 200){
                                                    const data = await response.json()
                                                    setTranslatedText(data.text);
                                                } else {
                                                    alert("Error translating, try again later");
                                                    setRecording(RecordingState.Init)
                                                }
                                            };
                                            x.readAsDataURL(blob);
                                        });
                                        setRecorder(null)
                                    }

                                    setRecording(RecordingState.Translating)
                                    playTranslating();
                                    setTimeout(() => {
                                        setRecording(RecordingState.Translated)
                                    }, 3000);
                                }}>Convert to Text</Button>
                            )
                        }

                        {
                            recording === RecordingState.Translated && (
                                <>
                                    <Button colorScheme='yellow' mr={3} onClick={() => {
                                        setRecording(RecordingState.Init)
                                    }} >Redo</Button>
                                    <Button colorScheme='green' mr={3} onClick={() => {
                                        setRecording(RecordingState.Init)
                                        setTranslatedText("Hi, I am a speech to text helper")
                                        playSuccess()
                                        onClose()
                                    }}>Done</Button>
                                </>
                            )
                        }

                    </ModalFooter>
                </ModalContent>
            </Modal>
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