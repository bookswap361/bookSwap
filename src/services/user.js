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

UserServices.deleteUser = function(id) {
    return new Promise(function(resolve, reject) {
        console.log(id);
        UserModel.deleteUser(id)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.updatePoints = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.updatePoints(body)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.getPoints = function(userId) {
    return UserModel.getPoints(userId);
};

UserServices.createUser = function(body) {    
 return new Promise(function(resolve, reject) {
    UserModel.getUserByEmail(body)
        .then(function(result) {
            if (result[0]) {
                let error = {"error": "User already exists under that email"};
                reject(error);
            } else {
                bcrypt.hash(body.password, 10, function(err, hash) {
                    UserModel.createUser(body, hash)
                        .then(function() {
                            UserModel.getUserByEmail(body)
                            .then(function(result) {
                                resolve(result[0]);
                            })
                            .catch(reject);
                        })
                            .catch(reject);
                        });
            }
        })
    });
};


UserServices.verifyLogin = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserByEmail(body)
            .then(function(user) {
                if (user[0]) {
                    bcrypt.compare(body.password, user[0].password, function( err, result) {
                        if (result == true) {                       
                            resolve(user[0]);
                        } else {
                            reject();
                        }
                    })
                } else {
                    reject();
                }
            })
    });
};

module.exports = UserServices;
