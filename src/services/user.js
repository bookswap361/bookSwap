var UserModel = require("../models/user");
var bcrypt = require('bcryptjs');
var UserServices = {};


UserServices.getUserById = function(user_id) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserById(user_id)
            .then(resolve)
            .catch(reject);
    });
};

//TODO
UserServices.searchUsers = function(critera, content) {
    // Can do what you did before and use conditions to target which model to use based on criteria
    // with if or switch
};

UserServices.searchUsersByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        UserModel.searchUsersByEmail(email)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.getUserByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserByEmail(email)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.deleteUser = function(user_id) {
    return new Promise(function(resolve, reject) {
        UserModel.deleteUser(user_id)
            .then(resolve)
            .catch(reject);
    });
};

//update to addPoints (updatePoints is misleading)
UserServices.updatePoints = function(amount, user_id) {
    return new Promise(function(resolve, reject) {
        UserModel.updatePoints(amount, user_id)
            .then(resolve)
            .catch(reject);
    });
};

UserServices.getPoints = function(userId) {
    return UserModel.getPoints(userId);
};

UserServices.createUser = function(body) {    
 return new Promise(function(resolve, reject) {
    UserModel.getUserByEmail(body.email)
        .then(function(result) {
            if (result[0]) {
                let error = {"error": "User already exists under that email"};
                reject(error);
            } else {
                bcrypt.hash(body.password, 10, function(err, hash) {
                    UserModel.createUser(body, hash)
                        .then(function() {
                            UserModel.getUserByEmail(body.email)
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
        UserModel.getUserByEmail(body.email)
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
