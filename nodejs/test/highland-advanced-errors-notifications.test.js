jest.setTimeout(1000)
const {empty} = require('ramda')
const __ = require('highland')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const {wait, wrapPromise} = require('../src/highland-utils')
const {DateTime} = require('luxon')
const R = require('ramda')

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
  // cb(`booooom - `)
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
const transform = fetch => async item => {
  const response = await fetch(item)
  return {original: item, ...response}
}
const sourceStream = __(reader).ratelimit(1, 10)
const writeErrorsStream = __(writableStreamErrorSource)
const processingStream = sourceStream
  .filter(Number.isInteger)
  .errors(handleProcessingErrors)
processingStream.observe().pipe(notifications)
const fetch1Stream = processingStream.fork().map(wrapPromise(transform(fetch1)))
const fetch2Stream = processingStream.fork().map(wrapPromise(transform(fetch2)))
const mergedStream = __([fetch1Stream, fetch2Stream])
  .ratelimit(1, 10).merge()
  .parallel(1)
  .batch(2)
  .tap(console.log)
  .map(R.mergeAll)
  // .tap(() => console.log(DateTime.local().c))

const sourceStreamInstrumentation = instrument(sourceStream)
const processingStreamInstrumentation = instrument(processingStream)

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
      {original: 3, v: 6, z: 9},
      {original: 8, v: 16, z: 24},
    ])
    expect(writeErrors.data).toEqual([
      'booooom - 1', 'booooom - 2', 'booooom - 2'
    ])
    expect(writeErrors.data.length + output.data.length).toBe(input.length - 2)
    expect(output.writable).toBe(false)
    done()
  })
  writeErrorsStream.pipe(writeErrors)
  mergedStream.pipe(output)
})
