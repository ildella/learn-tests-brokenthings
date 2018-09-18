const pjson = require('../package.json')
const express = require('express')
const app = require('express-async-await')(express())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const api = express.Router()
api.use((req, res, next) => {
  res.set('x-api-version', pjson.version)
  next()
})
app.use('/', api)
api.get('/', (req, res) => {
  res.status(200).json({
    name: pjson.name,
    version: pjson.version
  })
})
api.get('/path1', (req, res) => {
	res.json({})
})

const router = express.Router()
router.get('/', async function (req, res, next) {
  res.status(200).json({})
})

api.use('/stream', router)

module.exports = app
