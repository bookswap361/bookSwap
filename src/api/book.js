var express = require("express");
var router = express.Router();
var BookServices = require("../services/book");
var searchBooks = require("../loaders/openLibrary");

router.route("/create-book")
    .get(function(req, res, next) {
        BookServices.getOlKeys()
            .then(function(result){
                BookServices.getGenreList()
                    .then(function(genres) {
                        res.render("createbook", {"keys": result, "genres": genres});
                    })
                    .catch(function(err) {
                        next(err);
                    });
            })
            .catch(function(err){
                next(err);
            });
    })
    .post(function(req, res, next) {
        BookServices.createBook(req.body)
            .then(function(result) {
                res.redirect("/book/" + req.body.bol_key);
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/search")
    .get(function(req, res, next) {
        if (req.query.title || req.query.author) {
            new Promise(function(resolve, reject){
                resolve(searchBooks.makeRequest.search(req.query));
            })
            .then(function(results) {
                res.render("search", {
                    "total": results.numResults,
                    "data": results.books,
                    "pages": results.pages,
                    "query": req.query
                });
            })
            .catch(function(err){
                next(err);
            });
        }
        else {
            res.render("search");
        }
    });

router.route("/set-genre")
    .post(function(req, res, next) {
        BookServices.setGenre(Number(req.body.genre), Number(req.body.book_id))
            .then(function() {
                res.redirect("/book/" + req.body.ol_key);
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/:id")
    .get(function(req, res, next) {
        BookServices.getBookByOLId(req.params.id, req.session.u_id)
            .then(function(result) {
                if (result[0].length > 0) {
                    res.render("book-page", {"result": result[0][0], "genres": result[3], "copies": result[1], "wishlist": result[2]});
                } else {
                    next();
                }
            })
            .catch(function(err) {
                next(err);
            });
    })
    .post(function(req, res, next) {
        var data = req.body;
        BookServices.getBookByOLId(req.body.book_id, req.session.u_id)
            .then(function(result) {
                if(result[0].length > 0){
                    res.render("book-page", {"result": result[0][0], "copies": result[1], "wishlist": result[2], "genres": result[3]});
                } else {
                    var bookInfo = {
                        "title": data.title,
                        "bol_key": data.book_id,
                        "name": data.name,
                        "aol_key": data.author_id,
                        "description": data.description,
                        "thumbnail_url": data.thumbnail_url
                    }
                    BookServices.createBook(bookInfo)
                        .then(function(result) {
                            res.redirect("/book/" + bookInfo.bol_key);
                        })
                        .catch(function(err) {
                            next(err);
                        });
                }
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/create-author")
    .post(function(req, res, next) {
        BookServices.createAuthor(req.body)
            .then(function() {
                res.status(200).send("Author created");
            })
            .catch(function(err) {
                next(err);
            });
    });

module.exports = router;
