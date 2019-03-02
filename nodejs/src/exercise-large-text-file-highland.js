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
    push(null, line)
  })
  rl.on('close', () => {
    push(null, __.nil)
    console.log(`used heap -> ${process.memoryUsage().heapTotal / 1024 / 1024}MB`)
    console.log(`total heap -> ${process.memoryUsage().heapUsed / 1024 / 1024}MB`)
  })
}

const countLines = () => {
  __(generator)
    .tap(() => counter++)
    .done(() => console.log(`Highland> line count: ${counter}`))
}

const valuesAtLines = () => {
  __(generator)
    .tap(() => counter++)
    .filter(line => {
      return counter == 432 || counter == 43243
    })
    .map(line => line.split('|')[7])
    .map(value => `value at line ${counter}: ${value}`)
    .toArray(array => console.log(array))
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

// countLines()
valuesAtLines()
// countDonationsPerMonth()
// namesOccurences()
