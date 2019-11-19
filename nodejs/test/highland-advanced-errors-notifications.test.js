const {empty} = require('ramda')
const __ = require('highland')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const input = [1, 2, 3, 1.1, 1.2, 8, 2]

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
const writeErrors = new ObjectWritableMock()
const notifications = new ObjectWritableMock()
output._write = (chunk, encoding, cb) => {
  if (chunk > 4) {
    output.data.push(chunk)
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
const handleProcessingErrors = jest.fn()

const sourceStream = __(reader).ratelimit(1, 50)
const writeErrorsStream = __(outputErrorSource)
const processingStream = sourceStream
  .filter(Number.isInteger)
  .errors(handleProcessingErrors)
processingStream.observe().pipe(notifications)

const sourceStreamInstrumentation = instrument(sourceStream)
const processingStreamInstrumentation = instrument(processingStream)

test('output stream error', done => {
  // expect.assertions(8)
  writeErrors.on('finish', () => {
    expect(writeErrors.data).toEqual(['booooom - 1', 'booooom - 2', 'booooom - 3', 'booooom - 2'])
    expect(writeErrors.writable).toBe(false)
  })
  output.on('finish', () => {
    expect(handleProcessingErrors).not.toHaveBeenCalled()
    expect(sourceStreamInstrumentation.get()).toBe(7)
    expect(processingStreamInstrumentation.get()).toBe(5)
    expect(notifications.data).toEqual([1, 2, 3, 8, 2])
    expect(output.data).toEqual([8])
    expect(output.writable).toBe(false)
    done()
  })
  writeErrorsStream.pipe(writeErrors)
  processingStream.pipe(output)
})
