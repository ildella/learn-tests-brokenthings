const __ = require('highland')
const {stringify} = require ('highland-json')
const JSONStream = require ('JSONStream')

const input = [
  {a: 'b', b: 'c'},
  {a: [1, 2, 3]},
  [ 1, 2, 3 ],
  [ {a: 'b', b: 'c'} ]
]

test('highland-json stringify', done => {
  __(input)
    .through(stringify)
    .toArray(results => {
      const result = results.join('')
      console.log(result)
      expect(result).toBe('[{"a":"b","b":"c"},{"a":[1,2,3]},[1,2,3],[{"a":"b","b":"c"}]]')
      done()
    })
})

test('JSONStream stringify - there are new lines in the output', done => {
  __(input)
    .through(JSONStream.stringify())
    .toArray(results => {
      const result = results.join('')
      console.log(result)
      expect(result).toHaveLength(70)
      // expect(result).toBe(`
      //   [
      //   {"a":"b","b":"c"}
      //   ,
      //   {"a":[1,2,3]}
      //   ,
      //   [1,2,3]
      //   ,
      //   [{"a":"b","b":"c"}]
      //   ]
      // `)
      done()
    })
})

test('stringify behavior with an array with one string', done => {
  const input = ['not a json object']
  __(input)
    .through(stringify)
    .toArray(results => {
      console.log(results)
      expect(results).toHaveLength(4)
      expect(results.join('')).toEqual('["not a json object"]')
      done()
    })
})
