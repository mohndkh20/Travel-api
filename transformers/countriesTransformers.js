const { postsTransformer } = require('./postsTransformer');

const countryTransformer = (country) => {
    if (country.posts) {
        country.Posts = postsTransformer(country.posts)
    }
    return country;
}
const countriesTransformer = (countries) => {
    return countries.map((country) => countryTransformer(country))
};
module.exports = {
    countriesTransformer,
    countryTransformer
}