var express = require('express');
var router = express.Router();
var { addComment, deleteComment , getComments } = require('../controllers/commentController')
var { isAuthenticated } = require('../middlewares/isAuthenticated')  
var { isOwner } = require('../middlewares/isOwner')  


router.post('/add' , isAuthenticated , addComment )
router.get('/' , getComments )
router.delete('/:id' , isAuthenticated , isOwner('comment') , deleteComment )


module.exports = router