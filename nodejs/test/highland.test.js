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
    .errors(err => console.error(`error detected -> ${err.message}`))
    .toArray(results => {
      expect(results).toHaveLength(2)
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

test('generator with setTimeout', () => {
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
    }, 100)
  }

  __(highlandGenerator)
    .map(item => {
      // console.log(`I can see you here ${item}`)
      // expect(item).toContain('call-')
      return item
    })
    .toArray(results =>
      expect(results).toEqual(["call-1", "call-2", "call-3", "call-4", "call-5", "call-6", "call-7", "call-8", "call-9", "call-10"])
      // console.log('GENERATOR DONE', results)
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
