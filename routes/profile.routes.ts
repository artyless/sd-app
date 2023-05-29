import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {PrismaClient, User} from '@prisma/client'

const router: Router = Router()
const prisma = new PrismaClient()

// /api/profile/
router.put('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, userName, firstName, lastName, email} = req.body

        const user: User = await prisma.user.update({
            where: {id: id},
            data: {
                userName,
                firstName,
                lastName,
                email
            }
        })

        res.status(201).json({
            message: 'Profile data changed',
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/profile/
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id

        const user = await prisma.user.findFirst({
            where: {id: userId},
        }) as User

        res.status(201).json({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

export default router
