import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import minio from 'minio'
import {PrismaClient} from '@prisma/client'
import {generateUniqueFileName} from '../utils/generateUniqueFileName.js'
import dotenv from 'dotenv'

dotenv.config()

const router: Router = Router()

const prisma = new PrismaClient()

// TODO
// @ts-ignore
const MINIO_ACCESS: string = process.env.MINIO_ACCESS
// @ts-ignore
const MINIO_SECRET: string = process.env.MINIO_SECRET

const minioClient = new minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS,
    secretKey: MINIO_SECRET
})

// /api/image/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, imageStr, prompt, collectionName} = req.body

        if (!imageStr) {
            res.status(500).json({message: "Something went wrong, try again"})
        }

        const imageAddress = id.toString() + generateUniqueFileName(prompt)

        const imageBuffer = Buffer.from(imageStr, 'base64')

        const collection = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: "Collection not found!"})
        }

        minioClient.putObject(collection.bucket, imageAddress, imageBuffer, (err, etag) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Something went wrong, try again"})
            }
        })

        await prisma.image.create({
            data: {
                prompt: prompt,
                address: imageAddress,
                userId: id,
                collectionId: collection.id
            }
        })

        res.status(200).json({message: 'Image has been saved'})
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

// /api/image/
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, collection} = req.body

        // TODO
        // @ts-ignore

        const img = await minioClient.getObject(collection, 'image1.png')

        const base64Image = img.toString()
        res.status(200).json({image: base64Image})

    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
