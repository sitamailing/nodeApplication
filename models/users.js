module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        iduser: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        address: DataTypes.STRING
    });

    return User;
};