const {userTransformer} = require('./usersTransformers')

const commentTransformer = (comment) => {
    if (comment.User) {
        comment.User = userTransformer(comment.User)
    }
    return comment;
}
const commentsTransformer = (comments) => {
    return comments.map((comment) => commentTransformer(comment))
};
module.exports = {
    commentTransformer,
    commentsTransformer
}