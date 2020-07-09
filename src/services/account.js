var UserModel = require("../models/user");
    AccountModel = require("../models/account");
    BooksOwnedModel = require("../models/books_owned");
    WishListModel = require("../models/wishlist");
var AccountServices = {};



AccountServices.getAccount = function(id) {
    return new Promise(function(resolve, reject) {
        AccountModel.getAccount(id);
        BooksOwnedModel.getBooks(id);
        WishListModel.getWishList(id)
            .then(resolve)
            .catch(reject);
    });
};

//add one point when user adds a book -- not sure if this works
AccountServices.addBook = function(body, id) {
    return new Promise(function(resolve, reject) {
        BooksOwnedModel.addBook(body);
        UserModel.updatePoints(1, id)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.addWish = function(body) {
    return new Promise(function(resolve, reject) {
        WishListModel.addWish(body)
            .then(resolve)
            .catch(reject);
    });
};


AccountServices.deleteAccount = function(body) {
    return new Promise(function(resolve, reject) {
        BooksOwnedModel.deleteAllBooks(body);
        WishListModel.deleteAllWish(body);
        UserModel.deleteUser(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.deleteBooks = function(body) {
    return new Promise(function(resolve, reject) {
        BooksOwnedModel.deleteBooks(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.deleteWish = function(body) {
    return new Promise(function(resolve, reject) {
        WishListModel.deleteWish(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updateAccount = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.updateUser(body)
            .then(resolve)
            .catch(reject);
    });
};


AccountServices.updatePoints = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.updatePoints(body)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updateLostLimit = function(body) {
    return new Promise(function(resolve, reject) {
        UserModel.updateLostLimit(body)
            .then(resolve)
            .catch(reject);
    });
};


module.exports = AccountServices;
