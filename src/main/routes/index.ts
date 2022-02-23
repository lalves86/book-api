import { Router } from 'express'
import bookRouter from './bookRouter'

const router = Router()

router.use('/books', bookRouter)

export default router
