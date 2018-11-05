const stream = require('stream')
const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL || 'debug'})

class MongoStream extends stream.Writable {
  constructor (db, collection, options={}) {
    super({
      objectMode: true
    })
    const self = this
    this.db = db
    this.collection = collection
    this.name = `Mongo.${this.db.s.databaseName}.${this.collection}`
    this.inputCount = 0
    this.inserted_count = 0
    this.options = options
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
      this.inputCount += chunk.length
      const response = await this.db.collection(this.collection).insertMany(chunk, this.options.write || {})
      this.inserted_count += response.result.n
      tracer.debug(`${this.collection}: ask to insert ${chunk.length} and inserted ${response.result.n}. Tot: ${this.inserted_count} out of ${this.inputCount}`)
      next()
    // } else if (this.upsert) {
    //   this.inputCount++
    //   const response = await this.db.collection(this.collection).replaceOne({_id: chunk._id}, chunk, {upsert: true})
    //   //TODO: writable.emit('info'...);
    //   this.inserted_count += response.result.n
    //   tracer.debug(`replaced document in ${this.collection}`, response.result)
    //   next()
    } else {
      this.inputCount++
      tracer.trace(this.options)
      const response = await this.db.collection(this.collection).insertOne(chunk, this.options.write || {})
      const inserted = response.result.n ? response.result.n : 0
      tracer.debug(inserted)
      this.inserted_count += inserted
      tracer.debug
      tracer.debug(`${this.collection}: ask to insert 1 and inserted ${response.result.n}. Session: inserted ${this.inserted_count} out of ${this.inputCount}`)
      next()
    }
  }
}

module.exports = MongoStream
