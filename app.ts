import express, { Express } from 'express'
import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'

import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.SERVER_PORT

const app: Express = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

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

start().then()

