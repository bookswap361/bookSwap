var AccountModel = require("../models/user");
var AccountServices = {};

AccountModel = require("../models/account");
var AccountServices = {};



AccountServices.getAccount = function(id) {
    return new Promise(function(resolve, reject) {
        AccountModel.getAccount(id)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.addBook = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.addBook(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.addWish = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.addWish(body)
            .then(resolve)
            .catch(reject);
    });
};


AccountServices.deleteAccount = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.deleteAccount(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.deleteBooks = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.deleteBooks(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.deleteWish = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.deleteWish(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updateAccount = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.updateAccount(body)
            .then(resolve)
            .catch(reject);
    });
};


AccountServices.updatePoints = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.updatePoints(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updateLostLimit = function(body) {
    return new Promise(function(resolve, reject) {
        AccountModel.updateLostLimit(body)
            .then(resolve)
            .catch(reject);
    });
};


module.exports = AccountServices;
