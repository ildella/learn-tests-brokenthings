const {empty} = require('ramda')
const __ = require('highland')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const input = [1, 2, 3, 1.1, 1.2, 8]

const instrument = stream => {
  let counter = 0
  const counterStream = stream.observe()
  counterStream
    .tap(() => counter++)
    .each(empty)
  return {
    get: () => counter,
  }
}

const reader = new ObjectReadableMock(input)
const output = new ObjectWritableMock()
const errors = new ObjectWritableMock()
const notifications = new ObjectWritableMock()
output._write = (chunk, encoding, cb) => {
  if (chunk > 4) {
    return cb()
  }
  cb(`booooom - ${chunk}`)
}
const outputErrorSource = push => {
  output.on('error', err => {
    push(null, err)
  })
  output.on('finish', () => {
    push(null, __.nil)
  })
}
const errorsStream = __(outputErrorSource)
const handleWarnings = jest.fn()
const sourceStream = __(reader)
  .ratelimit(1, 50)
const originalStream = sourceStream
  .filter(Number.isInteger)
  .errors(handleWarnings)
const sourceStreamInstrumentation = instrument(sourceStream)
// const sourceStreamInstrumentation = stream.observe().pipe(notifications)
const originalStreamInstrumentation = instrument(originalStream)

test('output stream error', done => {
  expect.assertions(7)
  errors.on('finish', () => {
    expect(errors.writable).toBe(false)
    expect(errors.data).toEqual(['booooom - 1', 'booooom - 2', 'booooom - 3'])
  })
  output.on('finish', () => {
    expect(handleWarnings).not.toHaveBeenCalled()
    expect(sourceStreamInstrumentation.get()).toBe(6)
    expect(originalStreamInstrumentation.get()).toBe(4)
    expect(output.data).toEqual([])
    expect(output.writable).toBe(false)
    done()
  })
  errorsStream.pipe(errors)
  originalStream.pipe(output)
})
