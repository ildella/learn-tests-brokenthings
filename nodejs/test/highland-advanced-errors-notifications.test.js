const {empty} = require('ramda')
const __ = require('highland')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const {wait, wrapPromise} = require('../src/highland-utils')

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

const input = [1, 2, 3, 1.1, 1.2, 8, 2]
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
const writableStreamErrorSource = push => {
  output.on('error', err => {
    push(null, err)
  })
  output.on('finish', () => {
    push(null, __.nil)
  })
}
const handleProcessingErrors = jest.fn()
const fetch = async item => {
  await wait(3)
  return item * 2
}
const processingPipeline = __.pipeline(
  __.filter(Number.isInteger),
  __.map(wrapPromise(fetch)),
  // __.sequence(),
)

const sourceStream = __(reader).ratelimit(1, 50)
const writeErrorsStream = __(writableStreamErrorSource)
const processingStream = sourceStream
  // .filter(Number.isInteger)
  .through(processingPipeline)
  .sequence()
  .errors(handleProcessingErrors)
processingStream.observe().pipe(notifications)

const sourceStreamInstrumentation = instrument(sourceStream)
const processingStreamInstrumentation = instrument(processingStream)

test('output stream error', done => {
  // expect.assertions(8)
  writeErrors.on('finish', () => {
    expect(writeErrors.data).toEqual(['booooom - 2', 'booooom - 4', 'booooom - 4'])
    expect(writeErrors.writable).toBe(false)
  })
  output.on('finish', () => {
    expect(handleProcessingErrors).not.toHaveBeenCalled()
    expect(sourceStreamInstrumentation.get()).toBe(7)
    expect(processingStreamInstrumentation.get()).toBe(5)
    expect(notifications.data).toEqual([2, 4, 6, 16, 4])
    expect(output.data).toEqual([6, 16])
    expect(output.writable).toBe(false)
    done()
  })
  writeErrorsStream.pipe(writeErrors)
  processingStream.pipe(output)
})
