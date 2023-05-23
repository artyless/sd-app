import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// @ts-ignore
const SD_API_URL: string = process.env.SD_API_URL

const router: Router = Router()

// /api/sd/txt2img
router.post('/txt2img', auth, async (req: Request, res: Response) => {
    try {
        const {id, promptText, imageCount, imageSize} = req.body

        const sendingData = {
            prompt: promptText,
            steps: 5,
            n_iter: imageCount
        }

        axios.post(SD_API_URL + '/txt2img', sendingData)
            .then((response) => {
                res.status(200).json({message: 'Image has been generated', data: response.data})
            })
            .catch((error) => {
                console.error(error)
                res.status(500).json({message: "Something went wrong, try again"})
            })
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
