const EventEmitter = require('events')
class QueueEmitter extends EventEmitter {}
const queueEmitter = new QueueEmitter()

test('multiple listeners', () => {
  expect.assertions(2)
  queueEmitter.on('x', message => {
    expect(message).toBeDefined()
  })
  queueEmitter.on('x', message => {
    expect(message).toBeDefined()
  })
  queueEmitter.emit('x', {})
})

test('second round', () => {
  expect.assertions(4)
  queueEmitter.on('x', message => {
    expect(message).toBeDefined()
  })
  queueEmitter.on('x', message => {
    expect(message).toBeDefined()
  })
  queueEmitter.emit('x', {})
})

const events = require('events')
class CustomEmitter extends events {}

test('Event Emitter', () => {

  const channel1 = new CustomEmitter()
  const channel2 = new CustomEmitter()

  channel1.once('newListener', params => {
    // console.log('newListener event ->', params)
  })
  channel1.on('eventz', params => {
    // console.log('channel1: an event occurred ->', params)
  })
  channel2.on('eventz', params => {
    // console.log('channel2: an event occurred ->', params)
  })
  channel1.emit('eventz', ['something', 'dark', 'side'])
})

test('Event Errors', () => {
  const channel1 = new CustomEmitter()
  channel1.on('error', error => {
    expect(error).toBeDefined()
    // console.error('e1: an error occurred ->', error)
  })
  channel1.emit('error', new Error('whoops!'))
})

test('different event types', () => {

  const channel1 = new CustomEmitter()

  channel1.on('message', params => {
    console.log('message received ->', params)
  })
  channel1.emit('message', 'hey there')
})
