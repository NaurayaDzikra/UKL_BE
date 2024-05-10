const foodModel = require(`../models/index`).foods
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)

exports.getAllFood = async (request, response) => {
    let food = await foodModel.findAll()
    return response.json({
        success: true,
        data: food,
        message: `All Food have been loaded`
    })
}

exports.findFood = async (request, response) => {
    let keyword = request.params.key
    let food = await foodModel.findAll({
        where: {
            [Op.or]: [
                { food_id: { [Op.substring]: keyword } },
                { name: { [Op.substring]: keyword } },
                { spicy_level: { [Op.substring]: keyword } },
                { price: { [Op.substring]: keyword } },
            ]
        }
    })
    return response.json({
        success: true,
        data: food,
        message: `All foods have been loaded`
    })
}

const upload = require(`./upload-image`).single(`image`)

exports.addFood = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        if (!request.file) {
            return response.json({message: `Nothing to Upload`})
        }
        let newFood = {
            name: request.body.name,
            spicy_level: request.body.spicy_level,
            price: request.body.price,
            image: request.file.filename
        }
        await foodModel.create(newFood)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New food has been inserted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
}

exports.updateFood = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        let food_id = request.params.id 
        let dataFood = {
            name: request.body.name,
            spicy_level: request.body.spicy_level,
            price: request.body.price,     
            image: request.file.filename 
        }
        if (request.file) {
            const selectedFood = await foodModel.findOne({
                where: { food_id: food_id }
            });

            if (!selectedFood) {
                return response.json({
                    success: false,
                    message: "Food not found"
                });
            }

            const oldImage = selectedFood.image
            const pathImage = path.join(__dirname, "../image", oldImage)
            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error))
            }
            dataFood.image = request.file.filename
        }
        foodModel.update(dataFood, {where:{food_id:food_id}})
        .then(result => {
            return response.json({
                success: true,
                message: `Data food has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
}

exports.deleteFood = async (request, response) => {
    const food_id = request.params.id 
    const food = await foodModel.findOne({where:{food_id: food_id}})
    const oldImage = food.image
    const pathImage = path.join(__dirname, `../image`, oldImage)
    
    if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error))
    }

    foodModel.destroy({where:{food_id: food_id}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data food has been deleted`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}