const stream = require('stream')
const {promisify} = require('util')

class MockOutputStream extends stream.Writable {
  constructor () {
    super({
      objectMode: true
    })
    this
      .on('error', (error) => {
        console.error(error)
      })
      .on('finish', function () {
        console.info(`Stream is done`)
      })
  }
  _write (chunk, enc, next) {
    // console.log(enc)
    console.log(chunk)
  }
}

async function run (context, cb) {
  const fs = require('fs')
  const options = {
    delimiter: ';', // default is ,
    endLine: '$', // default is \n,
    // columns: ['columnName1', 'columnName2'], // by default read the first line and use values found as columns
    columnOffset: 2, // default is 0
    escapeChar: '"', // default is an empty string
    enclosedChar: '"' // default is an empty string
  }
  const readable = fs.createReadStream(context.source)
  const writable = new MockOutputStream()

  readable.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`)
    const stringChunk = chunk.toString('utf8')
    const lines = stringChunk.split('\n')
    console.log(lines)
    console.log(lines.length)
  })

  // __(readable)
  // .through(CSVStream)
  // .pipe(writable)
}

module.exports.run = promisify(run)
