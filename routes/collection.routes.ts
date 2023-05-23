import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {PrismaClient} from '@prisma/client'
import minio from 'minio'
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

// /api/collection/create
router.post('/create', auth, async (req: Request, res: Response) => {
    try {
        const {id, collectionName} = req.body

        if (!collectionName) {
            return res.status(500).json({message: "Collection's name is empty!"})
        }

        const bucketName = id.toString() + generateUniqueFileName(collectionName)

        const isBucketExist = await minioClient.bucketExists(bucketName)

        if (isBucketExist) {
            return res.status(500).json({message: "Collection already exist!"})
        }

        minioClient.makeBucket(bucketName, err => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: "Something went wrong, while creating collection in minio"})
            }

            createCollection()
        })

        const createCollection = async () => {
            try {
                const existingCollection = await prisma.collection.findFirst({
                    where: {
                        title: {
                            equals: collectionName,
                            mode: 'insensitive'
                        }
                    }
                })

                if (existingCollection) {
                    minioClient.removeBucket(bucketName, err => {
                        console.log(err)
                    })

                    return res.status(500).json({ message: "Collection already exists!" })
                }

                await prisma.collection.create({
                    data: {
                        title: collectionName,
                        amountImages: null,
                        bucket: bucketName,
                        userId: id
                    }
                })

                res.status(200).json({message: 'Collection has been created'})
            } catch (error) {
                console.error('Error creating collection:', error)
                res.status(500).json({ message: "Something went wrong, try again" });
            } finally {
                await prisma.$disconnect()
            }
        }
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

//api/collection/delete
router.post('/delete', auth, async (req: Request, res: Response) => {
    try {
        const {id, collectionName} = req.body

        if (!collectionName) {
            return res.status(500).json({message: "Collection's name is empty!"})
        }

        const collection = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: "Something went wrong, try again"})
        }

        minioClient.removeBucket(collection.bucket, err => {
            if (err) {
                console.log('Error removing bucket:', err)
                return res.status(500).json({message: "Error removing bucket"})
            } else {
                deleteCollection()
            }
        })

        const deleteCollection = async () => {
            try {
                await prisma.collection.delete({
                    where: {
                        bucket: collection.bucket
                    }
                })

                res.status(200).json({message: 'Collection has been deleted'})
            } catch (error) {
                console.error('Error deleting collection:', error)
                res.status(500).json({ message: "Something went wrong, try again" });
            } finally {
                await prisma.$disconnect()
            }
        }
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

// /api/collection/
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        // TODO
        // @ts-ignore
        const userId = req.user.id

        const collections = await prisma.collection.findMany({
            where: {
                userId: userId
            }
        })

        res.status(200).json({data: collections})
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
