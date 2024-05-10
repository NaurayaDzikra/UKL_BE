const express = require('express')
const {authenticate} = require('../controllers/auth.controller')

const app = express()

app.use(express.json())

app.post('/auth', authenticate)

module.exports = app