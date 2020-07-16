test('this', () => {
  // console.log(this)
  const o = {
    prop: 'value',
    run: () => {
      // console.log(this)
      expect(o.prop).toBe('value')
    }
  }
  o.run()
})

test('array shift', () => {
  const a = [1, 2, 3]
  const b = a.shift()
  expect(a).toEqual([2, 3])
  expect(b).toEqual(1)
})

test('object assign with null and undefined', () => {
  expect(Object.assign({a: 1}, null)).toEqual({a: 1})
  expect(Object.assign({a: 1}, undefined)).toEqual({a: 1})
})

test('get default from map/json', () => {
  const o = {a: 1, b: 2}
  expect(o['a']).toBe(1)
  expect(o['c']).toBe(undefined)
  expect(o['c'] || 3).toBe(3)
})

test('es6 power :)', () => {
  expect(2**8).toBe(256)
})

test('destructuring 1', () => {
  const search = ({p1, p2 = 1}) => {
    // console.log(p1)
    // console.log(p2)
    return p1 + p2
  }
  const result = search({p1: 1})
  expect(result).toBe(2)
  expect('add new parameter do NOT break old code').toBeTruthy()
})

const defaultSearch = {since: 'Forever'}
test('destructuring with defaults', () => {
  const search = ({query, since, user} = defaultSearch) => {
    expect(query).toBe(undefined)
    expect(since).toBe('Forever')
    expect(user).toBe(undefined)
    since = since.toLowerCase()
    expect(since).toBe('forever')
    return {status: 'ok'}
  }
  const result = search()
  expect(defaultSearch.since).toBe('Forever')
  expect(result.status).toBe('ok')
})

const requiredParam = (param) => {
  const requiredParamError = new Error(
    `Required parameter, "${param}" is missing.`
  )

  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(
      requiredParamError,
      requiredParam
    )
  }

  throw requiredParamError
}

test('destructuring with required parameter', () => {
  const search = ({a, b = requiredParam('b')} = defaultSearch) => {return 0}
  expect(() => { search() }).toThrow('a') // ummmmm
  // search()
})

test('spread / compose', () => {
  const defaults = {a: 1, b: 1, c: 1}
  const user = {a: 2, b: 3}
  const composed = {...defaults, ...user}
  expect(composed).toEqual({a: 2, b: 3, c: 1})
})

test('rest', () => {
  const object = {a: 1, b: 2, c: 3}
  const {b, ...rest} = object
  expect(b).toEqual(2)
  expect(rest).toEqual({a: 1, c: 3})
})

test('modulus', () => {
  expect(27%13).toBe(1)
  expect(27%-13).toBe(1)
  expect(-27%13).toBe(-1) // WRONG should be 12
  // expect(-27%13).toBe(12)
})

test('array pop and shift', () => {
  const a = [1, 2, 3]
  a.push(4)
  expect(a.pop()).toBe(4)
  expect(a.shift()).toBe(1)
  expect(a).toEqual([2, 3])
})

test('array slice', () => {
  const a = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
  expect(a.slice(1, 3)).toEqual(['Orange', 'Lemon'])
  expect(a).toEqual(['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'])
  expect(a.slice(0, 10)).toEqual(['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'])
})

test('insert at beginning', () => {
  const a = [0, 1, 2, 3, 4]
  a.push(5)
  expect(a.slice(1, 6)).toEqual([1, 2, 3, 4, 5])

  // const b = [0]
  // expect(b.slice(1, 11)).toEqual([0])
})

test('no-lodash: groupBy and keyBy', () => {
  const items = [{title: 'burger', price: 950}, {title: 'chips', price: 350}]
  const grouped = items.reduce((r, v, i, a, k = v.title) => ((r[k] || (r[k] = [])).push(v), r), {})
  expect(grouped.burger).toBeDefined()
  expect(grouped.chips).toBeDefined()
  const keyBy = (array, key) => (array || []).reduce((r, x) => ({...r, [key ? x[key] : x]: x}), {})
  const byKey = keyBy(items, 'title')
  expect(byKey.burger).toBeDefined()
  expect(byKey.chips).toBeDefined()
})

test('no-lodash: flat and flatMap', () => {
})

test('no-lodash: defaults, set and get', () => {
  const defaults = Object.assign({}, {'a': 1}, {'b': 2}, {'a': 3})
  // expect(defaults).toEqual({'a': 1, 'b': 2})
})

test('no-lodash: toPath', () => {
})

test('no-lodash: isEqual', () => {
})

test('no-lodash: uniq', () => {
  const array = [1, 2, 3, 1]
  const unique = [...new Set(array)]
  expect(unique).toEqual([1, 2, 3])

})

test('no-lodash: uniqWith', () => {
})

test('basic logic', () => {
  expect(1).toBeTruthy()
  expect('a').toBeTruthy()
  const a = 'a'
  expect(!a).toBeFalsy()
})

test('Symbols are a new primitive type. ', () => {
  const a = Symbol('a')
  const b = Symbol('a')
  expect(a).not.toEqual(b)
})
