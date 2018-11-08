const fs = require('fs')
const readline = require('readline')
const __ = require('highland')
// const stringStream = data => Buffer.from(data).toString()

const inputStream = fs.createReadStream('../data/input-sample')
// const inputStream = fs.createReadStream('../data/itcont_2018_20180422_20180705.txt')
// const inputStream = fs.createReadStream('../data/itcont.txt')
// const outputStream = fs.createWriteStream('highland-output')

const logger = item => {
  console.log(item)
  return item
}

const rl = readline.createInterface({input: inputStream})
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

const countWithReadline = () => {
  highlandStream
    .filter(line => {
      return counter == 432 || counter == 43243
    })
    .map(line => `value at line ${counter}: ${line.split('|')[7]}`)
    .map(logger)
    .done(() => console.log('Highland> mic drop'))
}

const countDonationsPerMonth = () => {
  highlandStream
    .map(date => date.substring(4, 6))
    .group(date => date.substring(4, 6))
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

// countWithReadline()
countDonationsPerMonth()
