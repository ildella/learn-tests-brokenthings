const fs = require('fs')
const readline = require('readline')

const inputStream = fs.createReadStream('input-sample')
// const inputStream = fs.createReadStream('data/itcont_2018_20180422_20180705.txt')
// const inputStream = fs.createReadStream('data/itcont.txt')
const outputStream = fs.createWriteStream('stream-output')
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
  const token = line.split('|')[7]
  if (counter == 432) {
    outputStream.write(`${token}\n`)
  }
  if (counter == 43243) {
    outputStream.write(`${token}\n`)
  }
})

// expected:
// ROOKE, JENNY
// WASSIL, JAMES

rl.on('close', () => {
  console.log('\ntotal lines ->', counter)
  process.exit(0)
})
