var BookModel = require("../models/book"),
    BooksOwnedModel = require("../models/books_owned"),
    WishListModel = require("../models/wishlist");
var searchBooks = require("../loaders/openLibrary");
var BookServices = {};

BookServices.getAllBooks = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getAllBooks()
            .then(resolve)
            .catch(reject);
    });
};

BookServices.getBooksBy = function(query) {
    return new Promise(function(resolve, reject) {
        searchBooks.makeRequest.search(query)
            .then(function(results) {
                if (query.title) {
                    var title = replace(query.title);
                    BookModel.getBooksBy(`%${title}%`)
                        .then(function(db_books){
                            if (db_books) {
                                db_books.forEach(function(book) {
                                    results.books.unshift(book);
                                    results.numResults++;
                                })
                            }
                            results.numResults = maxResults(results.numResults);
                            resolve(results)
                        })
                        .catch(reject)
                }
                else resolve(results)
            })
            .catch(reject);
    })
};

BookServices.getGenreList = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getGenreList()
            .then(function(result) {
                var genres = [];
                result.forEach(function(genre) {
                    genres.push({
                        "genre_id": genre.genre_id,
                        "name": genre.name
                    });
                });
                resolve(genres);
            })
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
    var p4 = new Promise(function(resolve, reject) {
        BookServices.getGenreList()
            .then(resolve)
            .catch(reject);
    });
	return Promise.all([p1, p2, p3, p4])
};

BookServices.createBook = function(info) {
    return new Promise(function(resolve, reject) {
        if (info.name == "null") {
            info.name = "n/a"
        }
        BookModel.createBook(info)
            .then(BookModel.createAuthor.bind(null, info))
            .then(BookModel.getAuthIdFromOlId.bind(null, info))
            .then(function(result) {
                var resultObj = {"author_id": result[0].author_id};
                BookModel.getBookIdFromOlId(info)
                .then(function(result) {
                    resultObj.book_id = result[0].book_id;
                    BookModel.joinAuthBook(resultObj)
                    .then(function(result) {
                        if (info.genre) {
                            BookServices.setGenre(info.genre, resultObj.book_id)
                            .then(resolve)
                            .catch(reject);
                        } else {
                            resolve()
                        }
                    })
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(reject);
    });
};

BookServices.setGenre = function(genreId, bookId) {
    return BookModel.setGenre(genreId, bookId);
};

BookServices.getOlKeys = function() {
    return new Promise(function(resolve, reject) {
        BookModel.getOlKeys()
            .then(function(result) {
                var keys = result.map(function(item) {
                    return item.ol_key;
                });
                resolve(keys);
            })
            .catch(reject);
    });
};


module.exports = BookServices;

function replace(str) {
    return str.replace("+", " ")
}

function maxResults(num) {
    if (num >= 1000) return 999;
    else return num;
}