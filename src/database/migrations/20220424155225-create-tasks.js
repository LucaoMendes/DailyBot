'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('categories', { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false,
        },
        chat_id:{
          type: Sequelize.INTEGER,
          allowNull: false,
          references :{
            model : 'chats',
            key : 'id',
          },
          onUpdate : 'CASCADE',
          onDelete : 'CASCADE',
        },
        name:{
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
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
    await queryInterface.dropTable('categories');
  }
};







'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('tasks', { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false,
        },
        chat_id:{
          type: Sequelize.INTEGER,
          allowNull : false,
          references : { 
            model : 'chats' , 
            key : 'id'},
          onUpdate : 'CASCADE',
          onDelete : 'CASCADE',
        },
        category_id:{
          type: Sequelize.INTEGER,
          allowNull : false,
          references : { 
            model : 'categories' , 
            key : 'id'},
          onUpdate : 'CASCADE',
          onDelete : 'CASCADE',
        },
        name:{
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        scheduled_at:{
          type: Sequelize.INTEGER,
          allowNull: false,
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
    await queryInterface.dropTable('tasks');
  }
};
