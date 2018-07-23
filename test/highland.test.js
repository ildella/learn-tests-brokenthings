const __ = require('highland')

test('Highland', async () => {
  const h = __([1, 2, 3, 4])
  // .filter(undefined)
  // .each(n => {
  //   expect(n).toBeGreaterThan(0)
  // })
  expect(h.__HighlandStream__).toBeTruthy()
  expect(h.append(5).__HighlandStream__).toBeTruthy()
})

test('Highland appen after map', async () => {
  const h1 = __([1, 2, 3, 4])
  const h2 = h1.map(n => { return 'a' })
  expect(h1.__HighlandStream__).toBeTruthy()
  expect(h1._already_consumed).toBeTruthy()
  expect(h2._already_consumed).toBeFalsy()
  // console.log(h2)
  expect(h2.ended).toBeFalsy()
  expect(h2.each(n => {}).ended).toBeTruthy()
})

test('just log error and move forward', async () => {
  const s1 = __([1, 2, 3, 4])
  expect(s1._incoming).toHaveLength(5)
  const s2 = s1
    .map(n => {
      if (n >= 4) { throw new Error('too big') }
      // if (n >= 2 && n < 4) { return 0 }
      return n
    })
    .errors((err, push) => {
      console.log(err)
      // push(null)
    })
  expect(s1.paused).toBeTruthy()
  expect(s2.paused).toBeTruthy()
  expect(s2.id).not.toEqual(s1.id)
  s2
    // .filter(item => item)
    .each(n => console.log(n))
    // .done(() => console.log('done'))
  expect(s2.ended).toBeTruthy()
  // console.log(s2)
})

test('collect errors in a different stream and do something else', async () => {
  // TODO...
})
