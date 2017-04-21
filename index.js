const crypto = require('crypto')
const express = require('express')

const app = express()
const wsMagic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

let listeners = {}
let timer = 0

setInterval(() => { 
  timer += .10
  Object.keys(listeners).forEach((clientId) => {
    let socket = listeners[clientId]

    socket.write(createSocketMessage(timer.toString()))
  }) 
}, 100)

app.enable('etag')

app.get('/', (req, res) => {
  res.sendFile('client/index.html', { root: __dirname })
})

var config = require('./api.json')

config.forEach(api => {
  app.get(api.endpoint, (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    Object.keys(api.headers).forEach((header) => {
      res.setHeader(header, api.headers[header])
    })

    if (api.goodResponse && api.badResponse) {
      if (Math.floor(timer / api.interval) % 2 === 0) {
        res.sendFile(api.goodResponse, { root: __dirname })
      } else {
        res.sendFile(api.badResponse, { root: __dirname })
      }
    }
    else if (Math.floor(timer / api.interval) % 2 === 0) {
      res.sendFile(api.path, { root: __dirname })
    } else {
      res.sendStatus(404)
    }
  })
})

app.get('/config', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.send(config)
})

app.use(express.static('client'))

let port = process.env.PORT || 9000

app.listen(port).on('upgrade', (req, socket) => {
  if (req.headers.upgrade === 'websocket') {
    let hash = crypto.createHash('sha1')
    let client = req.headers['sec-websocket-key']
    hash.update(client + wsMagic, 'binary')
    let handshake = hash.digest('base64')
    let response = 'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      'Sec-WebSocket-Accept: ' + handshake + '\r\n\r\n'
    
    listeners[client] = socket

    socket.write(response)
  }
})

function createSocketMessage(message) {
  let buf = Buffer.alloc(message.length + 2)

  buf[0] = 0x81
  buf.writeInt8(message.length, 1)
  buf.write(message, 2) 

  return buf;
}

console.log(`Started on port ${port}`)
