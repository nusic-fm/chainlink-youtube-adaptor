const createRequest = require('./index').createRequest
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')

const port = process.env.PORT || 8080
app.use(cors())

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('API is up and running...')
})

app.post('/subscribers', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
