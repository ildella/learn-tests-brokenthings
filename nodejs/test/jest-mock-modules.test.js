jest.mock('fs')

test('mock fake', () => {
  const mockedfs = require('fs')
  expect(mockedfs).toBeDefined()
  const {createWriteStream} = mockedfs
  expect(createWriteStream).toBeDefined()
  const fn = jest.fn()
  createWriteStream.mockImplementation(() => {fn()})
  createWriteStream()
  expect(createWriteStream).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledTimes(1)
})
