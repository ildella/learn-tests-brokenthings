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
