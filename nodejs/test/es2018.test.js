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

test('rest/spread ES2015', async () => {
  restParam(1, 2, 3, 4, 5)
  function restParam (p1, p2, ...p3) {
    expect(p1).toBe(1)
    expect(p2).toBe(2)
    expect(p3).toEqual([3, 4, 5])
  }

  const values = [99, 100, -1, 48, 16]
  expect(Math.max(...values)).toBe(100)
})

test('rest/spread ES2018', async () => {
  const myObject = {
    a: 1,
    b: 2,
    c: 3
  }
  const {a, ...x} = myObject
  expect(a).toBe(1)
  expect(x).toEqual({b: 2, c: 3})
})
test('flat', async () => {

  const listOfLists = [[1, 2, 3], [3, 4, 5]]
  expect(listOfLists.flat()).toEqual([1, 2, 3, 3, 4, 5])
})
