import { CreateToastFnReturn } from "@chakra-ui/react"
import { AlertType } from "../components/alert"


/**
 * Create a submit handler for a form
 * @param setLoading - A function to set the loading state
 * @param setAlerts - A function to set the alerts state
 * @param toast - A function to create a toast
 * @param toastTitle - The title of the toast
 * @param toastDescription - The description of the toast
 * @param apiEndpoint - The endpoint to send the form data to
 * @param redirectUrl - The url to redirect to after the form is submitted
 * @returns A function that handles the form submission
 * @example
 * ```tsx
 * const submitHandler = createSubmitHandler({
 *    setLoading,
 *    setAlerts,
 *    toast,
 *    toastTitle: 'Success',
 *    toastDescription: 'Your account has been created',
 *    apiEndpoint: 'register',
 *    redirectUrl: '/profile'
 * })
 * ```
 * 
 * ```tsx
 * <form onSubmit={submitHandler}>
 * </form>
 * ```
*/
export const createSumbitHandler = ({
    setLoading,
    setAlerts,
    toast,
    toastTitle,
    toastDescription,
    apiEndpoint,
    redirectUrl,
}: {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setAlerts: React.Dispatch<React.SetStateAction<AlertType[]>>
    toast: CreateToastFnReturn,
    toastTitle: string,
    toastDescription: string,
    apiEndpoint: string,
    redirectUrl: string,
}
) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setAlerts([])

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = Object.fromEntries(formData.entries())

    // Send the data to the API
    const response = await fetch(`/api/${apiEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()

    // Handle the response
    if (response.status === 200 || response.status === 201) {
        toast({
            title: toastTitle,
            description: toastDescription,
            status: 'success',
            duration: 9000,
            variant: 'left-accent',
            position: 'top-right',
        })

        setTimeout(() => {
            window.location.href = redirectUrl
        }, 3000)

    } else {
        console.log(result)
        // Error handling
        const alerts = Object.keys(result).map((field) => {
            return {
                field,
                message: result[field].join('\n')
            }
        })
        setAlerts(alerts)
    }

    setLoading(false)
}