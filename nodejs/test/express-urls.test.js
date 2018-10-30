'use strict'
const supertest = require('supertest')
const client = supertest(require('../src/sample-api-routes'))

test('path1', async () => {
  const response = await client.get('/path1')
  expect(response.statusCode).toBe(200)
  expect(response.body.baseUrl).toEqual('')
  expect(response.body.httpVersion).toEqual('1.1')
  expect(response.body.originalUrl).toEqual('/path1')
  expect(response.body.parsedUrlPathname).toEqual('/path1')
  expect(response.body.url).toEqual('/path1')
})

test('path1 wrong', async () => {
  const response = await client.get('/path1/more')
  expect(response.statusCode).toBe(404)
})

test('wrong path', async () => {
  const response = await client.get('/wrong')
  expect(response.statusCode).toBe(404)
})

test('wrong path two levels', async () => {
  const response = await client.get('/wrong/path')
  expect(response.statusCode).toBe(404)
})
