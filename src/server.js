'use strict'

const pjson = require('../package.json')
const start = async (expressApp) => {
  expressApp.listen(process.env.PORT)
  console.log(`API v${pjson.version} started -> http://localhost:${process.env.PORT}`)
}

start(require('./api'))
