import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import minio from 'minio'
import {Image, PrismaClient} from '@prisma/client'
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

// /api/image/save
router.post('/save', auth, async (req: Request, res: Response) => {
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
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, collectionName} = req.body

        const collection = await prisma.collection.findFirst({
            where: {
                userId: id,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: "Collection not found"})
        }

        // index !!!!

        const images: Image[] = await prisma.image.findMany({
            where: {
                userId: id,
                collectionId: collection.id
            }
        })

        if (!images) {
            return res.status(500).json({message: "Images not found"})
        }

        const getObjectsByName = (bucketName: string, objectNames: Image[]) => {
            return new Promise((resolve, reject) => {
                const objects: any = []

                let count = 0

                objectNames.forEach(objectName => {
                    minioClient.getObject(bucketName, objectName.address, (err, stream) => {
                        if (err) {
                            reject(err)
                        } else {
                            const chunks: any = []
                            stream.on('data', chunk => {
                                chunks.push(chunk)
                            })
                            stream.on('end', () => {
                                const objectData = Buffer.concat(chunks)
                                objects.push({data: objectName, imageStr: objectData.toString('base64')})
                                count++

                                if (count === objectNames.length) {
                                    resolve(objects)
                                }
                            })
                            stream.on('error', err => {
                                reject(err)
                            })
                        }
                    })
                })
            })
        }

        getObjectsByName(collection.bucket, images)
            .then(objects => {
                res.status(200).json({images: objects})
            })
            .catch(err => {
                console.error('Ошибка при получении элементов из бакета:', err)
                return res.status(500).json({message: "Error while getting images from collection"})
            })
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
