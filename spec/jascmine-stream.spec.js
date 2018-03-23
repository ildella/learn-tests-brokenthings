const axios = require('axios')
const baseURL = 'https://jsonplaceholder.typicode.com'
const streamClient = axios.create({
  baseURL: baseURL,
  responseType: 'stream'
})
const client = axios.create({baseURL: baseURL})
const supertest = require('supertest')(baseURL)

describe('A suite is just a function', function () {
  var a

  it('and so is a spec', function () {
    a = true

    expect(a).toBe(true)
  })

  it('should behave as a stream', async () => {
    const response = await streamClient('/posts')
    // console.log(response.request)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
    expect(response.data.IncomingMessage).toBeDefined()
    expect(response.data.IncomingMessage.ReadableState).toHaveLength(615)
  })
})
