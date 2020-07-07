var mysql = require("../loaders/mysql");
var bcrypt = require('bcrypt');
const { response } = require("express");
const e = require("express");
var User = {};


User.getAllUsers = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("allUsers"), [])
            .then(resolve)
            .catch(reject);
    });
}

User.getUserById = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("userById"), [id])
            .then(resolve)
            .catch(reject);
    })
}

User.getUserByEmail = function(body) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("userByEmail"), [body.email])
            .then(function(result) {
                resolve(result[0]);
            })
            .catch(reject);
    })
}

User.verifyLogin = function(body) {
    return new Promise(function(resolve, reject) {
        User.getUserByEmail(body)
            .then(function(user) {
                bcrypt.compare(body.password, user.password, function( err, result) {
                    if (result == true) {
                        resolve(result);
                    } else {
                        reject();
                    }
                })
            })
    })
}

User.createUser = function(body) {
    return new Promise(function(resolve, reject) {
        bcrypt.hash(body.password, 10, function(err, hash) {
            mysql.query(getQuery("createUser"), 
                [body.first_name, body.last_name, body.email, body.address, hash])
                .then(resolve)
                .catch(reject);
        })
    });
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allUsers":
            query = "SELECT * from user;"
            break;

        case "userById":
            query = "SELECT * from user WHERE user_id = ?";
            break;

        case "createUser":
            query = "INSERT INTO user \
            (first_name, last_name, email, address, points, password) \
            VALUES (?, ?, ?, ?, 100, ?)";
            break;

        case "userByEmail":
            query = "SELECT * from user WHERE email = ?";
            break;
    }

    return query;
};

module.exports = User;
