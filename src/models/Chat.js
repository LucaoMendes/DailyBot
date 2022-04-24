const { Model , DataTypes } = require("sequelize");

class Chat extends Model {
    static init(sequelize){
        super.init({
            chat_id : DataTypes.INTEGER,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            username: DataTypes.STRING,
            active: DataTypes.BOOLEAN,
        },{
            sequelize
        })
    }
    
    static associate(models){
        this.hasMany(models.Task,{
            foreignKey : 'chat_id',
            as: 'tasks'
        })
        this.hasMany(models.Category,{
            foreignKey : 'chat_id',
            as: 'categories'
        })
    }



}

module.exports = Chat