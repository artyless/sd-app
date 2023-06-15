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
        const {promptText, imageCount, imageSize} = req.body

        const sendingData = {
            prompt: promptText,
            steps: 20,
            n_iter: imageCount,
            width: imageSize,
            height: imageSize
        }

        const response = await axios.post(SD_API_URL + '/txt2img', sendingData)
        res.status(200).json({message: 'Image has been generated', ...response.data})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Error while generating image'})
    }
})

export default router
