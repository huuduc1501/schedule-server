require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')

const server = require('http').createServer(app)
const cors = require('cors')


const errorHandler = require('./middlewares/errorHandler')
const authRoute = require('./routes/auth')
const scheduleRoute = require('./routes/schedule')

const Port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/schedule', scheduleRoute)

app.use(errorHandler)

server.listen(Port, () => {
    console.log(`app listen on ${Port}`)
})
