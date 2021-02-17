const app = require("express").Router()

app.get('/', (req, res) => {
    res.send('server is up and running')
})

module.exports = app;