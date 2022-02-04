import { Router } from 'express'

const router = Router()

export const hello = router.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' })
})
