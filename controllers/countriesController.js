var models = require('../models');
var { errorResponse , successResponse } = require('../helpers/response');
var { countriesTransformer , countryTransformer } = require('../transformers/countriesTransformers')


const addCountry = async (req,res) => {
    const country_name = req.body.country_name
    const country = await models.countries.findOrCreate({
            where: {
                country_name
                }
    })
    if (country) {
        return res.send(successResponse('Country created successfully' ,{data: countryTransformer(country)}))
    } else {
        return res.send(errorResponse('Error'))
    }
}



const getCountries = async (req, res) => {
    const countries = await models.countries.findAll({})
        if (countries) {
            return res.send(successResponse("Success", {data: countriesTransformer(countries)}))
        } else {
            return res.send(errorResponse('Error'))
        }
}



const getCountry = async (req, res) => {
    const id  = req?.params?.id
    const country = await models.countries.findOne({
        where: {
            id
        }})
    if (country) {
        return res.send(successResponse("Success", {data: countryTransformer(country)}))
    } else {
        return res.send(errorResponse('There was an error'))
    }
}

const deleteCountry = async (req, res, next) => {
    const id = +req.params.id
    const deleted = await models.countries.destroy({
        where: {
            id
        }
    });
    if (deleted) {
        return res.send(successResponse('Country has been deleted'))
    } else {
        return res.send(errorResponse('error'))
    };
};


module.exports = {
    addCountry,
    getCountries,
    getCountry,
    deleteCountry
}