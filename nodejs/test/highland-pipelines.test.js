const __ = require('highland')

const empty = () => __.pipeline()
const error = () => __.pipeline(__.map(() => { throw new Error('oops') }))
const plusOne = () => __.pipeline(__.map(n => n+1))

test('empty', done => {
  __([1, 2, 3, 4])
    .through(empty())
    .toArray(result => {
      expect(result).toEqual([1, 2, 3, 4])
      done()
    })
})

test('plusOne', done => {
  __([1, 2, 3, 4])
    .through(empty())
    .through(plusOne())
    .through(empty())
    .toArray(result => {
      expect(result).toEqual([2, 3, 4, 5])
      done()
    })
})

test('plusTwo', done => {
  __([1, 2, 3, 4])
    .through(plusOne())
    .through(plusOne())
    .toArray(result => {
      expect(result).toEqual([3, 4, 5, 6])
      done()
    })
})

test('plus 2 with combo pipe', done => {
  const pipe = () => __.pipeline(
    plusOne(),
    plusOne(),
  )
  __([1, 2, 3, 4])
    .through(pipe())
    .toArray(result => {
      expect(result).toEqual([3, 4, 5, 6])
      done()
    })
})

test('error', done => {
  __([1, 2, 3, 4])
    .through(plusOne())
    .through(error())
    .errors(() => done())
    .toArray(() => {})
})
