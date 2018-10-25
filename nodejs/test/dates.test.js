const {DateTime} = require('luxon')
const {ObjectID} = require('mongodb')

test('millisec, jsdate, mongo id, oh my... :(', async () => {
  console.log(DateTime.local().millisecond)
  console.log(DateTime.local().toJSDate().getTime())
  console.log(DateTime.local().ts)
})

test('start of', async () => {
  console.log(DateTime.local().startOf('month'))
  console.log(DateTime.local().endOf('month'))
})

test('calling function', async () => {
  const dateTime = DateTime.local()
  const jsDate = dateTime.toJSDate()
  // console.log(dateTime)
  // console.log(jsDate)
  // console.log(jsDate.getTime())
  // console.log(dateTime.ts)
  // console.log(dateTime.millisecond)
  expect(jsDate.getTime()).toEqual(dateTime.ts)
  const startId1 = ObjectID.createFromTime(jsDate.getTime() / 1000)
  const startId2 = ObjectID.createFromTime(dateTime.ts / 1000)
  expect(startId1).toEqual(startId2)
})
