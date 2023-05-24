import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {Collection, PrismaClient} from '@prisma/client'
import {minioClient} from '../minio/minioConfig.js'
import {generateUniqueFileName} from '../utils/generateUniqueFileName.js'

const router = Router()
const prisma = new PrismaClient()

// /api/collection/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, collectionName} = req.body

        if (!collectionName) {
            return res.status(500).json({message: 'Collection\'\s name is empty!'})
        }

        const bucketName: string = id.toString() + generateUniqueFileName(collectionName)

        const isBucketExist: boolean = await minioClient.bucketExists(bucketName)

        if (isBucketExist) {
            return res.status(500).json({message: 'Collection already exist!'})
        }

        const existingCollection: Collection | null = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: {
                    equals: collectionName,
                    mode: 'insensitive'
                }
            }
        })

        if (existingCollection) {
            return res.status(500).json({message: 'Collection already exist!'})
        }

        minioClient.makeBucket(bucketName, err => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({message: 'Something went wrong, while creating collection in minio'})
            }
        })

        await prisma.collection.create({
            data: {
                title: collectionName,
                bucket: bucketName,
                userId: id
            }
        })

        res.status(200).json({message: 'Collection has been created'})
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({message: 'Error creating collection'})
    }
})

// /api/collection/
router.delete('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, collectionName} = req.body

        if (!collectionName) {
            return res.status(500).json({message: 'Collection\'\s name is empty!'})
        }

        const collection: Collection | null = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: 'Collection not found'})
        }

        minioClient.removeBucket(collection.bucket, err => {
            if (err) {
                console.error('Error removing bucket:', err)
                return res.status(500).json({message: 'Error removing bucket'})
            }

            (async function () {
                await prisma.collection.delete({
                    where: {
                        bucket: collection.bucket
                    }
                })
                res.status(200).json({message: 'Collection has been deleted'})
            }())
        })
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({message: 'Error deleting collection'})
    }
})

// /api/collection/
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const userId = req.user.id

        const collections: Collection[] = await prisma.collection.findMany({
            where: {
                userId: userId
            }
        })

        res.status(200).json({data: collections})
    } catch (err: any) {
        console.error(err.message)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

export default router
