const axios = require('axios')

const baseURL = 'https://jsonplaceholder.typicode.com'

const streamClient = axios.create({
  baseURL: baseURL,
  responseType: 'stream',
  timeout: 5000
})
const client = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

async function bug () {
  const response = await streamClient('/posts')
  console.log(response.data)
}

async function ok () {
  const response = await client('/posts')
  console.log(response.data.length)
  console.log(response.data[0])
}

bug()
ok()
