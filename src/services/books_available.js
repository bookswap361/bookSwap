var BooksOwnedModel = require("../models/books_owned"),
    UserServices = require("./user"),
    BookModel = require("../models/book"),
    BooksAvailableServices = {};

BooksAvailableServices.getAvailableBooks = function(userId, genreId) {
    var availableBooks;
    if (genreId == 0) {
        availableBooks = BookModel.getAvailableBooks(userId);
    } else {
        availableBooks = BookModel.getAvailableBooksByGenre(userId, genreId);
    }

	return new Promise(function(resolve, reject) {
		availableBooks
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

BooksAvailableServices.getAffordableBooks = function(userId, genreId) {
    var affordableBooks;

    if (genreId == 0) {
        affordableBooks = new Promise(function(resolve, reject) {
            UserServices.getPoints(userId)
                .then(function(result) {
                    resolve(BookModel.getAvailableBooksByPoints(userId, result[0].points));
                })
                .catch(reject);
            });
    } else {
        affordableBooks = new Promise(function(resolve, reject) {
            UserServices.getPoints(userId)
                .then(function(result) {
                    resolve(BookModel.getAvailableBooksByPointsAndGenre(userId, result[0].points, genreId));
                })
                .catch(reject);
            });
    }

    return new Promise(function(resolve, reject) {
        affordableBooks
            .then(function(result) {
                var books = [];
                result.forEach(function(book) {
                    books.push({
                        "book_id": book.book_id,
                        "title": book.title,
                        "name": book.name,
                        "copies": book.count
                    });
                });
                resolve(books);
            })
            .catch(reject);
    });
};

BooksAvailableServices.getCondition = function(book_id, user_id, filterAll) {
    var condition;
    if (filterAll) {
        condition = BooksOwnedModel.getCondition(book_id, user_id);
    } else {
        condition = new Promise(function(resolve, reject) {
            UserServices.getPoints(user_id)
                .then(function(result) {
                    BooksOwnedModel.getConditionByPoints(book_id, user_id, result[0].points)
                        .then(resolve);
                })
                .catch(reject);
        });
    }
    var books = new Promise(function(resolve, reject) {
        condition
            .then(function(results) {
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
        UserServices.getPoints(user_id)
            .then(function(results){
                resolve({"points": results[0].points});
            })
            .catch(reject);
    });

    return Promise.all([books, points]);
}

module.exports = BooksAvailableServices;
