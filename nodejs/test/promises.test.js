// const util = require('util')
const {promisify} = require('util')

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

// test('await does not work on non-promise, async () => {
//   const result = await job(3)
//   console.log(result)
// })
