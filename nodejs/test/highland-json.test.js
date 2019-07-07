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

test('pipe to file', done => {
  const output = fs.createWriteStream('../output.json')
  const stream = __(input)
    .through(stringify)
    .pipe(output)
  output.on('finish', () => done())
})

test('stringify behavior with an array with one string', async () => {
  const input = ['not a json object']
  __(input)
    .through(stringify)
    .toArray(results => {
      console.log(results)
      expect(results).toHaveLength(4)
    })
})
