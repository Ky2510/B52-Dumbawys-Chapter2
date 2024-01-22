'use strict';
const { Model } = require('sequelize');
const User = require('./User');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  Project.init({
    name: DataTypes.STRING,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    description: DataTypes.TEXT,
    duration: DataTypes.STRING,
    sass: DataTypes.STRING,
    python: DataTypes.STRING,
    laravel: DataTypes.STRING,
    php: DataTypes.STRING,
    image: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};
