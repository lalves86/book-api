import express, { json } from 'express'
import { mongooseConnect } from './main/config/mongooseConfig'
import { rabbitMqConsumer } from './infra/queue/rabbitMqConsumer'
import router from './main/routes'

rabbitMqConsumer()
mongooseConnect()
const app = express()
app.use(json())
app.use(router)

export default app
