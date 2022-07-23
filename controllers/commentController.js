var models = require('../models')
var { errorResponse, successResponse } = require('../helpers/response')
var { commentsTransformer } = require('../transformers/commentTransformers')


const addComment = async (req,res) => {
    const comment = req.body.comment
    // const post_id = req.body.post_id
    if (comment == '') {
        return res.send(errorResponse('Please fill the Comment content'))
    }
    const created = await models.comments.create({
        comment,
        post_id: req.body.post_id,
        user_id : req.user.id,
        // post_id 
    })
    if (created) {
        return res.send(successResponse('Commentde'))
    } else {
        return res.send(errorResponse('Error'))
    }
}



const getComments = async (req, res) => {
    const comments = await models.comments.findAll({
        include: [
            {model: models.posts},
            {model: models.users},
        ]
    })
    return res.send(successResponse("Success", {data: commentsTransformer(comments)}))
}



const deleteComment = async (req,res) => {
    const id = +req.params.id
    const comment = await models.comments.findByPk(id)
    if(comment) {
        if(comment) {
            const deleted = await models.comments.destroy({
                where: {
                    id
                }
            })
            if (deleted) {
                res.send(successResponse('Comment has been deleted'))
            } else {
                res.send(errorResponse('An error occurred while deleting Comment'))
            };
        }
    }
}

module.exports ={
    addComment,
    getComments,
    deleteComment
}