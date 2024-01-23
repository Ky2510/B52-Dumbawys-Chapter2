'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, {
        foreignKey: 'user_id',
      })
      Project.belongsTo(models.Profile, {
        foreignKey: 'user_id',
      })
    }
  }
  
  Project.init({
    name: DataTypes.STRING,
    startdate: DataTypes.DATE,
    enddate: DataTypes.DATE,
    duration: DataTypes.STRING,
    sass: DataTypes.STRING,
    python: DataTypes.STRING,
    laravel: DataTypes.STRING,
    php: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};
