const fs = require('fs')
const readline = require('readline')
const __ = require('highland')

const inputStream = fs.createReadStream('data/input-sample')
// const inputStream = fs.createReadStream('data/itcont_2018_20180422_20180705.txt')
// const inputStream = fs.createReadStream('data/itcont.txt')

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
    .done(() => console.log(`Highland> line count: ${counter}`))
}

const accumulator = {}
const sumByMonth = function (a, item) {
  accumulator[item.month] = (accumulator[item.month] || 0) + 1
  return item
}
const countDonationsPerMonth = () => {
  __(generator)
    .map(line => { return {month: line.split('|')[4].substring(4, 6), line: line,}})
    .reduce(0, sumByMonth)
    .done(() => {
      console.log('Highland> donations per month:')
      console.log(accumulator)
      console.log('(mic drop)')
    })
}

const occurrences = {}
const namesOccurences = () => {
  __(generator)
    .map(line => line.split('|')[8])
    .reduce(0, (a, name) => {
      occurrences[name] = (occurrences[name] || 0) + 1
      return name
    })
    .done(() => {
      console.log('Highland> names occurrences:')
      console.log(occurrences)
      console.log('(mic drop)')
    })
}

countWithReadline()
// countDonationsPerMonth()
// namesOccurences()
