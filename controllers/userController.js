var models = require('../models')
var { errorResponse, successResponse } = require('../helpers/response')
const { Op } = require("sequelize");
var authService = require('../services/auth');
var {userTransformer , usersTransformer} = require('../transformers/usersTransformers')
var { postsTransformer } = require('../transformers/postsTransformer')

const signUp = async (req, res) => {
    const username = req?.body?.username
    const email = req?.body?.email
    const firstname = req?.body?.firstname
    const lastname = req?.body?.lastname
    const password = req?.body?.password
    if (username?.length < 3) {
        return res.send(errorResponse('Username is too short'))
    }
    if (firstname?.length < 3) {
        return res.send(errorResponse('Frist name is too short'))
    }
    if (lastname?.length < 3) {
        return res.send(errorResponse('last name is too short'))
    }
    if (password?.length < 6) {
        return res.send(errorResponse('Password is too short'))
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
        return res.send(errorResponse('Email is invalid'))
    }
    const created = await models.users.findOrCreate({
        where: {
                email,
                username
        },
        defaults: {
            firstname,
            lastname,
            password: authService.hashPassword(password),
        }
    })
    if (created) {
        return res.send(successResponse('User created successfully'))
    } else {
        return res.send(errorResponse('User is already registered'))
    }
}


const logIn = async (req, res, next) => {
    var userNameOrEmail = req.body.userNameOrEmail
        // var username = req.body.username
    var password = req.body.password
    const user = await models.users.findOne({
        where: {
            // username
            [Op.or]:
                [
                    { email: userNameOrEmail }, 
                    { username: userNameOrEmail }
                ]
        }
    })

    if (user) {
        if (authService.comparePasswords(password,user.password)) {
            return res.send(successResponse("Success", {token: authService.signUser(user)},user))
        } else {
            return res.send(errorResponse('Password is wrong'))
        }
        } else {
        return res.send(errorResponse('Username or Email is wrong'))
    }
}


const getUsers = async (req, res) => {
    const users = await models.users.findAll({})
    if(users){
        return res.send(successResponse("Success" , {data: usersTransformer(users)}))
    }
}


const profile = async (req, res) => {
    const id = req.params.id
    const user = await models.users.findOne({
        where: {
            id
        }})
    if (user) {
        return res.send(successResponse("Success", {data: (user)}))
    } else {
        return res.send(errorResponse('There was an error'))
    }
}


const deleteUser = async (req,res) => {
    const id = +req.params.id
    const user = await models.users.findByPk(id)
    if(user) {
        if(user) {
            const deleted = await models.users.destroy({
                where: {
                    id
                }
            })
            if (deleted) {
                return res.send(successResponse('User deleted'))
            } else {
                return res.send(errorResponse('error'))
            }
        }
    }
}

const getUserPosts = async (req , res , next) => {
    const posts = await models.posts.findAll({
        where :{
            '$User.id$': req.user.id
        },
        include : [
            {model : models.users},
            {model : models.categories},
            {model : models.countries}
        ]
    })
    return res.send(successResponse("Success", {data: postsTransformer(posts)}))

}

const updateUser = async (req, res) => {
    console.log("i am updating the user");
    const username = req?.body?.username
    const email = req?.body?.email
    const firstname = req?.body?.firstname
    const lastname = req?.body?.lastname
    const password = req?.body?.password

    if (firstname?.length < 2) {
        res.send(errorResponse('The first name is too short'))
        return 
    }
    if (lastname?.length < 2) {
        res.send(errorResponse('The last name is too short'))
        return 
    }
    if (username?.length < 3) {
        res.send(errorResponse('The username is too short'))
        return 
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        res.send(errorResponse('The email is invalid'))
        return 
    }
    if (password?.length > 0) {
        if (password?.length < 6) {
            res.send(errorResponse('New password is too short'))
            return
        }
    }

    console.log("user id: ", req.user.id);
    const user = await models.users.findByPk(req.user.id)

    if (user) {
        user.firstname = firstname
        user.lastname = lastname
        user.username = username
        user.email = email
        if (password?.length > 0) {
            user.password = authService.hashPassword(password);
        };
        user.save().then((user) => {
            res.send(successResponse('User has been updated', {user: userTransformer(user)} ));
            return
        })
    } else {
        res.status(404)
        res.send(errorResponse('The user is undefined'));
    };
};




module.exports = {
    signUp,
    logIn,
    profile,
    getUsers,
    getUserPosts,
    updateUser,
    deleteUser,
    // logOut
}