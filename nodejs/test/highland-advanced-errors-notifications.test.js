jest.setTimeout(1000)
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
const mergedNotifications = new ObjectWritableMock()
output._write = (chunk, encoding, cb) => {
  console.log(chunk)
  if (chunk.v > 4 || chunk.z > 6) {
    output.data.push(chunk)
    return cb()
  }
  // cb(`booooom - ${chunk.original}`)
  cb(`booooom - `)
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
const fetch1 = async item => {
  await wait(3)
  return {v: item * 2}
}
const fetch2 = async item => {
  await wait(3)
  return {z: item * 3}
}
const processingPipeline = __.pipeline(
  __.map(wrapPromise(fetch1)),
  __.sequence(),
)

const sourceStream = __(reader).ratelimit(1, 50)
const writeErrorsStream = __(writableStreamErrorSource)
const processingStream = sourceStream
  .filter(Number.isInteger)
  // .through(processingPipeline)
  // .sequence()
  // .errors(handleProcessingErrors)
processingStream.observe().pipe(notifications)
// const originalStream = processingStream.fork()
const fetch1Stream = processingStream.fork().map(wrapPromise(fetch1))
const fetch2Stream = processingStream.fork().map(wrapPromise(fetch2))
const mergedStream = __([fetch1Stream, fetch2Stream]).merge().parallel(2)

const sourceStreamInstrumentation = instrument(sourceStream)
const processingStreamInstrumentation = instrument(processingStream)

test('output stream error', done => {
  // expect.assertions(8)
  output.on('finish', () => {
    expect(handleProcessingErrors).not.toHaveBeenCalled()
    expect(sourceStreamInstrumentation.get()).toBe(7)
    expect(processingStreamInstrumentation.get()).toBe(5)
    expect(notifications.data).toEqual([1, 2, 3, 8, 2])
    // expect(mergedNotifications.data).toEqual([{v: 2}, {z: 3}, {v: 4}, {z: 6}, {v: 6}, {z: 9}, {v: 16}, {z: 24}])
    console.log(output.data)
    expect(output.data).toEqual([{v: 6}, {z: 9}, {v: 16}, {z: 24}])
    // expect(writeErrors.data).toEqual(['booooom - 2', 'booooom - 4', 'booooom - 4'])
    expect(writeErrors.data).toEqual([
      'booooom - ', 'booooom - ', 'booooom - ', 'booooom - ', 'booooom - ', 'booooom - '
    ])
    expect(output.writable).toBe(false)
    done()
  })
  writeErrorsStream.pipe(writeErrors)
  // processingStream.pipe(output)
  mergedStream.pipe(output)
  // originalStream.pipe(output)
})
