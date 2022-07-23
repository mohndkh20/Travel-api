var express = require('express');
var router = express.Router();
var { addPost , getPost , getPosts , getPostsByCategory  , getPostsByCountry , updatePost , deletePost } = require ('../controllers/postController')
var { isAuthenticated } = require('../middlewares/isAuthenticated')
var { isOwner } = require('../middlewares/isOwner')
const multer = require('multer')
const path = require('path');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const acceptFile = function (req, file, cb) {
    const acceptedMimType = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ]
    if (acceptedMimType.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: acceptFile,
    limits: { fileSize: 1048576000 }
});


router.post('/add' , isAuthenticated , upload.single('image') , addPost)
router.get('/' , getPosts)
router.get('/:id' , getPost)
router.get('/bycountry/:id' , getPostsByCountry)
router.get('/bycategory/:id' , getPostsByCategory)
router.put('/:id' , isAuthenticated , isOwner('post'), upload.single('image') , updatePost)
router.delete('/:id' , isAuthenticated , isOwner('post') , deletePost)


module.exports = router