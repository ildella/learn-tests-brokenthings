const fs = require('fs')
const readline = require('readline')
const __ = require('highland')

const inputStream = fs.createReadStream('input-sample')
// const inputStream = fs.createReadStream('data/itcont_2018_20180422_20180705.txt')
// const inputStream = fs.createReadStream('data/itcont.txt')
// const outputStream = fs.createWriteStream('highland-output')

const stringStream = data => Buffer.from(data).toString()
// const toLines = data => data.split(/\r?\n/)
const toLines = data => data.split(/\n/)
const logger = item => {
  console.log(item)
  return item
}

const rl = readline.createInterface({input: inputStream})
let counter = 0
const generator = __((push, next) => {
  console.log('this should run once...')
  rl.on('line', line => {
    counter++
    push(null, line)
    next()
  })
  rl.on('close', () => {
    console.log(`total lines -> ${counter}`)
    console.log(`used heap -> ${process.memoryUsage().heapTotal / 1024 / 1024}MB`)
    console.log(`total heap -> ${process.memoryUsage().heapUsed / 1024 / 1024}MB`)
    process.exit(0)
  })
})

const count = () => {
  generator
    // .map(stringStream)
    // .filter(string => string != undefined && string != null && string != '')
    // .map(toLines).flatten()
    // .filter(line => {
    //   counter++
    //   return true
    // })
    // .filter(line => {
    //   return counter == 432 || counter == 43243
    // })
    .map(line => line.split('|')[7])
    .map(logger)
    .done(() => console.log(`total lines -> ${counter}`))
    // .pipe(outputStream)

  // inputStream.on('close', (err) => {
  //   console.error(err)
  //   console.log('INPUT - THE END')
  //   console.log(`total called -> ${called}`)
  //   console.log(`total lines -> ${counter}`)
  // })
  // outputStream.on('close', (err) => {
  //   console.error(err)
  //   console.log('OUTPUT - THE END')
  //   console.log(`total lines -> ${counter}`)
  // })
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

count()
// countDonationsPerMonth()
