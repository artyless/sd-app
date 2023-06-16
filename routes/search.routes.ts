import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
import {client, INDEX_NAME, indexSettings} from '../elasticSearch/elasticSearchConfig.js'
import {PrismaClient} from '@prisma/client'
import {minioClient} from '../minio/minioConfig.js'
import {IImageSearch} from '../models/image.js'

const router: Router = Router()
const prisma = new PrismaClient()

// /api/search/edit
router.post('/edit', auth, async (req: Request, res: Response) => {
    try {
        // await client.indices.create(indexSettings)

        // await client.indices.delete({index: INDEX_NAME})

        res.status(200).json({message: 'OKAY'})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/search/:query
router.get('/:query', auth, async (req: Request, res: Response) => {
    try {
        const query = req.params.query

        const result = await client.search({
            index: INDEX_NAME,
            query: {
                match: {
                    prompt: query
                }
            }
        })

        const images = result.hits.hits

        if (!images) {
            return res.status(500).json({message: 'Images not found'})
        }

        // todo вынести?
        const objects = []

        for (const image of images) {
            const source = image._source as IImageSearch
            const stream = await minioClient.getObject(source.bucket, source.storageAddress)

            const chunks = []

            for await (const chunk of stream) {
                chunks.push(chunk)
            }

            const objectData: Buffer = Buffer.concat(chunks)
            objects.push({data: image._source, imageStr: objectData.toString('base64')})
        }

        res.status(200).json({images: objects})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

export default router
