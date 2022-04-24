'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('chats', { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false,
        },
        chat_id:{
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        first_name:{
          type: Sequelize.STRING,
          allowNull: false
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false
        },
        active:{
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chats');
  }
};
