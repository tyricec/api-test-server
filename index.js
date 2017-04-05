const express = require('express')

const app = express()

let timer = 0;

setInterval(() => { timer += 1 }, 1000);

app.get('/', (req, res) => {
  res.sendFile('client/index.html', { root: __dirname })
})

app.get('/events', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 90) % 2 === 0) {
    res.sendFile('json/events.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/tolls', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 70) % 2 === 0) {
    res.sendFile('json/tolls.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/construction', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/construction.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/news', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/news.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/caltrans', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/caltrans.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/transit-alerts', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/transit-alerts.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/transit-centers', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/transit-centers.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/park-ride', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/park-ride.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/realtime-parking', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/realtime-parking.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/bike-trail-maps', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/bike-trail-maps.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/bridge-trail-maps', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/bridge-trail-maps.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/bridges', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/bridges.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/citymaps', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/citymaps.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/faq-categories', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/faq-categories.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/faqs', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/faqs.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/gfs-operators', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/gfs-operators.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/near-transit', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/near-transit.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/rtt-agencies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/rtt-agencies.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/static-agencies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/static-agencies.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/vanpool', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('json/vanpool.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.use(express.static('client'))

let port = process.env.PORT || 9000

app.listen(port)

console.log(`Started on port ${port}`)
