var UserModel = require("../models/user");
    BooksOwnedModel = require("../models/books_owned");
    WishListModel = require("../models/wishlist");
var AccountServices = {};



AccountServices.getAccount = function(id) {
    var p1 = new Promise(function(resolve, reject) {
    UserModel.getUserById(id)
<<<<<<< HEAD
    .then(function(user) {
        resolve(user[0]);
    })
=======
    .then(resolve)
>>>>>>> master
    .catch(reject);
    });
    var p2 = new Promise(function(resolve, reject) {
    BooksOwnedModel.getBooks(id)
<<<<<<< HEAD
    .then(function(books) {
        resolve({"books": books});
    })
=======
    .then(resolve)
>>>>>>> master
    .catch(reject);
    });
    var p3 = new Promise(function(resolve, reject) {
    WishListModel.getWishList(id)
<<<<<<< HEAD
    .then(function(wishlist) {
        resolve({"wishlist": wishlist});
    })
=======
    .then(resolve)
>>>>>>> master
    .catch(reject);
    });
return Promise.all([p1, p2, p3])
};

//add one point when user adds a book -- not sure if this works
AccountServices.addBook = function(body, id) {
    var p1 = new Promise(function(resolve, reject) {
    BooksOwnedModel.addBook(body)
    .then(resolve)
    .catch(reject);
    });
    var p2 = new Promise(function(resolve, reject) {
    UserModel.updatePoints(id, 1)
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
