var UserModel = require("../models/user"),
    BooksOwnedModel = require("../models/books_owned"),
    WishListModel = require("../models/wishlist"),
    SwapServices = require("../services/swap"),
    SwapModel = require("../models/swap"),
    AlertServices = require("../services/alert");
    UserServices = require("../services/user");
    ForumServices = require("../services/forum");
    AccountServices = {};

AccountServices.getAccount = function(user_id) {
    var p1 = new Promise(function(resolve, reject) {
        UserModel.getUserById(user_id)
        .then(function(user) {
            resolve(user[0]);
        })
        .catch(reject);
    });
    var p2 = new Promise(function(resolve, reject) {
        BooksOwnedModel.getBooks(user_id)
        .then(function(books) {
            resolve({"books": books});
        })
        .catch(reject);
    });
    var p3 = new Promise(function(resolve, reject) {
        WishListModel.getWishList(user_id)
        .then(function(wishlist) {
            resolve({"wishlist": wishlist});
        })
        .catch(reject);
    });
    var p4 = new Promise(function(resolve, reject) {
        SwapServices.getSwapsByUserId(user_id, false)
        .then(resolve)
        .catch(reject);
    });
    var p5 = new Promise(function(resolve, reject) {
        SwapServices.getSwapsByUserId(user_id, true)
        .then(resolve)
        .catch(reject);
    });
    var p6 = new Promise(function(resolve, reject) {
        AlertServices.getByUserId(user_id)
        .then(function(alerts) {
            resolve({"alerts": alerts});
        })
        .catch(reject);
    })

    //returns merged object containing all account data
    return Promise.all([p1, p2, p3, p4, p5, p6]).then(function(result) {
        let account = {...result[0], ...result[1], ...result[2], ...result[3],
                        ...result[4], ...result[5]}
        return account;
    });
};


AccountServices.addBook = function(book, user_id) {
    return new Promise(function(resolve, reject) {
        BooksOwnedModel.addBook(book, user_id)
        .then(UserModel.updatePoints.bind(null, 1, user_id))
        .then(resolve)
        .catch(reject);
    });
};


AccountServices.addWish = function(user_id, book_id) {
    return new Promise(function(resolve, reject) {
        WishListModel.addWish(user_id, book_id)
            .then(resolve)
            .catch(reject);
    });
};


AccountServices.deleteAccount = function(user) {
    let error = {"err": "Password was entered incorrectly"};
    return new Promise(function(resolve, reject) {
        UserServices.verifyLogin(user)
        .then(function(result) {
            if (result) {
                ForumServices.scrubForumByDeletedUserId(user.user_id)
                .then(SwapServices.scrubSwapsByDeletedUserId.bind(null, user.user_id))
                .then(AlertServices.deleteByUserId.bind(null, user.user_id))
                .then(BooksOwnedModel.deleteAllBooks.bind(null, user.user_id))
                .then(WishListModel.deleteAllWish.bind(null,user.user_id))
                .then(UserModel.deleteUser.bind(null,user.user_id))
                .then(resolve)
                .catch(reject);
            } else {
                reject({"err":"Password was entered incorrectly"});
            }
        })
        .catch(function() {
            reject({"err":"Password was entered incorrectly"});
        })
    });
};

AccountServices.updateCondition = function(info) {
    return BooksOwnedModel.updateCondition(info);
}

AccountServices.deleteBooks = function(list_id, user_id) {
    return new Promise(function(resolve, reject) {
        SwapModel.deleteSwapsByListId(list_id)
            .then(BooksOwnedModel.deleteBook(list_id))
            .then(UserModel.deletePoints.bind(null, 1, user_id))
            .then(resolve)
            .catch(reject);
        });
};

AccountServices.deleteWish = function(user_id, book_id) {
    return new Promise(function(resolve, reject) {
        WishListModel.deleteWish(user_id, book_id)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updateAccount = function(user) {
    return new Promise(function(resolve, reject) {
        UserModel.updateUser(user)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updatePoints = function(amount, user_id) {
    return new Promise(function(resolve, reject) {
        UserModel.updatePoints(amount, user_id)
            .then(resolve)
            .catch(reject);
    });
};

AccountServices.updateLostLimit = function(user_id) {
    return new Promise(function(resolve, reject) {
        UserModel.updateLostLimit(user_id)
            .then(resolve)
            .catch(reject);
    });
};


module.exports = AccountServices;
