import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'

const router: Router = Router()

// /api/sd/txt2img
router.post('/txt2img', auth, async (req: Request, res: Response) => {
    try {
        const {id, imageStr} = req.body

        res.status(200).json({message: 'Image has been generated'})
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
