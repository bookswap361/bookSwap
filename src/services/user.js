var UserModel = require("../models/user");
var UserServices = {};

UserServices.getAllUsers = function() {
    return new Promise(function(resolve, reject) {
        UserModel.getAllUsers()
            .then(resolve)
            .catch(reject);
    });
};

UserServices.getUserById = function(id) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserById(id)
            .then(resolve)
            .catch(reject);
    });
};

module.exports = UserServices;
