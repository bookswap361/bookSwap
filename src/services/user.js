var UserModel = require("../models/user");
var bcrypt = require('bcryptjs');
const User = require("../models/user");
var UserServices = {};


UserServices.getUserById = function(user_id) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserById(user_id)
            .then(resolve)
            .catch(reject);
    });
};


//TODO
UserServices.searchUsers = function() {
    return new Promise(function(resolve, reject) {
        UserModel.searchUsers()
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

UserServices.updatePassword = function(body) {
    return new Promise(function(resolve, reject) {
        UserServices.verifyLogin(body)
        .then(function(user) {
            if (user) {
                bcrypt.hash(body.newpass, 10, function(err, hash) {
                    UserModel.updatePassword(user.user_id, hash)
                        .then(resolve)
                        .catch(reject);
                })
            } else {
                reject();
            }
        })
        .catch(reject);

    })
}

UserServices.createUser = function(body) {    
 return new Promise(function(resolve, reject) {
    UserModel.getUserByEmail(body.email)
        .then(function(result) {
            if (result[0]) {
                let error = {"err": "User already exists under that email"};
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
