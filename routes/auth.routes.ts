import {Router, Request, Response} from 'express'
import {PrismaClient, User} from '@prisma/client'
import bcrypt from 'bcryptjs'
import {check, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET: string | undefined = process.env.JWT_SECRET

const router: Router = Router()
const prisma = new PrismaClient()


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Incorrect password').isLength({min: 6})
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }

            const {name, email, password} = req.body

            const candidate = await prisma.user.findFirst({where: {email}})

            if (candidate) {
                return res.status(400).json({message: 'This user already exist'})
            }

            // Почему только 12
            const hashedPassword = await bcrypt.hash(password, 12)

            await prisma.user.create({
                data: {
                    name,
                    email,
                    hashedPassword
                }
            })

            res.status(201).json({message: 'User created'})
        } catch (e) {
            res.status(500).json({message: "Something went wrong, try again"})
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Enter right email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login data'
                })
            }

            const {email, password} = req.body

            const user: User | null = await prisma.user.findFirst({where: {email}})

            if (!user) {
                return res.status(400).json({message: 'Incorrect login data'})
            }

            const isMatch: boolean = await bcrypt.compare(password, user.hashedPassword)

            if (!isMatch) {
                return res.status(400).json({message: 'Incorrect login data'})
            }

            if (!JWT_SECRET) {
                return res.status(500).json({message: 'Problems with server'})
            }

            // Зачем в payload userId и прочее?
            const token = jwt.sign(
                {userId: user.id},
                JWT_SECRET,
                {expiresIn: '1h'}
            )

            // А если зашифровать в токене?
            res.json({
                token,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                userCreatedAt: user.createdAt
            })
        } catch (e) {
            res.status(500).json({message: "Something went wrong, try again"})
        }
    })

export default router