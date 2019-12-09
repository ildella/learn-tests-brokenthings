const fieldsHeadersMapping = require('./fixtures/fields-headers-mapping')
const expectedHeadersDefault = Object.values(fieldsHeadersMapping).toString()
/* eslint-disable max-len*/
const expectedContactValuesDefault = 'Test1 LycBeam,Test1,,LycBeam,0acf2651-aad0-4bd5-9594-d57e9a6bdfbe,,super zen,2019-10-23T16:47:54.145Z,,,test1@lycbeam.com,00000000000000,Head of nothing,Lead,2019-10-23T16:47:50.997Z,,smartRecruiters,"Washington, United States",Washington,90210,United States,2019-10-23T13:21:02.109Z,"Data1,Data2","fff,zzz,pppp",pool123,,"https://www.linkedin.com/meemememem,http://www.fakebook.com/aarrggh","Library Director,LycTest Canary Job3 Internal,Canary Job Mariia","Lead,Lead,Lead",,https://seed-uploads-staging.s3.amazonaws.com/f2e09934-718d-4ea6-8e72-b17b736ee724.docx,surfing,Stansberry Research,https://test.local.com/#/crm/profile/0acf2651-aad0-4bd5-9594-d57e9a6bdfbe,,,test1@lycbeam.com,"00000000000000,111111111111,222222222222","tag1,tag3",false,2019-10-24T00:00:00.000Z,bb0f35a1fcb30160cf87'
/* eslint-enable max-len*/

const expectedCsv = require('./fixtures/expected-csv')

const {
  defaultContactHeaders,
  defaultContactValues,
} = expectedCsv()

test('headers', () => {
  expect(defaultContactHeaders).toBe(expectedHeadersDefault)
})

test('content', () => {
  expect(defaultContactValues).toBe(expectedContactValuesDefault)
})
