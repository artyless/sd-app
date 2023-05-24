import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {Collection, Image, PrismaClient} from '@prisma/client'
import {generateUniqueFileName} from '../utils/generateUniqueFileName.js'
import {minioClient} from '../minio/minioConfig.js'

const router: Router = Router()
const prisma = new PrismaClient()

// /api/image/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, imageStr, prompt, collectionName} = req.body

        if (!imageStr) {
            res.status(500).json({message: 'Something went wrong, try again'})
        }

        const imageAddress: string = id.toString() + generateUniqueFileName(prompt)

        const imageBuffer: Buffer = Buffer.from(imageStr, 'base64')

        const collection: Collection | null = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: 'Collection not found!'})
        }

        minioClient.putObject(collection.bucket, imageAddress, imageBuffer, (err, etag) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({message: 'Something went wrong, try again'})
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
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/image/
router.get('/:collectionName', auth, async (req: Request, res: Response) => {
    try {
        const {id} = req.body
        const collectionName: string = req.params.collectionName

        const collection: Collection | null = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: 'Collection not found'})
        }

        const images: Image[] = await prisma.image.findMany({
            where: {
                userId: id,
                collectionId: collection.id
            }
        })

        if (!images) {
            return res.status(500).json({message: 'Images not found'})
        }

        const objects: any = []

        for (const image of images) {
            const stream = await minioClient.getObject(collection.bucket, image.address)

            const chunks: any = []

            for await (const chunk of stream) {
                chunks.push(chunk)
            }

            const objectData: Buffer = Buffer.concat(chunks)
            objects.push({data: image, imageStr: objectData.toString('base64')})
        }

        res.status(200).json({images: objects})
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

export default router
