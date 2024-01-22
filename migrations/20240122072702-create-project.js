'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      startdate: {
        type: Sequelize.DATE
      },
      enddate: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.TEXT
      },
      sass: {
        type: Sequelize.STRING
      },
      python: {
        type: Sequelize.STRING
      },
      laravel: {
        type: Sequelize.STRING
      },
      php: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};