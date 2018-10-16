const {ObjectId} = require('mongodb')
const {DateTime} = require('luxon')
const util = require('util')

const objectIdfromISO = (isoDate) => {
  return ObjectId.createFromTime(DateTime.fromISO(isoDate).ts / 1000)
}

const rangeQuery = (beginIso, endIso) => {
  return {_id: {
    $gte: objectIdfromISO(beginIso),
    $lt: objectIdfromISO(endIso)
  }}
}

module.exports.fromISO = util.deprecate(objectIdfromISO)
module.exports.objectIdfromISO = objectIdfromISO
module.exports.rangeQuery = rangeQuery