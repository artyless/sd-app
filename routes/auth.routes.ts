import {Router, Request, Response} from 'express'
import {PrismaClient, User} from '@prisma/client'
import bcrypt from 'bcryptjs'
import {check, Result, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET: string = process.env.JWT_SECRET!

const router = Router()
const prisma = new PrismaClient()

// /api/auth/register
router.post(
    '/register',
    [
        check('userName', 'Incorrect username').exists(),
        check('firstName', 'Incorrect first name').exists(),
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Incorrect password').isLength({min: 6})
    ],
    async (req: Request, res: Response) => {
        try {
            const errors: Result = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }

            const {userName, firstName, email, password} = req.body

            const candidate: User | null = await prisma.user.findFirst({where: {email}})

            if (candidate) {
                return res.status(400).json({message: 'This user already exist'})
            }

            const hashedPassword: string = await bcrypt.hash(password, 12)

            await prisma.user.create({
                data: {
                    userName,
                    firstName,
                    email,
                    hashedPassword
                }
            })

            res.status(201).json({message: 'User created'})
        } catch (err) {
            console.error(err)
            res.status(500).json({message: 'Something went wrong, try again'})
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
            const errors: Result = validationResult(req)

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

            const token = jwt.sign(
                {id: user.id},
                JWT_SECRET,
                {expiresIn: '8h'}
            )

            res.json({
                token: token,
                id: user.id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({message: 'Something went wrong, try again'})
        }
    })

export default router
