const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})
const util = require('util')
const _ = require('lodash')
const __ = require('highland')
const MongoStream = require('./MongoStream')

const logger = item => {
  tracer.debug(item)
  return item
}

const migrateCollection = async (transform, done) => {
  const sinkDataStore = global[transform.sink.datastore]
  const sinkStream = new MongoStream(sinkDataStore, transform.sink.collection, {upsert: true})
  sinkStream.on('finish', async () => {
    const total = await sinkDataStore.collection(transform.sink.collection).countDocuments()
    done(null, Object.assign({}, transform.result, {
      inserted: sinkStream.inserted_count, total: total, task: transform.description
    }))
  })
  const cursor = global[transform.source.datastore].collection(transform.source.collection).find(transform.query)
  const keyValueMapper = source => {
    if (!transform.mapping) {
      return source
    }
    const keyMapping = transform.mapping || {}
    const valueMapping = transform.valueMapping || {}
    const cleaned = _.pick(source, Object.keys(keyMapping))
    return _(cleaned)
      .mapKeys((v, k) => `${keyMapping[k]}`)
      .mapValues(v => valueMapping[v] || v)
      .value()
  }
  const subfield = remapped => {
    if (!transform.subfield) { return remapped }
    const newObject = {}
    newObject[`${transform.subfield}`] = remapped
    return newObject
  }
  __(cursor)
    .map(keyValueMapper)
    .map(subfield)
    .pipe(sinkStream)
}

module.exports = util.promisify(migrateCollection)
