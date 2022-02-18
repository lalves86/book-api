import express, { json } from 'express'
import { mongooseConnect } from './main/config/mongooseConfig'
import router from './main/routes'

mongooseConnect()
const app = express()
app.use(json())
app.use(router)

export default app
