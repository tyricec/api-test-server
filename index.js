const crypto = require('crypto')
const express = require('express')
const EventEmitter = require('events')

const app = express()
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

let listeners = {}
let apis = {}

const stateEmitter = new EventEmitter()

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
    lastUpdated: Date.now()
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

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws, req) => {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send(JSON.stringify(apis))

  stateEmitter.on('update', update)

  ws.on('close', () => {
   stateEmitter.removeListener('update', update)
  })

  function update() {
    ws.send(JSON.stringify(apis))
  }
})

server.listen(port)

function startResponseLifecycle(api) {
  const apiState = apis[api.name]

  const current = apiState.current

  setTimeout(() => {
    const nextIndex = apiState.index + 1 >= apiState.responses.length ?
      0 : apiState.index + 1;

    apiState.current = apiState.responses[nextIndex]
    apiState.index = nextIndex
    apiState.lastUpdated = Date.now()

    stateEmitter.emit('update')

    startResponseLifecycle(api)
  }, current.timeToLive * 1000);
}

console.log(`Started on port ${port}`)
