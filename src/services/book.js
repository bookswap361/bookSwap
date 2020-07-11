var BookModel = require("../models/book");
var BookServices = {};

BookServices.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getAllBooks()
            .then(resolve)
            .catch(reject);
    });
};

BookServices.getAvailableBooks = function() {
	return new Promise(function(resolve, reject) {
		BookModel.getAvailableBooks()
			.then(function(results) {
				console.log("Processing Books in BookServices...");
				var availableBooks = []
				results.forEach(function(book) {
					availableBooks.push({
					"book_id": book.book_id,
					"title": book.title,
					"last_name": book.last_name,
					"first_name": book.first_name,
					"copies": book.count
				});
			})
			return availableBooks;
		})
		.then(resolve)
		.catch(reject);
	});
}

BookServices.getBookByOLId = function(id) {
	return new Promise(function(resolve, reject) {
		resolve(BookModel.getBookByOLId(id))
			.then(function(results) {
				var result = {};
					result.book_id = results.book_id;
					result.title = results.title;
					result.last_name = results.last_name;
					result.first_name = results.first_name;
					result.copies = results.count;
				return result;
			})
			.catch(reject);
	});
};

module.exports = BookServices;