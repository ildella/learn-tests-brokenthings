jest.setTimeout(2000)
const axios = require('axios')
const __ = require('highland')
const {empty} = require('ramda')
const {ObjectReadableMock, ObjectWritableMock} = require('stream-mock')
const input = [1, 2, 3, 1.1, 1.2]

test('error chain', () => {
  expect.assertions(6)
  __([1, 2, 3, 4])
    .map(n => {
      if (n > 3) {
        throw new Error('more than 3')
      }
      return n
    })
    .map(n => {
      // console.log(n)
      expect(n).toBeLessThan(4)
      return n
    })
    .map(n => {
      if (n > 2) {
        throw new Error('more than 2')
      }
      return n
    })
    .errors(err => {
      console.error(`error -> ${err.message}`)
      expect(err).toBeDefined()
    })
    .toArray(results => {
      expect(results).toHaveLength(2)
    })
})

test('error in a function with a callback', done => {
  expect.assertions(3)
  const dosomething = (n, cb) => {
    if (n > 3) {
      // throw new Error('more than 3') <-- this would be bad
      return cb(new Error('more than 3'))
    }
    cb(null, n)
  }
  __([1, 2, 3, 4])
    .map(__.wrapCallback(dosomething)).sequence()
    .errors(err => {
      expect(err).toBeDefined()
      expect(err.message).toBe('more than 3')
    })
    .toArray(results => {
      expect(results).toHaveLength(3)
      done(null)
    })
})

const {promisify} = require('util')
const wrapPromise = p => __.wrapCallback(async (input, callback) => {
  try {
    const result = await p(input)
    callback(null, result)
  } catch(e) {
    callback(e)
  }
})
test('error in a promise', done => {
  expect.assertions(3)
  const dosomething = (n, cb) => {
    if (n > 4) {
      // throw new Error('more than 3') <-- this would be bad
      return cb(new Error('more than 4'))
    }
    cb(null, n)
  }
  __([1, 2, 3, 4, 5])
    .map(wrapPromise(promisify(dosomething))).sequence()
    .errors(err => {
      expect(err).toBeDefined()
      expect(err.message).toBe('more than 4')
    })
    .toArray(results => {
      expect(results).toHaveLength(4)
      done(null)
    })
})

const remote = n => {
  // console.log(n)
  if (n > 3) {
    axios('http://localhost/unfedined')
      .catch(error => {
        // console.error(error)
        throw new Error('buh!')
      })
  }
  return n
}

const remoteAsync = async n => {
  // console.log(n)
  if (n > 2) {
    const response = await axios('http://localhost/unfedined')
  }
  return n
}

test('axios', () => {
  __([1, 2, 3, 4])
    .map(__.wrapCallback(remote)).sequence()
    .map(__.wrapCallback(remoteAsync)).sequence()
    .errors(err => console.error(err.message))
    .toArray(results => {
      expect(results).toHaveLength(3)
    })
})

test('through', () => {
  __([1, 2, 3, 4])
    .through(stream => {
      expect(stream.__HighlandStream__).toBeTruthy()
      return stream
    })
    .toArray(results => {
      expect(results).toHaveLength(4)
    })
})

test('fork and observe', done => {
  expect.assertions(10)
  const xs = __([1, 2, 3, 4])
  const ys = xs.fork()
  const zs = xs.observe()
  // now both zs and ys will receive data as fast as the slowest can handle it
  // ys.resume() // need to double check this, not needed

  ys
    .map(item => {
      expect(typeof item).toBe('number')
    })
    .toArray(results => {
      expect(results).toHaveLength(4)
    })
  zs
    .map(item => {
      expect(typeof item).toBe('number')
    })
    .toArray(results => {
      expect(results).toHaveLength(4)
      done(null)
    })
})

const counter = items => item => {
  items.push(1)
  return item
}

__.counter = counter

test('counter', () => {
  const list = []
  __([1, 2, 3, 4])
    .map(__.counter(list))
    .done(() => { expect(list).toHaveLength(4) })
})

const sub = () => {
  return __([1, 2, 3]).map(item => {
    return item * 2
  })
}

test('use stream from a function', () => {
  sub().toArray(items => {
    expect(items).toEqual([2, 4, 6])
    // console.log(items)
  })
})

test('group', () => {
  const docs = [
    {type: 'blogpost', title: 'foo'},
    {type: 'blogpost', title: 'bar'},
    {type: 'comment', title: 'foo'}
  ]
  __(docs)
    .group('type')
    .toArray(results => {
      expect(results).toHaveLength(1)
      expect(results[0].blogpost).toHaveLength(2)
      expect(results[0].comment).toHaveLength(1)
    })
})

test('basic generator with group', () => {
  // const output = require('fs').createWriteStream('../o1')
  let sent = 0
  let counter = 0
  const generator = (push, next) => {
    if (sent > 3) {
      push(null, __.nil)
      return
    }
    sent++
    push(null, {type: 't', value: sent})
    next()
  }
  __(generator)
    .tap(() => counter++)
    // .tap(console.log)
    .group('type')
    .toArray(results => {
      expect(counter).toBe(4)
      expect(sent).toBe(4)
      expect(results).toHaveLength(1)
    })
})

test('generator with setTimeout', done => {
  let called = 0
  const highlandGenerator = (push, next) => {
    setTimeout(() => {
      if (called >= 10) {
        push(null, __.nil)
        return
      }
      called++
      // console.log('pushing...')
      push(null, `call-${called}`)
      // console.log('... pushed!')
      next()
    }, 50)
  }

  __(highlandGenerator)
    .map(item => {
      // console.log(`I can see you here ${item}`)
      // expect(item).toContain('call-')
      return item
    })
    .toArray(results => {
      expect(results).toEqual([
        'call-1', 'call-2', 'call-3', 'call-4', 'call-5', 'call-6', 'call-7', 'call-8', 'call-9', 'call-10'
      ])
      done(null)
    }
    )
})

test('reduce', () => {
  const add = function (a, b) {
    return a + b
  }

  __([1, 2, 3, 4])
    .reduce(0, add)
    .toArray(result => expect(result[0]).toBe(10))
})

test('simple pipe with stream mocks', done => {
  const reader = new ObjectReadableMock(input)
  const writer = new ObjectWritableMock()
  reader.pipe(writer)
  writer.on('finish', () => {
    done()
  })
})

test('transform error', done => {
  const reader = new ObjectReadableMock(input)
  const writer = new ObjectWritableMock()
  writer.on('finish', () => {
    expect(writer.data).toEqual([])
    done()
  })
  const transform = () => { throw new Error('booom') }
  __(reader)
    .map(transform)
    .errors(() => ({}))
    .pipe(writer)
})

test('counter as observer', done => {
  let counter = 0
  const reader = new ObjectReadableMock(input)
  const writer = new ObjectWritableMock()
  writer.on('finish', () => {
    expect(writer.data).toHaveLength(input.length)
    expect(counter).toBe(input.length)
    done()
  })
  const transform = () => ({id: '1'})
  const mainStream = __(reader).map(transform)
  const processorStream = mainStream.fork()
  const counterStream = mainStream.observe()
  counterStream
    .tap(() => counter++)
    .tap(() => { throw new Error('bang') })
    .tap(() => counter++)
    .tap(item => console.log('tap', item))
    // .errors(err => console.error('counter stream', err))
    .errors(() => ({}))
    .each(empty)

  processorStream
    .errors(() => ({}))
    .pipe(writer)
})
