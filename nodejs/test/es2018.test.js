const model = {
  fetch: async id => {
    return {id: id, name: `${id}_name`}
  }
}

test('good way to run multiple promises in ES2018', async () => {
  const items = [1, 2, 3]
  const values1 = []
  const values2 = []
  for (const id of items) {
    values1.push(await model.fetch(id))
  }
  items.forEach(async id => {
    values2.push(await model.fetch(id))
  })
  // for await (const id of items) {
  //   values1.push(model.fetch(id))
  // }
  const promises = items.map(id => model.fetch(id))
  expect(values1).toHaveLength(3)
  expect(values2).toHaveLength(0)
  expect(await Promise.all(promises)).toHaveLength(3)
})

test('rest ES2015', async () => {
  restParam(1, 2, 3, 4, 5)
  function restParam (p1, p2, ...p3) {
    expect(p1).toBe(1)
    expect(p2).toBe(2)
    expect(p3).toEqual([3, 4, 5])
  }

  const values = [99, 100, -1, 48, 16]
  expect(Math.max(...values)).toBe(100)
})

test('rest object ES2018', async () => {
  const original = {a: 1, b: 2, c: 3}
  const {a, ...x} = original
  expect(a).toBe(1)
  expect(x).toEqual({b: 2, c: 3})
})

test('rest array ES2018', async () => {
  const original = [1, 2, null, 3]
  const [a, ...x] = original
  expect(a).toEqual(1)
  expect(x).toEqual([2, null, 3])
})

test('spread object ES2018', async () => {
  const x = null
  const y = {a: 1, b: 2}
  const z = {...x, ...y}

  expect(z).toEqual({a: 1, b: 2})
  expect(z).toEqual(y)
  expect(z).not.toBe(y)
})

test('spread array ES2018', async () => {
  const x = [1, 2, null, 3]
  const y = [...x, 4, 5]

  expect(y).toEqual([1, 2, null, 3, 4, 5])
})

test('flat', async () => {
  const listOfLists = [[1, 2, 3], [3, 4, 5]]
  expect(listOfLists.flat()).toEqual([1, 2, 3, 3, 4, 5])
})

const fs = require('fs').promises
const yaml = require('js-yaml')

const readFile = path => {
  const file = fs.readFile(path)
  // console.log(file)
  return file
}

const __ = require('highland')

// test('fs with promises', async done => {
//   const path = '../input.yml'
//   const json = yaml.safeLoad(await fs.readFile(path))
//   expect(json.location).toBe('London')

//   __([path])
//     .tap(console.log)
//     .map(__.wrapCallback(readFile)).sequence()
//     .tap(console.log)
//     .toArray(results => {
//       console.log(results)
//       done(null)
//     })
// })

const intersection = arrays => {
  return arrays.reduce((a, b) => a.filter(c => b.includes(c)))
}

test('intersection', () => {
  expect(intersection([[1, 2, 3], [101, 2, 1, 10], [2, 1]])).toEqual([1, 2])
  expect(intersection([[1, 2, 3], [101, 2, 1, 10], []])).toEqual([])
  expect(intersection([[1, 2, 3, 1, 1], [101, 2, 1, 10], [1]])).toEqual([1, 1, 1])
})

const reverseIntersection = arrays => {
  return arrays.reduce((a, b) => a.filter(c => !b.includes(c)))
}

test('reverseIntersection', () => {
  expect(reverseIntersection([[1, 2], [1, 2]])).toEqual([])
  expect(reverseIntersection([[1, 2, 3, 4], [1, 2]])).toEqual([3, 4])
  // expect(reverseIntersection([[1, 2], [101, 2, 1, 10]])).toEqual([101, 10])
  // expect(intersection([[1, 2], [101, 2, 1, 10]])).toEqual([])
})
