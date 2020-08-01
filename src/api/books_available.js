var express = require("express");
var router = express.Router();
var BooksAvailableServices = require("../services/books_available");

router.get("/", function(req, res, next) {
    if (req.query && req.query.filter && req.query.filter == "afford") {
        BooksAvailableServices.getAffordableBooks(req.session.u_id)
            .then(function(result) {
                console.log("at the end", result)
                res.render("book", {"books": result, "criteria": req.query.filter});
            })
            .catch(function(err) {
                next(err);
            });
    } else {
        BooksAvailableServices.getAvailableBooks(req.session.u_id)
            .then(function(result) {
                console.log(result)
                res.render("book", {"books": result, "criteria": "all"});
            })
            .catch(function(err) {
                next(err);
            });
    }
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
