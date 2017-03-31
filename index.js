const express = require('express')

const app = express()

let timer = 0;

setInterval(() => { timer += 1 }, 1000);

app.get('/events', (req, res) => {
  if (Math.floor(timer / 15) % 2 === 0) {
    res.header('Access-Control-Allow-Origin', '*')
    res.sendFile('events.json', { root: __dirname })
  } else {
    res.sendStatus(404)
  }
})

let port = process.env.PORT || 9000

app.listen(port)
console.log(`Started on port ${port}`)
