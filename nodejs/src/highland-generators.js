/**
  There is already a generator test in highland.test.js
  This example provides a more clear output that better shows what is going on
**/

const __ = require('highland')
let called = 0
const highlandGenerator = (push, next) => {
  setTimeout(() => {
    if (called >= 10) {
      push(null, __.nil)
      return
    }
    called++
    console.log('pushing...')
    push(null, `call-${called}`)
    console.log('... pushed!')
    next()
  }, 100)
}

__(highlandGenerator)
  .map(item => {
    console.log(`I can see you here ${item}`)
    return item
  })
  .toArray(results => console.log('GENERATOR DONE', results))
  // .done(()=> console.log('GENERATOR DONE'))
