test('empty', async () => {
  expect(process.env.NODE_ENV).toBe('test')
  expect(process.env.VARIABLE).toBeUndefined()
})

test('basic', async () => {
  require('dotenv').config({path: 'test.env'})
  expect(process.env.VARIABLE).toBeDefined()
})
