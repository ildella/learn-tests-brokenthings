const stream = require('stream')
const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})

class MongoStream extends stream.Writable {
  constructor (db, collection, options={}) {
    super({
      objectMode: true
    })
    const self = this
    this.db = db
    this.collection = collection
    this.name = `Mongo.${this.db.s.databaseName}.${this.collection}`
    this.count = 0
    this.inserted_count = 0
    this.upsert = options.upsert || false
    self
      .on('error', (error) => {
        //TODO: writable.emit('error', error);
        tracer.error(error)
      })
  }
  async _write (chunk, enc, next) {
    const isArray = Array.isArray(chunk)
    if (isArray) {
      this.count += chunk.length
      const result = await this.db.collection(this.collection).insertMany(chunk, { w: 1 })
      tracer.trace(`inserted in ${this.collection}`, result.result)
      this.inserted_count += result.result.n
      next()
    } else if (this.upsert) {
      this.count++
      const result = await this.db.collection(this.collection).replaceOne({_id: chunk._id}, chunk, { upsert: true })
      //TODO: writable.emit('info'...);
      tracer.trace(`inserted in ${this.collection}`, result.result)
      this.inserted_count += result.result.n
      next()
    } else {
      this.count++
      const result = await this.db.collection(this.collection).insertOne(chunk, { w: 1 }, next)
    }
  }
}

module.exports = MongoStream
