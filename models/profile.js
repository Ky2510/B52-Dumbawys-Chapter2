'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  Profile.init({
    first_name: DataTypes.STRING,
    second_name: DataTypes.STRING,
    place_birth: DataTypes.STRING,
    date_birth: DataTypes.DATE,
    phone_number: DataTypes.STRING,
    address: DataTypes.TEXT,
    description: DataTypes.TEXT,
    role: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};