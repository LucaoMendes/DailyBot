const { Model , DataTypes } = require("sequelize");

class Task extends Model {
    static init(sequelize){
        super.init({
            chat_id : DataTypes.INTEGER,
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            config: DataTypes.JSON,
            active: DataTypes.BOOLEAN,
        },{
            sequelize
        })
    }
    static associate(models){
        this.belongsTo(models.Chat,{
            foreignKey: 'chat_id',
            as:'owner'
        })
    }


}

module.exports = Task