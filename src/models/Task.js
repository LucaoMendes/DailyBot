const { Model , DataTypes } = require("sequelize");

class Task extends Model {
    static init(sequelize){
        super.init({
            chat_id : DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            scheduledAt: DataTypes.INTEGER,
            active: DataTypes.BOOLEAN,
        },{
            sequelize
        })
    }
    static associate(models){
    }


}

module.exports = Task