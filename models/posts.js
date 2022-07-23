'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.posts.hasMany(models.comments, {
        foreignKey: 'id'
      })
      models.posts.belongsTo(models.countries, {
        foreignKey: 'country_id'
      })
      models.posts.belongsTo(models.users, {
        foreignKey: 'user_id'
      })
      models.posts.belongsTo(models.categories, {
        foreignKey: 'category_id'
      })
    }

  }
  posts.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};