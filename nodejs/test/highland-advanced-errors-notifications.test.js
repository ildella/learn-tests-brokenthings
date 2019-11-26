const {empty, mergeAll} = require('ramda')
const __ = require('highland')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const {wait, wrapPromise} = require('../src/highland-utils')
// const {DateTime} = require('luxon')

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
// const mergedNotifications = new ObjectWritableMock()
output._write = (chunk, encoding, cb) => {
  if (!chunk.original) {
    return cb('noooooo')
  }
  if (chunk.original >= 3) {
    output.data.push(chunk)
    return cb()
  }
  cb(`booooom - ${chunk.original}`)
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
const fetch3 = async item => {
  await wait(3)
  return {y: item * 4}
}
const transform = fetch => async item => {
  const response = await fetch(item)
  return {original: item, ...response}
}
const prePipeline = () => __.pipeline(
  __.filter(Number.isInteger),
)
const remotePipeline = fetch => __.pipeline(
  __.map(wrapPromise(transform(fetch))),
)
const postPipeline = () => __.pipeline(
  __.map(mergeAll),
)

const sourceStream = __(reader).ratelimit(1, 10)
const writeErrorsStream = __(writableStreamErrorSource)
const preStream = sourceStream
  // .filter(Number.isInteger)
  .through(prePipeline())
  .errors(handleProcessingErrors)
preStream.observe().pipe(notifications)
const fetch1Stream = preStream.fork().through(remotePipeline(fetch1))
const fetch2Stream = preStream.fork().map(wrapPromise(transform(fetch2)))
const fetch3Stream = preStream.fork().map(wrapPromise(transform(fetch3)))
const mergeRemoteCallsStream = __([fetch1Stream, fetch2Stream, fetch3Stream])
  .ratelimit(1, 10)
  .merge()
  .parallel(5)
mergeRemoteCallsStream
  .observe()
  // .tap(console.log)
  .each(empty)
mergeRemoteCallsStream.observe().each(empty)
const finalStream = mergeRemoteCallsStream
  .batch(3)
  // .tap(console.log)
  .through(postPipeline())

const sourceStreamInstrumentation = instrument(sourceStream)
const processingStreamInstrumentation = instrument(preStream)

test('output stream error', done => {
  // expect.assertions(8)
  output.on('finish', () => {
    expect(handleProcessingErrors).not.toHaveBeenCalled()
    expect(sourceStreamInstrumentation.get()).toBe(7)
    expect(processingStreamInstrumentation.get()).toBe(5)
    expect(notifications.data).toEqual([1, 2, 3, 8, 2])
    // expect(output.data).toEqual([
    //   {original: 3, v: 6}, {original: 3, z: 9},
    //   {original: 8, v: 16}, {original: 8, z: 24}
    // ])
    expect(output.data).toEqual([
      {original: 3, v: 6, z: 9, y: 12},
      {original: 8, v: 16, z: 24, y: 32},
    ])
    expect(writeErrors.data).toEqual([
      'booooom - 1', 'booooom - 2', 'booooom - 2'
    ])
    expect(writeErrors.data.length + output.data.length).toBe(input.length - 2)
    expect(output.writable).toBe(false)
    done()
  })
  writeErrorsStream.pipe(writeErrors)
  finalStream.pipe(output)
})
