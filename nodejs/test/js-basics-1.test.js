test('initialize array', () => {
  console.log([])
  // console.log(new Array())
  console.log(new Array(2))
  const array = []
  array[2] = '2'
  array[0] = '0'
  array[3] = '3'
  console.log(array)
})

test('tracer return the param', () => {
  const tracer = require('tracer').colorConsole()
  const o = tracer.info('a')
  expect(o.args[0]).toEqual('a')
})

test('multipliers in js', () => {
  let n = 2
  n *= 8
  expect(n).toBe(16)
})

test('how require works (with tracer npm)', () => {
  const t1 = require('tracer').colorConsole({level: 'info'})
  t1.info('ciao')
  t1.debug('ciao')
  const t2 = require('tracer').colorConsole({level: 'debug'})
  t2.debug('ciao 2')
  const t3 = require('tracer').colorConsole()
  t3.debug('ciao 2')
})

test('strings', () => {
  const s = 'https://sample.com/api'
  expect(s.startsWith('https://')).toBeTruthy()
})

test('match', () => {
  expect(eval('2 + 2')).toBe(4)
  expect(eval('90975/379')).toBe(240.0395778364116)
})

test('basic logic', () => {
  const force = false
  const available = true
  expect(force || available).toBeTruthy()
  expect(force ? force : !available).toBeFalsy()
})

test('parseInt', () => {
  expect(parseInt(null)).toBe(NaN)
})

test('load json from js file', () => {
  const json = require('./fixtures/samplejson.js')
  console.log(json)
  expect(json.a).toBe('a')
})

test('sort array', () => {
  const array=['237','124','255','124','366','255']
  array.sort()
  console.log(array)
})

test('new unique array w/ ES5 filter', () => {
  const array=['237','124','255','124','366','255']
  const unique = array.filter((value, index, self) => {
    return self.indexOf(value) === index
  })
  expect(unique).toHaveLength(4)
  expect(array).toHaveLength(6)
})

test('new unique array w/ ES6 Set', () => {
  const array=['237','124','255','124','366','255']
  const unique = Array.from(new Set(array))
  expect(unique).toHaveLength(4)
  expect(array).toHaveLength(6)
})

test('sum undefined', () => {
  let a = 0
  a += 1
  expect(a).toBe(1)
  a += undefined
  expect(a).toBe(NaN)
})

test('count occurrencies in an array', () => {
  const array = [1, 2, 4, 5, 5, 4, 2, '2', 5, 5]
  // the old way, cause everybody can do a for loop...
  // const occurrences = {}
  // for (let i = 0, j = array.length; i < j; i++) {
  //   occurrences[array[i]] = (occurrences[array[i]] || 0) + 1
  // }
  const occurrences = array.reduce((accumulator, item) => {
    accumulator[item] = (accumulator[item] || 0) + 1
    return accumulator
  }, {})
  expect(occurrences[5]).toBe(4)
  expect(occurrences[2]).toBe(3) // <<-- take care
  expect(occurrences['a']).toBe(undefined)
  expect(occurrences[undefined]).toBe(undefined)
  expect(occurrences[null]).toBe(undefined)
})

test('Sort object by properties values', () => {
  expect(Object.keys({'a': 1, 'b': 3, 'c': 2})).toEqual(['a', 'b', 'c',])
  const object = {'a': 1, 'b': 3, 'c': 2}
  const keysSorted = Object.keys(object).sort((a,b) => {return object[a]-object[b]})
  expect(keysSorted).toEqual(['a', 'c', 'b',])
})

test('Object sort function. Extend Object.prototype OMG the crazy things! :)', () => {
  const object = {'a': 1, 'b': 3, 'c': 2}
  Object.prototype.sort = object => {
    return Object.keys(object).sort((a,b) => {return object[a]-object[b]})
  }
  const keysSorted = Object.sort(object)
  expect(keysSorted).toEqual(['a', 'c', 'b',])
})
