var UserModel = require("../models/user");
var BookModel = require("../models/book");
var BooksOwnedModel = require("../models/books_owned")
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
    var userPromise;
    var bookPromise = BooksOwnedModel.getBooksOwnedByUserId;
    var pointsPromise = UserModel.getPoints;
    switch(criteria) {
        case "1": //Search by first name
            userPromise = UserModel.getUserByFName;
            break;
        case "2": //Search by last name
            userPromise = UserModel.getUserByLName;
        case "3": //Search by email
            userPromise = UserModel.getUserByEmail;
            break;
    }

    return userPromise(content, u_id)
        .then(function(userResults) {
            var results = [];
            userResults.forEach(function(user) {
                results.push({
                    "user_id": user.user_id,
                    "fname": user.first_name,
                    "lname": user.last_name,
                    ...(user.private !== 1 && {"mail": user.email})
                });
            });
                
            var promises = results.map(function(user) {
                return bookPromise(user.user_id)
                    .then(function(bookResult) {
                        return {
                            ...user,
                            ...{"books": bookResult}
                        };
                    })
                });
            return Promise.all(promises)
                .then(function(values) {
                   return values;
                })  
    });
            
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
