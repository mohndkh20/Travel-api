var models = require('../models');
var { errorResponse, successResponse } = require('../helpers/response');
var { postsTransformer, postTransformer } = require('../transformers/postsTransformer')
var { categoryTransformer } = require('../transformers/categoriesTransformers')
var { countryTransformer } = require('../transformers/countriesTransformers');
var { commentsTransformer } = require('../transformers/commentTransformers');
const fs = require("fs");


const addPost = async (req, res) => {
    const title = req?.body?.title
    const image = req?.file?.image
    const description = req?.body?.description
    const country_id = req?.body?.country_id
    const category_id = req?.body?.category_id
    if (title == "") {
        return res.send(errorResponse("Please fill the post title"));
    }
    if (description == "") {
        return res.send(errorResponse("Please fill the description"));
    }
    const post = await models.posts.create({
        title,
        image: req.file?.filename,
        country_id,
        user_id: req.user.id,
        description,
        category_id
    })
    if (post) {
        res.send(successResponse(("Post created successfully", { data: postTransformer(post) })))
        return
    } else {
        return res.send(errorResponse('Error'))
    }
}


const getPosts = async (req, res) => {
    const posts = await models.posts.findAll({
        include: [
            models.users,
            models.categories,
            models.countries
        ]
    })
    return res.send(successResponse("Success", { data: postsTransformer(posts) }))
}


const getPost = async (req, res) => {
    const id = req.params.id
    const post = await models.posts.findOne({
        where: {
            id
        },
        include: [
            { model: models.users },
            { model: models.categories },
            { model: models.countries },
        ],
    })
    const comments = await models.comments.findAll({
        where: {
            post_id: id
        }
    })
    if (post && comments) {
        return res.send(successResponse("Success", { data: postTransformer(post), comments: commentsTransformer(comments) }))
    } else {
        return res.send(errorResponse('There was an error'))
    }
}




const getPostsByCategory = async (req, res, next) => {
    const id = req.params.id
    const result = await models.posts.findAll({
        where: {
            category_id : id
        }
    })
    if (result) {
        res.send(successResponse("Success", { data: postsTransformer(result) }));
    } else {
        res.send(errorResponse("failed getting result"));
    }
};



const getPostsByCountry = async (req, res, next) => {
    const id = req.params.id
    const result = await models.posts.findAll({
        country_id: id
    });
    if (result) {
        return res.send(successResponse("Success", { data: countryTransformer(result) }));
    } else {
        return res.send(errorResponse("failed getting result"));
    }
};



const updatePost = async (req, res) => {
    const postId = req.params.id;
    const post = await models.posts.findByPk(postId);
    if (!post) return res.send(errorResponse("No post found"));
    const { title, image, description, country_id, category_id } = req?.body;
    if (!title) title = post.title;
    if (req.file) {
        fs.unlink("uploads/" + post.image, () => { });
        post.picture = req.file?.filename;
    }
    if (!description) description = post.description;
    if (!country_id) country_id = post.country_id;
    if (!category_id) category_id = post.category_id
    const newPost = await models.posts.update({
        title,
        image: req.file?.filename,
        description,
        country_id,
        category_id
    },
        {
            where: {
                id: post.id
            }
        })
    if (newPost) {
        return res.send(successResponse('Edited', { data: (newPost) }))
    } else {
        return res.send(errorResponse('invalid'))
    }
}

const deletePost = async (req, res) => {
    const id = +req.params.id
    const post = await models.posts.findByPk(id)
    if (post) {
        const deleted = await models.posts.destroy({
            where: {
                id
            }
        })
        if (deleted) {
            return res.send(successResponse('Post deleted'))
        } else {
            return res.send(errorResponse('An error occurred while deleting Post'))
        }
    }
}

module.exports = {
    addPost,
    getPost,
    getPosts,
    getPostsByCategory,
    getPostsByCountry,
    updatePost,
    deletePost
}