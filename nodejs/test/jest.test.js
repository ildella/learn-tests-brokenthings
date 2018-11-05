const {exec} = require('child_process')

test('exec async', () => {
  const mock = jest.fn()
  exec('pwd', {}, (err, stdin, stdout) => {
    mock()
    console.log(err)
    console.log(stdin)
    console.log(stdout)
    expect(mock).toHaveBeenCalledTimes(1)
    mock()
  })
  // expect(mock).toHaveBeenCalledTimes(2)
})
