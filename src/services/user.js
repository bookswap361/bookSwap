var UserModel = require("../models/user");
var BookModel = require("../models/book");
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


UserServices.searchUsers = function(criteria, content, u_id) {
    switch(criteria)
    {
        case '1':
            var p1 = new Promise(function(resolve, reject) {
                UserModel.searchUserByfName(content)
                    .then(function(result) {
                        resolve({"users": result});
                    })
                    .catch(reject);
            });
             var p2 = new Promise(function(resolve, reject) {
                BookModel.getBooksByFName(content)
                    .then(function(result) {
                        resolve({"books": result});
                    })
                    .catch(reject);
            });
            var p3 = new Promise(function(resolve, reject) {
                UserModel.getPoints(u_id)
                    .then(function(result) {
                        resolve(result[0]);
                    })
                    .catch(reject);
            });
            return Promise.all([p1, p2, p3]).then(function(result) {
                let user = {...result[0], ...result[1], ...result[2]}
                return user;
            });
            break;
        case '2':
            var p1 = new Promise(function(resolve, reject) {
                UserModel.searchUserBylName(content)
                    .then(function(result) {
                        resolve({"users": result});
                    })
                    .catch(reject);
            });
             var p2 = new Promise(function(resolve, reject) {
                BookModel.getBooksByLName(content)
                    .then(function(result) {
                        resolve({"books": result});
                    })
                    .catch(reject);
            });
            var p3 = new Promise(function(resolve, reject) {
                UserModel.getPoints(u_id)
                    .then(function(result) {
                        resolve(result[0]);
                    })
                    .catch(reject);
            });
            return Promise.all([p1, p2, p3]).then(function(result) {
                let user = {...result[0], ...result[1], ...result[2]}
                return user;
            });
            break;
        case '3':
            var p1 = new Promise(function(resolve, reject) {
                UserModel.searchUserByEmail(content)
                    .then(function(result) {
                        resolve({"users": result});
                    })
                    .catch(reject);
            });
             var p2 = new Promise(function(resolve, reject) {
                BookModel.getBooksByEmail(content)
                    .then(function(result) {
                        resolve({"books": result});
                    })
                    .catch(reject);
            });
            var p3 = new Promise(function(resolve, reject) {
                UserModel.getPoints(u_id)
                    .then(function(result) {
                        resolve(result[0]);
                    })
                    .catch(reject);
            });
            return Promise.all([p1, p2, p3]).then(function(result) {
                let user = {...result[0], ...result[1], ...result[2]}
                return user;
            });
            
    }

}

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
    let error = {"err": "Old Password is incorrect"};
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
                reject({"err":"Old Password was entered incorrectly"});
            }
        })
        .catch(function() {
            reject({"err":"Old Password was entered incorrectly"});
        })
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
