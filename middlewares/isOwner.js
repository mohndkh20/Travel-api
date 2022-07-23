var models = require('../models');
var { errorResponse } = require('../helpers/response')

const isOwner = (type) => {
    console.log("type for owner : ", type);

    return async (req, res, next) => {
        console.log("type for owner : ", type);
        const user = await models.users.findByPk(req.user.id)
        if (user?.admin == 1) {
            return next()
        };
        switch (type) {
            case 'post':
                const postId = req.params.id;
                const post = await models.posts.findOne({
                    where: {
                        id: postId
                    }
                })
                if (post?.user_id == req.user.id) {
                    console.log("isOwner true");
                    return next()
                } else {
                    res.status(403)
                    return res.send(errorResponse('You are not authorized'))
                }

            case 'comment':
                const commentId = req.params.id
                const comment = await models.comments.findOne({
                    where: {
                        id: commentId
                    }
                })
                if (comment?.userId === req.user.id) {
                    return next()
                }
                res.status(403)
                res.send(errorResponse('You are not authorized'))
                return
        };
    };   
}

module.exports = {
    isOwner
}