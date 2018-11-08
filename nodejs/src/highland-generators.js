const __ = require('highland')
let called = 0
const generator = (push, next) => {
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

__(generator)
  .map(item => {
    console.log(`I can see you here ${item}`)
    return item
  })
  .toArray(results => console.log('GENERATOR DONE', results))
  // .done(()=> console.log('GENERATOR DONE'))
