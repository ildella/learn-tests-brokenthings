const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')
const config = {
  port: 55220,
  protoPath: path.join(__dirname, './user.proto'),
  service: 'User',
}
const protoOptions = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

test('compile a proto fil', async () => {
  const packageDefinition = await protoLoader.load(config.protoPath, protoOptions)
  // console.log(packageDefinition)
  expect(Object.keys(packageDefinition)).toHaveLength(14)
  const protoUser = packageDefinition['proto.User']
  expect(protoUser).toBeDefined()
  expect(protoUser.CreateUser.originalName).toEqual('createUser')
  expect(protoUser.CreateUser.path).toEqual('/proto.User/CreateUser')
})

test('load the definition', async () => {
  const packageDefinition = await protoLoader.load(config.protoPath, protoOptions)
  const packageObject = grpc.loadPackageDefinition(packageDefinition)
  expect(packageObject).toBeDefined()
  // console.log(packageObject)
  // console.log(packageObject.proto.User)
})

// test.skip('load compiled js_out -> static', () => {
//   const messages = require('../../chimera/protofiles/protos/user_pb.js')
//   // const services = require('../../chimera/protofiles/protos/user_grpc_pb.js')

// })
