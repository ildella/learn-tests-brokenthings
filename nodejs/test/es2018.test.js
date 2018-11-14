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

test('rest ES2018', async () => {
  const myObject = {
    a: 1,
    b: 2,
    c: 3
  }
  const {a, ...x} = myObject
  expect(a).toBe(1)
  expect(x).toEqual({b: 2, c: 3})
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

const yaml = require('js-yaml')
const fs = require('fs').promises
const __ = require('highland')
// const readFile = async path => await fs.readFile(path)

test('fs with promises', async () => {
  const path = '../data/input.yml'
  // console.log(readFile(path))
  // console.log(await readFile(path))
  const json = yaml.safeLoad(await fs.readFile(path))
  expect(json.location).toBe('London')

  const readFile = async path => await fs.readFile(path)
  __([path])
    .map(__.wrapCallback(readFile)).sequence()
    .tap(console.log)
    .toArray(results => console.log(results))
})
