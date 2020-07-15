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
		BookModel.getBookByOLId(id)
			.then(resolve)
			.catch(reject);
	});
};

BookServices.addToOwn = function(info) {
	return new Promise(function(resolve, reject) {
		BooksOwnedModel.addBooks(info)
			.then(resolve)
			.catch(reject);
	});
};

BookServices.createBook = function(info) {
	return new Promise(function(resolve, reject) {
		BookModel.createBook(info);
		resolve(info);
	}).then(function(info) {
		BookModel.createAuthor(info);
		return info;
	}).then(function(info) {
		var data = []
		data.push(BookModel.getAuthIdfromOlId(info))
		data.push(BookModel.getBookIdfromOlId(info))
		
		Promise.all(data)
		.then(function(result){
			return {
				"author_id": result[0][0].author_id,
				"book_id": result[1][0].book_id
			};	
		}).then(function(result){
			return BookModel.joinAuthBook(result)
		}).catch(function(){
		console.log("Services error")
		});
	}).catch(function(){
		console.log("Services error")
	})
}


BookServices.getOlKeys = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getOlKeys()
            .then(resolve)
            .catch(reject);
    });
};

module.exports = BookServices;