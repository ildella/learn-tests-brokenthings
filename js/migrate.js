const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})
const util = require('util')
const _ = require('lodash')
const __ = require('highland')
const {DateTime} = require('luxon')
const MongoStream = require('./mongostream')
const mongoutils = require('../mongoutils')

const logger = item => {
  tracer.debug(item)
  return item
}

const createTimeChunks = async (options) => {
  const increment = options.increment || {days: 1}
  const begin = DateTime.fromISO(options.begin)
  const end = DateTime.fromISO(options.end)
  const timeChunks = []
  let chunkBegin = begin
  while (chunkBegin < end) {
    const timeChunk = {
      begin: chunkBegin,
      end: chunkBegin.plus(increment)
    }
    timeChunks.push(timeChunk)
    chunkBegin = timeChunk.end
  }
  return timeChunks
}

const prepareQuery = (transform) => {
  // tracer.debug(transform.options)
  const options = transform.options || {}
  const begin = options.begin || DateTime.local().minus({minutes: 60}).toISO()
  const end = options.end || DateTime.local().toISO()
  const timeRange = mongoutils.rangeQuery(begin, end)
  // const query = {_id: {
  //   $gte: mongoutils.objectIdfromISO(begin),
  //   $lte: ObjectId.createFromTime(DateTime.fromISO(end).ts / 1000)
  // }}
  tracer.trace(`Import: ${transform.source.collection} --> ${transform.sink.collection}`)
  return Object.assign({}, transform, {query: timeRange})
}

const importCollection = async (transform, done) => {
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

module.exports = util.promisify(importCollection)
