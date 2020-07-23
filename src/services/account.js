var UserModel = require("../models/user");
    BooksOwnedModel = require("../models/books_owned");
    WishListModel = require("../models/wishlist");
    SwapServices = require("./swap");
var AccountServices = {};

AccountServices.getAccount = function(id) {
    var p1 = new Promise(function(resolve, reject) {
        UserModel.getUserById(id)
        .then(function(user) {
            resolve(user[0]);
        })
        .catch(reject);
    });
    var p2 = new Promise(function(resolve, reject) {
        BooksOwnedModel.getBooks(id)
        .then(function(books) {
            resolve({"books": books});
        })
        .catch(reject);
    });
    var p3 = new Promise(function(resolve, reject) {
        WishListModel.getWishList(id)
        .then(function(wishlist) {
            resolve({"wishlist": wishlist});
        })
        .catch(reject);
    });
    var p4 = new Promise(function(resolve, reject) {
        SwapServices.getSwapsByUserId(id, false)
        .then(function(swaps) {
            resolve(swaps);
        })
        .catch(reject);
    });
    var p5 = new Promise(function(resolve, reject) {
        SwapServices.getSwapsByUserId(id, true)
        .then(function(swaps) {
            resolve(swaps);
        })
        .catch(reject);
    });
    return Promise.all([p1, p2, p3, p4, p5]);
};

//add one point when user adds a book -- not sure if this works
// MC: it does
AccountServices.addBook = function(body, id) {
    var p1 = new Promise(function(resolve, reject) {
    BooksOwnedModel.addBook(body)
    .then(resolve)
    .catch(reject);
    });
    var p2 = new Promise(function(resolve, reject) {
    UserModel.updatePoints(1, id)
    .then(resolve)
    .catch(reject);
    });
return Promise.all([p1, p2])
};


AccountServices.addWish = function(body) {
    return new Promise(function(resolve, reject) {
        WishListModel.addWish(body)
            .then(resolve)
            .catch(reject);
    });
};


AccountServices.deleteAccount = function(body) {
    var p1 = new Promise(function(resolve, reject) {
        BooksOwnedModel.deleteAllBooks(body)
            .then(resolve)
            .catch(reject);
            });
    var p2 = new Promise(function(resolve, reject) {
        WishListModel.deleteAllWish(body)
            .then(resolve)
            .catch(reject);
            });
    var p3 = new Promise(function(resolve, reject) {
        UserModel.deleteUser(body)
            .then(resolve)
            .catch(reject);
             });
    return Promise.all([p1, p2, p3])
};


AccountServices.deleteBooks = function(list_id, user_id) {
    var p1 = new Promise(function(resolve, reject) {
        BooksOwnedModel.deleteInventory(list_id)
            .then(resolve)
            .catch(reject);
        });
    var p2 = new Promise(function(resolve, reject) {
        UserModel.deletePoints(1, user_id)
            .then(resolve)
            .catch(reject);
        });

    return Promise.all([p1, p2])
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
