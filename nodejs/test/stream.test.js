const fs = require('fs')

// const readStream = fs.createReadStream('data')
// request(url, function (err, res) {
//   readStream.pipe(res)
//   readStream.on('end', function () {
//     // res.end({"status":"Completed"});
//   })
// })

const output = fs.createWriteStream('output')
const __ = require('highland')

test('initialize array', () => {
  __([1, 2, 3, 4])
    .map(function (x) {
      return x + '\n'
    })
    .pipe(output)
})

// test('write stream', () => {
//   const source = __([1, 2, 3])
//   const dest = fs.createWriteStream('myfile')
//   source.pipe(dest)
// })
