const {promisify} = require('util')

const model = {
  fetchAll: async (param, cb) => {
    cb(null, {result: 'ok', param: param})
  },

  info: () => {
    return 'I am what I am'
  },

  fetch: async id => {
    return {id: id, name: `${id}_name`}
  }
}

const waitForIt = async (promise) => {
  console.log('wait for it...', await promise)
}

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

const fetchAll = promisify(model.fetchAll)

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

test('async functions promisify', async () => {
  fetchAll('a')
    .then(response => console.log('boring old style...', response))
    .catch(err => console.error(err))

  const response = fetchAll('b')
  console.log('do not wait for it...', response)

  waitForIt(response)

  Promise.all([fetchAll('c'), fetchAll('d')])
    .then(values => {
      console.log('and here are the responses from all the promises that run')
      console.log(values)
    })
})

test('good way to run multiple promises', async () => {
  async function fetchFromIds (ids) {
  // do NOT use await model.fetch(id) inside the map(). Instead:
    const promises = ids.map(id => model.fetch(id))
    return await Promise.all(promises)
  }

  const allItems = fetchFromIds([1, 2, 3])
  waitForIt(allItems)
})

test('Function name and toStringTag', () => {
  const asyncFn = async () => {}
  // console.log(asyncFn)
  // console.log(asyncFn[Symbol.toStringTag])
  expect(asyncFn.name).toEqual('asyncFn')
  expect(asyncFn[Symbol.toStringTag]).toEqual('AsyncFunction')
})

test('is Promise.promisifyAll() in yet?', async () => {
  const asyncFunctions = Object.values(model).filter(f => f[Symbol.toStringTag] === 'AsyncFunction')
  const syncFunctions = Object.values(model).filter(f => f[Symbol.toStringTag] !== 'AsyncFunction')
  const promisifiedAsyncFunctions = asyncFunctions.map(f => promisify(f))
  console.log(asyncFunctions)
  console.log(syncFunctions)
  const promisifiedModel = {}
  promisifiedAsyncFunctions.forEach(f => promisifiedModel[f.name] = f)
  syncFunctions.forEach(f => promisifiedModel[f.name] = f)
  console.log(model)
  console.log(promisifiedModel)
  console.log(promisifiedModel.fetch(99))
  console.log(model.fetch(99))
  // const officialPromisifiedModel = Promise.promisifyAll(model)
})
