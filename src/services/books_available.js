var BooksAvailableModel = require("../models/books_available"),
	BooksAvailableServices = {};

BooksAvailableServices.getAvailableBooks = function(user_id) {
	return new Promise(function(resolve, reject) {
		BooksAvailableModel.getAvailableBooks(user_id)
			.then(function(results) {
				console.log("Processing Books in BookServices...");
				var availableBooks = []
				results.forEach(function(book) {
					availableBooks.push({
					"book_id": book.book_id,
					"title": book.title,
					"name": book.name,
					"copies": book.count
				});
			})
			return availableBooks;
		})
		.then(resolve)
		.catch(reject);
	});
}

BooksAvailableServices.getCondition = function(book_id, user_id) {
    return new Promise(function(resolve, reject){
        BooksAvailableModel.getCondition(book_id, user_id)
            .then(function(results){
                console.log("Processing in services/books...");
                var books = [];
                results.forEach(function(item) {
                    books.push({
                      "list_id": item.list_id,
                      "title": item.title,
                      "author": item.name,
                      "condition_description": item.condition_description,
                      "cost": item.cost
                  });
                })
                console.log(books);
                return books;
            })
            .then(resolve)
            .catch(reject);
    });
}

BooksAvailableServices.addSwap = function(info, user_id) {
	return new Promise(function(resolve, reject){
    console.log("Adding swap in services/books_available..");
		BooksAvailableModel.addSwap(info, user_id)
			.then(resolve)
			.catch(reject);
	});
}

module.exports = BooksAvailableServices;