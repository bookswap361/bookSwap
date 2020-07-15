var UserModel = require("../models/user");
var bcrypt = require('bcryptjs');
var session - require('express-session');
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
            .then(function (user) {
                session.authenticated = true;
                session.u_id = user.insertId;
                session.u_name = body.first_name;
                resolve(user);
            })
                .catch(reject);
            });
});
};


UserServices.verifyLogin = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.getUserByEmail(body)
            .then(function(user) {
                if (user[0]) {
                    bcrypt.compare(body.password, user[0].password, function( err, result) {
                        if (result == true) {
                            session.authenticated = true;
                            session.u_id = user[0].user_id;
                            session.u_name = user[0].first_name;                            
                            resolve(result);
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
