/**
  There is already a generator test in highland.test.js
  This class provide a better console.log output to better show what is going on
**/

const __ = require('highland')
let called = 0
const highlandGenerator = (push, next) => {
  setTimeout(() => {
    if (called >= 10) {
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
