/*
Ok let's bring here some experiment with the MAGIC that are Iterators.
(It should have been a really sad world here before 2015...)
Anyway, as I want to dig more into AsyncIteratory, which looks to me as a real cool thing,
let's see the 'story' of iterators in this once tormented land of Javascript
*/

test('ok first we understand what Symbol is for in JS', () => {
  const symbol1 = Symbol()
  const symbol2 = Symbol(42)
  const symbol3 = Symbol('foo')

  expect(typeof symbol1).toBe('symbol')
  expect(symbol3.toString()).toBe('Symbol(foo)')
  expect(Symbol('foo')).not.toBe(Symbol('foo'))
  expect(Symbol('foo')).not.toEqual(Symbol('foo'))
  expect(symbol1.description).toBe(undefined)
  expect(symbol2.description).toBe('42')
  expect(symbol3.description).toBe('foo')
  expect('you').not.toBe('Impressed. In fact, this does not means a lot per se...')
})

test('well, sure, nice... but actually what?', () => {
  const user = {name: 'John'}
  const id = Symbol('id')
  user[id] = 'ID Symbol'
  user['id'] = 'ID String' // sonarjs linter gives an error here ^__^
  expect(user['name']).toBe('John')
  expect(user[id]).toBe('ID Symbol')
  expect(user['id']).toBe('ID String')
  expect(user).not.toEqual({id: 'ID String', name: 'John'}) // there's also the prop Symbol('id')
  expect('all of this').not.toBe('Really interesting in most cases. One can assign IDs to objects... and other mean stuff, but in a nice way')
})

test('The *Well Known* Symbols', () => {
  const url = 'https://tc39.github.io/ecma262/#sec-well-known-symbols'
})

test('The Iterator Symbol', () => {
  expect(Symbol.iterator.toString()).toBe('Symbol(Symbol.iterator)')
  expect(Symbol.iterator.description).toBe('Symbol.iterator')

  // Is the mechanism trough which we have MAGIC like... a for loop over an iterable object

  function* foo (){
    yield 1
    yield 2
  }
  const mock = jest.fn()
  for (const o of foo()) {
    mock()
    break
  }
  expect(mock).toHaveBeenCalledTimes(1)
  expect('me').not.toBe('Shoked')
})

// There are a few expect() but the added clutter is compensated by the clarify they bring
// We see clearly what's the iterator, what the iterable and where Symbol.iterator is used for
test('A simple iterable', () => {
  const mock1 = jest.fn()
  const mock2 = jest.fn()

  const iterable = {
    [Symbol.iterator] () {
      let step = 0
      const iterator = {
        next () {
          step++
          mock1()
          if (step < 3) {
            return {value: 'some value', done: false}
          }
          return {value: 'last value, will not be iterated on', done: true}
        }
      }
      expect(typeof iterator).toBe('object')
      return iterator
    }
  }

  for (const item of iterable) {
    console.log(item)
    mock2()
    expect(item).toBe('some value')
  }
  expect(mock1).toHaveBeenCalledTimes(3)
  expect(mock2).toHaveBeenCalledTimes(2)
})

test('Everyone is crazy about the good old Fibonacci', () => {
  const fibonacci = {
    [Symbol.iterator] () {
      let pre = 0, cur = 1
      return {
        next () {
          [pre, cur] = [cur, pre + cur]
          return {done: false, value: cur}
        }
      }
    }
  }

  const mock = jest.fn()
  for (const n of fibonacci) {
    if (n > 1000)
      break
    // console.log(n)
    mock()
  }
  expect(mock).toHaveBeenCalledTimes(15)
  expect('Fibonacci Iterable').not.toBe('ever stopped. It will go on forever, we stop it in the for loop')
})

// test('infinite iterator', () => {
// })
