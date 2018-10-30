const assert = require('assert')
const expect = require('chai').expect
// const assert = require('chai').assert
const {DateTime} = require('luxon')
const array = []
const json = {}

describe('In memory key-value', () => {
  it('array add with unique key', () => {
    array.push({id: '001', timestamp: DateTime.local()})
    assert.strict.equal('001', array.pop().id)
  })

  it('json add with unique key', () => {
    const timestamp = DateTime.local()
    json['001'] = {timestamp: timestamp, tx: 'abc123'}
    expect(json['002']).to.be.undefined
    expect(json['001']).to.have.property('tx')
    expect(json['001']).to.have.property('timestamp')
  })

})
