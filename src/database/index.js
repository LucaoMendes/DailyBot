const Sequelize = require('sequelize')
const dbConfig = require('../config/database')
const Category = require('../models/Category')

const Chat = require('../models/Chat')
const Task = require('../models/Task')

const connection = new Sequelize(dbConfig)

Chat.init(connection)
Category.init(connection)
Task.init(connection)


Chat.associate(connection.models)
Category.associate(connection.models)
Task.associate(connection.models)


module.exports = connection