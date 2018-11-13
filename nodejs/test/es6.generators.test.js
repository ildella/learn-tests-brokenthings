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
    if (n > 10000)
      break
    mock()
    console.log(n)
  }
  expect(mock).toHaveBeenCalledTimes(19)
  expect('this example').not.toBe('different from the one in iterator.test.js. Just a different syntax')
})

test('ok, ES6 generators', () => {
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
