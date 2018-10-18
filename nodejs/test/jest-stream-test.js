const axios = require('axios')
const baseURL = 'https://jsonplaceholder.typicode.com'
const streamClient = axios.create({
  baseURL: baseURL,
  responseType: 'stream'
})
const client = axios.create({baseURL: baseURL})
const supertest = require('supertest')(baseURL)

test('axios', async () => {
  const response = await client('/posts')
  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  expect(typeof response.data).toBe('object')
  expect(typeof response.headers).toBe('object')
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
  expect(typeof response.data).toBe('object')
  expect(response.data[0].id).toBe(1)
  expect(response.data.lenght).toBeGreaterThan(0)
})

test('axios stream', async () => {
  const response = await streamClient('/posts')
  // console.log(response.request)
  expect(response.status).toBe(200)
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
  expect(response.data.IncomingMessage).toBeDefined()
  expect(response.data.IncomingMessage.ReadableState).toHaveLength(615)
})

test('supertest', async () => {
  const response = await supertest.get('/posts')
  expect(response.status).toBe(200)
  expect(response.type).toBe('application/json')
  expect(response.body[0].id).toBe(1)
  expect(response.body.lenght).toBeGreaterThan(0)
})

test('supertest stream', async () => {
  const response = await supertest.get('/posts').set('Accept', 'stream')
  expect(response.status).toBe(200)
  expect(response.type).toBe('application/json')
  expect(response.body.IncomingMessage).toBeDefined()
  expect(response.body.IncomingMessage.ReadableState).toHaveLength(615)
})
