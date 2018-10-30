const FormData = require('form-data')

test('shuffle results for each list', () => {
  const o = {a: 'a', b: 'b'}
  const form = new FormData()
  form.append('akey', 'avalue')
  Object.keys(o).forEach(key => form.append(key, o[key]))
  // console.log(form)
})

// client.interceptors.response.use(response => {
//   tracer.warn(`intercepting axios positive response -> ${response.status}`)
//   return response
// }, error => {
//   const response = error.response
//   if (response) {
//     const config = response.config
//     const message = `${response.status} ${config.method} ${config.url} ${config.data}`
//     throw new Error(`API REQUEST FAILED -> ${message}`)
//   } else { throw new Error('API REQUEST FAILED BADLY') }
// })
