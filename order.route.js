const express = require(`express`)
const app = express()
app.use(express.json()) 
const orderController = require(`../controllers/order.controller`)

app.post('/', orderController.Addorder )
app.get('/', orderController.getAllHistory)

module.exports=app