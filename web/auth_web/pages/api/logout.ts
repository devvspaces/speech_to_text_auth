
import { NextApiResponse, NextApiRequest } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Delete cookies
    res.setHeader('Set-Cookie', `token=; path=/; httponly`)
    res.status(200).json({message: 'Logged out'})
}