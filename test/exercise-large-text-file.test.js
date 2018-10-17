/**
Requirments: Get the 880MB zip and unzip it:

wget https://www.fec.gov/files/bulk-downloads/2018/indiv18.zip
unzip indiv18.zip -d Documents/exerciselargetext
**/

const fs = require('fs')
const readline = require('readline')

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at', p, 'reason:', reason)
})

test('Create a small subset to test algos', async () => {
  const inputStream = fs.createReadStream('/home/ildella/Documents/exerciselargetext/by_date/itcont_2018_20180422_20180705.txt')
  const outputStream = fs.createWriteStream('sample')
  const rl = readline.createInterface({
    input: inputStream,
    output: process.stdout
  })
  inputStream.on('error', err => {
    console.error(err)
  })
  let counter = 0
  inputStream.on('lines', line => {
    outputStream.write(line)
    counter++
    if(counter === 2) { rl.close() }
  })
  rl.on('close', () => {
    // console.log(wantedLines)
    process.exit(0)
  })
  // inputStream.on('data', chunk => {
  //   console.log('data', chunk)
  // })
})
