const fibonacci = {
  [Symbol.iterator]: function*() {
    let pre = 0, cur = 1
    while (true) {
      const temp = pre
      pre = cur
      cur += temp
      yield cur
    }
  }
}

for (const n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 10000)
    break
  console.log(n)
}
