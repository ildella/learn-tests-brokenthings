const {promisify} = require('util')

const model = {

  prop: 'someValue',

  info: () => {
    return 'I am what I am'
  },

  fetch: async (id, cb) => {
    cb(null, {id: id, name: `${id}_name`})
  },

  fetchAll: async (param, cb) => {
    cb(null, {result: 'ok', param: param})
  }

}

const fetch = promisify(model.fetch)
const fetchAll = promisify(model.fetchAll)

const job = async (param, cb) => {
  console.log('starting...')
  setTimeout(() => {
    cb(null, `${param} - DONE`)
  }, 100)
}

const promisifiedJob = promisify(job)

const f1 = promisify(async (cb) => {
  const result = await promisifiedJob(1)
  cb(null, result)
})

test('2 nested promisified functions', async () => {
  const result = await f1()
  console.log(result)
})

test('test return with await with promisifiedJob', async () => {
  console.log(await promisifiedJob(2))
})

test('print the basics', async () => {
  console.log('the standard function')
  console.log(model.info)
  console.log('the async function')
  console.log(model.fetchAll)
  console.log('the promisified async function')
  console.log(fetchAll)
  console.log('use Promise.all and we see the pending promises')
  console.log(Promise.all([model.fetchAll]))
  console.log(Promise.all([fetchAll]))
})

test('async functions with callback, promisified', async () => {
  fetchAll('a')
    .then(response => console.log('boring old style...', response))
    .catch(err => console.error(err))

  const response = fetchAll('b')
  console.log('do not wait for it...', response)
  console.log('wait for it...', await response)

  Promise.all([fetchAll('c'), fetchAll('d')])
    .then(values => {
      console.log('and here are the responses from all the promises that run')
      console.log(values)
    })
})

test('good way to run multiple promises / avoid async in loops', async () => {
  const promises = [5, 6, 7, 8].map(id => fetch(id))
  console.log(await Promise.all(promises))
})

test('Function name and toStringTag', () => {
  const asyncFn = async () => {}
  // console.log(asyncFn)
  // console.log(asyncFn[Symbol.toStringTag])
  expect(asyncFn.name).toEqual('asyncFn')
  expect(asyncFn[Symbol.toStringTag]).toEqual('AsyncFunction')
})

function className (object) {
  return Object.prototype.toString.call(object).replace('object ', '').replace('[', '').replace(']', '')
}

test('how to build a Promise.promisifyAll() (ES2017)', async () => {
  const asyncFunctions = Object.values(model).filter(f => f[Symbol.toStringTag] === 'AsyncFunction')
  const syncFunctions = Object.values(model).filter(f => f[Symbol.toStringTag] !== 'AsyncFunction')
  const promisifiedAsyncFunctions = asyncFunctions.map(f => promisify(f))
  const promisifiedModel = {}
  promisifiedAsyncFunctions.forEach(f => promisifiedModel[f.name] = f)
  syncFunctions.forEach(f => promisifiedModel[f.name] = f)
  // console.log(promisifiedModel)
  // console.log('crash ->', model.fetch(99))
  // console.log('pending ->', promisifiedModel.fetch(99))
  // console.log('resolved async ->', await promisifiedModel.fetch(99))
  expect(await promisifiedModel.fetch(99)).toEqual({id: 99, name: '99_name'})
  // console.log(Object.getOwnPropertyDescriptors(model))
  console.log(Object.entries(model).length)
  console.log(Object.entries(model).forEach(entry => console.log(entry[1])))
  console.log(Object.entries(model).forEach(entry => console.log(typeof entry[1])))
  console.log(Object.entries(model).forEach(entry => console.log(className(entry[1]))))
  const fields = Object.entries(model).filter(entry => typeof entry[1] != 'function')
  expect(fields).toHaveLength(1)
  console.log(fields)
  // expect(fields).toEqual('["props": "someValue"]')
  fields.forEach(entry => promisifiedModel[entry[0]] = entry[1])
  expect(promisifiedModel.info).toBeDefined()
  expect(promisifiedModel.fetch).toBeDefined()
  expect(promisifiedModel.fetchAll).toBeDefined()
  console.log(promisifiedModel)
  expect(promisifiedModel.prop).toBe('someValue')
  // const officialPromisifiedModel = Promise.promisifyAll(model)
})
