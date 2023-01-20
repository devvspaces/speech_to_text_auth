
import { NextApiResponse, NextApiRequest } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make a request to the backend to login the user
    const BASE_URL = 'http://localhost:8000/api/v1'
    const response = await fetch(`${BASE_URL}/account/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (response.status === 200) {
        // Get the token from the response
        const token = data.tokens.access

        // Set the token in the cookie
        res.setHeader('Set-Cookie', `token=${token}; path=/; httponly`)

        return res.status(200).json(data)
    }

    return res.status(400).json(data)
}
