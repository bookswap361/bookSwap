var BooksAvailableModel = require("../models/books_available"),
	BooksAvailableServices = {};

BooksAvailableServices.getAvailableBooks = function(user_id) {
	return new Promise(function(resolve, reject) {
		BooksAvailableModel.getAvailableBooks(user_id)
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
    return new Promise(function(resolve, reject){
        BooksAvailableModel.getCondition(book_id, user_id)
            .then(function(results){
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
                return books;
            })
            .then(resolve)
            .catch(reject);
    });
}

BooksAvailableServices.getPoints = function(user_id) {
     return new Promise(function(resolve, reject){
         BooksAvailableModel.getPoints(user_id)
             .then(function(results){
                 var points = {"points": results[0].points};
                 return points;
             })
             .then(resolve)
             .catch(reject);
     });
 }

BooksAvailableServices.addSwap = function(info, user_id) {
	return new Promise(function(resolve, reject){
		BooksAvailableModel.addSwap(info, user_id)
			.then(resolve)
			.catch(reject);
	});
}

module.exports = BooksAvailableServices;