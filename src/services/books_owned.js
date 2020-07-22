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
                      "list_id": item.list_id,
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

BooksOwnedServices.updateCondition = function(info) {
  return new Promise(function(resolve, reject){
    console.log("Updating Inventory in services/books_owned..");
    console.log(info);
    BooksOwnedModel.updateCondition(info)
      .then(resolve)
      .catch(reject);
  });
}

BooksOwnedServices.deleteInventory = function(list_id) {
	return new Promise(function(resolve, reject){
    console.log("Deleting Inventory in services/books_owned..");
		BooksOwnedModel.deleteInventory(list_id)
			.then(resolve)
			.catch(reject);
	});
}

module.exports = BooksOwnedServices;