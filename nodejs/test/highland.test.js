jest.setTimeout(2000)
const axios = require('axios')
const __ = require('highland')

test('error chain', () => {
  __([1, 2, 3, 4])
    .map(n => {
      if (n > 3) {
        throw new Error('more than 3')
      }
      return n
    })
    .map(n => {
      console.log(n)
      return n
    })
    .map(n => {
      if (n > 2) {
        throw new Error('more than 2')
      }
      return n
    })
    .errors(err => console.error(`error -> ${err.message}`))
    .toArray(results => {
      expect(results).toHaveLength(2)
    })
})

test('error in a promise', done => {
  const dosomething = (n, cb) => {
    if (n > 3) {
      // throw new Error('more than 3') <-- this would be bad
      return cb(new Error('more than 3'))
    }
    cb(null, n)
  }
  __([1, 2, 3, 4])
    .map(__.wrapCallback(dosomething)).sequence()
    .errors(err => console.error(`error -> ${err.message}`))
    .toArray(results => {
      expect(results).toHaveLength(3)
      done(null)
    })
})

const remote = n => {
  console.log(n)
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
  console.log(n)
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

test('fork and observe', () => {
  const xs = __([1, 2, 3, 4])
  const ys = xs.fork()
  const zs = xs.observe()

  // now both zs and ys will receive data as fast as ys can handle it
  ys.resume()

  ys
    .toArray(results => {
      expect(results).toHaveLength(4)
    })
  zs
    .toArray(results => {
      expect(results).toHaveLength(4)
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
    console.log(items)
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
      console.log(results)
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
      console.log('pushing...')
      push(null, `call-${called}`)
      console.log('... pushed!')
      next()
    }, 100)
  }

  __(highlandGenerator)
    .map(item => {
      console.log(`I can see you here ${item}`)
      return item
    })
    .toArray(results => {
      expect(results).toHaveLength(10)
      done(null)
    })
})

test('reduce', () => {
  const add = function (a, b) {
    return a + b
  }

  __([1, 2, 3, 4])
    .reduce(0, add)
    .toArray(result => expect(result[0]).toBe(10))
})
