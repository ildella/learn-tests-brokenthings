require('dotenv').config()
const tracer = require('tracer').colorConsole({level: process.env.LOG_LEVEL})
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const port = process.env.PORT || 4444

const app = express()
const server = http.Server(app)
const io = socketio(server)

const sendMessage = (message) => {
  io.emit('message', message)
}

const start = async () => {
  server.listen(port, () => tracer.info(`Websocket server listning at ${port}`))
  io.on('connection', client => {
    tracer.debug('A client just joined on', client.id)
    client.emit('intro', `Welcome, ${client.id}`)
    sendMessage('something, something dark side')
    // client.broadcast.emit('hi')
    // client.on('reply', function(){ /* */ }) // listen to the event
  })
}

start()
