import pgPromise, {IDatabase} from 'pg-promise'
import dotenv from 'dotenv'

dotenv.config()

const configuration = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    database: process.env.DATABASE_NAME || 'pinterest',
    user: process.env.DATABASE_USER || 'artyless',
    password: process.env.DATABASE_PASS || 'password'
}

const pgp = pgPromise({})
// Какой тип?
const db: IDatabase<any> = pgp(configuration)

// db.any('SELECT * FROM users')
//     .then(data => {
//       console.log('Data: ',data)
//     })
//     .catch(error => {
//       console.log('Error: ', error)
//     })
//
// db.none('INSERT INTO users(user_id, username, password, email, images_count, profile_picture) VALUES (2, \'Test Name\', \'Test password\', \'test emati@mail.ru\', 10, \'http://test.url\')')
//     .then(() => {
//         console.log('Success inserted')
//     }).catch(error => {
//         console.log('Error:',error)
// })