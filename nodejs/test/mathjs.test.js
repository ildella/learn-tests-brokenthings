// const math = require('mathjs')

test.skip('modulus with mathjs', () => {
  expect(5 % 2).toBe(1)
  expect(-5 % 2).toBe(-1) // should be 1
  expect(math.mod(5, 2)).toBe(1)
  expect(math.mod(-5, 2)).toBe(1) // lulz
  // expect(math.mod(5, -2)).toBe(1) // lulz non lo fa
})
