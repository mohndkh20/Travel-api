var express = require('express');
var router = express.Router();
var { addCountry , getCountries , getCountry , deleteCountry} = require('../controllers/countriesController')
var { isAuthenticated } = require('../middlewares/isAuthenticated')  
var { isAdmin } = require('../middlewares/isAdmin')  

router.post('/add' , isAuthenticated , isAdmin , addCountry )
router.get('/'  , getCountries )
router.get('/:id' , getCountry )
router.delete('/:id' , isAuthenticated , isAdmin , deleteCountry)


module.exports = router