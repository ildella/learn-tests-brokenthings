const array = []
array.push({a: 'b'})
array.push({a: 'c'})
const newArray = Array.from(array)
newArray.push({a: 'd'})
// console.log(array)
// console.log(newArray)

test('basic tests', async () => {
  try {
    expect(1).toBe(1)
  } catch (e) {
    console.error(e)
  }
})

test('assign', async () => {
  let case1 = aFunction()
  expect(case1.prop1).toBe('p1')
  expect(case1.prop2).toBe()
  let case2 = aFunction({prop2: 'p2'})
  expect(case2.prop1).toBe('p1')
  expect(case2.prop2).toBe('p2')
})

function aFunction (param) {
  let aParam = param || {}
  aParam.prop1 = 'p1'
  return aParam
}

test('assign and reference', async () => {
  let source = { a: 'b' }
  let target = source || {}
  expect(target.a).toBe('b')
  target.a = 'c'
  expect(target.a).toBe('c')
  expect(source.a).toBe('c')
  source.a = 'd'
  expect(target.a).toBe('d')
  expect(source.a).toBe('d')
})

test('arrays', async () => {
  let array = []
  array.push(1)
  expect(array[0]).toBe(1)
  // array.next()
})

test('Booleans', async () => {
  expect(Boolean('false')).toBe(true)
  expect(Boolean('true')).toBe(true)
  expect(Boolean('blablabla')).toBe(true)
  expect(Boolean('')).toBe(false)
  expect(Boolean(undefined)).toBe(false)
  expect(Boolean(null)).toBe(false)
  expect(JSON.parse('true')).toBe(true)
  expect(JSON.parse('false')).toBe(false)
  // expect(JSON.parse('FALSE')).toBe(false)
  // expect(JSON.parse('FAlsE')).toBe(false)
})

test('toLowerCase', async () => {
  expect('TRUE'.toLowerCase()).toBe('true')
  expect('TruE'.toLowerCase()).toBe('true')
})

test('Object.assign()', async () => {
  const target = Object.assign({}, {a: 1})
  expect(target).toEqual({a: 1})
})

test('elegant if else else', async () => {
  const genders = {
    m: 'Male',
    f: 'Female'
  }
  expect(genders['m'] || 'Not Specified').toBe('Male')
  expect(genders['f'] || 'Not Specified').toBe('Female')
  expect(genders[''] || 'Not Specified').toBe('Not Specified')
})
