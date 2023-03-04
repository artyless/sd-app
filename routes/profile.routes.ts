import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {PrismaClient, User} from '@prisma/client'

const router: Router = Router()
const prisma = new PrismaClient()

// /api/profile/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {userId, name, email} = req.body

        const user = await prisma.user.update({
            where: {id: userId},
            data: { name: name, email: email}
        })

        res.status(201).json({message: 'Profile data changed', userName: user.name, userEmail: user.email})
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
