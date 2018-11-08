const __ = require('highland')
const fs = require('fs')
const {stringify} = require ('highland-json')
const JSONStream = require ('JSONStream')

const input = [
  {a: 'b', b: 'c'},
  {a: [1, 2, 3]},
  [ 1, 2, 3 ],
  [ {a: 'b', b: 'c'} ]
]

test('use highland-json stringify', () => {
  __(input)
    .through(stringify)
    .toArray(results => {
      const result = results.join('')
      console.log(result)
      expect(result).toBe('[{"a":"b","b":"c"},{"a":[1,2,3]},[1,2,3],[{"a":"b","b":"c"}]]')
    })
})

test('use JSONStream stringify - there are new lines in the output', () => {
  __(input)
    .through(JSONStream.stringify())
    .toArray(results => {
      const result = results.join('')
      console.log(result)
      // expect(result).toBe('[{"a":"b","b":"c"},{"a":[1,2,3]},[1,2,3],[{"a":"b","b":"c"}]]')
    })
})

// test('pipe to file', async () => {
//   const output = fs.createWriteStream('output.json')
//   const stream = __(input)
//     .through(stringify)
//     .pipe(output)
//   console.log(`Stream to '${stream.path}'. Closed? ${stream.closed}`)
// })
