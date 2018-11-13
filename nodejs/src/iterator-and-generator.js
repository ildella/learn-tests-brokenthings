const simpleIterable = {
  [Symbol.iterator] () {
    let step = 0
    return {
      next () {
        step++
        if (step < 3) {
          return {value: step, done: false}
        }
        return {value: 'last value', done: true}
      }
    }
  }
}

const iterableViaGenerator = {
  [Symbol.iterator]: function*() {
    let n = 0
    while (true) {
      console.log('pre yield...')
      n++
      yield n
      console.log('... post yield')
    }
  }
}

const generatorWithoutWhile = {
  [Symbol.iterator]: function*() {
    let n = 0
    n++
    yield n
  }
}

function* shortest (){
  yield 1
  console.log('Hi, I am 1.5')
  yield 2
}

for (const n of simpleIterable) {
  console.log(`standard iterable -> ${n}`)
}

for (const n of iterableViaGenerator) {
  if (n > 3)
    break
  console.log(`standard generator -> ${n}`)
}

for (const n of shortest()) {
  console.log(`shortest -> ${n}`)
}

for (const n of generatorWithoutWhile) {
  console.log(`no loop -> ${n}`)
}
