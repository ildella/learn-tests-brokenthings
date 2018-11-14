test('Sugar for Fibonacci', () => {

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

  const mock = jest.fn()
  for (const n of fibonacci) {
    if (n > 100)
      break
    mock()
    console.log(n)
  }
  expect(mock).toHaveBeenCalledTimes(10)
  expect('this example').not.toBe('different from the one in iterator.test.js. Just a different syntax')
})

test('Basic ES6 generators - short form', () => {
  function* foo (){
    yield 1
    console.log('Hi, I am 1.5')
    yield 2
  }
  const mock = jest.fn()
  for (const o of foo()) {
    console.log(`I can do whatever I need on ${o}`)
    mock()
  }
  expect(mock).toHaveBeenCalledTimes(2)
  expect('this').not.toBe('Well, ok this is actually REALLY interesting :)')
  expect('yield 2').not.toBe('called until the for loop completes the iteration of the value return by the first yield')

})

test('iterable with and without generator', () => {
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

  for (const n of simpleIterable) {
    console.log(`standard iterable -> ${n}`)
  }

  for (const n of iterableViaGenerator) {
    if (n > 3)
      break
    console.log(`standard generator -> ${n}`)
  }

})

test('generators with setTimeout', () => {
  const longerForm = {
    [Symbol.iterator]: function*() {
      let n = 100
      n++
      yield n
    }
  }

  function* shortestForm (){
    yield 999
  }

  for (const n of longerForm) {
    console.log(`longer -> ${n}`)
  }

  for (const n of shortestForm()) {
    console.log(`shortest -> ${n}`)
  }

})
