// const iterable = {
//   [Symbol.iterator]: function*() {
//     let n = 0
//     while (true) {
//       // console.log('pre yield...')
//       yield n++
//       // console.log('... yield done!')
//     }
//   }
// }

const simpleIterable = {
  [Symbol.iterator] () {
    let step = 0
    return {
      next () {
        step++
        if (step < 10) {
          return {value: 'some value', done: false}
        }
        return {value: 'last', done: true}
      }
    }
  }
}

const __ = require('highland')

__(simpleIterable)
  .tap(console.log) // this one also print 'last'. Need to check the implementation
  .done(() => console.log('FINISHED'))

for (const n of simpleIterable) {
  console.log(n)
}
