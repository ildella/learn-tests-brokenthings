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

// const withHigland = require('../src/exercise-large-text-file-highland')

test('Complete file', async () => {
  // readline
  // lines -> 13709514
  // MORTON GROOMS, KAREN VICTORIA
  // COLLINS, DARREN ROBERT
  
  // highland
  // lines -> 13750541
  // KIRSCHNER, THAIS S.E.
  // CARSON, LANIE AARON
  // withHigland()
})
