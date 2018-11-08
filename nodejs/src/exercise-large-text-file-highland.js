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
const generator = (push, next) => {
  rl.on('line', line => {
    counter++
    push(null, line)
    // next()
  })
  rl.on('close', () => {
    push(null, __.nil)
    // console.log(`line counter -> ${counter}`)
    // console.log(`used heap -> ${process.memoryUsage().heapTotal / 1024 / 1024}MB`)
    // console.log(`total heap -> ${process.memoryUsage().heapUsed / 1024 / 1024}MB`)
  })
}

const countWithReadline = () => {
  __(generator)
    .filter(line => {
      return counter == 432 || counter == 43243
    })
    .map(line => `value at line ${counter}: ${line.split('|')[7]}`)
    .map(logger)
    .done(() => console.log(`Highland> line count: ${counter}`))
}

// const output = fs.createWriteStream('../houtput.json')
const accumulator = {}
const groupByMonth = function (a, item) {
  accumulator[item.month] = (accumulator[item.month] || 0) + 1
  return item
}
const countDonationsPerMonth = () => {
  __(generator)
    .map(line => { return {month: line.split('|')[4].substring(4, 6), line: line,}})
    .reduce(0, groupByMonth)
    .done(() => {
      console.log('Highland> donations per month:')
      console.log(accumulator)
      console.log('(mic drop)')
    })
}

// countWithReadline()
countDonationsPerMonth()
