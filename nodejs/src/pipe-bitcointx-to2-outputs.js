const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})
const fs = require('fs')
const __ = require('highland')
const {DateTime} = require('luxon')
// const {stringify} = require ('highland-json')
const JSONStream = require ('JSONStream')
const api = require('axios').create({
  baseURL: 'https://blockchain.info/unconfirmed-transactions?format=json'
})

const mainStream = __((push, next) => {
  setTimeout(async () => {
    const response = await api.get()
    // console.log(`\n\n--- ${DateTime.local().toISO()} --- \n`)
    push(null, response.data)
    next()
  }, 1000)
})
  .map(data => data.txs).flatten()
  .pick(['time', 'tx_index', 'hash', 'weight'])
  // .map(json => {
  //   console.log(json)
  // })
  .through(JSONStream.stringify())

const ys = mainStream.fork()
const zs = mainStream.observe()
console.log('both streams will wait 2000ms before starting...')
zs.pipe(fs.createWriteStream('bitcointx'))
setTimeout(() => {
  ys.pipe(process.stdout)
}, 2000)
// .done(() => console.log('DONE'))
