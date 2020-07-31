var express = require("express");
var router = express.Router();
var BooksAvailableServices = require("../services/books_available");

router.get("/", function(req, res, next) {
    BooksAvailableServices.getAvailableBooks(req.session.u_id)
        .then(function(result) {
            res.render("book", {"books": result});
        })
        .catch(function(err) {
            next(err);
        });
});

router.get("/condition/:id", function(req, res, next) {
    BooksAvailableServices.getCondition(req.params.id, req.session.u_id)
        .then(function(books) {
            res.send(books);
        }).catch(function(err) {
            next(err);
        });
});

module.exports = router;
