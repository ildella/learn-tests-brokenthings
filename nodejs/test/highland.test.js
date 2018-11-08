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

const logger = item => {
  console.log(item)
  return item
}

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

test('basic generator', () => {
  const output = require('fs').createWriteStream('../o1')
  let sent = 0
  let counter = 0
  const generator = (push, next) => {
    if (sent > 1) {
      return
    }
    sent++
    push(null, 'a')
    next()
  }
  __(generator)
    .map(item => {
      counter++
      expect(item).toBe('a')
      return item
    })
    // .pipe(output)
    .done(() => {
      expect(counter).toBe(sent)
      console.log('DONE', counter)
    })
    // .toArray(results => {
    //   expect(counter).toBe(2)
    //   console.log(results)
    // })
})

test('generator with group', () => {
  const output = require('fs').createWriteStream('../o1')
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
    .map(item => {
      counter++
      return item
    })
    .map(logger)
    // .group('type')
    // .map(logger)
    // .pipe(output)
    .toArray(results => {
      expect(counter).toBe(4)
      console.log(results)
    })
})
