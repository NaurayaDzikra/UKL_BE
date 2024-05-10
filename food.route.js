const express = require(`express`)
const app = express()
app.use(express.json())

const foodController = require(`../controllers/food.controller`)
const {authorize} = require('../controllers/auth.controller')

app.get("/", foodController.getAllFood)
app.get("/:key", foodController.findFood)
app.post("/", authorize, foodController.addFood)
app.put("/:id", authorize, foodController.updateFood)
app.delete("/:id", authorize, foodController.deleteFood)

module.exports = app