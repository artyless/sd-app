import express, {Express} from 'express'
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import stableDiffusionRoutes from './routes/sd.routes.js'
import imageRoutes from './routes/image.routes.js'
import collectionRoutes from './routes/collection.routes.js'

import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.SERVER_PORT

const app: Express = express()

app.use(express.json({limit: '15mb'}))
// app.use(express.urlencoded({limit: '5mb', extended: true}))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/sd', stableDiffusionRoutes)
app.use('/api/image', imageRoutes)
app.use('/api/collection', collectionRoutes)

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`[server]: Server is running at http://localhost:${PORT}`)
        })
    } catch (e: any) {
        console.log('Server Error: ', e.message)
        process.exit(1)
    }
}

start().catch((e: Error) => {
    console.log('Error. Server was stopped: ', e)
})
