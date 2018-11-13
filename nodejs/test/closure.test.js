test('Basic closure, done the classic way. Show access to outer param and var', () => {
  function printName (firstName) {
    const intro = 'This person is '
    // inner function has access to the outer function's variables and parameters
    function lastName (theLastName) {
      return intro + firstName + ' ' + theLastName
    }
    return lastName
  }
  // Simple pointer to the inner function if you ask me. Magic is that it access outer vars and params
  const lastNameFn = printName ('Mike')
  const text = lastNameFn ('Thompson')
  expect(text).toBe('This person is Mike Thompson')
})

// Here is more clear we're returning lastName which is a function.
// In a sense, each printName() creates an "instance", that brings with it the params and variables between its scope
// Also is able to pass params and values to its own inner functions that will live when the outer already completed
test('Closure in a modern, concise way', () => {
  const printName = firstName => {
    const intro = 'This person is'
    return lastName => `${intro} ${firstName} ${lastName}`
  }
  expect(printName('Mike')('Thompson')).toBe('This person is Mike Thompson')
  const john = printName('John')
  const tom = printName('Tom')
  expect(tom('Whatever')).toBe('This person is Tom Whatever')
  expect(john('Whatever')).toBe('This person is John Whatever')
})
