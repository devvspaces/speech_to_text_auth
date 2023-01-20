import { CircularProgress } from "@chakra-ui/react"

export const Loader = ({loading}: {loading: boolean}) => (
    <CircularProgress display={loading ? 'block' : 'none'} alignSelf={'center'} mb={6} isIndeterminate color='blue.500' />
)