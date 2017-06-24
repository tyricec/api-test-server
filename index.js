const crypto = require('crypto')
const express = require('express')

const app = express()
const wsMagic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

let listeners = {}
let apis = {}
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
  apis[api.name] = {
    current: api.responses[0],
    responses: api.responses,
    index: 0,
  }

  startResponseLifecycle(api)
  
  app.get(api.endpoint, (req, res) => {
    const currentResponse = apis[api.name].current

    res.header('Access-Control-Allow-Origin', '*')

    if (currentResponse.headers) {
      Object.keys(currentResponse.headers).forEach((header) => {
        res.setHeader(header, currentResponse.headers[header])
      })
    }
    if (!currentResponse.headers || !currentResponse.headers['Cache-Control']) {
      res.setHeader('Cache-Control', `public;max-age=${Math.floor(Math.abs(api.interval - timer))}`)
    }
    if (currentResponse.response) {
      res.status(currentResponse.status)
      res.sendFile(currentResponse.response, { root: __dirname })
    } else {
      res.status(500);
      res.send('Error with api configuration')
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

function startResponseLifecycle(api) {
  const apiState = apis[api.name]

  const current = apiState.current

  setTimeout(() => {
    const nextIndex = apiState.index + 1 >= apiState.responses.length ?
      0 : apiState.index + 1;

    apiState.current = apiState.responses[nextIndex]
    apiState.index = nextIndex
    startResponseLifecycle(api)
  }, current.timeToLive * 1000);
}

function createSocketMessage(message) {
  let buf = Buffer.alloc(message.length + 2)

  buf[0] = 0x81
  buf.writeInt8(message.length, 1)
  buf.write(message, 2) 

  return buf;
}

console.log(`Started on port ${port}`)
