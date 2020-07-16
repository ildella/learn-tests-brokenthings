const {promisify} = require('util')

const isFunction = x => {
  return typeof x === 'function'
}

const isAsyncFunction = f => {
  return f[Symbol.toStringTag] === 'AsyncFunction'
}

const promisifyAll = model => {
  const fields = Object.entries(model).filter(entry => !isFunction(entry[1]))
  const syncFunctions = Object.values(model).filter(isFunction).filter(f => !isAsyncFunction(f))
  const asyncFunctions = Object.values(model).filter(isAsyncFunction)
  const promisifiedModel = {}
  const promisifiedAsyncFunctions = asyncFunctions.map(f => promisify(f))
  promisifiedAsyncFunctions.forEach(f => promisifiedModel[f.name] = f)
  syncFunctions.forEach(f => promisifiedModel[f.name] = f)
  fields.forEach(entry => promisifiedModel[entry[0]] = entry[1])
  return promisifiedModel
}

module.exports = promisifyAll
