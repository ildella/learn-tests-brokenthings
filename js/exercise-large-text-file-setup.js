const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

// const inputStream = fs.createReadStream('/home/ildella/Documents/exerciselargetext/by_date/itcont_2018_20180422_20180705.txt')
const inputStream = fs.createReadStream('input-sample')
const outputStream = fs.createWriteStream('stream-output')
// const outputStream = new stream()
let counter = 0

inputStream.on('error', err => {
  console.error(err)
})

const rl = readline.createInterface({
  input: inputStream,
  output: outputStream
  // output: process.stdout
  // output: outputStream
})

rl.on('line', line => {
  console.log('a')
  counter++
  // console.log('counter', counter)
  if(counter == 2) { rl.close() }
  // outputStream.write(line)
})

rl.on('close', () => {
  console.log('\nlines ->', counter)
  process.exit(0)
})

// inputStream.on('data', chunk => {
//   console.log('data', chunk)
// })
