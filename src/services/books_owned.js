var BooksOwnedModel = require("../models/books_owned");
var BooksOwnedServices = {};

BooksOwnedServices.getInventoryByUserId = function(user_id) {
    return new Promise(function(resolve, reject){
        BooksOwnedModel.getInventoryByUserId(user_id)
            .then(function(results){
                console.log("Processing in services/books_owned...");
                var books = [];
                results.forEach(function(item) {
                    books.push({
                      "book_id": item.book_id,
                      "title": item.title,
                      "author": item.name,
                      "condition_description": item.condition_description,
                      "list_date": item.list_date
                  });
                })
                console.log(books);
                return books;
            })
            .then(resolve)
            .catch(reject);
    });
}

module.exports = BooksOwnedServices;