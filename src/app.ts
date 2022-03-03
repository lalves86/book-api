import express, { json } from 'express'
import { mongooseConnect } from './main/config/mongooseConfig'
import { rabbitMqConsumerConfig } from './main/config/rabbitMqConsumerConfig'
import router from './main/routes'

rabbitMqConsumerConfig()
mongooseConnect()
const app = express()
app.use(json())
app.use(router)

export default app
