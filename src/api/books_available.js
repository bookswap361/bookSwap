var express = require("express");
var router = express.Router();
var BooksAvailableServices = require("../services/books_available"),
    BookServices = require("../services/book");

router.get("/", function(req, res, next) {
    BookServices.getGenreList()
        .then(function(genres) {
            var genreId;
            if (!req.query.genre) {
                genreId = 0;
            }
            else {
                genreId = Number(req.query.genre);
            }
            if (req.query && req.query.filter && req.query.filter == "afford") {
                BooksAvailableServices.getAffordableBooks(req.session.u_id, genreId)
                    .then(function(result) {
                        res.render("book", {"books": result, "criteria": req.query.filter, "genres": genres, "value": genreId});
                    })
                    .catch(function(err) {
                        next(err);
                    });
            } else {
                BooksAvailableServices.getAvailableBooks(req.session.u_id, genreId)
                    .then(function(result) {
                        res.render("book", {"books": result, "criteria": "all", "genres": genres, "value": genreId});
                    })
                    .catch(function(err) {
                        next(err);
                    });
            }
        });
});

router.get("/condition", function(req, res, next) {
    BooksAvailableServices.getCondition(Number(req.query.id), req.session.u_id, req.query.filter == "all")
        .then(function(books) {
            res.send(books);
        }).catch(function(err) {
            next(err);
        });
});

module.exports = router;
