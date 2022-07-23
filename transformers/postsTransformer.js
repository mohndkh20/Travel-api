const { userTransformer } = require('./usersTransformers')
const { commentsTransformer } = require('./commentTransformers')

const postTransformer = (post) => {
    post.image = `${process.env.URL + '' + process.env.UPLOADS + '' + post.image}`
    if (post.users) {
        post.users = userTransformer(post.users)
    }
    if (post.Comments) {
        post.Comments = commentsTransformer(post.Comments)
    }
    return post;
}
const postsTransformer = (posts) => {
    return posts.map((singlepost) => postTransformer(singlepost))
};
module.exports = {
    postTransformer,
    postsTransformer
}