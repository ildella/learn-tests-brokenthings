'use strict'
require('dotenv').config()
const port = process.env.PORT || 3456
const pjson = require('../package.json')
const start = async (expressApp) => {
  expressApp.listen(port)
  console.log(`API v${pjson.version} started -> http://localhost:${port}`)
}

start(require('./sample-api-routes'))
