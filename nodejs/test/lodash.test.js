'use strict'
const _ = require('lodash')

const listA = ['A1', 'A2']
const listB = ['B1', 'B2', 'B3']

test('shuffle results for each list', () => {
  const shuffleA = _.shuffle(listA)
  const shuffleB = _.shuffle(listB)
  // console.log(shuffleA)
  // console.log(shuffleB)
})

test('shuffle results ', () => {
  const list = []
  list.push(listA)
  list.push(listB)
  // console.log(list)
  const shuffleA = _.shuffle(list[0])
  const shuffleB = _.shuffle(list[1])
  // console.log(shuffleA)
  // console.log(shuffleB)
  // console.log(list)
})

test('pick ', () => {
  const list = [{a: 'a', b: 'b'}, {a: '1', b: 2}]
  // console.log(_.map(list, (item) => { return _.pick(item, 'a') }))
})

test('compact ', () => {
  const list = [1, 'a', null, 'undefined', undefined, '']
  expect(_.compact(list)).toHaveLength(3)
})

test('native assign is immutable? no :(', () => {
  const source = {}
  const result = Object.assign(source, {a: 1})
  expect(result.a).toBe(1)
  expect(source.a).toBe(1)
})

test('lodash assign is immutable? no :(', () => {
  const o = {}
  const result = _.assign(o, {a: 'b'})
  expect(result.a).toBe('b')
  // expect(o).toEqual({})  fails :(
})

// const { Map, List } = require('immutable')
// test('is immutablejs convenient? not completely but at least immutable...', () => {
//   const map = Map({ a: 1, b: 2, c: 3, d: 4 })
//   const result = map.merge({a: 2, e: 5})
//   console.log(result)
//   expect(result.toObject().a).toBe(2)
//   expect(result.toObject().e).toBe(5)
//   expect(map.toObject().a).toBe(1)
// })

test('count', () => {
  const list = ['jim', 'jon', 'jon', 'pier']
  const result = _.countBy(list)
  console.log(result)
  expect(result).toEqual({jim: 1, jon: 2, pier: 1})
})

test('remap', () => {
  const source = {a: 1, b: 2, c: '3'}
  const keyMapping = {
    a: 'antilope',
    c: 'c'
  }
  const valueMapping = {
    '3': 3
  }
  const cleaned = _.pick(source, Object.keys(keyMapping))
  const remapped = _(cleaned)
    .mapKeys((v, k) => keyMapping[k])
    .mapValues(v => valueMapping[v] || v)
    .value()

  expect(remapped.antilope).toBe(1)
  expect(remapped.a).toBeUndefined()
  expect(remapped.b).toBeUndefined()
  expect(remapped.undefined).toBeUndefined()
  expect(remapped.null).toBeUndefined()
  expect(remapped.c).toBe(3)

  console.log(remapped)
})

test('remap with empty mapping', () => {
  const source = {a: 1, b: 2, c: '3'}
  const keyMapping = {}
  const valueMapping = {}
  const cleaned = _.pick(source, Object.keys(keyMapping))
  const remapped = _(cleaned)
    .mapKeys((v, k) => keyMapping[k])
    .mapValues(v => valueMapping[v] || v)
    .value()

  expect(remapped.a).toBeUndefined()
  expect(remapped.b).toBeUndefined()
  expect(remapped.c).toBeUndefined()

  console.log(remapped)
})
