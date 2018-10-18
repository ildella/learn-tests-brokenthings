'use strict'
require('dotenv').config()
const supertest = require('supertest')
const client = supertest(require('../src/api'))

test('Server up and running', async () => {
  const response = await client.get(`/`)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('version')
  expect(response.body).toHaveProperty('name')
})
