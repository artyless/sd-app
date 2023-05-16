import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

// export async function createUser(newUser: any) {
//     const data = await prisma.user.create(newUser)
//     console.log(data)
// }

// createUser()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async e => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })
