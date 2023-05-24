import express, {Express} from 'express'
import {configureServer} from './configureServer.js'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.SERVER_PORT

const start = async () => {
    try {
        const app: Express = express()

        configureServer(app)

        app.listen(PORT, () => {
            console.log(`[server]: Server is running at http://localhost:${PORT}`)
        })
    } catch (err: any) {
        console.error('Server Error: ', err.message)
        process.exit(1)
    }
}

start().catch((err: Error) => {
    console.error('Error. Server was stopped: ', err)
})
