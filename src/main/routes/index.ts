import { Router } from 'express'
import bookRouter from './bookRouter'
import userRouter from './userRouter'

const router = Router()

router.use('/books', bookRouter)
router.use('/users', userRouter)

export default router
