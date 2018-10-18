const __ = require('highland')
let called = 0
const s = __((push, next) => {
  setTimeout(() => {
    if (called > 10) {
      process.exit(0)
    }
    called++
    push(null, 'a')
    next()
  }, 100)
})

s.pipe(process.stdout)
