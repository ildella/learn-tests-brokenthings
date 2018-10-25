/**
From https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33
**/

const fs = require('fs')
const readline = require('readline')

// const inputStream = fs.createReadStream('input-sample')
// const inputStream = fs.createReadStream('data/itcont_2018_20180422_20180705.txt')
const inputStream = fs.createReadStream('data/itcont.txt')
const outputStream = fs.createWriteStream('readline-output')
let counter = 0

inputStream.on('error', err => {
  console.error(err)
})

const rl = readline.createInterface({
  input: inputStream,
  output: outputStream
})

rl.on('line', line => {
  counter++
  if (counter == 432) {
    outputStream.write(`${line.split('|')[7]}\n`)
  }
  if (counter == 43243) {
    outputStream.write(`${line.split('|')[7]}\n`)
  }
})

rl.on('close', () => {
  console.log('\ntotal lines ->', counter)
  console.log(`used heap -> ${process.memoryUsage().heapTotal / 1024 / 1024}MB`)
  console.log(`total heap -> ${process.memoryUsage().heapUsed / 1024 / 1024}MB`)
  process.exit(0)
})
