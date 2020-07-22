var BookModel = require("../models/book"),
    BooksOwnedModel = require("../models/books_owned");
var BookServices = {};

BookServices.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getAllBooks()
            .then(resolve)
            .catch(reject);
    });
};

BookServices.getBookByOLId = function(id) {
	return new Promise(function(resolve, reject) {
		BookModel.getBookByOLId(id)
			.then(resolve)
			.catch(reject);
	});
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
