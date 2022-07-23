const { postsTransformer } = require('./postsTransformer');

const categoryTransformer = (category) => {
    if (category.Posts) {
        category.Posts = postsTransformer(category.Posts)
    }
    return category;
}
const categoriesTransformer = (categories) => {
    return categories.map((category) => categoryTransformer(category))
};
module.exports = {
    categoriesTransformer,
    categoryTransformer
}