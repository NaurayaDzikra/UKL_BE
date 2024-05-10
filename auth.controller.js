const md5 = require('md5')
const jwt = require('jsonwebtoken')
const adminModel = require('../models/index').admins
const secret = 'chicken'

const authenticate = async (request, response) => {
    let dataLogin = {
        email: request.body.email,
        password: md5(request.body.password)
    }
    let dataAdmin = await adminModel.findOne({
        where: dataLogin
    })
    if (dataAdmin) {
        let payload = JSON.stringify(dataAdmin)
        console.log(payload)
        let token = jwt.sign(payload, secret)
        return response.json({
            success: true,
            logged: true,
            message: 'Authentication Success',
            token: token,
            data: dataAdmin
        })
    }

    return response.json({
        success: false,
        logged: false,
        message: 'Authentication Failed. Invalid email or password'
    })
}
const authorize = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        let verifiedUser = jwt.verify(token, secret);
        if (!verifiedUser) {
            return response.json({
                success: false,
                auth: false,
                message: 'User Unauthorized'
            })
        }

        request.user = verifiedUser;
        next();
    } else {
        return response.json({
            success: false,
            auth: false,
            message: 'Forbidden! You not admin'
        })
    }
}
module.exports = { authenticate, authorize }