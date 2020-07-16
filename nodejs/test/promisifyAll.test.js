const model = {

  prop: 'someValue',

  info: () => {
    return 'I am what I am'
  },

  read: async id => {
    return {id: id, name: `${id}_name`}
  },

  fetch: async (id, cb) => {
    cb(null, {id: id, name: `${id}_name`})
  },

  fetchAll: async (param, cb) => {
    cb(null, {result: 'ok', param: param})
  },

  search: async function (query, cb) {
    cb(null, {result: 'found!'})
  }

}

const promisifyAll = require('../src/promisifyAll')

test('basic check', async () => {
  console.log(model)
  const promisifedModel = promisifyAll(model)
  expect(promisifedModel.fetch).toBeDefined()
  expect(promisifedModel.info).toBeDefined()
  expect(promisifedModel.fetch).toBeDefined()
  expect(promisifedModel.fetchAll).toBeDefined()
  expect(promisifedModel.search).toBeDefined()
  expect(promisifedModel.prop).toBeDefined()
  expect(promisifedModel.undefined).not.toBeDefined()
  expect(Object.entries(promisifedModel)).toHaveLength(Object.entries(model).length)
})

test('consistency', async () => {
  const promisifedModel = promisifyAll(model)
  expect(promisifedModel.prop).toBe('someValue')
  expect(promisifedModel.info()).toBe('I am what I am')
})
