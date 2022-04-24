const { Model , DataTypes } = require("sequelize");

class Category extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            active: DataTypes.BOOLEAN,
        },{
            sequelize
        })
    }

    static associate(models){
        this.belongsTo(models.Chat ,{
            foreignKey : 'chat_id',
            as: 'owner'
        })
    }


}

module.exports = Category