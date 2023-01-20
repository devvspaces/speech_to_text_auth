
import { Button, CircularProgress, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, ModalFooter, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import useSound from 'use-sound';
import { ChatIcon } from '@chakra-ui/icons'
import { MutableRefObject } from 'react';


/**
 * 
 * Speech to Text component
 * It creates a new button and modal for Speech to text functionality
 * 
 * @param callback - A function to invoke with the result of the speech to text,
 * a function is used to enable the user perform extra actions with the result.
 * For example the user could clean the results before setting it.
 * @param focusRef - Used to focus on an element after modal closes
 * @returns 
 */
const SpeechComponent = ({
    callback,
    focusRef,
}: {
    callback: (result: string) => void,
    focusRef?: MutableRefObject<any>
}) => {

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

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)
    
    // Use this to set different states of the recording flow
    enum RecordingState {
        Init,
        Recording,
        Translating,
        Translated,
    }

    const [recording, setRecording] = useState<RecordingState>(RecordingState.Init)
    const [translated, setTranslatedText] = useState("")
    const onModalClose = () => {
        setRecording(RecordingState.Init)
        setTranslatedText("")
        onClose()
    }

    return (

        <>
            <Button onClick={onOpen} ms={3} colorScheme="blue"><ChatIcon /></Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={focusRef}
                isOpen={isOpen}
                onClose={onModalClose}
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
                                        Result: <strong>{translated}</strong>
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
                                    // Dynamically load recordrtc
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

                                                if (response.status === 200) {
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
                                        setTranslatedText("")
                                    }} >Redo</Button>
                                    <Button colorScheme='green' mr={3} onClick={() => {
                                        callback(translated);
                                        playSuccess()
                                        onModalClose()
                                    }}>Done</Button>
                                </>
                            )
                        }

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>


    )
}

export default SpeechComponent;