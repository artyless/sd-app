import minio from 'minio'
import dotenv from 'dotenv'

dotenv.config()

const MINIO_ACCESS: string = process.env.MINIO_ACCESS!
const MINIO_SECRET: string = process.env.MINIO_SECRET!

export const minioClient = new minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS,
    secretKey: MINIO_SECRET
})
