var BookModel = require("../models/book"),
    BooksOwnedModel = require("../models/books_owned");
    WishListModel = require("../models/wishlist")
var BookServices = {};

BookServices.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getAllBooks()
            .then(resolve)
            .catch(reject);
    });
};

BookServices.getBookByOLId = function(id, user_id) {
	var p1 = new Promise(function(resolve, reject) {
		BookModel.getBookByOLId(id)
			.then(resolve)
			.catch(reject);
	});
	var p2 = new Promise(function(resolve, reject) {
		BooksOwnedModel.getAvailableBooksByOLId(id, user_id)
			.then(resolve)
			.catch(reject);
	});
    var p3 = new Promise(function(resolve, reject) {
        WishListModel.getWishList(user_id)
        .then(resolve)
        .catch(reject);
    });
	return Promise.all([p1, p2, p3])
};

BookServices.createBook = function(info) {
    return new Promise(function(resolve, reject) {
        BookModel.createBook(info)
            .then(BookModel.createAuthor.bind(null, info))
            .then(BookModel.getAuthIdFromOlId.bind(null, info))
            .then(function(result) {
                var resultObj = {"author_id": result[0].author_id};
                BookModel.getBookIdFromOlId(info)
                .then(function(result) {
                    resultObj.book_id = result[0].book_id;
                    BookModel.joinAuthBook(resultObj)
                    .then(resolve)
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(reject);
    });
};


BookServices.getOlKeys = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getOlKeys()
            .then(resolve)
            .catch(reject);
    });
};


module.exports = BookServices;
