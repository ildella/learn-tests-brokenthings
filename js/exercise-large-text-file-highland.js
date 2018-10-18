const fs = require('fs')
const __ = require('highland')

// const inputStream = fs.createReadStream('data/itcont.txt')
const inputStream = fs.createReadStream('data/itcont_2018_20180422_20180705.txt')
// const inputStream = fs.createReadStream('input-sample')
const outputStream = fs.createWriteStream('highland-output')

const stringStream = data => Buffer.from(data).toString()
const toLines = data => data.split(/\r?\n/)
const logger = item => {
  console.log(item)
  return item
}

const run = () => {
  let counter = 0
  __(inputStream)
    .map(stringStream)
    .filter(string => string != undefined && string != null && string != '')
    .map(toLines).flatten()
    .filter(line => {
      counter++
      return true
    })
    .filter(line => {
      return counter == 432 || counter == 43243
    })
    .map(line => line.split('|')[7])
    .map(logger)
    .done(() => console.log('DONE'))
    // .pipe(outputStream)

  inputStream.on('close', (err) => {
    console.error(err)
    console.log('INPUT - THE END')
    console.log(`total lines -> ${counter}`)
  })
  // outputStream.on('close', (err) => {
  //   console.error(err)
  //   console.log('OUTPUT - THE END')
  //   console.log(`total lines -> ${counter}`)
  // })
}

run()
