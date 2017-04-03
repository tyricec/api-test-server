const express = require('express')

const app = express()

let timer = 0;

setInterval(() => { timer += 1 }, 1000);

app.get('/events', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 90) % 2 === 0) {
    res.sendFile('events.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/tolls', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 70) % 2 === 0) {
    res.sendFile('tolls.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/construction', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('construction.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/news', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('news.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/caltrans', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('caltrans.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/transit-alerts', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('transit-alerts.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/transit-centers', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('transit-centers.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/park-ride', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('park-ride.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

app.get('/realtime-parking', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  if (Math.floor(timer / 50) % 2 === 0) {
    res.sendFile('realtime-parking.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

let port = process.env.PORT || 9000

app.listen(port)
console.log(`Started on port ${port}`)
