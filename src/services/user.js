var UserModel = require("../models/user");
var bcrypt = require('bcryptjs');
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

UserServices.getUserByEmail = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserByEmail(body)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.deleteUser = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.deleteUser(body)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.createUser = function(body) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(body.password, 10, function(err, hash) {
            UserModel.createUser(body, hash)
                .then(resolve)
                .catch(reject);
        });
    });
};

UserServices.verifyLogin = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserByEmail(body)
            .then(function(user) {
                bcrypt.compare(body.password, user[0].password, function( err, result) {
                    if (result == true) {
                        resolve(result);
                    } else {
                        reject();
                    }
                })
            })
    });
};

module.exports = UserServices;
