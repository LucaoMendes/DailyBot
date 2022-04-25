const express = require('express')
const ChatsController = require('../controllers/ChatsController')
const routes = express.Router()
routes.get('/',(req,res)=>{
    return res.json({hello:'world'})
})


routes.post('/chats',ChatsController.addByRoute)
routes.get('/chats',ChatsController.getAllByRoute)
routes.get('/chats/:id',ChatsController.getByRoute)
routes.get('/chats/:id/categories',ChatsController.getThisChatCategories)
routes.get('/chats/:id/tasks',ChatsController.getThisChatTasks)


module.exports = routes