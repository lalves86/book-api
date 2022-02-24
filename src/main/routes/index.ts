import { Router } from 'express'
import authRouter from './authRouter'
import bookRouter from './bookRouter'
import userRouter from './userRouter'

const router = Router()

router.use('/books', bookRouter)
router.use('/users', userRouter)
router.use('/auth', authRouter)

export default router
