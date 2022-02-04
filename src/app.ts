import express, { json } from 'express'
import { hello } from './routes'

const app = express()
app.use(hello)
app.use(json())

export default app
