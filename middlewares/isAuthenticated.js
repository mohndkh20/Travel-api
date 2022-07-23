const { errorResponse } = require('../helpers/response')
var authService = require('../services/auth')
var models = require('../models')

const isAuthenticated = async (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1]
    const isInvalid = await models.token.findOne({
        where : {
            token
        }
    })
    if(isInvalid) return res.send(errorResponse('Token is invalid'))
    if (token) {
        const isVerified = authService.verifyToken(req, token)
   
        if (isVerified) {
            console.log("Verified");
            return next()
        }
    }
    res.status(401)
    res.send(errorResponse('Please Login'))
    return
}

module.exports = { isAuthenticated }


// const { errorResponse } = require('../helpers/response')
// var authService = require('../services/auth')

// exports.isAuthenticated = async (req, res, next) => {
//     const token = req.cookies.jwt
//         req.headers.authorization.split(" ")[1] ||
//         null;
//     if (token) {
//         const isVerified = await authService.verifyUser(token)
//         if (isVerified) {
//             req.user = isVerified
//             return next()
//         }
//     }
//     res.status(401)
//     return  res.send(errorResponse('Please Login'))
// }