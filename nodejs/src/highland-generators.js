const __ = require('highland')
let called = 0
const highlandStream = __((push, next) => {
  setTimeout(() => {
    if (called > 10) {
      return
    }
    called++
    console.log('pushing...')
    push(null, `call-${called}`)
    console.log('... pushed!')
    next()
  }, 100)
})

highlandStream
  .map(item => {
    console.log(`I can see you here ${item}`)
    return item
  })
  .pipe(process.stdout)

const fibonacci = {
  [Symbol.iterator]: function*() {
    let pre = 0, cur = 1
    while (true) {
      const temp = pre
      pre = cur
      cur += temp
      yield cur
    }
  }
}

for (const n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 10000)
    break
  console.log(`everybody can do a for loop - ${n}`)
}

// __(fibonacci)
//   .map(n => console.log(n))
//   .pipe(process.stdout)
