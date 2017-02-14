const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.sendStatus(500)
})

app.listen(process.env.PORT || 9000)