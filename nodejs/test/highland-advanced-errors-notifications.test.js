const {empty} = require('ramda')
const __ = require('highland')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const input = [1, 2, 3, 1.1, 1.2]

const instrument = (stream, output) => {
  let counter = 0
  const counterStream = stream.observe()
  counterStream
    .tap(() => counter++)
    .each(empty)
    // .pipe(output)
  return {
    get: () => counter,
    counterStream,
  }
}

const reader = new ObjectReadableMock(input)
const output = new ObjectWritableMock()
const errors = new ObjectWritableMock()
const notifications = new ObjectWritableMock()
output._write = (chunk, encoding, cb) => {
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
const originalStream = __(reader)
  .ratelimit(1, 50)
  .filter(Number.isInteger)
  .errors(handleWarnings)
// const mainStream = originalStream.fork()
const originalStreamInstrumentation = instrument(originalStream, notifications)
const outputErrorsInstrumentation = instrument(errorsStream, errors)

test('output stream error', done => {
  output.on('error', err => {
    expect(output.writable).toBe(true)
  })
  errors.on('finish', () => {
    expect(errors.writable).toBe(false)
    expect(errors.data).toEqual(['booooom - 1', 'booooom - 2', 'booooom - 3'])
  })
  output.on('finish', () => {
    expect(handleWarnings).not.toHaveBeenCalled()
    expect(originalStreamInstrumentation.get()).toBe(3)
    expect(outputErrorsInstrumentation.get()).toBe(3)
    expect(output.data).toEqual([])
    expect(output.writable).toBe(false)
    done()
  })
  errorsStream.pipe(errors)
  originalStream.pipe(output)
})
