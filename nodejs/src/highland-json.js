const __ = require('highland')
const {stringify} = require ('highland-json')
const JSONStream = require ('JSONStream')

const input = [
  {a: 'b', b: 'c'},
  {a: [1, 2, 3]},
  [ 1, 2, 3 ],
  [ {a: 'b', b: 'c'} ]
]

__(input)
  .through(stringify)
  .toArray(results => {
    const result = results.join('')
    console.log(result)
  })

__(input)
  .through(JSONStream.stringify())
  .toArray(results => {
    const result = results.join('')
    console.log(result)
  })
