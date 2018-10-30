process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: ', p, 'reason:', reason)
})
// const __ = require('highland')
// const stream = require('stream')
const csvstream = require('../src/csvstream')
const context = {
  source: './assets/sample.csv'
}

// csvstream.stream({
//   source: './assets/sample.csv'
// })

test('Execute places stream', async () => {
// await csvstream.process(context)
})

// test('How to catch an uncatchable exception', async () => {
//   const response = await csvstream.stream({
//     source: 'roadtonowhere'
//   })
//   expect(typeof response.data).toBe('undefined')
// })
