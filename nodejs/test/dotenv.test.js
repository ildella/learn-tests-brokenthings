const fs = require('fs')

beforeAll(() => {
  const env = 'VARIABLE=\'someValue\'\nPORT=3333\nOTHER_VARIABLE=10'
  const testEnv = 'VARIABLE=\'someOtherValue\'\nPORT=4444\n'
  fs.writeFileSync('.env', env)
  fs.writeFileSync('.test.env', testEnv)
})

afterAll(() => {
  fs.unlinkSync('.env')
  fs.unlinkSync('.test.env')
})

// test('empty', async () => {
//   expect(process.env.NODE_ENV).toBe('test')
//   expect(process.env.VARIABLE).toBeUndefined()
// })

// test('basic', async () => {
//   require('dotenv').config({path: 'test.env'})
//   expect(process.env.VARIABLE).toBeDefined()
// })

test('dotenv does NOT override variables but loads new ones', async () => {
  require('dotenv').config({path: '.test.env'})
  expect(process.env.VARIABLE).toBeDefined()
  expect(process.env.VARIABLE).toBe('someOtherValue')
  expect(process.env.PORT).toBe('4444')
  expect(process.env.NODE_ENV).toBe('test')
  expect(process.env.OTHER_VARIABLE).toBeUndefined()

  require('dotenv').config()
  expect(process.env.VARIABLE).toEqual('someOtherValue')
  expect(process.env.PORT).toEqual('4444')
  expect(process.env.OTHER_VARIABLE).toBe('10')
})

