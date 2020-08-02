var BooksOwnedModel = require("../models/books_owned"),
    UserModel = require("../models/user"),
    BookModel = require("../models/book"),
    BooksAvailableServices = {};

BooksAvailableServices.getAvailableBooks = function(user_id) {
	return new Promise(function(resolve, reject) {
		BookModel.getAvailableBooks(user_id)
			.then(function(results) {
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
    var books = new Promise(function(resolve, reject){
        BooksOwnedModel.getCondition(book_id, user_id)
            .then(function(results){
                var books = [];
                results.forEach(function(item) {
                    books.push({
                      "list_id": item.list_id,
                      "title": item.title,
                      "author": item.name,
                      "condition_description": item.condition_description,
                      "cost": item.cost,
                      "user_id": item.user_id,
                      "name": item.first_name + " " + item.last_name
                  });
                })
                resolve(books);
            })
            .catch(reject);
    });
    var points = new Promise(function(resolve, reject){
        UserModel.getPoints(user_id)
            .then(function(results){
                resolve({"points": results[0].points});
            })
            .catch(reject);
    });

    return Promise.all([books, points]);
}

module.exports = BooksAvailableServices;
