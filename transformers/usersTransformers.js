
const userTransformer = (user) => {
    delete user?.['dataValues']?.['password'];
    delete user?.['password'];
    return user;
}

const usersTransformer = (users) => {
    return users.map((user) => userTransformer(user))
};
module.exports = {
    userTransformer,
    usersTransformer
}