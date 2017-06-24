const crypto = require('crypto')
const express = require('express')
const EventEmitter = require('events')
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const app = express()
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

let apis = {}
let apiConfig = {}

const stateEmitter = new EventEmitter()
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: "Config",
};

app.enable('etag')

app.get('/', (req, res) => {
  res.sendFile('client/index.html', { root: __dirname })
})

docClient.scan(params, onScan);

function onScan(err, data) {
  if (err) {
    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    // print all the movies
    console.log("Scan succeeded.");
    apiConfig = data.Items
    data.Items.forEach(function (api) {
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
    });

    // continue scanning if we have more movies, because
    // scan can retrieve a maximum of 1MB of data
    if (typeof data.LastEvaluatedKey != "undefined") {
      console.log("Scanning for more...");
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      docClient.scan(params, onScan);
    }
  }
}

app.get('/config', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.send(apiConfig)
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


