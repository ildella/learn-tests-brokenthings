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
  },

  search: async param => {
    return `${param} -> found!`
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

test('Promise.all', () => {
  return Promise.all([fetchAll('c'), fetchAll('d')])
    .then(values => {
      console.log('and here are the responses from all the promises that run')
      expect(values).toEqual([{'param': 'c', 'result': 'ok'}, {'param': 'd', 'result': 'ok'}])
    })
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
  // console.log(promisifiedModel)
  expect(promisifiedModel.prop).toBe('someValue')
  // const officialPromisifiedModel = Promise.promisifyAll(model)
})

test('callback, returns, promises OhMy!', async () => {
  const fn = async () => {
    // const promise = model.fetch(1) // --> ERROR cb not a function
    model.search('a')
    const response = await fetch(1)
    expect(response).toEqual({id: 1, name: '1_name'})
    return response
  }
  // expect(promise).toEqual({})
  const response = await fn()
  expect(response).toEqual({id: 1, name: '1_name'})
})

test('resolve the promise', () => {
  const promise = fetch(1)
  console.log(promise)
  // IMPORTANT: here the return is mandatory for the test to pass
  return expect(Promise.resolve(promise)).resolves.toEqual({id: 1, name: '1_name'})
})

test('await "the promise"', async () => {
  const response = await fetch(1)
  console.log(response)
  expect(response).toEqual({id: 1, name: '1_name'})
})

test('async function with return is, indeed, a Promise', () => {
  const promise = model.search(3)
  console.log('model.search is a...', promise)
  // IMPORTANT: here the return is mandatory for the test to pass
  return expect(Promise.resolve(promise)).resolves.toEqual('3 -> found!')
})

// IMPORTANT: from now on we use await so we do not have to return the expect
test('and what happens if we reject the return promise?', async () => {
  const promise = model.search(3)
  await expect(Promise.reject(new Error('ARGH!'))).rejects.toThrow('ARGH') // is this a bug?
  await expect(Promise.resolve(promise)).resolves.toEqual('3 -> found!')
  // await expect(Promise.reject(promise)).rejects.toEqual({}) // the reject is not specified, it stays a promise?
})

test('ok, we do not have a basic promise yet...', async () => {
  const p = param => new Promise((resolve, reject) => {
    if (!param) return reject('error message')
    resolve({result: 'ok'})
  })
  console.log(p(false))
  await expect(Promise.resolve(p(true))).resolves.toEqual({result: 'ok'})
  await expect(Promise.resolve(p(false))).rejects.toEqual('error message')
  p(true).then(result => console.log(result))
  p(false)
    .then(result => console.log(result))
    .catch(err => console.error(err))
})
