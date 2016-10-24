var db = require('../models');

var UsersRepository = {
    findAll: function () {
        return db.user.findAll();
    },
    findById: function (iduser) {
        return db.user.find({where: {iduser: iduser}})
    },
    save: function (object) {
        return db.user.create(object);
    },
    bulkCreate: function (objectArray) {
        return db.user.bulkCreate(objectArray);
    },
    update: function (objectArray, condition) {
        return db.user.update(objectArray, {where: condition});
    },
    delete: function (iduser) {
        return db.user.destroy({where: {iduser: iduser}});
    }
};

module.exports = UsersRepository;