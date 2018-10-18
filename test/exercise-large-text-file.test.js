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

const withHigland = require('../js/exercise-large-text-file-pipe')

test('With Highland', async () => {
  withHigland()
})
