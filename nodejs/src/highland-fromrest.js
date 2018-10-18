const __ = require('highland')
// const {stringify} = require ('highland-json')
// const JSONStream = require ('JSONStream')
const api = require('axios').create({
  baseURL: 'https://blockchain.info/unconfirmed-transactions?format=json'
})

__((push, next) => {
  setTimeout(async () => {
    const response = await api.get()
    push(null, response.data)
    next()
  }, 1000)
})
  .map(data => data.txs).flatten()
  .pick(['time', 'tx_index', 'hash'])
  .map(json => {
    console.log(json)
  })
  // .through(JSONStream.stringify())
  // .pipe(process.stdout)
  .done(() => console.log('DONE'))
