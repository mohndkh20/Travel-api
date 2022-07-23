var models = require('../models');
var { errorResponse, successResponse } = require('../helpers/response');
var { categoryTransformer , categoriesTransformer } = require('../transformers/categoriesTransformers')




const addCategory = async (req,res) => {
    const name = req.body.name
    const created = await models.categories.findOrCreate({
        where: {
                    name
                }
    })
    if (created) {
        return res.send(successResponse('Category created successfully' , {data:(created)} ))
    } else {
        return res.send(errorResponse('Error'))
    }
}



const getCategories = async (req, res) => {
    const categories = await models.categories.findAll({})
    return res.send(successResponse("Success", {data:(categories)}))
}




const getCategory = async (req, res) => {
    const id  = req?.params?.id
    const category = await models.categories.findOne({
        where: {
            id
        }})
    if (category) {
        return res.send(successResponse("Success", {data:categoryTransformer(category)}))
    } else {
        return res.send(errorResponse('There was an error'))
    }
}




const updateCategory = async (req,res) => {
    const catrgoryId = req.params.id;
    const category = await models.categories.findByPk(catrgoryId);
    if(!category) return res.send(errorResponse("No category found"));
    const name =req?.body;
    if(!name) name = category.name;
    const newCategory = await models.categories.update(
        name,
    {
        where:{
            id: category.id
        }
    })
    if(newCategory) {  
        return res.send(successResponse('Edited'))
    } else {
        res.status(404)
        return res.send(errorResponse('Categoy not found'))
    }
}



const deleteCategory = async (req,res) => { 
    const id = +req.params.id
    const category = await models.categories.findByPk(id)
    if(category) {
        // if(category) {
            const deleted = await models.categories.destroy({
                where: {
                    id
                }
            })
            if (deleted) {
                return res.send(successResponse('Category deleted'))
            } else {
                return res.send(errorResponse('error'))
            }
        // }
    }
}



module.exports = {
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}