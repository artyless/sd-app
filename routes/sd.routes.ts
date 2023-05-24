import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const SD_API_URL: string = process.env.SD_API_URL!

const router: Router = Router()

// /api/sd/txt2img
router.post('/txt2img', auth, async (req: Request, res: Response) => {
    try {
        const {promptText, imageCount} = req.body

        const sendingData = {
            prompt: promptText,
            steps: 10,
            n_iter: imageCount
        }

        const response = await axios.post(SD_API_URL + '/txt2img', sendingData)
        res.status(200).json({message: 'Image has been generated', data: response.data})
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({message: 'Error while generating image'})
    }
})

export default router
