const {promisify} = require('util')
const stream = require('stream')
const path = require('path')
const fs = require('fs')
const {createReadStream, createWriteStream} = fs
const {readFile, unlink} = fs.promises
const {createGunzip, deflateSync, inflateSync} = require('zlib')
const unzipper = require('unzipper')

const finished = promisify(stream.finished)
const inputPath = path.join(__dirname, './fixtures/jd-feed.zip')

const autoDestroy = true
const highWaterMark = 16384

const chunkSize = 16 * 1024
const charset = 'binary'
const info = true
// const windowBits = 8 // any number will fail

const readStreamOptions = {
  autoDestroy,
  highWaterMark,
}

test('learning - inflate / deflate', () => {
  const input = 'Hello World'

  const deflated = deflateSync(input).toString('base64')
  expect(deflated).toBe('eJzzSM3JyVcIzy/KSQEAGAsEHQ==')

  const inflated = inflateSync(Buffer.from(deflated, 'base64')).toString()
  expect(inflated).toBe('Hello World')
})

test.skip('unzip to xml - with nodejs zlib', async () => {
  const gunzipOptions = {
    chunkSize,
    charset,
    info,
    // windowBits,
  }
  console.log(inputPath)
  const readStream = createReadStream(inputPath, readStreamOptions)
  const unzip = createGunzip(gunzipOptions)
  const writeStream = createWriteStream('./unzipped.xml')
  // console.log(readStream)
  // console.log(unzip)

  readStream
    .pipe(unzip)
    .pipe(writeStream)

  await finished(writeStream)
  expect(true).toBe(true)
})

test.skip('unzip to xml - with unzipper', async () => {
  const outputFileName = 'feed-unzipped.xml'
  const readStream = createReadStream(inputPath, readStreamOptions)
  const writeStream = createWriteStream(outputFileName)
  const unzip = unzipper.ParseOne()
  readStream
    .pipe(unzip)
    .pipe(writeStream)
  await finished(readStream)
  const output = await readFile(outputFileName)
  expect(output.toString()).toContain('<g:rss version=')
  expect(output.toString()).toContain('</g:rss>')
  await unlink(outputFileName)
})
