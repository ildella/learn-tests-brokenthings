const pjson = require('../package.json')
const express = require('express')
const app = require('express-async-await')(express())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const api = express.Router()
api.use((req, res, next) => {
  res.set('x-api-name', pjson.name)
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
  res.json({
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    parsedUrlPathname: req._parsedUrl.pathname,
    // _parsedOriginalUrlPathname: req._parsedOriginalUrl.pathname,
    httpVersion: req.httpVersion,
  })
})

const router = express.Router()
router.get('/', async (req, res) => { res.status(200).json({endpoint: 'stream'}) })
api.use('/stream', router)

const errorHandler = (err, req, res, next) => {
  console.error(err)
}

api.use(errorHandler)

module.exports = app
