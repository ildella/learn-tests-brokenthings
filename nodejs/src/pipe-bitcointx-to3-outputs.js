const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})
const __ = require('highland')
const {DateTime} = require('luxon')
// const {stringify} = require ('highland-json')
const JSONStream = require ('JSONStream')
const api = require('axios').create({
  baseURL: 'https://blockchain.info/unconfirmed-transactions?format=json'
})

const hs = __((push, next) => {
  setTimeout(async () => {
    const response = await api.get()
    console.log(`\n\n--- ${DateTime.local().toISO()} --- \n`)
    push(null, response.data)
    next()
  }, 1000)
})
  .map(data => data.txs).flatten()
  .pick(['time', 'tx_index', 'hash'])
  // .map(json => {
  //   console.log(json)
  // })
  .through(JSONStream.stringify())

hs.pipe(process.stdout)
// .done(() => console.log('DONE'))
