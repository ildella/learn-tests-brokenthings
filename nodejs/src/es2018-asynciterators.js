const timer = () => setInterval(()=>console.log('tick'), 500)

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const getValue = () => {
  return new Promise(resolve=>{
    setTimeout(()=>resolve(random(1,10)), 1000)
  })
}

const asyncNumberGenerator = async function* () { // remove 'async' for the sync version
  for (let i=0; i<5; i++) {
    const value = await getValue() // remove 'await' for the sync version
    yield value**2
  }
}

const numberGenerator = function* () {
  for (let i=0; i<5; i++) {
    const value = random(20, 30)
    yield value**2
  }
}

const main = async () => {
  const t = timer()
  for await (const v of asyncNumberGenerator()) {
    console.log('async number = ' + v)
  }
  for await (const v of numberGenerator()) {
    console.log('number = ' + v)
  }
  clearInterval(t)
}

main()
