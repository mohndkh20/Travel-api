var bcryptjs = require('bcryptjs')
var jwt = require('jsonwebtoken')


var authService = {
    signUser: function (user) {
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            admin: user.admin
        },
        `${process.env.JWT_SECRET_KEY}` ,
        {
            expiresIn: '10h'
        }
    )
        return token
    },
    verifyToken: (req, token) => {
        try {
            const decodedData = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`)
            req.user = {
                id: decodedData.id,
                email: decodedData.email,
                token: token,
                role: decodedData.admin
            };
            return (decodedData?.id) ? decodedData : false
        } catch(e) {
            return false
        }
    },
    hashPassword: function(plainPassword) {
        var salt = bcryptjs.genSaltSync(10)
        var hashedPassword = bcryptjs.hashSync(plainPassword, salt)
        return hashedPassword
    },
    comparePasswords: function(plainPassword, hashedPassword) {
        return bcryptjs.compareSync(plainPassword, hashedPassword)
    }
}
module.exports = authService