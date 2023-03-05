import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {PrismaClient, User} from '@prisma/client'

const router: Router = Router()
const prisma = new PrismaClient()

// /api/profile/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, userName, firstName, lastName, email, sex, dob} = req.body

        const user = await prisma.user.update({
            where: {id: id},
            data: {
                userName,
                firstName,
                lastName,
                email,
                sex,
                dob: new Date(dob)
            }
        })

        res.status(201).json({
            message: 'Profile data changed',
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            sex: user.sex,
            dob: user.dob
        })
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
