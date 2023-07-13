import express, {Express} from 'express'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import stableDiffusionRoutes from './routes/sd.routes.js'
import imageRoutes from './routes/image.routes.js'
import collectionRoutes from './routes/collection.routes.js'
import searchRoutes from './routes/search.routes.js'

export const configureServer = (app: Express) => {
    app.use(express.json({limit: '15mb'}))

    app.use('/api/auth', authRoutes)
    app.use('/api/user', userRoutes)
    app.use('/api/sd', stableDiffusionRoutes)
    app.use('/api/image', imageRoutes)
    app.use('/api/collection', collectionRoutes)
    app.use('/api/search', searchRoutes)
}
