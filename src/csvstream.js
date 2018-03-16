const __ = require('highland')
const stream = require('stream')

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
    console.log(enc)
    console.log(chunk)
  }
}

async function process (context) {
  const fs = require('fs')
  const csv = require('csv-stream')
  const options = {
    delimiter: ';', // default is ,
    endLine: '\n', // default is \n,
    // columns: ['columnName1', 'columnName2'], // by default read the first line and use values found as columns
    columnOffset: 2, // default is 0
    escapeChar: '"', // default is an empty string
    enclosedChar: '"' // default is an empty string
  }
  const inputStream = fs.createReadStream(context.source)
  const outputStream = new MockOutputStream()
  const CSVStream = csv.createStream(options)

  __(inputStream)
    .through(CSVStream)
    .pipe(outputStream)
}

module.exports.process = process
