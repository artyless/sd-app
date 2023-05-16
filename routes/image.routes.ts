import {Router, Request, Response} from 'express'
import {auth} from '../middleware/auth.middleware.js'
//import http from 'http'
// import {request} from 'https'
// import {request} from 'express'

const router: Router = Router()

// /api/image/
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {id, imageStr} = req.body

        const options = {
            url: 'http://localhost:5000/upload',
            method: 'POST',
            body: {
                image: id
            },
            json: true
        }

        // request(options, (res:IncomingMessage) => {
        //     console.log('Completed')
        //         // if (res) {
        //         //     console.log(error)
        //         //     res.status(500).send('Internal server error')
        //         // } else if (response.statusCode !== 200) {
        //         //     console.log('Status: ', response.statusCode)
        //         //     res.status(500).send('Internal server error')
        //         // } else {
        //         //     console.log('Response', body)
        //         //     res.status(200).send('Image uploaded to the other server')
        //         // }
        //     }
        // )

        res.status(200).json({message: 'Image has been received'})
    } catch (e) {
        res.status(500).json({message: "Something went wrong, try again"})
    }
})

export default router
