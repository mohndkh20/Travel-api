var express = require('express');
var router = express.Router();
var { signUp , logIn , logOut , profile , getUsers , updateUser , deleteUser , getUserPosts } = require('../controllers/userController')
var { isAuthenticated } = require('../middlewares/isAuthenticated')
var { isAdmin } = require('../middlewares/isAdmin')
var { isOwner } = require('../middlewares/isOwner');

router.post('/signup' , signUp)
router.post('/login' , logIn)
// router.post('/logout' , isAuthenticated , logOut)
router.get('/' , isAuthenticated , isAdmin , getUsers)
router.get('/posts' , isAuthenticated , getUserPosts)
router.put('/update/:id' , isAuthenticated , updateUser)
router.get('/:id' , isAuthenticated , isOwner, profile)
router.delete('/:id' , isAuthenticated , isAdmin , deleteUser)

module.exports = router

