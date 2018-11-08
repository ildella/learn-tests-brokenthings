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
    console.log(`line counter -> ${counter}`)
    console.log(`used heap -> ${process.memoryUsage().heapTotal / 1024 / 1024}MB`)
    console.log(`total heap -> ${process.memoryUsage().heapUsed / 1024 / 1024}MB`)
  })
}

const countWithReadline = () => {
  __(generator)
    .filter(line => {
      return counter == 432 || counter == 43243
    })
    .map(line => `value at line ${counter}: ${line.split('|')[7]}`)
    .map(logger)
    .done(() => console.log('Highland> mic drop'))
}

const hCounter = 0
const {stringify} = require ('highland-json')
const output = fs.createWriteStream('../houtput.json')
const countDonationsPerMonth = () => {
  __(generator)
    // .map(date => date.substring(4, 6))
    // .map(line => { return {month: line.split('|')[4].substring(4, 6), line: line,}})
    .map(line => { return {month: '06', a: 2} })
    // .filter(item => item.month === '06')
    // .map(item => {
    //   hCounter++
    //   return item
    // })
    .group('month')
    .map(logger)
    // .map(item => {
    //   const month = Object.keys(item)[0]
    //   return {
    //     month: month,
    //     count: item[month].length
    //   }
    // })
    // .toArray(results => console.log(results))
    .done(() => console.log(`highland counter -> ${counter}`))
    // .through(stringify)
    // .pipe(output)

}

// countWithReadline()
countDonationsPerMonth()
