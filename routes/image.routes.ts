import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {Collection, Image, PrismaClient} from '@prisma/client'
import {generateUniqueFileName} from '../utils/generateUniqueFileName.js'
import {minioClient} from '../minio/minioConfig.js'
import {client, INDEX_NAME} from '../elasticSearch/elasticSearchConfig.js'
import {IImageCollection} from '../models/image.js'

const router: Router = Router()
const prisma = new PrismaClient()

// /api/image/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {userId, imageStr, prompt, collectionName} = req.body

        if (!imageStr) {
            res.status(500).json({message: 'Something went wrong, try again'})
        }

        const storageAddress: string = userId.toString() + generateUniqueFileName(prompt)

        const imageBuffer: Buffer = Buffer.from(imageStr, 'base64')

        const collection: Collection | null = await prisma.collection.findFirst({
            where: {
                userId: userId,
                title: collectionName
            }
        })

        if (!collection) {
            return res.status(500).json({message: 'Collection not found!'})
        }

        minioClient.putObject(collection.bucket, storageAddress, imageBuffer, (err, etag) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({message: 'Something went wrong, try again'})
            }
        })

        // TODO
        await prisma.image.create({
            data: {
                prompt: prompt,
                translated: generateUniqueFileName('temporary'),
                language: 'eng',
                storageAddress: storageAddress,
                userId: userId,
                collectionId: collection.id
            }
        })

        res.status(200).json({message: 'Image has been saved'})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/image/
router.get('/:collectionName?', auth, async (req: Request, res: Response) => {
    try {
        const id = req.user.id
        const collectionName: string = req.params.collectionName

        let images: IImageCollection[]

        if (!collectionName) {
            images = await prisma.image.findMany({
                where: {
                    published: true
                },
                include: {
                    Collection: {
                        select: {bucket: true}
                    }
                }
            })
        } else {
            const collection: Collection | null = await prisma.collection.findFirst({
                where: {
                    userId: id,
                    title: collectionName
                }
            })

            if (!collection) {
                return res.status(500).json({message: 'Collection not found'})
            }

            images = await prisma.image.findMany({
                where: {
                    userId: id,
                    collectionId: collection.id
                },
                include: {
                    Collection: {
                        select: {bucket: true}
                    }
                }
            })
        }

        if (!images) {
            return res.status(500).json({message: 'Images not found'})
        }

        const objects = []

        for (const image of images) {
            const stream = await minioClient.getObject(image.Collection.bucket, image.storageAddress)

            const chunks = []

            for await (const chunk of stream) {
                chunks.push(chunk)
            }

            const objectData: Buffer = Buffer.concat(chunks)
            objects.push({data: image, imageStr: objectData.toString('base64')})
        }

        res.status(200).json({images: objects})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/image/
router.delete('/', auth, async (req: Request, res: Response) => {
    try {
        const {id} = req.body

        const image = await prisma.image.findFirst({
            where: {
                id: id
            },
            include: {
                Collection: {
                    select: {bucket: true}
                }
            }
        })

        if (!image) {
            return res.status(500).json({message: 'Something went wrong, try again'})
        }

        if (image.searchId) {
            await client.delete({
                index: INDEX_NAME,
                id: image.searchId
            })
        }

        minioClient.removeObject(image.Collection.bucket, image.storageAddress, err => {
            if (err) {
                console.error('Error removing image:', err)
                return res.status(500).json({message: 'Error removing image'})
            }
        })

        await prisma.image.delete({
            where: {
                id: image.id
            }
        })

        res.status(200).json({message: 'Image has been deleted'})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/image/
router.put('/', auth, async (req: Request, res: Response) => {
    try {
        const {image, bucket} = req.body

        if (!image) {
            res.status(500).json({message: 'Something went wrong, try again'})
        }

        let searchId: string = ''

        if (!image.published) {
            const data = await client.index({
                index: INDEX_NAME,
                document: {
                    userId: image.userId,
                    prompt: image.prompt,
                    bucket: bucket,
                    storageAddress: image.storageAddress
                }
            })
            searchId = data._id
        } else {
            await client.delete({
                index: INDEX_NAME,
                id: image.searchId
            })
        }

        await prisma.image.update({
            where: {
                id: image.id
            },
            data: {
                published: !image.published,
                searchId: searchId
            }
        })

        res.status(200).json({message: 'Publicity has been changed'})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

export default router
