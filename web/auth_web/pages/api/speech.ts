
import { NextApiResponse, NextApiRequest } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Make a request to the backend to register the user
    const BASE_URL = 'http://localhost:8000/api/v1'
    const response = await fetch(`${BASE_URL}/account/speech-to-text/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (response.status === 200) {
        return res.status(200).json(data)
    }

    return res.status(400).json(data)
}