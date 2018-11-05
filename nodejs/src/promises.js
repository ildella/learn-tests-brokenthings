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

const fetchAll = promisify(model.fetchAll)
console.log('the standard function')
console.log(model.info)
console.log('the async function')
console.log(model.fetchAll)
console.log('the promisified async function')
console.log(fetchAll)
console.log('use Promise.all and we see the pending promises')
console.log(Promise.all([model.fetchAll]))
console.log(Promise.all([fetchAll]))

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

async function fetchFromIds (ids) {
  // do NOT use await teamModel.fetch(id) inside the _map. Instead:
  const promises = ids.map(id => model.fetch(id))
  return await Promise.all(promises)
}

const allItems = fetchFromIds([1, 2, 3])
waitForIt(allItems)
