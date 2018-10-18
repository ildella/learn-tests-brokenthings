// const {promisify} = require('util')
const fs = require('fs')
const __ = require('highland')
const readline = require('readline')
const stream = require('stream')

// const inputStream = fs.createReadStream('data/itcont.txt')
const inputStream = fs.createReadStream('data/itcont_2018_20180422_20180705.txt')
// const inputStream = fs.createReadStream('input-sample')
const outputStream = fs.createWriteStream('highland-output')

const stringStream = data => { return Buffer.from(data).toString() }
const logger = item => {
  console.log(item)
  return item
}

const run = () => {
  let counter = 0
  __(inputStream)
    .map(stringStream)
    // .through(stream => {
    //   console.log(stream)
    // })
    .filter(line => {
      counter++
      console.log(counter)
      // const valid = counter == 432
      // console.log(valid)
      // return counter == 432
      return true
    })
    // .map(logger)
    .map(line => line.split('|')[7])
    .pipe(outputStream)
}

// module.exports = promisify(run)

run()
