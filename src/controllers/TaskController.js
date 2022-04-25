const Task = require('../models/Task')

module.exports = {
    async store(task){
        Task.create(task)
    }
}