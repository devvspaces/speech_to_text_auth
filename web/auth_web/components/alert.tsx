
import React from 'react'

import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';


function capitalize(value: string){
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export type AlertType = {
    field: string,
    message: string
}

export const ErrorAlerts = ({ errors }: { errors: AlertType[] }) => {
    return (
        <>
            {
                errors.map((alert, index) => {
                    return (
                        <Alert key={index} status='error' mb={4} variant='left-accent'>
                            <AlertIcon />
                            <Box>
                                <AlertTitle mb={2}>{capitalize(alert.field)}</AlertTitle>
                                <AlertDescription>{alert.message}</AlertDescription>
                            </Box>
                        </Alert>
                    )
                })
            }
        </>
    )
}
