const fs = require('fs')
const readline = require('readline')
const __ = require('highland')

// const inputStream = fs.createReadStream('../data/input-sample')
// const inputStream = fs.createReadStream('../data/itcont_2018_20180422_20180705.txt')
const inputStream = fs.createReadStream('../data/itcont.txt')
// const outputStream = fs.createWriteStream('highland-output')

const logger = item => {
  console.log(item)
  return item
}

const stringStream = data => Buffer.from(data).toString()
const toLines = data => data.split(/\r?\n/)
// const toLines = data => data.split(/\n/)
const countWithCustomStringParser = () => {
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
    .done(() => console.log(`Real lines: 13709514. Counted lines -> ${counter}`))
    // .pipe(outputStream)
}

const rl = readline.createInterface({input: inputStream})
const countWithReadline = () => {
  let counter = 0
  const highlandStream = __((push, next) => {
    rl.on('line', line => {
      counter++
      push(null, line)
    })
    rl.on('close', () => {
      console.log(`total lines -> ${counter}`)
      console.log(`used heap -> ${process.memoryUsage().heapTotal / 1024 / 1024}MB`)
      console.log(`total heap -> ${process.memoryUsage().heapUsed / 1024 / 1024}MB`)
    })
  })

  highlandStream
    .filter(line => {
      return counter == 432 || counter == 43243
    })
    .map(line => `value at line ${counter}: ${line.split('|')[7]}`)
    .map(logger)
    .done(() => console.log('Highland> mic drop'))
}

const countDonationsPerMonth = () => {
  const counter = 0
  __(inputStream)
    .map(stringStream)
    .map(toLines).flatten()
    // .map(line => line.split('|')[4])
    // .filter(string => string != undefined && string != null && string != '')
    // .map(date => date.substring(4, 6))
    // .group(date => date.substring(4, 6))
    .group(line => line.split('|')[4].substring(4, 6))
    .map(item => {
      const month = Object.keys(item)[0]
      return {
        month: month,
        count: item[month].length
      }
    })
    .map(logger)
    .done(() => console.log(`total lines -> ${counter}`))
}

countWithReadline()
